const TYPES_TO_IGNORE = [
    "LIST", "MAP", "SET", "DOUBLE", "STRING", "LONG", "DECIMAL", "BOOLEAN", "DATE", "DATETIME", "TIME", "OBJECT", "ID", "SOBJECT", "INTEGER"
];
var ApexcodeParser = require('./ApexcodeParser.js');
var ApexcodeLexer = require('./ApexcodeLexer.js');
var ApexcodeListener = require('./ApexcodeListener.js');
var SOQLParser = require('../soql-parser/SOQLParser.js');
var ApexCodeBlock = require('./ApexCodeBlock.js');
var SOQLStatement = require('../soql-parser/SOQLStatement.js');
var SOQLLexer = require('../soql-parser/SOQLLexer.js');
var SOQLListener = require('../soql-parser/SOQLListener.js');
var SOQLParserUtils = require('../soql-parser/SOQLParserUtils.js');
var antlr4 = require('antlr4/index');

module.exports = class ApexParserUtils{
    constructor(loggerToUse, classOrTriggerId) {
        this.logger = loggerToUse;
        this.classOrTriggerId=classOrTriggerId;
    }

    extractObjectFromString(str) {
        var tokens = str.split('<');
        var tList = new Array();
        var finalList = new Array();
        for (var i = 0; i < tokens.length; i++) {
            var tokens1 = tokens[i].split('>');
            if (tokens1.length > 1) {
                for (var j = 0; j < tokens1.length; j++) {
                    if (tokens1[j].trim().length > 0) {
                        tList.push(tokens1[j]);
                    }
                }
            } else if (tokens[i].trim().length > 0) {
                tList.push(tokens[i]);
            }
        }
        for (var i = 0; i < tList.length; i++) {
            var tokens = tList[i].split(',');
            for (var j = 0; j < tokens.length; j++) {
                if (!TYPES_TO_IGNORE.includes(tokens[j].toUpperCase())) {
                    finalList.push(tokens[j]);
                }
            }

        }
        return finalList;
    }

    parseSymbolTable(symTable) {
        var tList = [];
        for (var i = 0; i < symTable.variables.length; i++) {
            Array.prototype.push.apply(tList, this.extractObjectFromString(symTable.variables[i].type));
        }
        var objList = [];
        tList.forEach(function (objName) {
            if (!objList.includes(objName)) {
                objList.push(objName);
            }
        });
        return objList;
    }

    parseApexBody(theClass) {

        var chars = new antlr4.InputStream(theClass.Body);
        var lexer = new ApexcodeLexer.ApexcodeLexer(chars);
        var tokens = new antlr4.CommonTokenStream(lexer);
        var parser = new ApexcodeParser.ApexcodeParser(tokens);
        parser.buildParseTrees = true;
        var typeReferences = new Array();
        var soqlStatements = new Array();
        var soqlRefs = new Array();
        var listener = new ApexcodeListener.ApexcodeListener(theClass,typeReferences,soqlStatements);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, parser.compilationUnit());
        var soqlList = new Array();
        for (var j = 0; j < soqlStatements.length; j++) {
            var theSOQL = soqlStatements[j];
            this.debug(theClass.Id+' - SOQL :'+theSOQL.soql+',Line:'+theSOQL.line);
            var soqlParser = new SOQLParserUtils();
            var soqlStmt = soqlParser.parseSOQL(theClass,theSOQL.soql,this.logger);
            this.debug(theClass.Id+' - SOQL Tokens :'+JSON.stringify(soqlStmt));
            soqlRefs.push(soqlStmt);
        }
        return soqlRefs;
    }

    debug(msg){
        this.logger?this.logger.debug(msg):console.log(msg);
    }
}
