const lodash = require('lodash');
const AbstractPlugin = require('./AbstractPlugin.js');

const Neo4JUtils = require('../utils/Neo4JUtils.js');

module.exports = class GlobalPicklistPlugin extends AbstractPlugin {

    constructor() {
        super('GlobalPicklistPlugin', 'Global Picklist Recommender', 'Recommends picklist values that can be refactored into global picklist as it is used across multiple fields.');

    }
    async execute(orgId,params){
        if(!orgId){
            throw new Error("Org Id is required");
        }
        const CYPHER_QUERY =
            " match (p:PicklistValue)-[r:Uses]-(fld:CustomField {orgId:$orgId})-[b:BelongsTo]->(obj:CustomObject {orgId:$orgId})" +
            " with p,r,fld,obj,count(fld) as fld_count" +
            " where fld_count > 0" +
            " return p.name,count(fld) as fld_count,collect(obj.name+'.'+fld.name) as fields_using_value order by fld_count desc";
        let neo4jutils = new Neo4JUtils();
        var queryResults = await neo4jutils.runCypherQuery(CYPHER_QUERY,{orgId:orgId});
        var pluginResults = new Array();
        for (var i = 0; i < queryResults.records.length; i++) {
            pluginResults.push({
                "picklistValue": queryResults.records[i].get('p.name'),
                "fields": queryResults.records[i].get('fields_using_value')
            })
        }
        neo4jutils.close();
        return pluginResults;
    }
}