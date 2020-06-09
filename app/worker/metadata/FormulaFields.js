var MetadataUtils = require('../utils/MetadataUtils.js');
var JSONUtils = require('../utils/JSONUtils.js');
const LoggerUtils = require('../utils/LoggerUtils.js');
const build = require('sf-formula-ast');
const AbstractMetadataType = require('./AbstractMetadataType.js');

module.exports = class FormulaFields  extends AbstractMetadataType{
    constructor(n4jUtils, sfConn, metajobId) {
        super(n4jUtils, sfConn, metajobId);
        this.logger = LoggerUtils.getLogger('formulafields', 'debug');

    }

    extractFormulaFields(cFld) {
        var formulaFields = new Array();
        try {
            let ast = build(cFld.Metadata.formula);
            extractFieldsAST(ast, formulaFields);
            this.logger.debug(cFld.DeveloperName + ': Fields in Formula: ' + JSON.stringify(formulaFields));
        } catch (err) {
            this.logger.debug('Error parsing ' + cFld.DeveloperName + ' - ' + err);
        }
        return formulaFields;
    }

    extractFieldsAST(ast, fields) {
        if (ast.arguments) {
            ast.arguments.forEach(arg => {
                if (arg.type == 'identifier') {
                    fields.push(arg.name);
                }
                if (arg.arguments) {
                    extractFieldsAST(arg, fields);
                }
            });
        }
    }

    async createFormulaFieldRelationships(objName, srcFldName, srcFldId, formulaFields) {
        for (var i = 0; i < formulaFields.length; i++) {

            var desFldId = await this.neo4jutils.findFieldInObject(objName, formulaFields[i]);
            if (desFldId) {
                var cypRes = await this.neo4jutils.upsertRelationship(
                    { type: "CustomField", findBy: "Id", findByVal: desFldId },
                    { type: "CustomField", findBy: "Id", findByVal: srcFldId },
                    {
                        type: "RefersTo", findBy: "name",
                        params: {
                            name: objName + '.' + srcFldName + '.Formula.' + objName + '.' + formulaFields[i],
                            type: 'Formula'
                        }
                    }
                );
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+ srcFldId + '- Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' FormulaFieldReference relationships');

            } else {
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+srcFldId + '- Could not find referring field ' + objName + '.' + destFldName);

            }

        }
    }


    async process() {
        try {
            await super.updateMetadataStatus('In Progress', { type: 'FormulaFields' })

            var results = await this.neo4jutils.runCypherQuery('match (obj:CustomObject)-[rel:BelongsTo]-(fld:CustomField) where fld.formula is not null return obj.name,fld.name,fld.Id,fld.formula');
            await super.updateMetadataStatus('In Progress', { type: 'FormulaFields', totalTypes: results.records.length })
            for (var i = 0; i < results.records.length; i++) {
                try {
                    let ast = build(results.records[i].get('fld.formula'));
                    var formulaFields = new Array();
                    this.extractFieldsAST(ast, formulaFields);
                    await this.createFormulaFieldRelationships(
                        results.records[i].get('obj.name'),
                        results.records[i].get('fld.name'),
                        results.records[i].get('fld.Id'),
                        formulaFields
                    );

                    await super.updateMetadataStatus('In Progress', {
                        type: 'FormulaFields',
                        totalTypes: results.records.length,
                        completed: (i + 1)
                    });

                    this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed ' + (i + 1) + ' of ' + results.records.length);
                } catch (err) {
                    this.logger.warn('['+this.conn.userInfo.organization_id + '] '+ results.records[i].get('fld.Id') + ' -  Could not parse Formula field:' + results.records[i].get('fld.formula'));
                }
            }
            await super.updateMetadataStatus('Completed', { type: 'FormulaFields' })

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}