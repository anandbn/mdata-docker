const SOQLParser = require('./SOQLParser.js');
const SOQLLexer = require('./SOQLLexer.js');
const SOQLListener = require('./SOQLListener.js');
const SOQLStatement = require('./SOQLStatement.js');
var antlr4 = require('antlr4/index');

module.exports = class SOQLParserUtils {
    parseSOQL(theClass,soql){
        soql = soql.replace('[','');
        soql = soql.replace(']','');
        soql = soql.trim();
        var soqlStmt = new SOQLStatement(soql);
        if(soql.length>0){
            var chars = new antlr4.InputStream(soql);
            var lexer = new SOQLLexer.SOQLLexer(chars);
            var tokens = new antlr4.CommonTokenStream(lexer);
            var soqlParser = new SOQLParser.SOQLParser(tokens);
            var listener = new SOQLListener.SOQLListener(soqlStmt);
            antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, soqlParser.soql_query());
        }
        return soqlStmt;
    }

}