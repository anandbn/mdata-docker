const lodash = require('lodash');
const AbstractPlugin = require('./AbstractPlugin.js');

const Neo4JUtils = require('../utils/Neo4JUtils.js');

module.exports = class FieldsNotInLayoutsPlugin extends AbstractPlugin{

    constructor(){
        super('FieldsNotInLayoutsPlugin','Fields Not in Layouts','Lists all fields that are not included in any layouts for the corresponding object.');

    }
    async execute(orgId,params){
        if(!orgId){
            throw new Error("Org Id is required");
        }

        let neo4jutils = new Neo4JUtils();
        var pluginResults = new Array();
        var cypRes = await neo4jutils.runCypherQuery('match (obj:CustomObject {orgId:$orgId})--(fld:CustomField {orgId:$orgId}) return obj.name,obj.type,count(fld) as total_fields',{orgId:orgId});
        for(var i=0;i<cypRes.records.length;i++){
            pluginResults.push(
                             {
                                'name':cypRes.records[i].get('obj.name'),
                                'type':cypRes.records[i].get('obj.type'),
                                'totalFields':cypRes.records[i].get('total_fields').low,
                             }
            );
        }
        var cypRes = await neo4jutils.runCypherQuery("match (obj:CustomObject {orgId:$orgId})--(fld:CustomField {orgId:$orgId}) WHERE NOT (fld)-[:Contains]-(:Layout) return obj.name,collect(fld.name) as notInLayoutFields",{orgId:orgId});
        for(var i=0;i<cypRes.records.length;i++){
            var objIndex = lodash.findIndex(pluginResults,{'name':cypRes.records[i].get('obj.name')});
            var theObject = pluginResults[objIndex];
            theObject.notInLayoutFields = cypRes.records[i].get('notInLayoutFields');
            if(cypRes.records[i].get('notInLayoutFields') && cypRes.records[i].get('notInLayoutFields').length > 0){
                theObject.notInLayoutCount = cypRes.records[i].get('notInLayoutFields').length;
            }
        }
        pluginResults = lodash.filter(pluginResults,function(o) { return o.notInLayoutFields && o.notInLayoutFields.length>0; });
        //sort by the ones that have the most fields
        pluginResults = lodash.orderBy(pluginResults,['notInLayoutCount'],['desc']);
        
        neo4jutils.close();
        return pluginResults;
    }
}