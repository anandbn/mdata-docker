
class ApexCodeBlock{
    constructor() {
    }


    addType(typeName){
        if(!this.typeReferences){
            this.typeReferences = new Array();
        }
        
    }
    addSOQL(soqlStmt){
        if(!this.soqlStatements){
            this.soqlStatements = new Array();
        }
        this.soqlStatements.push(soqlStmt);
    }

}

module.exports=ApexCodeBlock;