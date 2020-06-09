const PluginFactory = require('./PluginFactory.js');

module.exports = class AbstractPlugin {

    constructor(id,name,description){
        this._id = id;
        this._name =name;
        this._description = description;
    }
    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get description(){
        return this._description;
    }

    init(n4jUtils,conn){
        this.neo4jutils = n4jUtils;
        this.conn = sfConn;
    }
    async execute(orgId,params){
        return {
            "status":"Success",
            "results":[]
        }
    }
    
}