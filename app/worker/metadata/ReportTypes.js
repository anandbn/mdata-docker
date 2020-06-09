const LoggerUtils = require('../utils/LoggerUtils.js');
const lodash = require('lodash');
const AbstractMetadataType = require('./AbstractMetadataType.js');
const JSONUtils = require('../utils/JSONUtils.js');

const path = require('path');

module.exports = class ReportTypes extends AbstractMetadataType{

    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('reporttypes','debug');
        this.tmpDir  = path.join('_tmp');
    
    }
    

    
    async createReportType(reportType,relatedObjects){
    
        var cypRes = await this.neo4jutils.upsert('ReportType','name',reportType);
        this.logger.debug('['+this.conn.userInfo.organization_id + '] Created ' + cypRes.summary.counters._stats.nodesCreated + ' nodes');
        for(var i=0;i<relatedObjects.length;i++){
            //Create the link between report type and object
            cypRes = await this.neo4jutils.upsertRelationship(
                { type: "CustomObject", findBy: "name", findByVal: relatedObjects[i].name },
                { type: "ReportType", findBy: "name", findByVal: reportType.name },
                {
                    type: "RefersTo",
                    findBy: "name",
                    params: {
                        name: reportType.name + '.Object.' + relatedObjects[i].name,
                        type: 'ReportTypeObject',
                        outerJoin:relatedObjects[i].outerJoin
                    }
                }
            );
            this.logger.debug('['+this.conn.userInfo.organization_id + '] Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' relationships');
        }
    }

    async createReportTypes(reportTypes){
        await super.updateMetadataStatus('In Progress', {   type: 'ReportTypes',  totalTypes: reportTypes.length});
        let results = await this.conn.queryAll("select QualifiedApiName,PluralLabel from EntityDefinition");
        let pluralObjNameToAPIName = {};
        for(var i=0;i<results.records.length;i++){
            this.logger.debug('['+this.conn.userInfo.organization_id + '] Plural Label:'+results.records[i].PluralLabel+' --> '+results.records[i].QualifiedApiName);
            pluralObjNameToAPIName[results.records[i].PluralLabel]=results.records[i].QualifiedApiName;
        }
        pluralObjNameToAPIName["Activities"]="Activity";
        for(var i=0;i<reportTypes.length;i++){
            var reportType = await this.conn.getReportTypeMetadata(reportTypes[i].describeUrl);
            if(reportType.reportTypeMetadata){
                var objects = reportType.reportTypeMetadata.objectRelationships;
                var relatedObjects = new Array();
                reportType = JSONUtils.extractPrimitiveProperties(reportType.reportMetadata,false);
                reportType.name = reportTypes[i].label;
                reportType.category = reportTypes[i].category;
                reportType.type = reportTypes[i].type;
                if(objects){
                    for(var j=0;j<objects.length;j++){
                        let objDevName = pluralObjNameToAPIName[objects[j].label];
                        if(j === 0 && objDevName){
                            //BaseObject is the first object in objectRelationships
                            reportType.baseObject = objDevName;
                            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+reportTypes[i].label+' - Setting base object to '+objDevName);
                        }
                        if(!objDevName){
                            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+reportTypes[i].label+' - Could not find object API name for :'+objects[j].label);
                        }
                        if(objDevName){
                            relatedObjects.push({name:objDevName});                    
                        }
                    }
                }
                
                await this.createReportType(reportType,relatedObjects);
                    
            }
            await super.updateMetadataStatus('In Progress', {type: 'ReportTypes',  totalTypes: reportTypes.length,completed: (i + 1)});
            
            this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed ' + (i + 1) + ' of ' + reportTypes.length);
        }
        

    }

    async process() {
        await super.updateMetadataStatus('In Progress', {type: 'ReportTypes'});
        var categories = await this.conn.getReportTypeList();

        this.logger.debug('['+this.conn.userInfo.organization_id + '] Fetched report type categories '+ categories.length);
        var reportTypes = new Array();
        for(var i=0;i<categories.length;i++){
            var tmpReportTypes = categories[i].reportTypes;
            lodash.forEach(tmpReportTypes,function(rptType){
                lodash.set(rptType,'category',categories[i].label);
            });
            reportTypes = lodash.concat(reportTypes,tmpReportTypes);
        }
        await this.createReportTypes(reportTypes);
        await super.updateMetadataStatus('Completed', {type: 'ReportTypes'});
        
    }
}