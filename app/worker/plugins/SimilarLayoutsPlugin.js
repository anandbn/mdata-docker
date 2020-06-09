/*
*/

const lodash = require('lodash');
const AbstractPlugin = require('./AbstractPlugin.js');

const LoggerUtils = require('../utils/LoggerUtils.js');
const Neo4JUtils = require('../utils/Neo4JUtils.js');
const SIMLAR_LAYOUTS_QUERY = 
                        "MATCH (o:CustomObject {name:$objectName,orgId:$orgId})--(l:Layout {orgId:$orgId})-[:Contains]->(fld {orgId:$orgId}) "+
                        "where not l.name =~ 'Approval Page Layout.*' "+
                        "WITH {item:id(l), categories: collect(id(fld))} as userData "+
                        "WITH collect(userData) as data "+
                        "CALL algo.similarity.overlap.stream(data) "+
                        "YIELD item1, item2, count1, count2, intersection, similarity "+
                        "WITH algo.getNodeById(item1).name AS from,algo.getNodeById(item1).Id as layoutIdFrom, "+
                        "algo.getNodeById(item2).name AS to,algo.getNodeById(item2).Id as layoutIdTo,count1, count2, "+
                        "intersection,100*intersection/count2 as overlapPct, similarity "+
                        "where overlapPct >= $threshold "+
                        "return from,layoutIdFrom,to,layoutIdTo,count1 as fromFldCount, "+
                        "count2 as toFldCount,intersection,overlapPct,similarity "+
                        "order by overlapPct desc ";

const SIMLAR_LAYOUTS_QUERY_SMRY = 
                        "MATCH (o:CustomObject {name:$objectName,orgId:$orgId})--(l:Layout {orgId:$orgId})-[:Contains]->(fld {orgId:$orgId}) "+
                        "where not l.name =~ 'Approval Page Layout.*' "+
                        "WITH {item:id(l), categories: collect(id(fld))} as userData "+
                        "WITH collect(userData) as data "+
                        "CALL algo.similarity.overlap.stream(data) "+
                        "YIELD item1, item2, count1, count2, intersection, similarity "+
                        "WITH algo.getNodeById(item1).name AS from,algo.getNodeById(item1).Id as layoutIdFrom, "+
                        "algo.getNodeById(item2).name AS to,algo.getNodeById(item2).Id as layoutIdTo,count1, count2, "+
                        "intersection,100*intersection/count2 as overlapPct, similarity,ceil((100*intersection/count2)/25*25) as pctBucket "+
                        "return pctBucket,case "+
                        "when pctBucket=0.0 then '0-25 %' "+
                        "when pctBucket=25.0 then '25-50 %' "+
                        "when pctBucket=50.0 then '50-75 %' "+
                        "when pctBucket=75.0 then '75-100 %' "+
                        "when pctBucket=100.0 then '100 %' "+
                        "else 'N/A' "+
                        "end as pctBucketStr,count(from) as layoutCount order by pctBucket desc ";

module.exports = class SimilarObjectLayoutsPlugin extends AbstractPlugin {

    constructor() {
        super('SimilarObjectLayoutsPlugin', 'Similar Layouts in an Object', 'Lists all Layouts excluding Approval page layouts that have similar fields which the ones that have the most overlaps first.');
    }
    async execute(orgId,params) {

        let logger = LoggerUtils.getLogger('similarprofiles','debug');
        if(!orgId){
            throw new Error("Org Id is required");
        }
        if(params == null || (params.object==null && params.allObjects==null && params.objects ==null)){
            throw new Error("object,allObject or objects parameter is required");
        }
        let pctThreshold = 0 | params.threshold;

        let objectsToReturn = new Array();
        if(params.allObjects){
            let neo4jutils = new Neo4JUtils();
            let allObjResults = await neo4jutils.runCypherQuery('match (o:CustomObject) return o.name as objName');
            for(var j=0;j<allObjResults.records.length;j++){
                objectsToReturn.push(allObjResults.records[j].get('objName')); 
            }
            neo4jutils.close();
        }else if(params.object){
            objectsToReturn.push(params.object); 
            
        }else if(params.objects){
            objectsToReturn=params.objects.split(','); 
        }
        let respType = params.responseType?params.responseType:'summary';
        let pluginResults;
        if(respType === 'detail'){
            pluginResults = await this.getSimilarLayoutsDetail(orgId,pctThreshold,objectsToReturn,logger);
        }else if(respType ==='summary'){
            pluginResults = await this.getSimilarLayoutsSummary(orgId,objectsToReturn,logger);
        }
        return pluginResults;
    }

    async getSimilarLayoutsSummary(orgId,objectsToReturn,logger){
        let neo4jutils = new Neo4JUtils();
        let pluginResults = new Array();
        let bucketsAndCounts = {};
        logger.debug('['+orgId + '] Total Objects: '+objectsToReturn.length);
        for(var j=0;j<objectsToReturn.length;j++){

            let queryResults = await neo4jutils.runCypherQuery(SIMLAR_LAYOUTS_QUERY_SMRY, { orgId: orgId, objectName:objectsToReturn[j]});
            let objResults = new Array();
            for (var i = 0; i < queryResults.records.length; i++) {
                logger.debug('[ '+orgId + '] Object: '+objectsToReturn[j]+', bucket:'+queryResults.records[i].get('pctBucketStr')+', layoutCount:'+queryResults.records[i].get('layoutCount').low);
                objResults.push({
                    "pctBucket": queryResults.records[i].get('pctBucketStr'),
                    "layoutCount": queryResults.records[i].get('layoutCount').low,
                });
                let currCnt = lodash.get(bucketsAndCounts, queryResults.records[i].get('pctBucketStr'));
                if(currCnt){
                    currCnt+=queryResults.records[i].get('layoutCount').low;
                }else{
                    currCnt=queryResults.records[i].get('layoutCount').low;
                }
                lodash.set(bucketsAndCounts, queryResults.records[i].get('pctBucketStr'),currCnt);
            }

            if(objResults.length >0){
                pluginResults.push({ object: objectsToReturn[j], similarLayouts: objResults });
            }
        }
        neo4jutils.close();
        return {
            summary:bucketsAndCounts,
            details: pluginResults
        }; 
    }
    async getSimilarLayoutsDetail(orgId,pctThreshold,objectsToReturn,logger){
        let neo4jutils = new Neo4JUtils();
        let pluginResults = new Array();
        for(var j=0;j<objectsToReturn.length;j++){

            let queryResults = await neo4jutils.runCypherQuery(SIMLAR_LAYOUTS_QUERY, { orgId: orgId, objectName:objectsToReturn[j], threshold: pctThreshold });
            let objResults = new Array();
            for (var i = 0; i < queryResults.records.length; i++) {
                objResults.push({
                    "from": queryResults.records[i].get('from'),
                    "layoutIdFrom": queryResults.records[i].get('layoutIdFrom'),
                    "fromFldCount": queryResults.records[i].get('fromFldCount').low,
                    "to": queryResults.records[i].get('to'),
                    "layoutIdTo": queryResults.records[i].get('layoutIdTo'),
                    "toFldCount": queryResults.records[i].get('toFldCount').low,
                    "intersection": queryResults.records[i].get('intersection').low,
                    "overlapPct": queryResults.records[i].get('overlapPct').low
                })
            }

            if(objResults.length >0){
                pluginResults.push({ object: objectsToReturn[j], similarLayouts: objResults });
            }
        }
        neo4jutils.close();
        return pluginResults;       
    }
}