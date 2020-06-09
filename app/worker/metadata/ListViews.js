const fs = require('fs');
const unzip = require('unzipper');
const parseString = require('xml2js').parseString;
const LoggerUtils = require('../utils/LoggerUtils.js');
const lodash = require('lodash');
const AbstractMetadataType = require('./AbstractMetadataType.js');

const path = require('path');
const standardObjects = ["Account", "Asset", "Campaign", "CampaignMember", "Case", "Contact", "Contract", "Event", "Folder",, "Idea", "Lead", "Opportunity", "Order", "OrderItem", "Partner", "Pricebook2", "Product2", "Question", "Quote", "Task", "User"];
const listViewNamesToIgnore = ["Open Tasks","Today's Tasks","Overdue Tasks","Delegated Tasks","Recently Completed Tasks","Recurring Tasks","Unscheduled Tasks"]; 

const standardFieldsAllObjects ={
    "ID":"Id",
    "NAME":"Name",
    "CREATEDBY_USER":"CreatedBy",
    "UPDATEDBY_USER":"ModifiedBy",
    "LAST_UPDATE":"LastModifiedDate",
    "OWNER_NAME":"Owner",
    "FULL_NAME":"Name"
};
const listViewStandardFieldNames = {
    "ACCOUNT.NAME": { "object": "Account", "fieldApiName": "Name", "Id": "Account.Name" },
    "ACCOUNT.PHONE1": { "object": "Account", "fieldApiName": "Phone", "Id": "Account.Phone" },
    "ACCOUNT.CREATED_DATE": { "object": "Account", "fieldApiName": "CreatedDate", "Id": "Account.CreatedDate" },
    "CORE.USERS.ALIAS": { "object": "User", "fieldApiName": "Alias", "Id": "User.Alias" },
    "CORE.USERS.FIRST_NAME": { "object": "User", "fieldApiName": "FirstName", "Id": "User.FirstName" },
    "CORE.USERS.LAST_NAME": { "object": "User", "fieldApiName": "LastName", "Id": "User.LastName" },
    "ACCOUNT.ADDRESS1_STREET": { "object": "Account", "fieldApiName": "MailingAddressStreet", "Id": "Account.MailingAddressStreet" },
    "ACCOUNT.ADDRESS1_CITY": { "object": "Account", "fieldApiName": "MailingAddressCity", "Id": "Account.MailingAddressCity" },
    "ACCOUNT.ADDRESS1_STATE": { "object": "Account", "fieldApiName": "MailingAddressState", "Id": "Account.MailingAddressState" },
    "ACCOUNT.ADDRESS1_ZIP": { "object": "Account", "fieldApiName": "MailingAddressPostalCode", "Id": "Account.MailingAddressPostalCode" },
    "ACCOUNT.ADDRESS1_COUNTRY": { "object": "Account", "fieldApiName": "MailingAddressCountry", "Id": "Account.MailingAddressCountry" },
    "CLEAN_STATUS": { "object": "Account", "fieldApiName": "CleanStatus", "Id": "Account.CleanStatus" },
    "ACCOUNT.RECORDTYPE": { "object": "Account", "fieldApiName": "RecordType", "Id": "Account.RecordType" },
    "ACCOUNT.SITE": { "object": "Account", "fieldApiName": "Site", "Id": "Account.Site" },
    "ACCOUNT.TYPE": { "object": "Account", "fieldApiName": "Type", "Id": "Account.Type" },
    "ACCOUNT.LAST_UPDATE": { "object": "Account", "fieldApiName": "LastUpdatedDate", "Id": "Account.LastUpdatedDate" },
    "UPDATEDBY_USER.ALIAS": { "object": "User", "fieldApiName": "Alias", "Id": "User.Alias" },
    "NAME": { "object": "Amenity__c", "fieldApiName": "Name", "Id": "Amenity__c.Name" },
    "NAME": { "object": "API_Point__c", "fieldApiName": "Name", "Id": "API_Point__c.Name" },
    "UPDATEDBY_USER": { "object": "API_Point__c", "fieldApiName": "UpdatedBy", "Id": "API_Point__c.UpdatedBy" },
    "LAST_UPDATE": { "object": "API_Point__c", "fieldApiName": "LastUpdatedDate", "Id": "API_Point__c.LastUpdatedDate" },
    "RECORDTYPE": { "object": "ARM_Action_Plan__c", "fieldApiName": "RecordType", "Id": "ARM_Action_Plan__c.RecordType" },
    "NAME": { "object": "ARM_Action_Plan__c", "fieldApiName": "Name", "Id": "ARM_Action_Plan__c.Name" },
    "CREATEDBY_USER": { "object": "ARM_Action_Plan__c", "fieldApiName": "CreatedBy", "Id": "ARM_Action_Plan__c.CreatedBy" },
    "UPDATEDBY_USER": { "object": "ARM_Action_Plan__c", "fieldApiName": "UpdatedBy", "Id": "ARM_Action_Plan__c.UpdatedBy" },
    "NAME": { "object": "Booking_Office__c", "fieldApiName": "Name", "Id": "Booking_Office__c.Name" },
    "LAST_UPDATE": { "object": "Booking_Office__c", "fieldApiName": "LastUpdatedDate", "Id": "Booking_Office__c.LastUpdatedDate" },
    "CAMPAIGN.NAME": { "object": "Campaign", "fieldApiName": "Name", "Id": "Campaign.Name" },
    "CAMPAIGN.START_DATE": { "object": "Campaign", "fieldApiName": "StartDate", "Id": "Campaign.StartDate" },
    "CAMPAIGN.END_DATE": { "object": "Campaign", "fieldApiName": "EndDate", "Id": "Campaign.EndDate" },
    "CAMPAIGN.CAMPAIGN_TYPE": { "object": "Campaign", "fieldApiName": "Type", "Id": "Campaign.Type" },
    "CAMPAIGN.STATUS": { "object": "Campaign", "fieldApiName": "Status", "Id": "Campaign.Status" },
    "CAMPAIGN.ACTIVE": { "object": "Campaign", "fieldApiName": "Active", "Id": "Campaign.Active" },
    "CAMPAIGN.BUDGETED_COST": { "object": "Campaign", "fieldApiName": "BudgetedCost", "Id": "Campaign.BudgetedCost" },
    "CAMPAIGN.ACTUAL_COST": { "object": "Campaign", "fieldApiName": "ActualCost", "Id": "Campaign.ActualCost" },
    "CASES.CASE_NUMBER": { "object": "Case", "fieldApiName": "CaseNumber", "Id": "Case.CaseNumber" },
    "ACCOUNT.NAME": { "object": "Account", "fieldApiName": "Name", "Id": "Account.Name" },
    "NAME": { "object": "Case", "fieldApiName": "Name", "Id": "Case.Name" },
    "CASES.SUBJECT": { "object": "Case", "fieldApiName": "Subject", "Id": "Case.Subject" },
    "CASES.STATUS": { "object": "Case", "fieldApiName": "Status", "Id": "Case.Status" },
    "CASES.PRIORITY": { "object": "Case", "fieldApiName": "Priority", "Id": "Case.Priority" },
    "CASES.ORIGIN": { "object": "Case", "fieldApiName": "Origin", "Id": "Case.Origin" },
    "OWNER_NAME": { "object": "Case", "fieldApiName": "Owner", "Id": "Case.Owner" },
    "CASES.CREATED_DATE": { "object": "Case", "fieldApiName": "CreatedDate", "Id": "Case.CreatedDate" },
    "CORE.USERS.ALIAS": { "object": "User", "fieldApiName": "Alias", "Id": "User.Alias" },
    "CASES.RECORDTYPE": { "object": "Case", "fieldApiName": "RecordType", "Id": "Case.RecordType" },
    "CASES.LAST_UPDATE": { "object": "Case", "fieldApiName": "LastUpdatedDate", "Id": "Case.LastUpdatedDate" },
    "PARENT.CASE_NUMBER": { "object": "Case", "fieldApiName": "CaseNumber", "Id": "Case.CaseNumber" },
    "CASES.LAST_UPDATE_DATE_ONLY": { "object": "Case", "fieldApiName": "LastUpdatedDate", "Id": "Case.LastUpdatedDate" },
    "CASES.CREATED_DATE_DATE_ONLY": { "object": "Case", "fieldApiName": "CreatedDate", "Id": "Case.CreatedDate" },
    "CONTACT.ACCOUNT": { "object": "Case", "fieldApiName": "AccountId", "Id": "Case.AccountId" },
    "CASES.CLOSED_DATE": { "object": "Case", "fieldApiName": "ClosedDate", "Id": "Case.ClosedDate" },
    "CREATEDBY_USER.ALIAS": { "object": "User", "fieldApiName": "Alias", "Id": "User.Alias" },
    "CONTACT.LAST_NAME": { "object": "Contact", "fieldApiName": "LastName", "Id": "Contact.LastName" },
    "CASES.TYPE": { "object": "Case", "fieldApiName": "Type", "Id": "Case.Type" },
    "UPDATEDBY_USER.ALIAS": { "object": "User", "fieldApiName": "Alias", "Id": "User.Alias" },
    "CREATED_DATE": { "object": "Case_Duration__c", "fieldApiName": "CreatedDate", "Id": "Case_Duration__c.CreatedDate" },
    "CREATEDBY_USER": { "object": "Case_Duration__c", "fieldApiName": "CreatedBy", "Id": "Case_Duration__c.CreatedBy" },
    "NAME": { "object": "Case_Types__c", "fieldApiName": "Name", "Id": "Case_Types__c.Name" },
    "CONTACT.TITLE": { "object": "Contact", "fieldApiName": "Title", "Id": "Contact.Title" },
    "FULL_NAME": { "object": "Contact", "fieldApiName": "Name", "Id": "Contact.Name" },
    "CONTACT.EMAIL": { "object": "Contact", "fieldApiName": "Email", "Id": "Contact.Email" },
    "CORE.USERS.ALIAS": { "object": "User", "fieldApiName": "Alias", "Id": "User.Alias" },
    "CONTACT.PHONE1": { "object": "Contact", "fieldApiName": "Phone", "Id": "Contact.Phone" },
    "CONTACT.PHONE4": { "object": "Contact", "fieldApiName": "Phone", "Id": "Contact.Phone" },
    "CONTACT.PHONE3": { "object": "Contact", "fieldApiName": "Phone", "Id": "Contact.Phone" },
    "CORE.USERS.FIRST_NAME": { "object": "User", "fieldApiName": "FirstName", "Id": "User.FirstName" },
    "CORE.USERS.LAST_NAME": { "object": "User", "fieldApiName": "LastName", "Id": "User.LastName" },
    "ACCOUNT.NAME": { "object": "Account", "fieldApiName": "Name", "Id": "Account.Name" },
    "CONTACT.CREATED_DATE": { "object": "Contact", "fieldApiName": "CreatedDate", "Id": "Contact.CreatedDate" },
    "CREATEDBY_USER.ALIAS": { "object": "User", "fieldApiName": "Alias", "Id": "User.Alias" },
    "UPDATEDBY_USER.ALIAS": { "object": "User", "fieldApiName": "Alias", "Id": "User.Alias" },
    "CONTACT.FIRST_NAME": { "object": "Contact", "fieldApiName": "FirstName", "Id": "Contact.FirstName" },
    "CONTACT.LAST_NAME": { "object": "Contact", "fieldApiName": "LastName", "Id": "Contact.LastName" },
    "CONTACT.SALUTATION": { "object": "Contact", "fieldApiName": "Salutation", "Id": "Contact.Salutation" },
    "CONTACT.ADDRESS2_STREET": { "object": "Contact", "fieldApiName": "OtherAddressStreet", "Id": "Contact.OtherAddressStreet" },
    "CONTACT.ADDRESS2_CITY": { "object": "Contact", "fieldApiName": "OtherAddressCity", "Id": "Contact.OtherAddressCity" },
    "CONTACT.ADDRESS2_STATE": { "object": "Contact", "fieldApiName": "OtherAddressState", "Id": "Contact.OtherAddressState" },
    "CONTACT.RECORDTYPE": { "object": "Contact", "fieldApiName": "RecordType", "Id": "Contact.RecordType" },
    "CONTRACT.STATUS_CODE": { "object": "Contract", "fieldApiName": "StatusCode", "Id": "Contract.StatusCode" },
    "FULL_NAME": { "object": "User", "fieldApiName": "Name", "Id": "User.Name" },
    "CORE.USERS.USERNAME": { "object": "User", "fieldApiName": "Username", "Id": "User.Username" },
    "CORE.USER_ROLE.NAME": { "object": "User", "fieldApiName": "Role", "Id": "User.Role" },
    "CORE.USERS.ACTIVE": { "object": "User", "fieldApiName": "IsActive", "Id": "User.IsActive" },
    "CORE.PROFILE.NAME": { "object": "User", "fieldApiName": "Profile", "Id": "User.Profile" },
    "CORE.USERS.ALIAS": { "object": "User", "fieldApiName": "Alias", "Id": "User.Alias" },
    "CORE.USERS.LAST_LOGIN": { "object": "User", "fieldApiName": "LastLogin", "Id": "User.LastLogin" },
    "EMPLOYEE_NUMBER": { "object": "User", "fieldApiName": "EmployeeNumber", "Id": "User.EmployeeNumber" },
    "MANAGER": { "object": "User", "fieldApiName": "Manager", "Id": "User.Manager" },
    "CORE.USERS.LAST_NAME": { "object": "User", "fieldApiName": "LastName", "Id": "User.LastName" },
    "CORE.USERS.FIRST_NAME": { "object": "User", "fieldApiName": "FirstName", "Id": "User.FirstName" },
    "TIMEZONE": { "object": "User", "fieldApiName": "Timezone", "Id": "User.Timezone" },
    "CORE.USERS.SAML_SUBJECT": { "object": "User", "fieldApiName": "FederationIdentifier", "Id": "User.FederationIdentifier" },
    "CORE.USERS.EMAIL": { "object": "User", "fieldApiName": "Email", "Id": "User.Email" },
    "KNOWLEDGE_USER": { "object": "User", "fieldApiName": "IsKnowledgeUser", "Id": "User.IsKnowledgeUser" },
    "LIVEAGENT_USER": { "object": "User", "fieldApiName": "IsLiveAgentUser", "Id": "User.IsLiveAgentUser" },
    "OWNER.ALIAS":{ "object": "User", "fieldApiName": "Alias", "Id": "User.Alias" },
    "OWNER.LAST_NAME":{ "object": "User", "fieldApiName": "LastName", "Id": "User.LastName" },
    "OWNER.FIRST_NAME":{ "object": "User", "fieldApiName": "FirstName", "Id": "User.FirstName" },

};
module.exports = class ListViews extends AbstractMetadataType{

    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('listviews','debug');
        this.tmpDir  = path.join('_tmp');
    
    }
    
    async requestListViews() {
        let typesToFetch =  [
            { name: "CustomObject", 
              members:["Account", "Asset", "Campaign", "CampaignMember", "Case", "Contact", "Contract", "Event", "Folder",, "Idea", "Lead", "Opportunity", "Order", "OrderItem", "Partner", "Pricebook2", "Product2", "Question", "Quote", "Task", "User", "*"]
            }
        ];
        await this.conn.metadataRetrieve(typesToFetch,this.tmpDir ,"ListViews");
    
    }
    
    
    async unpackageListViews(){
        let self = this;
        //fs.createReadStream('path/to/archive.zip').pipe(unzip.Extract({ path: 'output/path' }));
        return new Promise(function (resolve, reject) {
            fs.createReadStream(path.join(self.tmpDir ,'ListViews.zip'))
            .pipe(unzip.Extract({ path:self.tmpDir  })).on('close', function(){
                self.logger.debug('Files Extracted to :'+self.tmpDir );
                resolve();
            });;
        });
    }
    
    async parseListViewXml(fileName) {
        var xmlStr = fs.readFileSync(path.join(this.tmpDir ,'unpackaged/objects/' + fileName));
        return new Promise(function (resolve, reject) {
            parseString(xmlStr, { explicitArray: false },
                function (err, result) {
                    resolve(result.CustomObject.listViews);
                });
        });
    
    
    }
    async getListViewsFromObject(){
        var theQuery = "select Id,DeveloperName,IsSoqlCompatible,Name,SobjectType from ListView where SobjectType!=null";

        return new Promise(function (resolve, reject) {
            conn.query(theQuery,
                function (error, result) {
                    resolve(result);
                });
        });                  

    }
    async readAndCreateListViews(){

       
        var listViewWithIds = await this.conn.queryAll('select Id,DeveloperName,IsSoqlCompatible,Name,SobjectType from ListView where SobjectType!=null');
        listViewWithIds = lodash.filter(listViewWithIds,function(item){
            var obj = lodash.find(standardObjects,function(o){
                return o == item.SobjectType;
            });

            if(!obj){
                return lodash.endsWith(item.SobjectType,'__c')
            }else{
                var isValid = !lodash.startsWith(item.Name,'Recently Viewed');
                var isIgnoredListView = lodash.find(listViewNamesToIgnore,function(o){
                    return o == item.Name;
                });
                isValid = isValid && !isIgnoredListView;
                return isValid; 
            }
        });
        this.logger.debug ('['+this.conn.userInfo.organization_id + '] Total ListViews:' + listViewWithIds.length);
        
        var listViewMap = lodash.keyBy(listViewWithIds, function (o) {
            return o.SobjectType + '-' + o.DeveloperName;
        });
        var files = fs.readdirSync(path.join(this.tmpDir ,'/unpackaged/objects'));
        
        await super.updateMetadataStatus('In Progress', {   type: 'ListViews',  totalTypes: listViewWithIds.length});

        var listViewCnt = 0;
        for(var i=0;i<files.length;i++){
            this.logger.debug ('['+this.conn.userInfo.organization_id + '] Processing Object :'+files[i]);
            var objName = (files[i].split('\.'))[0];
            var listViews = await this.parseListViewXml(files[i]);
            if(listViews && !lodash.isArray(listViews)){
                var _tmp = new Array();
                _tmp.push(listViews);
                listViews = _tmp;
            }
            if(listViews){
                listViewCnt += await this.createListViewsForObject(objName,listViews,listViewMap,listViewCnt,listViewWithIds.length);
            }
        }
        var matchedMap = lodash.filter(listViewMap,function(value,key){
            return value.matched;
        });
               
        return lodash.size(matchedMap);


    }
    
    
    async createListViewsForObject(objName,listViews,listViewMap,listViewCnt,totalCnt){
        
        for(var i=0;i<listViews.length;i++){
            var listView = listViews[i];
            var listViewObj = lodash.get(listViewMap,objName+'-'+listView.fullName);
            if(listViewObj){
                listView.Id = listViewObj.Id;
                lodash.set(listViewObj,'matched',true);
            }else{
                listView.Id = listViewMap.objName+'-'+listView.fullName;
            }
            var listViewCols = listView.columns;
            var listViewFilters = listView.filters;
            var listViewSharedTo = listView.sharedTo;
            delete listView.columns;
            delete listView.filters;
            delete listView.sharedTo;
            listView.name = listView.fullName;
            var cypRes = await this.neo4jutils.upsert("ListView", "Id", listView);
            this.logger.debug ('['+this.conn.userInfo.organization_id + '] '+listView.Id+' - Created ' + cypRes.summary.counters._stats.nodesCreated + ' ListViews');
            //Create the link between custom object and list view
            cypRes = await this.neo4jutils.upsertRelationship(
                { type: "CustomObject", findBy: "name", findByVal: objName },
                { type: "ListView", findBy: "Id", findByVal: listView.Id },
                {
                    type: "BelongsTo",
                    findBy: "name",
                    params: {
                        name: objName + '-' + listView.fullName,
                        type: 'ObjectListView'
                    }
                }
            );
            this.logger.debug ('['+this.conn.userInfo.organization_id + '] '+listView.Id+' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ObjectListView relationships');
            if(listViewCols){
                await this.createListViewsColumns(objName,listView,listViewCols);
            }
            if(listViewFilters){
                //In case there is only 1 filter XML parser returns it as an object
                if(!lodash.isArray(listViewFilters)){
                    var listViewFilterAr = new Array();
                    listViewFilterAr.push(listViewFilters);
                    listViewFilters = listViewFilterAr;
                }
                await this.createListViewFilterColumns(objName,listView,listViewFilters);
            }
            if(listViewSharedTo){
                var sharedToList = listViewSharedTo.role; 
                if(sharedToList){
                    if(!lodash.isArray(sharedToList)){
                        var sharedToListAr = new Array();
                        sharedToListAr.push(sharedToList);
                        sharedToList = sharedToListAr;
                    }
                    await this.createListViewSharedTo(objName,listView,sharedToList,'Role');
                }
                sharedToList = listViewSharedTo.group; 
                if(sharedToList){
                    if(!lodash.isArray(sharedToList)){
                        var sharedToListAr = new Array();
                        sharedToListAr.push(sharedToList);
                        sharedToList = sharedToListAr;
                    }
                    await this.createListViewSharedTo(objName,listView,sharedToList,'PublicGroup');
                }
                
                
            }
            this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed ' +(listViewCnt+i + 1)+' of '+totalCnt );
            await super.updateMetadataStatus('In Progress', { type: 'ListViews',totalTypes: totalCnt,completed: (listViewCnt+i + 1) });
        }
        return listViews.length;
    }
    async createListViewsColumns(objName,listView,listViewCols){
        
        for(var i=0;i<listViewCols.length;i++){
            var fld;
            try{
                fld = await this.neo4jutils.findFieldInObject(objName,listViewCols[i]);
            }catch(err){
                logger.error(err);
            }
            if(!fld){
                let standardFld = standardFieldsAllObjects[listViewCols[i]];
                if(standardFld){
                    fld = await this.neo4jutils.findFieldInObject(objName,standardFld);
                }
                if(!fld){
                    standardFld = listViewStandardFieldNames[listViewCols[i]];
                    if(standardFld){
                        fld = await this.neo4jutils.findFieldInObject(objName,standardFld);
                    }else{
                        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+listView.Id+' - Could not find Listview Field - Object : ' +objName+', Field: '+ listViewCols[i])
                    }
                }

            }

            if(fld){
                let cypRes = await this.neo4jutils.upsertRelationship(
                    { type: "ListView", findBy: "Id", findByVal: listView.Id },
                    { type: "CustomField", findBy: "Id", findByVal: fld },
                    {
                        type: "RefersTo",
                        findBy: "name",
                        params: {
                            name: objName+'-'+listView.fullName + '-' + listViewCols[i],
                            type: 'ListViewColumn'
                        }
                    }
                );
                this.logger.debug ('['+this.conn.userInfo.organization_id + '] '+listView.Id+' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ListViewColumn relationships');                
            }
        }
    }

    async createListViewFilterColumns(objName,listView,listViewFilters){
        
        for(var i=0;i<listViewFilters.length;i++){
            var fld = await this.neo4jutils.findFieldInObject(objName,listViewFilters[i].field);
            if(!fld){
                let standardFld = standardFieldsAllObjects[listViewFilters[i].field];
                if(standardFld){
                    fld = await this.neo4jutils.findFieldInObject(objName,standardFld);
                }
                if(!fld){
                    standardFld = listViewStandardFieldNames[listViewFilters[i].field];
                    if(standardFld){
                        fld = standardFld.Id;
                    }
                }

            }
            if(fld){
                let cypRes = await this.neo4jutils.upsertRelationship(
                    { type: "ListView", findBy: "Id", findByVal: listView.Id },
                    { type: "CustomField", findBy: "Id", findByVal: fld },
                    {
                        type: "RefersTo",
                        findBy: "name",
                        params: {
                            name: objName+'-'+listView.fullName + '-' + listViewFilters[i].field,
                            type: 'ListViewFilter'
                        }
                    }
                );
                this.logger.debug ('['+this.conn.userInfo.organization_id + '] '+listView.Id+' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ListViewFilter relationships');                
            }else{
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+listView.Id+' - Could not find Listview Field - Object : ' +objName+', Field: '+ listViewFilters[i].field)

            }
        }
    }

    async createListViewSharedTo(objName,listView,sharedToList,shareToObjType){
        
        for(var i=0;i<sharedToList.length;i++){
            let cypRes = await this.neo4jutils.upsertRelationship(
                { type: "ListView", findBy: "Id", findByVal: listView.Id },
                { type: shareToObjType, findBy: "name", findByVal: sharedToList[i] },
                {
                    type: "SharedTo",
                    findBy: "name",
                    params: {
                        name: objName + '-' + listView.fullName + '.SharedTo.' + sharedToList[i],
                        type: 'ListViewSharedTo'
                    }
                }
            );
            this.logger.debug ('['+this.conn.userInfo.organization_id + '] '+listView.Id + ' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' ListViewSharedTo relationships');                
        }
    }
    async init() {
        await super.updateMetadataStatus('In Progress', { type: 'ListViews' });
        this.logger.debug ('['+this.conn.userInfo.organization_id + '] _tmp directory : '+this.tmpDir );
        if (!fs.existsSync(this.tmpDir )) {
            fs.mkdirSync(this.tmpDir );
        }
    }
    async process(){
        await this.requestListViews();
        await this.unpackageListViews();
        var totalTypes = await this.readAndCreateListViews();
        await super.updateMetadataStatus('Completed', {   type: 'ListViews', totalTypes: totalTypes, completed:totalTypes});
    }

    async cleanup() {
        var files = fs.readdirSync(path.join(this.tmpDir ,'unpackaged/objects'));
        for(var i=0;i<files.length;i++){
            fs.unlinkSync(path.join(this.tmpDir ,'unpackaged/objects/'+files[i]));
            this.logger.debug ('['+this.conn.userInfo.organization_id + '] Removed file :'+files[i]);
        }
        fs.unlinkSync(path.join(this.tmpDir ,'unpackaged/package.xml'));
        fs.rmdirSync(path.join(this.tmpDir ,'unpackaged/objects'));
        fs.rmdirSync(path.join(this.tmpDir ,'unpackaged'))
        fs.unlinkSync(path.join(this.tmpDir ,'ListViews.zip'));
        fs.rmdirSync(this.tmpDir );

    }
}