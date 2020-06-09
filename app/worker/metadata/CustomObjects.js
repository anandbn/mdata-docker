const fs = require('fs');
const MetadataUtils = require('../utils/MetadataUtils.js');
const lodash = require('lodash');
const AbstractMetadataType = require('./AbstractMetadataType.js');

const LoggerUtils = require('../utils/LoggerUtils.js');
const standardObjects = [
    {"type":"Standard","name":"Account","Id":"Account"},
    {"type":"Standard","name":"Asset","Id":"Asset"},
    {"type":"Standard","name":"Campaign","Id":"Campaign"},
    {"type":"Standard","name":"CampaignMember","Id":"CampaignMember"},
    {"type":"Standard","name":"Case","Id":"Case"},
    {"type":"Standard","name":"CaseHistory","Id":"CaseHistory"},
    {"type":"Standard","name":"CaseComment","Id":"CaseComment"},
    {"type":"Standard","name":"Contact","Id":"Contact"},
    {"type":"Standard","name":"Contract","Id":"Contract"},
    {"type":"Standard","name":"Document","Id":"Document"},
    {"type":"Standard","name":"Event","Id":"Event"},
    {"type":"Standard","name":"Folder","Id":"Folder"},
    {"type":"Standard","name":"Group","Id":"Group"},
    {"type":"Standard","name":"GroupMember","Id":"GroupMember"},
    {"type":"Standard","name":"Idea","Id":"Idea"},
    {"type":"Standard","name":"IdeaComment","Id":"IdeaComment"},
    {"type":"Standard","name":"Lead","Id":"Lead"},
    {"type":"Standard","name":"Macro","Id":"Macro"},
    {"type":"Standard","name":"Note","Id":"Note"},
    {"type":"Standard","name":"NoteAndAttachment","Id":"NoteAndAttachment"},
    {"type":"Standard","name":"Opportunity","Id":"Opportunity"},
    {"type":"Standard","name":"OpportunityCompetitor","Id":"OpportunityCompetitor"},
    {"type":"Standard","name":"OpportunityLineItem","Id":"OpportunityLineItem"},
    {"type":"Standard","name":"Order","Id":"Order"},
    {"type":"Standard","name":"OrderItem","Id":"OrderItem"},
    {"type":"Standard","name":"Partner","Id":"Partner"},
    {"type":"Standard","name":"Pricebook2","Id":"Pricebook2"},
    {"type":"Standard","name":"PricebookEntry","Id":"PricebookEntry"},
    {"type":"Standard","name":"Product2","Id":"Product2"},
    {"type":"Standard","name":"Profile","Id":"Profile"},
    {"type":"Standard","name":"Question","Id":"Question"},
    {"type":"Standard","name":"Quote","Id":"Quote"},
    {"type":"Standard","name":"QuoteDocument","Id":"QuoteDocument"},
    {"type":"Standard","name":"QuoteLineItem","Id":"QuoteLineItem"},
    {"type":"Standard","name":"RecordType","Id":"RecordType"}

];
module.exports = class CustomObjects extends AbstractMetadataType{

    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('customobjects','debug');
    
    }

   async process(){
        await super.updateMetadataStatus('In Progress',{type:'CustomObjects'})
        let customObjects = await MetadataUtils.getMetadataList(this.conn,'CustomObject','DeveloperName,Description','NamespacePrefix=null');

        let custObjects = lodash.concat(customObjects,standardObjects);
        await super.updateMetadataStatus('In Progress',{type:'CustomObjects',totalTypes:custObjects.length})
        this.logger.debug('['+this.conn.userInfo.organization_id + '] Total objects: '+custObjects.length);
        
        for (var i = 0; i < custObjects.length; i++) {
            var theObject = custObjects[i];
            if(!(theObject.type === 'Standard')){
                theObject.name= theObject.DeveloperName +'__c'
                theObject.type = 'Custom';
            }else{
                theObject = custObjects[i];
            }
            var objParams ={
                name: theObject.name ,
                type: theObject.type,
                Id: theObject.Id
            }

            this.logger.debug('['+this.conn.userInfo.organization_id + '] Object:'+objParams.name +', Properties: '+JSON.stringify(objParams));
            const cypRes = await this.neo4jutils.upsert("CustomObject","name",objParams);
            this.logger.debug('['+this.conn.userInfo.organization_id + '] Object:'+objParams.name +' : Created ' + cypRes.summary.counters._stats.nodesCreated + ' nodes');
            
            await super.updateMetadataStatus('In Progress',{type:'CustomObjects',totalTypes:(custObjects.length),completed: (i + 1)})
        }
        await super.updateMetadataStatus('Completed',{type:'CustomObjects'})
       
    }


}
