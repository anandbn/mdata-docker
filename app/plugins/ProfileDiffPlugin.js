/*
*/

const lodash = require('lodash');
const AbstractPlugin = require('./AbstractPlugin.js');

const LoggerUtils = require('../utils/LoggerUtils.js');
const Neo4JUtils = require('../utils/Neo4JUtils.js');

const PERM_MATCHER_QUERY_1 = "MATCH (p1:Profile {orgId:$orgId,name:$profile1})-[CRUD:HasAccess {";
const PERM_MATCHER_QUERY_2 = ":1,orgId:$orgId}]-(c:CustomObject {orgId:$orgId}) with collect(c.name) as p1_objects MATCH (p2:Profile {orgId:$orgId,name:$profile2})-[CRUD:HasAccess {"
const PERM_MATCHER_QUERY_3 = ":1,orgId:$orgId}]-(c:CustomObject {orgId:$orgId}) return apoc.coll.disjunction(p1_objects,collect(c.name)) as objectDiff";
const PERM_MATCHER_QUERY =  "MATCH (p1:Profile {orgId:$orgId,name:$profile1})--(perm1:Permission {orgId:$orgId}) "+
                            "with collect(perm1.name) as p1_objects "+
                            "MATCH (p2:Profile {orgId:$orgId,name:$profile2})--(perm2:Permission {orgId:$orgId}) "+
                            "return apoc.coll.disjunction(p1_objects,collect(perm2.name)) as permDiff";
               
const CRUD_KEY_WORDS = ["Create","Read","Edit","Delete","ViewAll","ModifyAll"];

module.exports = class ProfileDiffPlugin extends AbstractPlugin {

    constructor() {
        super('ProfileDiffPlugin', 'Compare CRUD & permissoins for two profiles', 'Compare CRUD & permissions for two profiles');
    }
    async execute(orgId,params) {

        if(!orgId){
            throw new Error("Org Id is required");
        }

        if(!params.profile1 || !params.profile2){
            throw new Error("profile1 and profile2 parameters are required");
        }
        let pluginResults = {};
        let neo4jutils = new Neo4JUtils();
        for(let j=0;j<CRUD_KEY_WORDS.length;j++){
            let keyword = CRUD_KEY_WORDS[j];
            let theQuery = PERM_MATCHER_QUERY_1+keyword+PERM_MATCHER_QUERY_2+keyword+PERM_MATCHER_QUERY_3;
            let queryResults = await neo4jutils.runCypherQuery(theQuery,
                                                                {
                                                                    orgId: orgId,
                                                                    profile1: params.profile1,
                                                                    profile2: params.profile2
                                                                }
            );
            if(queryResults.records && queryResults.records.length>0){
                pluginResults[keyword]=queryResults.records[0].get('objectDiff');
            }
        }
        let queryResults = await neo4jutils.runCypherQuery(PERM_MATCHER_QUERY,
                                                            {
                                                                orgId: orgId,
                                                                profile1: params.profile1,
                                                                profile2: params.profile2
                                                            }
        );

        if(queryResults.records && queryResults.records.length>0){
            pluginResults['Permissions']=queryResults.records[0].get('permDiff');
        }

        return pluginResults;
    }


}