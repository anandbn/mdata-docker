/*
*/

const lodash = require('lodash');
const AbstractPlugin = require('./AbstractPlugin.js');

const LoggerUtils = require('../utils/LoggerUtils.js');
const Neo4JUtils = require('../utils/Neo4JUtils.js');
const FIELD_REF_QUERY = "match (obj:CustomObject {orgId:$orgId})--(fld:CustomField {orgId:$orgId})-[rel]-(n) " +
"where not n:PicklistValue and type(rel) <> 'BelongsTo' " +
"return obj.name,fld.Id, fld.name,labels(n)[0] as typeRef,type(rel) as relationship,n.name,n.Id";

const SCORING_MODEL =  {
    "CustomObject":5,
    "Layout": 5,
    "Report": {
        "Contains":5,
        "Uses":10
    },
    "CustomField":20,
    "ValidationRule":20,
    "ListView":5,
    "ApexClass":25,
    "ApexTrigger":25
}
module.exports = class AllFieldReferencesPlugin extends AbstractPlugin {

    constructor() {
        super('AllFieldReferencesPlugin', 'All Field References', 'Lists all references for a field across all the metadata types');

    }
    async execute(orgId,params) {
        if(!orgId){
            throw new Error("Org Id is required");
        }
        let neo4jutils = new Neo4JUtils();
        let queryResults = await neo4jutils.runCypherQuery(FIELD_REF_QUERY,{orgId:orgId});
        let pluginResults = new Array();
        for (var i = 0; i < queryResults.records.length; i++) {
            let score = SCORING_MODEL[queryResults.records[i].get('typeRef')];
            if(!score){
                score=5;
            }else{
                if(!lodash.isNumber(score)){
                    score = score[queryResults.records[i].get('relationship')];
                    if(!score){
                        score=5;
                    }
                }
            }
            pluginResults.push({
                "objectName": queryResults.records[i].get('obj.name'),
                "fieldId": queryResults.records[i].get('fld.name'),
                "score":score,
                "fieldAPIName": queryResults.records[i].get('fld.Id'),
                "type": queryResults.records[i].get('typeRef'),
                "relationship": queryResults.records[i].get('relationship'),
                "typeRefName": queryResults.records[i].get('n.name'),
                "typeRefId": queryResults.records[i].get('n.Id')
            })
        }
        pluginResults = lodash.groupBy(pluginResults, function(result){
            return result.fieldAPIName
        });
        neo4jutils.close();
        return pluginResults;
    }
}