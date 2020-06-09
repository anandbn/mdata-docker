const lodash = require('lodash');
const AbstractPlugin = require('./AbstractPlugin.js');

const LoggerUtils = require('../utils/LoggerUtils.js');
const Neo4JUtils = require('../utils/Neo4JUtils.js');

module.exports = class AllObjectsPlugin extends AbstractPlugin{

    constructor(){
        super('AllObjects','All Objects','List of All Object names and type');

    }
    async execute(orgId,params){
        if(!orgId){
            throw new Error("Org Id is required");
        }
        let neo4jutils = new Neo4JUtils();
        var queryResults = await neo4jutils.runCypherQuery( 'match (obj:CustomObject {orgId:$orgId}) return obj.name,obj.type',
                                                            {orgId:orgId});
        var pluginResults = new Array();
        for(var i=0;i<queryResults.records.length;i++){
            pluginResults.push({
                "name":queryResults.records[i].get('obj.name'),
                "type":queryResults.records[i].get('obj.type')
            })
        }
        neo4jutils.close();
        return pluginResults;
    }
}