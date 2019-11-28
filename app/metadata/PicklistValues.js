const LoggerUtils = require('../utils/LoggerUtils.js');
const AbstractMetadataType = require('./AbstractMetadataType.js');

module.exports = class PicklistValues extends AbstractMetadataType{
    
    constructor(n4jUtils, sfConn, metajobId) {
        super(n4jUtils, sfConn, metajobId);
        this.logger = LoggerUtils.getLogger('picklistvalues', 'debug');

    }
    
    async process(){
        await super.updateMetadataStatus('In Progress', { type: 'PicklistValues' })
        var results =  await this.neo4jutils.runCypherQuery('match (fld:CustomField {type:"Picklist"})-[:BelongsTo]-(obj:CustomObject) return obj.name,fld.Id,fld.name,fld.valueSet');
        await super.updateMetadataStatus('In Progress', { type: 'FormulaFields',totalTypes:results.records.length })
        for(var i=0;i<results.records.length;i++){
            var fldId = results.records[i].get('fld.Id');
            var objName = results.records[i].get('obj.name');
            var fldName = results.records[i].get('fld.name');
            var valueSet = JSON.parse (results.records[i].get('fld.valueSet'));
            if(valueSet && valueSet.valueSetDefinition){
                for(var j=0;j<valueSet.valueSetDefinition.value.length;j++){
                    var picklistVal = valueSet.valueSetDefinition.value[j];
                    picklistVal.name = picklistVal.label;
                    var cypRes = await this.neo4jutils.upsert('PicklistValue','name',picklistVal);
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+fldId+' - Created '+cypRes.summary.counters._stats.nodesCreated+' Picklistvalue nodes');
                    var relName = objName+'.'+fldName+'.PicklistValue.'+picklistVal.name;
                    cypRes = await this.neo4jutils.upsertRelationship(
                        { type: "PicklistValue", findBy: "name", findByVal: picklistVal.name },
                        { type: "CustomField", findBy: "Id", findByVal: fldId },
                        {
                            type: "Uses", findBy: "name",
                            params: {
                                name: relName,
                                type: 'PicklistValue'
                            }
                        }
                    );
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+fldId+' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' PicklistField relationships');
                }
                
            }

            await super.updateMetadataStatus('In Progress', { type: 'PicklistValues',totalTypes:results.records.length,completed: (i + 1) })
            this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed ' + (i + 1) + ' of ' + results.records.length);

        }

        await super.updateMetadataStatus('Completed', { type: 'PicklistValues'})


    }

}