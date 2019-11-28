const jsforce = require('jsforce');
require('dotenv').load();
const lodash = require('lodash');
const LoggerUtils = require('./LoggerUtils.js');
const fs = require('fs');
const path = require('path');
var Client = require('node-rest-client').Client;

async function addNamespaceToKeys(namespace,params){
    var newParams = new Object();
    lodash.forEach(params,function(value,key){
        if(!(key === 'Name' || key === 'Id' )){
            lodash.set(newParams,namespace+key,value);
        }else{
            lodash.set(newParams,key,value);
        }
    }); 
    return newParams;
}
module.exports = class SFConnectionUtils {
    constructor(){
        this.logger = LoggerUtils.getLogger('sfdc-utils','debug');
    }
    async login() {
        this.sfdcConn = new jsforce.Connection({
            loginUrl : process.env.SF_LOGIN_URL
        });
        let conn = this.sfdcConn;
        return new Promise(function (resolve, reject) {
            conn.login(process.env.SF_USER_NAME,process.env.SF_USER_PASSWORD+process.env.SF_SECURITY_TOKEN,
                function (err, userInfo) {
                    if (err) { reject(err); }
                    resolve(userInfo);
                });
        })
    }

    get orgNamespace(){
        if(this._orgNamespace && !process.env.LOCAL){
            return this._orgNamespace+'__';
        }else{
            return '';
        }
    }

    set orgNamespace(namespace){
        this._orgNamespace = namespace;
    }

    get userInfo(){
        return this._userInfo;
    }

    set userInfo(info){
        this._userInfo = info;
    }
    async loginWithOauth(authInfo){
        this.sfdcConn = new jsforce.Connection({
            instanceUrl: authInfo.instance_url,
            accessToken: authInfo.access_token
        });
    }

    async setOrgNamespacePrefix(){
        let self = this;
        return new Promise(function (resolve, reject) {
            self.sfdcConn.query('SELECT NamespacePrefix FROM Organization', function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    self.orgNamespace=result.records[0].NamespacePrefix;
                    resolve();
                }
            });
        });
    }

    async query(theQuery){
        let self = this;
        
        return new Promise(function (resolve, reject) {
            self.sfdcConn.query(theQuery, function (err, result) {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    }

    async queryAll(theQuery){
        let result  = await this.query(theQuery);
        let allRecords = new Array();
        while (!result.done) {
            allRecords = lodash.concat(allRecords,result.records);
            result = await this.sfdcConn.queryMore(result.nextRecordsUrl);
        
        }
        if (result.records.length > 0) {
            allRecords = lodash.concat(allRecords,result.records);
        }
        return allRecords;
    }

    async setIdentityInfo() {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.sfdcConn.identity(function (err, res) {
                if(err){
                    reject(err);
                }else{
                    self.userInfo = res;
                    resolve();
                }
           })
        });
    }

    async getIdentityInfo() {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.sfdcConn.identity(function (err, res) {
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
           })
        });
    }

    async create(type,params){
        let self = this;
        let sObj = await addNamespaceToKeys(this.orgNamespace,params);
        return new Promise(function (resolve, reject) {
            self.sfdcConn.sobject(self.orgNamespace+type).create(sObj, function (err, ret) {
                if (err) {
                    reject(err);
                }
                resolve(ret.id);
            });
        });
    }

    async update(type,params){
        let self = this;
        let sObj = await addNamespaceToKeys(this.orgNamespace,params);
        return new Promise(function (resolve, reject) {
            self.sfdcConn.sobject(self.orgNamespace+type).update(sObj, function (err, ret) {
                if (err) {
                    reject(err);
                }
                resolve(ret.id);
            });
        });
    }

    async getMetadataForId(metadataType,theId){
        let self = this;
        return new Promise(function (resolve, reject) {
            self.sfdcConn.tooling.sobject(metadataType)
                .find({ Id: theId })
                .execute(
                function (err, meta) {
                    if (err) {
                        self.logger.error(err);
                        //throw err;
                        resolve(null);
                    }
                    resolve(meta[0]);
                });
        });
    }    

    async getReportMetadata(reportId) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.sfdcConn.analytics.report(reportId).describe(function (err, reportMetadata) {
                if (err) {
                    self.logger.error(reportId + ' - Error fetching Metadata for Report :'+ err);
                    //gracefully fail and return a null response
                    resolve(null);
                }
                resolve(reportMetadata)
            });
        });
    }
    async toolingQuery(theQuery){
        let self = this;
        return new Promise(function (resolve, reject) {
            self.sfdcConn.tooling.query(theQuery,
                function (error, result) {
                    if (error) {
                        console.log(error);
                        //throw error;
                        resolve(undefined);
                    }
                    resolve(result);
                });
        });
    }

    async toolingQueryAll(theQuery){
        let result = await this.toolingQuery(theQuery);
        let allRecords = new Array();
        while(!result.done){
            allRecords = lodash.concat(allRecords,result.records);
            result = await this.sfdcConn.tooling.queryMore(result.nextRecordsUrl);             
        }
        allRecords = lodash.concat(allRecords,result.records);
        return allRecords;
    }

    async metadataRetrieve(typesToFetch,tmpDir,fileName) {
        let self = this;
        this.logger.debug('Making request...');
        this.sfdcConn.metadata.pollTimeout = 600000;
        return new Promise(function (resolve, reject) {
            self.sfdcConn.metadata.retrieve({
                unpackaged: {
                    types: typesToFetch,
                    version: "43.0"
                }
            }).stream().pipe(fs.createWriteStream(path.join(tmpDir,fileName+".zip"))).on('finish', function(){
                 resolve();
            });
            
        });
    
    }

    async getReportTypeList(){
        let self = this;
        return new Promise(function (resolve, reject) {
            var client = new Client();
            var reportTypeUrl = self.sfdcConn.instanceUrl+'/services/data/v43.0/analytics/report-types';
            var sessionId = self.sfdcConn.accessToken;
            var args = {
                headers: { "Authorization": "OAuth "+sessionId } // request headers
            };
            client.get(reportTypeUrl, args,function (data, response) {
                // parsed response body as js object
                resolve(data);
            
            });
        });

    }

    async getReportTypeMetadata(describeUrl){
        let self = this;
        return new Promise(function (resolve, reject) {
            var client = new Client();
            var reportTypeUrl = self.sfdcConn.instanceUrl+describeUrl;
            var sessionId = self.sfdcConn.accessToken;
            var args = {
                headers: { "Authorization": "OAuth "+sessionId } // request headers
            };
            client.get(reportTypeUrl, args,function (data, response) {
                // parsed response body as js object
                resolve(data);
            
            });
        });        
    }

    async describeSObject(objType){
        let self = this;
         return new Promise(function (resolve,reject){
            self.sfdcConn.sobject(objType).describe(function(err, meta) {
                if (err) { reject(console.error(err)); }
                resolve(meta);
            });
            

        });
    }
}