const TYPES_TO_IGNORE = [
    "LIST", "MAP", "SET", "DOUBLE", "STRING", "LONG", "DECIMAL", "BOOLEAN", "DATE", "DATETIME", "TIME", "OBJECT", "ID", "SOBJECT", "INTEGER"
];
const ApexcodeParser = require('../apex-parser/ApexcodeParser.js');
const ApexcodeLexer = require('../apex-parser/ApexcodeLexer.js');
const MetadataUtils = require('../utils/MetadataUtils.js');
const antlr4 = require('antlr4/index');
const SOQLParserUtils = require('../soql-parser/SOQLParserUtils.js');
const LoggerUtils = require('../utils/LoggerUtils.js');

const AbstractMetadataType = require('./AbstractMetadataType.js');

module.exports = class ApexClasses extends AbstractMetadataType{
    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('apexclasses','debug');
    
    }

    
    async getObjectReferences(theClass) {

        var typeRefs = new Map();
        var soqlStatements = new Array();
        try {
            var chars = new antlr4.InputStream(theClass.Body);
            var lexer = new ApexcodeLexer.ApexcodeLexer(chars);
            var tokens = new antlr4.CommonTokenStream(lexer);
            var parser = new ApexcodeParser.ApexcodeParser(tokens);
            parser.buildParseTrees = true;
            var compUnitCtx = parser.compilationUnit();
            await this.extractTypesFromContext(theClass, compUnitCtx, typeRefs, soqlStatements);

        } catch (error) {
            this.logger.error('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - Could not parse ApexClass : ' + error);

        }
        return {
            objects: Array.from(typeRefs.values()),
            soqlStatements: soqlStatements
        };
    }


    extractTypesFromContext(theClass, ctx, typeRefs, soqlStatements) {
        if (ctx.children) {
            for (var i = 0; i < ctx.children.length; i++) {
                var currCtx = ctx.children[i];
                if (currCtx.constructor.name === 'TerminalNodeImpl') {
                    if (currCtx.symbol.text.startsWith('[')) {
                        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - SOQL Query found : ' + currCtx.symbol.text);
                        var soqlParser = new SOQLParserUtils();
                        var soqlStmt = soqlParser.parseSOQL(theClass, currCtx.symbol.text);
                        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - SOQL Tokens : \n' + JSON.stringify(soqlStmt, null, 4));
                        if (soqlStmt.objName) {
                            soqlStatements.push(soqlStmt);
                        }
                    }
                } else if (currCtx.constructor.name === 'ClassOrInterfaceTypeContext') {
                    var typeName = currCtx.children[0].symbol.text;
                    if (!typeRefs.get(typeName) && !TYPES_TO_IGNORE.includes(typeName.toUpperCase())) {
                        typeRefs.set(typeName, typeName);
                    }
                    this.extractTypesFromContext(theClass, currCtx, typeRefs, soqlStatements);
                } else {
                    this.extractTypesFromContext(theClass, currCtx, typeRefs, soqlStatements);
                }
            }
        }
    }
    async createObjectReferences(theClass, objAndFields) {
        theClass.name = theClass.FullName;
        delete theClass.attributes;
        delete theClass.Metadata;
        delete theClass.Body;
        delete theClass.SymbolTable;

        var cypRes = await this.neo4jutils.upsert('ApexClass', 'Id', theClass);
        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - Created ' + cypRes.summary.counters._stats.nodesCreated + ' classes');

        var objList = objAndFields.objects;
        if (objList.length > 0) {
            for (var i = 0; i < objList.length; i++) {
                cypRes = await this.neo4jutils.upsertRelationship(
                    { type: "CustomObject", findBy: "name", findByVal: objList[i] },
                    { type: "ApexClass", findBy: "Id", findByVal: theClass.Id },
                    {
                        type: "RefersTo",
                        findBy: "name",
                        params: {
                            name: theClass.name + '.ApexClass.' + objList[i],
                            type: 'ApexClass'
                        }
                    }
                );
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - ' + objList[i] + ' : Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ClassObject relationships');

            }
        }
        var soqlStatements = objAndFields.soqlStatements;
        for (var i = 0; i < soqlStatements.length; i++) {
            var soqlStmt = soqlStatements[i];
            await this.createRelationshipsFromSOQL(theClass, soqlStmt);

        }

    }

    async createRelationshipsFromSOQL(theClass, soqlStmt,parentObjName) {

        try {
            if(soqlStmt.objName.endsWith('__r')){
                let relName =  soqlStmt.objName.substring(0, soqlStmt.objName.length-3);
                let objResults = await this.neo4jutils.runCypherQuery('match (fld:CustomField {relationshipName:$relName})--(obj:CustomObject {name:$objName}) return fld.referenceTo limit 1',
                    {"objName":parentObjName,"relName":relName}
                );
                if(objResults.records & objResults.records.length ==1){
                    soqlStmt.objName = objResults.records[0].get('fld.referenceTo');
                }
                
            }
            var cypRes = await this.neo4jutils.upsertRelationship(
                { type: "CustomObject", findBy: "name", findByVal: soqlStmt.objName },
                { type: "ApexClass", findBy: "Id", findByVal: theClass.Id },
                {
                    type: "RefersTo",
                    findBy: "name",
                    params: {
                        name: theClass.name + '.ApexClass.' + soqlStmt.objName,
                        type: 'SOQL'
                    }
                }
            );
            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - ' + soqlStmt.objName + ' : Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ClassObject relationships');

            if (soqlStmt.fields) {
                for (var i = 0; i < soqlStmt.fields.length; i++) {
                    var fldName = soqlStmt.fields[i];
                    var fldId = await this.findFieldInObject(soqlStmt.objName, fldName);
                    if (fldId) {
                        cypRes = await this.neo4jutils.upsertRelationship(
                            { type: "CustomField", findBy: "Id", findByVal: fldId },
                            { type: "ApexClass", findBy: "Id", findByVal: theClass.Id },
                            {
                                type: "RefersTo",
                                findBy: "name",
                                params: {
                                    name: theClass.name + '.ApexClass.' + (soqlStmt.objName + '.' + fldName),
                                    type: 'SOQLSelect'
                                }
                            }
                        );
                        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - ' + (soqlStmt.objName + '.' + fldName) + ' : Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ApexClass field relationships');
                    } else {
                        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - ' + (soqlStmt.objName + '.' + fldName) + ' : Did not find a match field !!!');
    
                    }
                }
            }

            if (soqlStmt.literals && soqlStmt.fields) {
                for (var i = 0; i < soqlStmt.literals.length; i++) {
                    var fldName = soqlStmt.fields[i];
                    cypRes = await this.neo4jutils.upsertRelationship(
                        { type: "PicklistValue", findBy: "name", findByVal: soqlStmt.literals[i] },
                        { type: "ApexClass", findBy: "Id", findByVal: theClass.Id },
                        {
                            type: "RefersTo",
                            findBy: "name",
                            params: {
                                name: theClass.name + '.ApexClass.' + soqlStmt.literals[i],
                                type: 'SOQLWhere'
                            }
                        }
                    );
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - Literal Value - ' + soqlStmt.literals[i] + ' : Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ApexClassPicklistValue relationships');
                }
            }

            if (soqlStmt.whereFields) {
                for (var i = 0; i < soqlStmt.whereFields.length; i++) {
                    var fldName = soqlStmt.whereFields[i];
                    var fldId = await this.findFieldInObject(soqlStmt.objName, fldName);
                    if (fldId) {
                        cypRes = await this.neo4jutils.upsertRelationship(
                            { type: "CustomField", findBy: "Id", findByVal: fldId },
                            { type: "ApexClass", findBy: "Id", findByVal: theClass.Id },
                            {
                                type: "RefersTo",
                                findBy: "name",
                                params: {
                                    name: theClass.name + '.ApexClass.' + (soqlStmt.objName + '.' + fldName),
                                    type: 'SOQLWhere'
                                }
                            }
                        );
                        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - ' + (soqlStmt.objName + '.' + fldName) + ' : Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ApexClassField (where) relationships');
                    } else {
                        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - ' + (soqlStmt.objName + '.' + fldName) + ' : Did not find a match WHERE field !!!');

                    }
                }
            }
            if(soqlStmt.subQueries){
                for(let i=0;i<soqlStmt.subQueries.length;i++){
                    await this.createRelationshipsFromSOQL(theClass,soqlStmt.subQueries[i],soqlStmt.objName);
                }
            }
        } catch (error) {
            this.logger.error('['+this.conn.userInfo.organization_id + '] '+theClass.Id + ' - Error creating field relationships on ApexClass SOQLs :' + error);
            throw error;
        }



    }

    async findFieldInObject(objName, fldName) {
        var fldId;

        if (fldName.includes('.')) {
            var tokens = fldName.split('.');
            var newObjName = tokens[0];
            var fieldName = tokens[tokens.length - 1];
            fldId = await this.neo4jutils.findFieldInObject(objName, fieldName);
        } else {
            fldId = await this.neo4jutils.findFieldInObject(objName, fldName);
        }
        return fldId;
    }
    async process() {
        await super.updateMetadataStatus('In Progress',{type:'ApexClasses'})
        var classes = await MetadataUtils.getMetadataList(this.conn, 'ApexClass','Name',"ManageableState='unmanaged'");
        await super.updateMetadataStatus('In Progress',{type:'ApexClasses',totalTypes:classes.length})
        this.logger.info('['+this.conn.userInfo.organization_id + '] Total Apex Classes Fetched :'+classes.length);
        for (var i = 0; i < classes.length; i++) {
            var metadata = await this.conn.getMetadataForId('ApexClass',classes[i].Id);
            var objAndFields = await this.getObjectReferences(metadata);
            await this.createObjectReferences(metadata, objAndFields);
            this.logger.info('['+this.conn.userInfo.organization_id + '] '+metadata.Id + ' - ApexClass parsed successfully !!!')
            this.logger.info('['+this.conn.userInfo.organization_id + '] Completed ' + (i + 1) + ' of ' + classes.length + ' Apex classes ...');
            
            await super.updateMetadataStatus('In Progress',{type:'ApexClasses',totalTypes:classes.length,completed: (i + 1)})
            
        }
        await super.updateMetadataStatus('Completed',{type:'ApexClasses'})

    }


}