const LoggerUtils = require('../utils/LoggerUtils.js');
const MetadataUtils = require('../utils/MetadataUtils.js');
const lodash = require('lodash');
const AbstractMetadataType = require('./AbstractMetadataType.js');

module.exports = class Roles extends AbstractMetadataType{


    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('roles','debug');
    
    }

    async process() {
        await super.updateMetadataStatus('In Progress',{type:'Roles'})

        var roles = await MetadataUtils.getMetadataList(this.conn, 'Role', 'CaseAccessForAccountOwner,ContactAccessForAccountOwner,DeveloperName,Name,OpportunityAccessForAccountOwner,ParentRoleId', null);
       
        var roleCountsAsMap = await this.getRoleCountsAsMap();
        this.logger.debug('['+this.conn.userInfo.organization_id + '] Total Roles:' + roles.length);
        await super.updateMetadataStatus('In Progress',{type:'Roles',totalTypes: roles.length})
        for (var i = 0; i < roles.length; i++) {
            var role = roles[i];
            delete role.attributes;
            role.name = role.DeveloperName;
            var roleMbrCount = lodash.get(roleCountsAsMap, role.Id);
            if (roleMbrCount) {
                role.memberCount = roleMbrCount.length;
            }
            var cypRes = await this.neo4jutils.upsert("Role", "Id", role);
            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+role.Id + ' - ' + role.Name + ' - Created  ' + cypRes.summary.counters._stats.nodesCreated + ' nodes');

            await super.updateMetadataStatus('In Progress',{type:'Roles',totalTypes: roles.length,completed: (i + 1)})
            this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed '+(i + 1)+' of '+roles.length);
            

        }
        await super.updateMetadataStatus('Completed',{type:'Roles'})
    }
    async getRoleCountsAsMap() {
       let allUser = await this.conn.queryAll('select Id,UserRoleId from User where IsActive=true and UserRoleId != null');
        
       let userByRoles = lodash.groupBy(allUser, function(value){
            return value.UserRoleId;
       });
       
       return userByRoles;
    }

}