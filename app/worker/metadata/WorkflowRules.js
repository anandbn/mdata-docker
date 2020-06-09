const MetadataUtils = require('../utils/MetadataUtils.js');

const LoggerUtils = require('../utils/LoggerUtils.js');
const AbstractMetadataType = require('./AbstractMetadataType.js');

module.exports = class WorkflowRules extends AbstractMetadataType{

    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('workflowrules','debug');
    
    }

    async createRuleFieldUpdateRelationships(metadata, ruleActions) {
        for (var i = 0; i < ruleActions.length; i++) {
            if (ruleActions[i].type === 'FieldUpdate') {
                var cypRes = await this.neo4jutils.upsertRelationship(
                    { type: "WorkflowFieldUpdate", findBy: "FullName", findByVal: metadata.TableEnumOrId + '.' + ruleActions[i].name },
                    { type: "WorkflowRule", findBy: "Id", findByVal: metadata.Id },
                    {
                        type: "Uses",
                        findBy: "name",
                        params: {
                            name: metadata.Name + '.FieldUpdate.' + ruleActions[i].name,
                            type: 'FieldUpdate'
                        }
                    }
                );
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+metadata.Id + ' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' WorkflowFieldUpdate relationships');

            }

            if (ruleActions[i].type === 'Alert') {
                var cypRes = await this.neo4jutils.upsertRelationship(
                    { type: "WorkflowAlert", findBy: "DeveloperName", findByVal: ruleActions[i].name },
                    { type: "WorkflowRule", findBy: "Id", findByVal: metadata.Id },
                    {
                        type: "Uses",
                        findBy: "name",
                        params: {
                            name: metadata.Name + '.Alert.' + ruleActions[i].name,
                            type: 'Alert'
                        }
                    }
                );
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+metadata.Id + ' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' WorkflowAlert relationships');

            }
        }
    }

    async process() {
        await super.updateMetadataStatus('In Progress',{type:'WorkflowRules'})
        var workflowRules = await MetadataUtils.getMetadataList(this.conn,'WorkflowRule','Name,TableEnumOrId',"ManageableState='unmanaged'");
        
        this.logger.debug('['+this.conn.userInfo.organization_id + '] Total Workflow Rules fetched:' + workflowRules.length);
        await super.updateMetadataStatus('In Progress',{type:'WorkflowRules',totalTypes: workflowRules.length})

        for (var i = 0; i < workflowRules.length; i++) {
            try {
                var metadata = await this.conn.getMetadataForId('WorkflowRule', workflowRules[i].Id);
                var ruleActions = metadata.Metadata.actions;
                var criteriaItems = metadata.Metadata.criteriaItems;
                var ruleFormula = metadata.Metadata.formula;
                metadata.name = metadata.Name;
                delete metadata.Metadata.actions;
                delete metadata.Metadata.criteriaItems;
                delete metadata.Metadata.workflowTimeTriggers;

                Object.assign(metadata, metadata.Metadata);
                delete metadata.Metadata;
                delete metadata.attributes;

                var cypRes = await this.neo4jutils.upsert('WorkflowRule', 'Id', metadata);
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+metadata.Id + ' - Created ' + cypRes.summary.counters._stats.nodesCreated + ' WorkflowRules');

                cypRes = await this.neo4jutils.upsertRelationship(
                    { type: "CustomObject", findBy: "name", findByVal: metadata.TableEnumOrId },
                    { type: "WorkflowRule", findBy: "Id", findByVal: metadata.Id },
                    {
                        type: "BelongsTo",
                        findBy: "name",
                        params: {
                            name: metadata.name + '.WorkflowRule.' + metadata.TableEnumOrId,
                            type: 'WorkflowRule'
                        }
                    }
                );
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+metadata.Id + ' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ObjectWorkflowRule relationships');
                if (cypRes.summary.counters._stats.relationshipsCreated == 0) {
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+metadata.Id + ' - Could not create ObjectWorkflowRule relationship for Object:' + metadata.TableEnumOrId);

                }
                await this.createRuleFieldUpdateRelationships(metadata, ruleActions);

                this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed ' + (i + 1) + ' WorkflowRules of ' + workflowRules.length + '...');

            } catch (err) {
                this.logger.error('['+this.conn.userInfo.organization_id + '] '+metadata.Id + ' - Error fetching FieldUpdate:' + workflowRules[i].Name+' - Error : '+err);

            }
            await super.updateMetadataStatus('In Progress',{type:'WorkflowRules',totalTypes: workflowRules.length,completed: (i + 1)})
            
        }
        await super.updateMetadataStatus('Completed',{type:'WorkflowRules'})

    }

}
