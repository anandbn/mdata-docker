require('dotenv').load();
const Neo4JUtils = require('./utils/Neo4JUtils.js');
const lodash = require('lodash');
const LoggerUtils = require('./utils/LoggerUtils.js');
const MetadataFactory = require('./metadata/MetadataFactory.js');

const METADATA_TYPES = [
    "CustomObjects",
    "CustomFields",
    "FormulaFields",
    "Roles",
    "PicklistValues",
    "PublicGroups",
    "ReportTypes",
    "Reports",
    "ListViews",
    "Layouts",
    "ValidationRules",
    "WorkflowFieldUpdates",
    "WorkflowRules",
    "ApexTriggers",
    "ApexClasses",
    "Profiles"
]

module.exports = class MdataIndexer {

    constructor(sfConn) {
        this.conn = sfConn;
        this.logger = LoggerUtils.getLogger('mdata-indexer', 'debug');
    }

    async getMdataConfiguration() {
        if(!process.env.LOCAL){
            let result = await this.conn.query("SELECT DeveloperName," + this.conn.orgNamespace + "Enabled__c," + this.conn.orgNamespace + "Additional_Configuration__c FROM " + this.conn.orgNamespace + "MData_Types__mdt");
            let self = this;
            lodash.forEach(result.records, function (value) {
                if (lodash.get(value, self.conn.orgNamespace + "Additional_Configuration__c")) {
                    lodash.set( value, 
                                self.conn.orgNamespace + "Additional_Configuration__c",
                                JSON.parse(lodash.get(value, self.conn.orgNamespace + "Additional_Configuration__c")));
                }
            });
            return result.records;
        }else{
            //Local configuration
            var config = require('./config.js');
            return config;
        }


    }

    async createIndexMetadataJob(jobId, typeName, isEnabled) {
        let orgNamespace = this.conn.orgNamespace
        return new Promise(function (resolve, reject) {
            var theObject = new Object();
            lodash.set(theObject, "Name", typeName);
            lodash.set(theObject, orgNamespace + "mData_Synapse_Job__c", jobId);
            lodash.set(theObject, orgNamespace + "Status__c", isEnabled ? 'Not Started' : 'Skipped');

            conn.sobject(orgNamespace + "Metadata_Job__c").create(theObject, function (err, ret) {
                if (err) {
                    reject(err);
                }
                resolve(ret.id);
            });
        });
    }
    async createJob(mdataTypeConfig) {
        
        let indexJob = new Object();
        lodash.set(indexJob, 'types', mdataTypeConfig);
        if(!process.env.SKIP_JOB_CREATE){
            let jobId = await this.conn.create('mData_Synapse_Job__c', {});;
            lodash.set(indexJob, 'jobId', jobId);

            for (var i = 0; i < mdataTypeConfig.length; i++) {
                let theObject = new Object();
                let isEnabled  = lodash.get(mdataTypeConfig[i],this.conn.orgNamespace+'Enabled__c');
                lodash.set(theObject, "Name", mdataTypeConfig[i].DeveloperName);
                lodash.set(theObject, "mData_Synapse_Job__c", jobId);
                lodash.set(theObject, "Status__c", isEnabled ? 'Not Started' : 'Skipped');
                lodash.set(theObject, "mData_Synapse_Job__c", jobId);
                let theId = await this.conn.create('Metadata_Job__c', theObject);
                mdataTypeConfig[i].Id = theId;
    
            }
        }
        
        return indexJob;
    }
    async startIndexing() {
        let mdataConfig = await this.getMdataConfiguration();
        this.logger.info('[' + this.conn.userInfo.organization_id + '] - mdata indexing starting ...');

        this.indexJob = await this.createJob(mdataConfig);
        var neo4jutils = new Neo4JUtils();

        neo4jutils.orgId = this.conn.userInfo.organization_id;

        for(let i=0;i<METADATA_TYPES.length;i++){
            if (shouldIndexType(mdataConfig, METADATA_TYPES[i],this.conn.orgNamespace)) {
                let mDataPluginClass =  MetadataFactory.getPluginClass(METADATA_TYPES[i])
                var mType = lodash.find(mdataConfig, { "DeveloperName": METADATA_TYPES[i] });
                let addlInfo = lodash.get(mType,this.conn.orgNamespace+'Additional_Configuration__c');
                let mDataPlugin = new mDataPluginClass(neo4jutils,this.conn,mType.Id,addlInfo);
                await mDataPlugin.init();
                await mDataPlugin.process();
                await mDataPlugin.cleanup();
                this.logger.info('[' + this.conn.userInfo.organization_id + '] Completed indexing '+METADATA_TYPES[i]);
                
            }
        }
        
    }

}

function shouldIndexType(typeConfig, type,orgNamespace) {
    if (typeConfig) {
        return lodash.get(lodash.find(typeConfig, { "DeveloperName": type }),orgNamespace+"Enabled__c");
    } else {
        return false;
    }
}