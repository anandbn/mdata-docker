const fs = require('fs');
const LoggerUtils = require('../utils/LoggerUtils.js');
const AbstractMetadataType = require('./AbstractMetadataType.js');

module.exports = class RecordTypes extends AbstractMetadataType{
    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('recordtypes','debug');
    
    }

    async getRecordTypes() {
        return new Promise(function (resolve, reject) {
            conn.tooling.query("select Id,Name,SObjectType,IsActive,CreatedById,CreatedDate,LastModifiedDate from RecordType where ManageableState='unmanaged'",
            function (error, result) {
                if(error){
                    logger.error(error);
                    throw error;
                }
                resolve(result);
                
            });
        });
    
    }

    async getProfileLayouts() {
        return new Promise(function (resolve, reject) {

            //conn.tooling.query("select ProfileId,RecordTypeId,LayoutId  from ProfileLayout where RecordTypeId !=null",
            conn.tooling.query("select ProfileId,RecordTypeId,LayoutId from ProfileLayout where RecordTypeId !=null",
            function (error, result) {
                if(error){
                    logger.error(error);
                    throw error;
                }
                resolve(result);
                
            });
        });
    
    }
    
    async function createRecordTypeAndObjectRelationships(recordTypes){
        for(var i=0;i<recordTypes.records.length;i++){
            var recType =recordTypes.records[i];
            delete recType.attributes;
            recType.name = recType.Name;
            
            var cypRes = await neo4jutils.upsert('RecordType','Id',recType);
            logger.debug(recType.Id+' - Created ' + cypRes.summary.counters._stats.nodesCreated + ' RecordType nodes');
            cypRes = await neo4jutils.upsertRelationship(
                    { type: "CustomObject", findBy: "name", findByVal: recType.SobjectType },
                    { type: "RecordType", findBy: "Id", findByVal: recType.Id },
                    {
                        type: "BelongsTo", 
                        findBy: "name",
                        params: {
                            name: recType.SobjectType+ '.RecordType.' +recType.name,
                            type: 'RecordType'
                        }
                    }                
                );
            logger.debug(recType.Id + ' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' RecordTypeObject relationships');
            logger.debug('Completed '+(i+1)+' RecordTypes of '+recordTypes.records.length+' ...');

        }        
    }
    async function createRecordTypeAndLayoutRelationships(){
        var result = await getProfileLayouts();
        var profileLayouts = [];
        var recordTypeLayouts = new Array();
        var fetchedCnt = 0;
        while(!result.done){
            fetchedCnt +=result.records.length;
            logger.debug('Total RecordTypes:'+result.totalSize+', Fetched:'+fetchedCnt);
            extractRecordTypesAndLayouts(recordTypeLayouts,result);
            result = await conn.tooling.queryMore(result.nextRecordsUrl);             
        }
        if(result.records){
            fetchedCnt +=result.records.length;
            logger.debug('Total RecordTypes:'+result.totalSize+', Fetched:'+fetchedCnt);
            extractRecordTypesAndLayouts(recordTypeLayouts, result);
        }
        logger.debug(JSON.stringify(recordTypeLayouts));
        logger.debug('Total RecordTypes Fetched:'+reports.length);

    }
    async function extractRecordTypesAndLayouts(recordTypeLayouts,result){
        for(var i=0;i<result.records.length;i++){
            var recTypeLayout = result.records[i];
           
            if (!recordTypeLayouts.includes(recTypeLayout.RecordTypeId+':'+recTypeLayout.LayoutId)) {
                recordTypeLayouts.push(recTypeLayout.RecordTypeId+':'+recTypeLayout.LayoutId);
            }

        }       
    }

    this.init = async function(){

    }
    this.process = async function(){
        //var recordTypes = await getRecordTypes();
        //logger.debug('Fetched '+recordTypes.records.length+' RecordTypes ...');
        //await createRecordTypeAndObjectRelationships(recordTypes);
        eventBus.emit('ProcessStart', { type: 'RecordType' });
        await createRecordTypeAndLayoutRelationships();
        logger.debug('Completed processing RecordTypes!!!');
        eventBus.emit('ProcessEnd', { type: 'RecordType' });
    }
    this.cleanup = async function(){
    }

}
module.exports = RecordTypes;