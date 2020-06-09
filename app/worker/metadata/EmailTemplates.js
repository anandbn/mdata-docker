var MetadataUtils = require('../utils/MetadataUtils.js');
var JSONUtils = require('../utils/JSONUtils.js');
const LoggerUtils = require('../utils/LoggerUtils.js');
const AbstractMetadataType = require('./AbstractMetadataType.js');
const lodash = require('lodash');

module.exports = class EmailTemplates extends AbstractMetadataType {
    constructor(n4jUtils, sfConn, metajobId) {
        super(n4jUtils, sfConn, metajobId);
        this.logger = LoggerUtils.getLogger('emailtemplates', 'debug');

    }
    async process() {
        await super.updateMetadataStatus('In Progress', { type: 'EmailTemplates' })
        try {
            var emailTemplateQuery = 'select Id,ApiVersion,BrandTemplateId,Description,DeveloperName,Encoding,Folder.Name,IsActive,RelatedEntityType,Subject,TemplateStyle,TemplateType,UiType from EmailTemplate';
            var emailTemplates = await this.conn.queryAll(emailTemplateQuery);

            this.logger.debug('[' + this.conn.userInfo.organization_id + '] Total Email Templates:' + emailTemplates.length);
            await super.updateMetadataStatus('In Progress', { type: 'EmailTemplates', totalTypes: emailTemplates.length })

            for (var i = 0; i < emailTemplates.length; i++) {

                var emailTemplate = emailTemplates[i];
                delete emailTemplate.attributes;
                if(emailTemplate.Folder){
                    emailTemplate.FolderName = emailTemplate.Folder.Name;
                    delete emailTemplate.Folder;
                }

                this.logger.debug('[' + this.conn.userInfo.organization_id + '] EmailTemplate:' + emailTemplate.name + ', Properties: ' + JSON.stringify(emailTemplate));
                let cypRes = await this.neo4jutils.upsert("EmailTemplate", "DeveloperName", emailTemplate);
                this.logger.debug('[' + this.conn.userInfo.organization_id + '] EmailTemplate:' + emailTemplate.name + ' : Created ' + cypRes.summary.counters._stats.nodesCreated + ' nodes');
                this.logger.debug('[' + this.conn.userInfo.organization_id + '] Completed ' + (i + 1) + ' of ' + emailTemplates.length);
                await super.updateMetadataStatus('In Progress', { type: 'EmailTemplates', totalTypes: emailTemplates.length, completed: (i + 1) });

            }
            await super.updateMetadataStatus('Completed', { type: 'EmailTemplates' });


        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

    async cleanup() {

    }
}