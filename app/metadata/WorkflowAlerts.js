const MetadataUtils = require('../utils/MetadataUtils.js');

const LoggerUtils = require('../utils/LoggerUtils.js');
const AbstractMetadataType = require('./AbstractMetadataType.js');

module.exports = class WorkflowAlerts extends AbstractMetadataType{
    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('workflowalerts','debug');
    
    }

    
    async process() {
        await super.updateMetadataStatus('In Progress',{type:'WorkflowAlerts'})
        var workflowalerts = await MetadataUtils.getMetadataList(this.conn,'WorkflowAlert','Metadata,TemplateId,CcEmails,Description,DeveloperName,SenderType,ManageableState,NamespacePrefix,CreatedDate,CreatedById,LastModifiedDate,LastModifiedById,EntityDefinitionId,FullName',null);
        
        this.logger.debug('['+this.conn.userInfo.organization_id + '] Total Alerts Fetched:' + workflowalerts.length);
        await super.updateMetadataStatus('In Progress',{type:'WorkflowAlerts', totalTypes: workflowalerts.length })

        for (var i = 0; i < workflowalerts.length; i++) {
            try {
                var wflowAlert = workflowalerts[i];
                delete wflowAlert.attributes;
                delete wflowAlert.Metadata;
                var cypRes = await this.neo4jutils.upsert('WorkflowAlert','Id',wflowAlert);
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+wflowAlert.Id+' - Created ' + cypRes.summary.counters._stats.nodesCreated + ' WorkflowAlert');
                this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed '+(i+1)+' WorkflowAlerts of '+workflowalerts.length+'...');
                if(wflowAlert.TemplateId){
                    var cypRes = await this.neo4jutils.upsertRelationship(
                        { type: "EmailTemplate", findBy: "Id", findByVal: wflowAlert.TemplateId },
                        { type: "WorkflowAlert", findBy: "Id", findByVal: wflowAlert.Id },
                        {
                            type: "Uses",
                            findBy: "name",
                            params: {
                                name: wflowAlert.Id + '.EmailTemplate.' + wflowAlert.TemplateId,
                                type: 'EmailTemplate'
                            }
                        }
                    );
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+wflowAlert.Id + ' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' WorkflowAlert-EmailTemplate relationships');
    
                }

                await super.updateMetadataStatus('In Progress',{type:'WorkflowAlerts', totalTypes: workflowalerts.length,completed: (i + 1) })

            } catch (err) {
                this.logger.error('['+this.conn.userInfo.organization_id + '] '+wflowAlert.Id + ' - Error fetching WorkflowAlert:' + wflowAlert.FullName);

            }

        }
        
        await super.updateMetadataStatus('Completed',{type:'WorkflowAlerts'})
    }

}
