

module.exports = class MetadataUtils{
    
    
    static async getMetadataList(conn,metadatatype,addlFields,whereClause,recordLimit){
        var theQuery = 'select Id';
        if(addlFields){
            theQuery +=','+addlFields.trim();
        }
        theQuery = theQuery + " from " + metadatatype ;
        if(whereClause){
            theQuery += " where "+whereClause;
        }
        if(recordLimit){
            theQuery += " limit "+recordLimit;
        }

        return conn.toolingQueryAll(theQuery);

    }
    
    static async getCustomObjectsById(neo4jutils){
        var customObjects = new Map();
        var results = await neo4jutils.runCypherQuery('match (obj:CustomObject) return coalesce(obj.Id,obj.name) as obj_id,obj.name,obj');
        for (var i = 0; i < results.records.length; i++) {

            customObjects.set(  results.records[i].get('obj_id'),
                                results.records[i].get('obj').properties
            );

        }     
        return customObjects;   
    }
    
    static async getCustomObjectsByName(neo4jutils){
        var customObjects = new Map();
        var results = await neo4jutils.runCypherQuery('match (obj:CustomObject) return obj.Id,obj.name,obj');
        for (var i = 0; i < results.records.length; i++) {

            customObjects.set(
                results.records[i].get('obj.name'),
                results.records[i].get('obj').properties
            );

        }     
        return customObjects;   
    }
    
}