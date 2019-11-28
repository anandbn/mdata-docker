const neo4j = require('neo4j-driver').v1;
const LoggerUtils = require('./LoggerUtils.js');

module.exports = class Neo4JUtils {

    constructor() {
        let graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
        let graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
        let graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;
        this.driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));
        this.session = this.driver.session();
        this.logger = LoggerUtils.getLogger('neo4jutils','debug');
    }

    get orgId(){
        return this._orgId;
    }

    set orgId(orgId){
        this._orgId=orgId;
    }
    
    async runCypherQuery(query,params){
        this.logger.debug('Executing query :'+query+' with params:\n'+JSON.stringify(params,null,4));
        return this.session.run(query,params);
                  
    }
    
    
    async upsert(type,findBy,params){
        params.orgId = this._orgId;

        //Try to find a match
        try{
            var matchResults = await this.runCypherQuery("MATCH (n:"+type+" {"+findBy+":$findByKey}) return n",{
                findByKey:params[findBy]
            });
            if(matchResults.records.length == 1){
                this.logger.debug('Found existing '+type+' for '+findBy+'='+params[findBy]);
                return this.runCypherQuery("MATCH (n:"+type+" {"+findBy+":$findByKey}) set n=$props return n",{
                    findByKey:params[findBy],
                    props:params
                });
                
            } else if(matchResults.records.length == 0){
                this.logger.debug('Did not find '+type+' for '+findBy+'='+params[findBy]);
                return this.runCypherQuery("create (node:"+type+") set node=$props return node",{
                   props:params
                });
            }else{
                throw new Error('Multiple nodes '+type+' for '+findBy+'='+params[findBy]+' found');
            }
        }catch(err){
            this.logger.debug('upsert() :  Error' + err+',type:'+type+',findBy:'+findBy+',findByVal:'+params[findBy]);
            throw err;
        }
        
    }
    
    async upsertRelationship(source,target,rel){
        rel.params.orgId = this._orgId;
        //Try to find a match
        var matchResults = await this.runCypherQuery("MATCH (f)-[rel:"+rel.type+" {"+rel.findBy+":$findByKey}]->(o) return rel",{
            findByKey:rel.params[rel.findBy]
        });
        if(matchResults.records.length == 1){
            this.logger.debug('Found existing '+rel.type+' for '+rel.findBy+'='+rel.params[rel.findBy]);
            return this.runCypherQuery("MATCH (f)-[rel:"+rel.type+" {"+rel.findBy+":$findByKey}]->(o) set rel=$props return rel",{
                findByKey:rel.params[rel.findBy],
                props:rel.params
            });
            
        } else if(matchResults.records.length == 0){
            this.logger.debug('Did not find '+rel.type+' for '+rel.findBy+'='+rel.params[rel.findBy]);
            return  this.runCypherQuery(     "match (s:"+source.type+" {"+source.findBy+":$srcName}) "+
                                        "match (t:"+target.type+" {"+target.findBy+":$trgName}) " +
                                        "create (t)-[rel:"+rel.type+"]->(s) set rel=$props",
                                        {
                                            srcName: source.findByVal,
                                            trgName: target.findByVal,
                                            props: rel.params
                                        }
            );
        }else{
            throw new Error("Multiple relationships found ..");
        }
    
    }
    
    async findFieldInObject(objName,fldName){
        var fldId;
        try {
            var results = await this.runCypherQuery('match p=allShortestPaths(' +
                '(obj:CustomObject)-[:BelongsTo|RefersTo*0..3]-(fld:CustomField))' +
                ' where obj.name =~ "(?i)'+objName+'" and fld.name =~ "(?i)'+fldName+'"'+
                ' RETURN reduce(theNames =[], n IN nodes(p)| theNames + coalesce(n.name,"")) AS theNames,' +
                'reduce(theNames =[], n IN nodes(p)| theNames + coalesce(n.Id,"")) AS theIds',
                { start: objName, end: fldName });
            for (var i = 0; i < results.records.length; i++) {
                var theNames = results.records[i].get('theNames');
                var theIds = results.records[i].get('theIds');
                if (objName.toUpperCase() === theNames[0].toUpperCase() && 
                    fldName.toUpperCase() === theNames[theIds.length - 1].toUpperCase()) {
                    fldId = theIds[theIds.length - 1];
                }

            }

        } catch (error) {
            logger.error(error);
            throw error;
        } 
        return fldId;       
    }
    async findObjectName(objName,fldName){
        var fldId;
        try {
            var results = await this.runCypherQuery('match p=allShortestPaths(' +
                '(obj:CustomObject)-[:BelongsTo|RefersTo*0..3]-(fld:CustomField))' +
                ' where obj.name =~ "(?i)'+objName+'" and fld.name =~ "(?i)'+fldName+'"'+
                ' RETURN reduce(theNames =[], n IN nodes(p)| theNames + coalesce(n.name,"")) AS theNames,' +
                'reduce(theNames =[], n IN nodes(p)| theNames + coalesce(n.referenceTo,"")) AS obj_references',
                { start: objName, end: fldName });
            for (var i = 0; i < results.records.length; i++) {
                var theNames = results.records[i].get('theNames');
                var objNames = results.records[i].get('obj_references');
                if (objName.toUpperCase() === theNames[0].toUpperCase() && 
                    fldName.toUpperCase() === theNames[1].toUpperCase()) {
                    fldId = objNames[objNames.length - 1];
                }

            }

        } catch (error) {
            logger.error(error);
            throw error;
        } 
        return fldId;       
    }
    async close(){
        this.session.close();
        this.driver.close();
    }
}