const LoggerUtils = require('../utils/LoggerUtils.js');
const MetadataUtils = require('../utils/MetadataUtils.js');
const lodash = require('lodash');
const AbstractMetadataType = require('./AbstractMetadataType.js');

module.exports = class PublicGroups extends AbstractMetadataType{
    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('publicgroups','debug');
    
    }

    async process() {
        await super.updateMetadataStatus('In Progress',{type:'PublicGroups'})

        var publicGroups = await MetadataUtils.getMetadataList(this.conn, 
                                                        "Group", 
                                                        "DeveloperName,Name,Type",
                                                        "Type in ('Regular')");
        
        this.logger.debug('['+this.conn.userInfo.organization_id + '] Total Groups:' + publicGroups.length);
        
        //var grpMemberCntMap = await this.getGroupMemberCountsAsMap();

        await super.updateMetadataStatus('In Progress',{type:'PublicGroups', totalTypes: publicGroups.length})
        for (var i = 0; i < publicGroups.length; i++) {
            var group = publicGroups[i];
            delete group.attributes;
            group.name = group.DeveloperName;
            /*var grpMbrCount = lodash.get(grpMemberCntMap,group.Id);
            if(grpMbrCount){
                group.memberCount = grpMbrCount.member_count;
            }*/
            var cypRes = await this.neo4jutils.upsert("PublicGroup", "Id", group);
            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+group.Id + ' - ' + group.Name + ' - Created  ' + cypRes.summary.counters._stats.nodesCreated + ' PublicGroups');

            await super.updateMetadataStatus('In Progress',{type:'PublicGroups', totalTypes: publicGroups.length,completed: (i + 1)})
            
        }
        await super.updateMetadataStatus('Completed',{type:'PublicGroups', totalTypes: publicGroups.length,completed: publicGroups.length});

    }

    async getGroupMemberCountsAsMap(){
        let grpMemberCounts = await this.conn.queryAll('select GroupId,count(Id) member_count from GroupMember group by GroupId');
        
        this.logger.debug('['+this.conn.userInfo.organization_id + '] Total Groups with Counts:' + grpMemberCounts.length);

        return lodash.keyBy(grpMemberCounts, 'GroupId');
    }
}