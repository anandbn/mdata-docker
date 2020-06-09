const FIELDNAMES_TO_IGNORE = [
    "ID", "NAME", "GROUPID", "DEVELOPERNAME", "CREATEDDATE", "LASTMODIFIEDDATE","GROUPID","ACCOUNTID","USERORGROUPID"
];

function isStandardField(fldName){
    return FIELDNAMES_TO_IGNORE.includes(fldName.toUpperCase());
}

module.exports = class SOQLStatement {
    constructor() {
    }

    addField(fld) {
        if(!isStandardField(fld)){
            if (this.subQuery) {
                this.subQuery.addField(fld);
            } else {
                if (!this.fields) {
                    this.fields = new Array();
                }
                if (this.objPrefixes) {
                    var fldName;
                    if (this.objPrefixes.length > 1) {
                        fldName = this.objPrefixes.join('.') + fld;
                    } else {
                        fldName = this.objPrefixes[0] + '.' + fld;
                    }
                    if (this.whereFields){
                        if(!this.whereFields.includes(fldName)){
                            this.whereFields.push(fldName);
                        }
                    }else{
                        if(!this.fields.includes(fldName)){
                            this.fields.push(fldName);
                        }
                    }
                    this.objPrefixes = null;
                } else {
                    if(this.whereFields){
                        if(!this.whereFields.includes(fld)){
                            this.whereFields.push(fld);
                        }
                    }else{
                        if(!this.fields.includes(fld)){
                            this.fields.push(fld);
                        }
                    }
                }
    
            }
        }

    }
    objectPrefix(prefix) {
        if (this.subQuery) {
            this.subQuery.objectPrefix(prefix);
        } else {
            if (!this.objPrefixes) {
                this.objPrefixes = new Array()
            }
            this.objPrefixes.push(prefix);
        }
    }
    subQueryStart() {
        this.subQuery = new SOQLStatement();
    }
    subQueryEnd() {
        if (!this.subQueries) {
            this.subQueries = new Array();
        }
        this.subQueries.push(this.subQuery);
        this.subQuery = null;
    }
    whereStart() {
        if (this.subQuery) {
            this.subQuery.whereStart();
        }else{
            if(!this.whereFields){
                this.whereFields = new Array();
            }
        }
    }
    fromClause(objName) {
        if (this.subQuery) {
            this.subQuery.fromClause(objName);
        } else {
            this.objName = objName;
        }
    }
    addStringLiteralValue(strValue) {
        if (!this.literals) {
            this.literals = new Array();
        }
        strValue = strValue.substring(1,strValue.length);
        strValue = strValue.substring(0,strValue.length-1);
        this.literals.push(strValue);
    }

}
