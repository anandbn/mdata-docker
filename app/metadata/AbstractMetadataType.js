const lodash = require('lodash');
module.exports = class AbstractMetadataType {

    constructor(n4jUtils, sfConn, metajobId) {
        this.neo4jutils = n4jUtils;
        this.conn = sfConn;
        this.metajobId = metajobId;

    }

    async init() {

    }

    async process() {

    }
    async cleanup() {

    }

    async updateMetadataStatus(status, metadataType) {
        if (!this.metajobId) {
            return new Promise(function (resolve, reject) {
                resolve();
            });
        }

        var sObj = new Object();
        lodash.set(sObj, 'Id', this.metajobId);
        lodash.set(sObj, this.conn.orgNamespace+'Status__c', status);
        if (metadataType.totalTypes>=0) {
            lodash.set(sObj, this.conn.orgNamespace+'Total_Types__c', metadataType.totalTypes);
        }
        if (metadataType.completed>=0) {
            lodash.set(sObj, this.conn.orgNamespace+'Indexed_Types__c', metadataType.completed);
        }
        return await this.conn.update(this.conn.orgNamespace+'Metadata_Job__c', sObj);

    }
    
}