module.exports = class ParseUtils{

    static extractSOQLFromContext(ctx,soqlStmts)
    {
        if (ctx.children) {
            for (var i = 0; i < ctx.children.length; i++) {
                var currCtx = ctx.children[i];
                if (currCtx.constructor.name === 'TerminalNodeImpl' && currCtx.symbol.text.startsWith('[')) {
                    soqlStmts.push({
                        soql: currCtx.symbol.text,
                        line: currCtx.symbol.line
                    }
                    );
                } else {
                    ParseUtils.extractSOQLFromContext(currCtx,soqlStmts);
                }
            }
        }        
    }
    static getNameFromContext(objCtx){
        if(objCtx.children && objCtx.children.length == 1 && objCtx.children[0].symbol){
            return objCtx.children[0].symbol.text;
        }
        else if(objCtx.children){
            return ParseUtils.getNameFromContext(objCtx.children[0]);
        }else{
            return '';
        }
    }
}