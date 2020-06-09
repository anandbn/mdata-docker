const lodash = require('lodash');
const AbstractPlugin = require('./AbstractPlugin.js');

const Neo4JUtils = require('../utils/Neo4JUtils.js');

module.exports = class ListViewWithNoFiltersPlugin extends AbstractPlugin{

    constructor(){
        super('ListViewWithNoFiltersPlugin','List view with no filters','Returns all list views that have no filters and scope set to All Records.');

    }
    async execute(orgId,params){
        if(!orgId){
            throw new Error("Org Id is required");
        }
        let cyperQuery = "match (obj:CustomObject {orgId:$orgId} )--(l:ListView {orgId:$orgId";
        if(params.scope && params.scope==='All'){
            cyperQuery+="})";
        }else{
            cyperQuery+=',filterScope:"Everything"})';

        }
        
        cyperQuery +=" optional match (l)-[:SharedTo]-(role_or_group)" +
        " optional match (l)-[r:RefersTo {type:'ListViewFilter'}]-(fld:CustomField) " +
        " with obj,l,r,role_or_group,count(fld) as fld_count" +
        " where fld_count=0 and role_or_group.name is not null" +
        " return obj.name as objectName,l.Id as Id,l.filterScope as filterScope,l.name as name,role_or_group.name as sharedTo," +
        " labels(role_or_group)[0] as sharedToType ,role_or_group.memberCount as memberCount order by role_or_group.memberCount desc"

        let neo4jutils = new Neo4JUtils();
        let pluginResults = new Array();
        var cypRes = await neo4jutils.runCypherQuery(cyperQuery,{orgId:orgId});
        for(var i=0;i<cypRes.records.length;i++){
            pluginResults.push({
                "objectName":cypRes.records[i].get('objectName'),
                "listViewName":cypRes.records[i].get('name'),
                "sharedTo":cypRes.records[i].get('sharedTo'),
                "sharedToType":cypRes.records[i].get('sharedToType'),
                "memberCount":cypRes.records[i].get('memberCount'),
                "filterScope":cypRes.records[i].get('filterScope'),
                "Id":cypRes.records[i].get('Id')
            });
        }       
        pluginResults = lodash.groupBy(pluginResults,function(value){
            return value.objectName;
        });
        let pluginResultsArray = new Array();
        lodash.forIn(pluginResults,function(key,value){
            delete key.objectName;
            pluginResultsArray.push({
                "objectName":value,
                "listViews":key
            });
        });
        neo4jutils.close();
        return pluginResultsArray;
    }
}