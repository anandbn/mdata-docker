var MetadataUtils = require('../utils/MetadataUtils.js');
var JSONUtils = require('../utils/JSONUtils.js');
const LoggerUtils = require('../utils/LoggerUtils.js');
const AbstractMetadataType = require('./AbstractMetadataType.js');
const lodash = require('lodash');

module.exports = class Profiles extends AbstractMetadataType{
    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('profiles','debug');
    
    }
    async process() {
        await super.updateMetadataStatus('In Progress',{type:'Profiles'})
        try {
            let allPermissions = new Array();
            let profileMeta = await this.conn.describeSObject('Profile');

            let profileQuery = 'select Id,Name,';
            for(let i=0;i<profileMeta.fields.length;i++){
                if(profileMeta.fields[i].name.startsWith('Permissions')){
                    allPermissions.push(profileMeta.fields[i].name);
                }
            }
            profileQuery += allPermissions.join(',')+' from Profile';

            let profiles = await this.conn.queryAll(profileQuery);
            
            this.logger.debug('['+this.conn.userInfo.organization_id + '] Total Profiles:' + profiles.length);
            await super.updateMetadataStatus('In Progress',{type:'Profiles', totalTypes: profiles.length })

            this.logger.debug('['+this.conn.userInfo.organization_id + '] Total Permissions:' + allPermissions.length);
            for(let i=0;i<allPermissions.length;i++){
                let cypRes = await this.neo4jutils.upsert("Permission","name",{name:allPermissions[i]});
                this.logger.debug('['+this.conn.userInfo.organization_id + '] Permission:'+allPermissions[i]+' : Created ' + cypRes.summary.counters._stats.nodesCreated + ' nodes');
            }
            for (var i = 0; i < profiles.length; i++) {
                var profileParams ={
                    name: profiles[i].Name,
                    Id: profiles[i].Id
                }
    
                this.logger.debug('['+this.conn.userInfo.organization_id + '] Profile:'+profileParams.name +', Properties: '+JSON.stringify(profileParams));
                let cypRes = await this.neo4jutils.upsert("Profile","name",profileParams);
                this.logger.debug('['+this.conn.userInfo.organization_id + '] Profile:'+profileParams.name +' : Created ' + cypRes.summary.counters._stats.nodesCreated + ' nodes');
                
                for(let j=0;j<allPermissions.length;j++){
                    let theProfile = profiles[i];
                    let permVal = theProfile[allPermissions[j]];
                    if(permVal){
                        let cypRes1 = await this.neo4jutils.upsertRelationship(
                            { type: "Permission", findBy: "name", findByVal: allPermissions[j] },
                            { type: "Profile", findBy: "Id", findByVal: theProfile.Id },
                            {
                                type: "HasPermission", 
                                findBy: "name",
                                params:  {
                                    name: allPermissions[j] + '_Permission_'+theProfile.Name,
                                }
                            }
                        );
                        this.logger.debug('['+this.conn.userInfo.organization_id + '] Profile Permission :'+allPermissions[j] +' for '+ theProfile.Name + 
                            ' - Created  ' + cypRes1.summary.counters._stats.relationshipsCreated + ' relationships');
        
                    }
                }
            }
            await this.createObjectCRUDForProfiles();
            await super.updateMetadataStatus( 'Completed',{type:'Profiles'});


        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

    async createObjectCRUDForProfiles() {
        var objectCRUDDetails = [];
        var customObjects = await MetadataUtils.getCustomObjectsByName(this.neo4jutils);
        
        var objectCRUDQuery =   "SELECT ParentId,Parent.ProfileId,PermissionsCreate,PermissionsDelete,PermissionsEdit,"+
                                "PermissionsModifyAllRecords,PermissionsRead,PermissionsViewAllRecords,SobjectType "+
                                "FROM ObjectPermissions where Parent.ProfileId !=null";

        var objectCRUDDetails = await this.conn.queryAll(objectCRUDQuery);
        for(var i=0;i<objectCRUDDetails.length;i++){
            var objCrud = objectCRUDDetails[i];
            var profileId = objCrud.Parent.ProfileId;
            var objName = objCrud.SobjectType;
            if(customObjects.get(objName)){
                var cypRes = await this.neo4jutils.upsertRelationship(
                    { type: "CustomObject", findBy: "name", findByVal: objName },
                    { type: "Profile", findBy: "Id", findByVal: profileId },
                    {
                        type: "HasAccess", 
                        findBy: "name",
                        params:  {
                            name: profileId + '_CRUD_'+objName,
                            Create:objCrud.PermissionsCreate?1:0,
                            Read:objCrud.PermissionsRead?1:0,
                            Edit:objCrud.PermissionsEdit?1:0,
                            Delete:objCrud.PermissionsDelete?1:0,
                            ViewAll: objCrud.PermissionsViewAllRecords?1:0,
                            ModifyAll:objCrud.PermissionsModifyAllRecords?1:0
                        }
                    }
                );
                this.logger.debug('['+this.conn.userInfo.organization_id + '] Profile CRUD :'+profileId + ' to ' + objName + 
                    ' - Created  ' + cypRes.summary.counters._stats.relationshipsCreated + ' relationships');
                this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed '+(i+1)+' of '+objectCRUDDetails.length+' Profile CRUD permissions ...');
    
            }else{
                this.logger.debug('['+this.conn.userInfo.organization_id + '] Profile CRUD :'+profileId + ' to ' + objName + 
                    ' - Object not found.');

            }
        }        

    }

}