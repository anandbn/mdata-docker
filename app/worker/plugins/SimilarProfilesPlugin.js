/*
*/

const lodash = require('lodash');
const AbstractPlugin = require('./AbstractPlugin.js');

const LoggerUtils = require('../utils/LoggerUtils.js');
const Neo4JUtils = require('../utils/Neo4JUtils.js');
const SIMILAR_PROFILES_QUERY_READ_PREFIX = 
                "MATCH (p:Profile {orgId:$orgId}), (c:CustomObject {orgId:$orgId}) "+
                "OPTIONAL MATCH (p)-[CRUD:HasAccess {orgId:$orgId}]->(c) "+
                "WITH {item:id(p), weights: collect(coalesce(CRUD.";
const SIMILAR_PROFILES_QUERY_READ_POSTFIX = ", 0))} as userData "+
                "WITH collect(userData) as data "+
                "CALL algo.similarity.cosine.stream(data) "+
                "YIELD item1, item2, count1,count2,similarity "+
                "RETURN algo.getNodeById(item1).name AS from, algo.getNodeById(item2).name AS to,count1,count2, similarity "+
                "order by similarity desc ";

const SIMILAR_PROFILES_PERMS_QUERY=
                "MATCH (p:Profile {orgId:$orgId})-[:HasPermission {orgId:$orgId}]->(perm {orgId:$orgId}) "+
                "WITH {item:id(p), categories: collect(id(perm))} as userData "+ 
                "WITH collect(userData) as data "+ 
                "CALL algo.similarity.overlap.stream(data) "+ 
                "YIELD item1, item2, count1, count2, intersection, similarity "+ 
                "WITH algo.getNodeById(item1).name AS from,algo.getNodeById(item1).Id as layoutIdFrom, "+ 
                "algo.getNodeById(item2).name AS to,algo.getNodeById(item2).Id as layoutIdTo,count1, count2, "+ 
                "intersection,100*intersection/count2 as overlapPct, similarity "+ 
                "where overlapPct<100 "+
                "return from as name,collect(to) as similarProfiles,count1 as permissionCount "+
                "order by count1 desc ";
const PERM_MATCHER_QUERY =  "MATCH (p1:Profile {orgId:$orgId,name:$profile1})--(perm1:Permission {orgId:$orgId}) "+
                "with collect(perm1.name) as p1_objects "+
                "MATCH (p2:Profile {orgId:$orgId,name:$profile2})--(perm2:Permission {orgId:$orgId}) "+
                "return apoc.coll.disjunction(p1_objects,collect(perm2.name)) as permDiff";

                
const CRUD_KEY_WORDS = ["Create","Read","Edit","Delete","ViewAll","ModifyAll"];

module.exports = class SimilarProfilesPlugin extends AbstractPlugin {

    constructor() {
        super('SimilarProfilesPlugin', 'Similar Profiles in your org based on Object CRUD access', 'Similar Profiles in your org based on Object CRUD access');
    }
    async execute(orgId,params) {
        let logger = LoggerUtils.getLogger('similarprofiles','debug');

        if(!orgId){
            throw new Error("Org Id is required");
        }
        let thresholdMin = params.thresholdMin?params.thresholdMin:0.90;
        let thresholdMax = params.thresholdMax?params.thresholdMax:0.99;
        let returnPermDiffs = params.permDifferences?params.permDifferences:false;

        let profileMaps = [];
        let neo4jutils = new Neo4JUtils();
        for(let j=0;j<CRUD_KEY_WORDS.length;j++){
            let keyword = CRUD_KEY_WORDS[j];
            let theQuery = SIMILAR_PROFILES_QUERY_READ_PREFIX+keyword+SIMILAR_PROFILES_QUERY_READ_POSTFIX;
            let queryResults = await neo4jutils.runCypherQuery(theQuery,{orgId:orgId});
            for (var i = 0; i < queryResults.records.length; i++) {
                let  prfCompareRow = queryResults.records[i];
                let currRow =profileMaps[prfCompareRow.get('from')+'_'+prfCompareRow.get('to')];
                if(!currRow){
                    currRow = {
                        "from":prfCompareRow.get('from'),
                        "to":prfCompareRow.get('to')
                    };
                }
                currRow[keyword]=prfCompareRow.get('similarity');
                profileMaps[prfCompareRow.get('from')+'_'+prfCompareRow.get('to')]=currRow;
            }
        }
        let profileList = {};

        lodash.forIn(profileMaps, async function(value, key) {
            let prfCmpRow = value;
            if( (prfCmpRow.Create >= thresholdMin && prfCmpRow.Create <= thresholdMax) ||
            (prfCmpRow.Read >= thresholdMin && prfCmpRow.Read <= thresholdMax) ||
            (prfCmpRow.Edit >= thresholdMin && prfCmpRow.Edit <= thresholdMax) ||
            (prfCmpRow.ModifyAll >= thresholdMin && prfCmpRow.ModifyAll <= thresholdMax) ||
            (prfCmpRow.Delete >= thresholdMin && prfCmpRow.Delete <= thresholdMax) ||
            (prfCmpRow.ViewAll >= thresholdMin && prfCmpRow.ViewAll <= thresholdMax)
            ){
                let prf = profileList[prfCmpRow.from];
                if(!prf){
                    prf = {
                        name:prfCmpRow.from,
                        similarProfilesByCRUD: []
                    }
                }
                prf.similarProfilesByCRUD.push({
                    name: prfCmpRow.to,
                    similarities:{
                        Create:prfCmpRow.Create,
                        Read:prfCmpRow.Read,
                        Edit:prfCmpRow.Edit,
                        Delete:prfCmpRow.Delete,
                        ViewAll:prfCmpRow.ViewAll,
                        ModifyAll:prfCmpRow.ModifyAll,
                    }
                });
                
                profileList[prfCmpRow.from]=prf;
            }            
        });

        let pluginResults = new Array();
        lodash.forIn(profileList, function(value, key) {
            pluginResults.push(value);
        });
        if(returnPermDiffs){
            for(let i=0;i<pluginResults.length;i++){
                let prf = pluginResults[i];
                if(prf.similarProfilesByCRUD){
                    for(let j=0;j<prf.similarProfilesByCRUD.length;j++){
                        prf.similarProfilesByCRUD[j].permissionDifferences
                                                        = await this.getDifferingPerms(orgId,logger,
                                                                                        pluginResults[i].name,
                                                                                        prf.similarProfilesByCRUD[j].name);
                    }
                }
            }
    
        }
        return pluginResults;
    }

    async getDifferingPerms(orgId,logger,profile1,profile2){
        let neo4jutils = new Neo4JUtils();
        let queryResults = await neo4jutils.runCypherQuery(PERM_MATCHER_QUERY,
                    {
                        orgId: orgId,
                        profile1: profile1,
                        profile2: profile2
                    }
        );

        if(queryResults.records){
            return queryResults.records[0].get('permDiff');
        }else{
            return null;
        }

 
    }


}