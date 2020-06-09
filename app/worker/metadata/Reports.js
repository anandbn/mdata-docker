const fs = require('fs');
const LoggerUtils = require('../utils/LoggerUtils.js');
const lodash = require('lodash');
var JSONUtils = require('../utils/JSONUtils.js');

const AbstractMetadataType = require('./AbstractMetadataType.js');

const standardFieldToIdMap = {
    "Case.CASE_NUMBER":"Case.CaseNumber",
    "Case.LAST_UPDATE":"Case.LastModifiedDate",
    "Case.RECORDTYPE":"Case.RecordType",
    "Case.ORIGIN":"Case.Origin",
    "Case.DESCRIPTION":"Case.Description",
    "Case.CREATED_DATE":"Case.CreatedDate",
    "Case.CREATED_ALIAS":"User.Alias",
    "Case.STATUS":"Case.Status",
    "Case.OWNER_ROLE":"User.Role",
    "Case.CONTACT.NAME":"Contact.Name",
    "Case.OWNER":"Case.Owner",
    "Case.CREATED":"Case.CreatedDate",
    "Case.CLOSED_DATE":"Case.ClosedDate",
    "Case.ACCOUNT.NAME":"Account.Name",
    "Case.LAST_UPDATE_BY":"Case.LastUpdatedBy",
    "Case.CLOSED":"Case.IsClosed",
    "Case.AGE":"Case.Age",
    "Case.OPEN":"Case.Status",
    "Case.LAST_UPDATEONLY":"Case.LastUpdatedDate",
    "Case.EMAIL.STATUS":"Case.Status",
    "Case.ESCALATION_STATE":"Case.Status",
    "Case.CREATED_DATEONLY":"Case.CreatedDate",
    "Case.CASE_COMMENT":"Case.Comment",    
    "Case.CASE_CREATED_DATE":"Case.CreatedDate",    
    "CaseHistory.CASE_NUMBER":"CaseHistory.CaseNumber",
    "CaseHistory.ORIGIN":"CaseHistory.Origin",
    "CaseHistory.CASE_CREATE":"CaseHistory.CreatedDate",
    "CaseHistory.CLOSED_DATE":"CaseHistory.ClosedDate",
    "CaseHistory.CASE_OWNER":"CaseHistory.Owner",
    "Activity.WHAT_NAME":".",
    "Activity.ACCOUNT":"Activity.Account",
    "Activity.SUBJECT":"Activity.Subject",
    "Activity.DESCRIPTION":"Activity.Description",
    "Activity.OPPORTUNITY":"Activity.Opportunity",
    "Activity.PRIORITY":"Activity.Priority",
    "Activity.DUE_DATE":"Activity.DueDate",
    "Activity.CREATED_DATE":"Activity.CreatedDate",
    "Activity.STATUS":"Activity.Status",
    "Activity.OWNER_ROLE":"User.Role",
    "Activity.ACCOUNT.NAME":"Account.Account",
    "CaseHistory.RECORDTYPE":"CaseHistory.RecordType",
    "CaseHistory.CASE_CREATED_DATE":"CaseHistory.CreatedDate",  
}
module.exports = class ReportsAndReportTypes extends AbstractMetadataType {
    
    constructor(n4jUtils,sfConn,metajobId,addlInfo){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('reports','debug');
        if(addlInfo){
            this.reportTimePeriodDays = addlInfo.reportsTimePeriodDays;
        };
        if(!this.reportTimePeriodDays){
            this.reportTimePeriodDays=90;
        }    
    }

    async createReportAndDependencies(report,metadata,reportType){
        report.name = report.Name;
        let dateFilter = metadata.reportMetadata.standardDateFilter;
        if(dateFilter){
            report.dateFilterColumn=dateFilter.column;
            report.dateFilterDurationValue=dateFilter.durationValue;
            report.dateFilterStartDate = dateFilter.startDate;
            report.dateFilterEndDate = dateFilter.endDate;
        }
        var reportMetadata = JSONUtils.extractPrimitiveProperties(metadata.reportMetadata,false);

        lodash.assign(report,reportMetadata);
        delete report.Name;
        delete report.attributes;
        report.baseObject = reportType.baseObject;
        var cypRes = await this.neo4jutils.upsert('Report','Id',report);
        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+report.Id+' - Created ' + cypRes.summary.counters._stats.nodesCreated + ' reports');

        if(reportType){
            cypRes = await this.neo4jutils.upsertRelationship(
                { type: "ReportType", findBy: "name", findByVal: reportType.name },
                { type: "Report", findBy: "Id", findByVal: report.Id },
                {
                    type: "Uses",
                    findBy: "name",
                    params: {
                        name: report.name + '.ReportType.' + reportType.name,
                        type: 'ReportType'
                    }
                }
            );
            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+report.Id+' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ReportType relationships');
        }
        await this.createReportFieldRelationships(report,metadata);
        await this.createReportCriteriaRelationships(report,metadata);
                
    }
    async createReportCriteriaRelationships(report,metadata){
        if(metadata.reportMetadata.reportFilters){
            for(var i=0;i<metadata.reportMetadata.reportFilters.length;i++){
                var reportFilter = metadata.reportMetadata.reportFilters[i];
                var fldId = await this.findReportColumnField(reportFilter.column);
                if(!fldId){
                    fldId = standardFieldToIdMap[report.baseObject+'.'+reportFilter.column];
                }
                if(fldId){
                    var cypRes = await this.neo4jutils.upsertRelationship(
                        { type: "CustomField", findBy: "Id", findByVal: fldId },
                        { type: "Report", findBy: "Id", findByVal: report.Id },
                        {
                            type: "Uses",
                            findBy: "name",
                            params: {
                                name: report.name + '.ReportFilterField.' + reportFilter.column,
                                type:'ReportFilterField'
                            }
                        }
                    ); 
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+report.Id+' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ReportFilterField relationships'); 
                    if(reportFilter.value){
                        var picklistValues = reportFilter.value.split(',');
                        for(var j=0;j<picklistValues.length;j++){
                            if(!( picklistValues[j].toUpperCase() == 'TRUE' && 
                                 picklistValues[j].toUpperCase()  == 'FALSE'))
                            {
                                
                                cypRes = await this.neo4jutils.upsertRelationship(
                                    { type: "PicklistValue", findBy: "label", findByVal: picklistValues[j] },
                                    { type: "Report", findBy: "Id", findByVal: report.Id },
                                    {
                                        type: "Uses",
                                        findBy: "name",
                                        params: {
                                            name: report.name + '.ReportFilterValue.' + picklistValues[j],
                                            type:'ReportFilterValue'
                                        }
                                    }
                                );     
                                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+report.Id+' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ReportFilterValue relationships'); 
                            }
                        }
                    }
                }else{
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+report.Id+' - Could not find custom Field: Object: '+report.baseObject+', Field:'+reportFilter.column);
                }
                
            }
        }
    }
    async createReportFieldRelationships(report,metadata){

        if(metadata.reportMetadata.detailColumns){
            for(var i=0;i<metadata.reportMetadata.detailColumns.length;i++){

                var fldId = await this.findReportColumnField(metadata.reportMetadata.detailColumns[i]);
                if(!fldId){
                    fldId = standardFieldToIdMap[report.baseObject+'.'+metadata.reportMetadata.detailColumns[i]];
                }
                if(fldId){
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] Found Field with Id:'+fldId+' for report column:'+metadata.reportMetadata.detailColumns[i]);
                    var cypRes = await this.neo4jutils.upsertRelationship(
                        { type: "CustomField", findBy: "Id", findByVal: fldId },
                        { type: "Report", findBy: "Id", findByVal: report.Id },
                        {
                            type: "Contains",
                            findBy: "name",
                            params: {
                                name: report.name + '.Field.' + metadata.reportMetadata.detailColumns[i]
                            }
                        }
                    ); 
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+report.Id+' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' relationships');
                }else{
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+report.Id+' - Could not find custom Field: Object: '+report.baseObject+', Field:'+metadata.reportMetadata.detailColumns[i]);
                }
            }
        }        
    }

    
    async findReportColumnField(reportCol) {
        var fldTokens = reportCol.split('.');
        var fldId;
        if (fldTokens.length >= 2) {
            var startName = fldTokens[0];
            var endName = fldTokens[fldTokens.length - 1];
            //This is a custom field or a custom object and it's field
            try {
                var results = await this.neo4jutils.runCypherQuery('match p=allShortestPaths(' +
                    '(obj:CustomObject {name:$start})-[:BelongsTo|RefersTo*0..3]-(fld:CustomField {name:$end}))' +
                    'RETURN reduce(theNames =[], n IN nodes(p)| theNames + coalesce(n.name,"")) AS theNames,' +
                    'reduce(theNames =[], n IN nodes(p)| theNames + coalesce(n.Id,"")) AS theIds',
                    { start: startName, end: endName });
                for (var i = 0; i < results.records.length; i++) {
                    var theNames = results.records[i].get('theNames');
                    var theIds = results.records[i].get('theIds');
                    if (fldTokens[0] === theNames[0] && fldTokens[1] === theNames[1]) {
                        fldId = theIds[theIds.length - 1];
                        break;
                    }

                }

            } catch (error) {
                this.logger.error(error);
                throw error;
            }
        }
        return fldId;

    }
    async findReportTypeForReport(reportTypeName){
        var reportType;
        //if(reportTypeName.endsWith('__c')){
            
            try{
                var query = "optional match (rptType:ReportType {type:$reportType}) return rptType.name,rptType.baseObject";
                var qryParams = {
                    reportType: reportTypeName
                };
                var results = await this.neo4jutils.runCypherQuery(query, qryParams);
                if (results.records.length == 1) {
                    reportType = {};
                    reportType.name = results.records[0].get('rptType.name');
                    reportType.baseObject = results.records[0].get('rptType.baseObject');
                }
            }catch(error){
                this.logger.error(error);
                throw error;
            }
        //}
        
        return reportType;
       
    }
    

    async process() {
        await super.updateMetadataStatus('In Progress',{type:'Reports'})
        var reports = [];
        
        var reportQuery = "select Id,DeveloperName,Description,FolderName,Name,NamespacePrefix,Format,LastRunDate,LastViewedDate "+
                          "from Report where NamespacePrefix=null and Format!='MultiBlock' and "+
                          "(LastRunDate >= LAST_N_DAYS:"+this.reportTimePeriodDays+" or LastViewedDate >= LAST_N_DAYS:"+this.reportTimePeriodDays+")";

        var reports = await this.conn.queryAll(reportQuery);
                
        this.logger.debug('['+this.conn.userInfo.organization_id + '] Total Reports Fetched:'+reports.length);
        await super.updateMetadataStatus('In Progress',{type:'Reports', totalTypes: reports.length})

        for(var i=0;i<reports.length;i++){
            try{
                var reportMdata = await this.conn.getReportMetadata(reports[i].Id);
                if(reportMdata){
                    var reportType = await this.findReportTypeForReport(reportMdata.reportMetadata.reportType.type);
                    if(reportType){
                        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+reports[i].Id+' - Found ReportType:'+reportType.name+' for Report:'+reportMdata.reportMetadata.developerName);
                        
                    }else{
                        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+reports[i].Id+' - '+reports[i].DeveloperName+' - Did not find ReportType:'+reportMdata.reportMetadata.reportType.type);
                    }

                }else{
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+reports[i].Id+' - '+reports[i].DeveloperName+' - Could not fetch Report Metadata');
                    
                }
                await this.createReportAndDependencies(reports[i],reportMdata,reportType);

                this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed '+(i+1)+' reports of '+reports.length+'...');
            }catch(err){
                this.logger.error('['+this.conn.userInfo.organization_id + '] '+reports[i].Id+' - Error fetching ReportMetadata for '+reports[i].DeveloperName+', Error: '+err);
            
            }
            await super.updateMetadataStatus('In Progress',{type:'Reports',totalTypes: reports.length,completed: (i + 1)})
            
        }
        await super.updateMetadataStatus('Completed',{type:'Reports'})
    }
}