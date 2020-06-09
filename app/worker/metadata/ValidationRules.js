const LoggerUtils = require('../utils/LoggerUtils.js');
const build = require('sf-formula-ast');

const AbstractMetadataType = require('./AbstractMetadataType.js');
function extractFieldsAST(ast, fields) {
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
module.exports = class ValidationRules extends AbstractMetadataType{


    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('validationrules','debug');
    
    }

    async findFieldInObject(objName, fldName) {
        var fldId;

        if (fldName.includes('.')) {
            var tokens = fldName.split('.');
            var newObjName = tokens[0];
            if (newObjName.endsWith('__r')) {
                newObjName = newObjName.substring(0, newObjName.length - 3)+'__c';
            }
            var fieldName = tokens[tokens.length - 1];
            fldId = await this.neo4jutils.findFieldInObject(newObjName, fieldName);
        } else {
            fldId = await this.neo4jutils.findFieldInObject(objName, fldName);
        }
        return fldId;
    }
    /*
    async findFormulaField(objName, fldName) {
        var fldId;
        try {
            var results = await this.neo4jutils.runCypherQuery('match (obj:CustomObject {name:$objName})-[:BelongsTo]-(fld:CustomField {name:$fldName}) return fld.Id',
                { objName: objName, fldName: fldName });
            if (results.records && results.records.length == 1) {
                fldId = results.records[0].get('fld.Id')
            }
        } catch (error) {
            logger.error(error);
            throw error;
        }
        return fldId;

    }*/
    async createRuleFieldRelationships(objName, valRule, formulaFields) {
        for (var j = 0; j < formulaFields.length; j++) {
            var fldId = await this.findFieldInObject(objName, formulaFields[j]);
            if (fldId) {
                this.logger.debug(valRule.Id + ' - Found field ' + formulaFields[j] + ' in validation rule formula Id:' + fldId);
                var cypRes = await this.neo4jutils.upsertRelationship(
                    { type: "CustomField", findBy: "Id", findByVal: fldId },
                    { type: "ValidationRule", findBy: "Id", findByVal: valRule.Id },
                    {
                        type: "RefersTo",
                        findBy: "name",
                        params: {
                            name: valRule.name + '.ValidationRuleField.' + formulaFields[j],
                            type: 'ValidationRuleField'
                        }
                    }
                );
                this.logger.debug(valRule.Id + ' - ' + formulaFields[j] + ' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ValidationRuleField relationships');
            } else {
                this.logger.debug(valRule.Id + ' - Did not find field ' + formulaFields[j] + ' in validation rule');

            }

        }
    }

    async process() {
        await super.updateMetadataStatus('In Progress',{type:'ValidationRules'});
        var valRules = await this.conn.toolingQueryAll('select Id,Active,Description,ErrorDisplayField,ErrorMessage,ValidationName from ValidationRule where NamespacePrefix=null');
        this.logger.debug('['+this.conn.userInfo.organization_id + '] Fetched ' + valRules.length + ' Validation rules ...');
        await super.updateMetadataStatus('In Progress',{type:'ValidationRules', totalTypes: valRules.length});
        for (var i = 0; i < valRules.length; i++) {
            var valRule = valRules[i];
            var results = await this.conn.getMetadataForId('ValidationRule',valRule.Id);
            if (results) {
                valRule = results;
                delete valRule.attributes;
                valRule.errorConditionFormula = valRule.Metadata.errorConditionFormula;
                delete valRule.Metadata;
                var formulaFields = new Array();
                try {
                    let ast = build(valRule.errorConditionFormula);
                    extractFieldsAST(ast, formulaFields);
                } catch (parsingError) {
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+valRule.Id + ' - Error parsing formula - ' + valRule.errorConditionFormula);
                }
                valRule.name = (valRule.FullName.split('.'))[1];
                var objName = (valRule.FullName.split('.'))[0]
                var cypRes = await this.neo4jutils.upsert('ValidationRule', 'Id', valRule);
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+ valRule.Id + ' - Created ' + cypRes.summary.counters._stats.nodesCreated + ' ValidationRule nodes');
                cypRes = await this.neo4jutils.upsertRelationship(
                    { type: "CustomObject", findBy: "name", findByVal: objName },
                    { type: "ValidationRule", findBy: "Id", findByVal: valRule.Id },
                    {
                        type: "BelongsTo",
                        findBy: "name",
                        params: {
                            name: objName + '.ValidationRule.' + valRule.name,
                            type: 'ValidationRules'
                        }
                    }
                );
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+valRule.Id + ' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ValidationRuleObject relationships');
                await this.createRuleFieldRelationships(objName, valRule, formulaFields);
            }
            await super.updateMetadataStatus('In Progress',{type:'ValidationRules', totalTypes: valRules.length,completed: (i + 1)});
            this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed ' + (i + 1) + ' Validation Rules of ' + valRules.length + ' ...');

        }
        this.logger.debug('Completed processing Validation Rules !!!');
        await super.updateMetadataStatus('Completed',{type:'ValidationRules',totalTypes: valRules.length,completed:valRules.length});
    }

}