const MetadataUtils = require('../utils/MetadataUtils.js');

const LoggerUtils = require('../utils/LoggerUtils.js');
const AbstractMetadataType = require('./AbstractMetadataType.js');

module.exports = class WorkflowFieldUpdates extends AbstractMetadataType{
    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('workflowfieldupdates','debug');
    
    }

    
    async process() {
        await super.updateMetadataStatus('In Progress',{type:'WorkflowFieldUpdates'})
        var fieldUpdates = await MetadataUtils.getMetadataList(this.conn,'WorkflowFieldUpdate','SourceTableEnumOrId,Name',"ManageableState='unmanaged'");
        
        this.logger.debug('['+this.conn.userInfo.organization_id + '] Total Field Updates Fetched:' + fieldUpdates.length);
        await super.updateMetadataStatus('In Progress',{type:'WorkflowFieldUpdates', totalTypes: fieldUpdates.length })

        for (var i = 0; i < fieldUpdates.length; i++) {
            try {
                var metadata = await this.conn.getMetadataForId('WorkflowFieldUpdate',fieldUpdates[i].Id);
                var fldName = metadata.Metadata.field;
                var objName = metadata.SourceTableEnumOrId;
                var fldId = await this.neo4jutils.findFieldInObject(objName,fldName);
                Object.assign(metadata,metadata.Metadata);
                delete metadata.Metadata;
                delete metadata.attributes;

                //metadata.FullName = fieldUpdates[i].FullName;
                var cypRes = await this.neo4jutils.upsert('WorkflowFieldUpdate','Id',metadata);
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+metadata.Id+' - Created ' + cypRes.summary.counters._stats.nodesCreated + ' WorkflowFieldUpdate');
        
                if(fldId){
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] Found Field with Id:'+fldId+' for field:'+objName+'.'+fldName);
                    cypRes = await this.neo4jutils.upsertRelationship(
                        { type: "CustomField", findBy: "Id", findByVal: fldId },
                        { type: "WorkflowFieldUpdate", findBy: "Id", findByVal: metadata.Id },
                        {
                            type: "RefersTo",
                            findBy: "name",
                            params: {
                                name: metadata.name + '.Field.' + fldName,
                                type:'WorkflowField'
                            }
                        }
                    ); 
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+metadata.Id+' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' relationships');
                    
                }else{
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] Did not find field:'+objName+'.'+fldName);
                    
                }
                this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed '+(i+1)+' FieldUpdates of '+fieldUpdates.length+'...');
                await super.updateMetadataStatus('In Progress',{type:'WorkflowFieldUpdates', totalTypes: fieldUpdates.length,completed: (i + 1) })
            } catch (err) {
                this.logger.error('['+this.conn.userInfo.organization_id + '] '+metadata.Id + ' - Error fetching FieldUpdate:' + fieldUpdates[i].Name);

            }

        }
        await super.updateMetadataStatus('Completed',{type:'WorkflowFieldUpdates'})
    }

}
