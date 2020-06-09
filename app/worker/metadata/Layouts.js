var MetadataUtils = require('../utils/MetadataUtils.js');
var JSONUtils = require('../utils/JSONUtils.js');
const LoggerUtils = require('../utils/LoggerUtils.js');
const AbstractMetadataType = require('./AbstractMetadataType.js');

module.exports = class Layouts extends AbstractMetadataType{

    constructor(n4jUtils,sfConn,metajobId){
        super(n4jUtils,sfConn,metajobId);
        this.logger = LoggerUtils.getLogger('layouts','debug');
    
    }

    async createLayoutFieldRelationships(theObject,layout) {
        var layoutSections = JSON.parse(layout.Metadata.layoutSections);
        for(var i=0;i<layoutSections.length;i++){
            for(var j=0;j<layoutSections[i].layoutColumns.length;j++){
                if(layoutSections[i].layoutColumns[j].layoutItems){
                    for(var k=0;k<layoutSections[i].layoutColumns[j].layoutItems.length;k++){
                        var layoutItem = layoutSections[i].layoutColumns[j].layoutItems[k];
                        this.logger.debug('['+this.conn.userInfo.organization_id + '] '+layout.Id+' - '+layout.Metadata.name+':Section - '+layoutSections[i].label
                                    +':Field - '+theObject.name+'.'+layoutItem.field);
                        var fldId = await this.neo4jutils.findFieldInObject(theObject.name,layoutItem.field);
                        if (fldId) {
                            layoutItem.name = layout.Metadata.name + '-LayoutItem-' + theObject.name + '.' + layoutItem.field;
                            layoutItem.type = 'LayoutItem';
                            var cypRes = await this.neo4jutils.upsertRelationship(
                                { type: "CustomField", findBy: "Id", findByVal: fldId },
                                { type: "Layout", findBy: "Id", findByVal: layout.Metadata.Id },
                                {
                                    type: "Contains",
                                    findBy: "name",
                                    params: layoutItem
                                }
                            );
                            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+layout.Id+' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' relationships');

                        } else {
                            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+layout.Id+' - Layout:' + layout.Metadata.name + ' - Could not find field :' + theObject.name + '.' + layoutItem.field);

                        }
                    }
                }
                            
            }
        }
    }    

    async process(){
        await super.updateMetadataStatus('In Progress',{type:'Layouts'})
        try{
            var customObjects = await MetadataUtils.getCustomObjectsById(this.neo4jutils);
            
            var layouts = await MetadataUtils.getMetadataList(this.conn,'Layout','Name,TableEnumOrId,LayoutType','NamespacePrefix=null');
            
            await super.updateMetadataStatus('In Progress',{type:'Layouts',totalTypes:layouts.length})
            this.logger.debug('['+this.conn.userInfo.organization_id + '] Total Layouts:'+layouts.length);
           
            for (var i = 0; i < layouts.length; i++) {
                var record = layouts[i];
                var theObject = customObjects.get(record.TableEnumOrId);
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+record.Id+' - Layout:'+record.Name+',TableEnumOrId:'+record.TableEnumOrId);
                if(theObject){
                    var layoutResults;
                    try{
                        layoutResults = await this.conn.getMetadataForId("Layout",record.Id);
                    }catch(metadataErr){
                        //Ignore the metadata error.
                        this.logger.error(record.Id+' - Error fetching Layout metadata for Id:'+record.Id);
                        
                    }   
                    if(layoutResults){
                            var layout = layoutResults;
                            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+record.Id+' - Fetched metadata for layout:'+record.Name);
                            layout.Metadata = JSONUtils.extractPrimitiveProperties(layout.Metadata,true)
                            layout.Metadata.Id = record.Id;
                            layout.Metadata.name = record.Name;
                            layout.Metadata.type = record.LayoutType;
                            layout.Metadata.TableEnumOrId = record.TableEnumOrId;
                            var cypRes = await this.neo4jutils.upsert('Layout','Id',layout.Metadata);
                            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+record.Id+' - Created ' + cypRes.summary.counters._stats.nodesCreated + ' layout nodes');
                            var relName = theObject.name+'.Layout.'+layout.Metadata.name;
                            cypRes = await this.neo4jutils.upsertRelationship(
                                { type: "CustomObject", findBy: "name", findByVal: theObject.name },
                                { type: "Layout", findBy: "Id", findByVal: layout.Metadata.Id },
                                {
                                    type: "BelongsTo", findBy: "name",
                                    params: {
                                        name: relName,
                                        type: 'Layout'
                                    }
                                }
                            );
                            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+record.Id+' - Created ' + cypRes.summary.counters._stats.relationshipsCreated + ' relationships');
                            await this.createLayoutFieldRelationships(theObject,layout);
                        }else{
                            this.logger.debug('['+this.conn.userInfo.organization_id + '] '+record.Id+' - Could not fetch layout metadata');

                        }
    
                }else{
                    this.logger.debug('['+this.conn.userInfo.organization_id + '] '+record.Id+' - Did not find object for Layout:'+record.Name+',TableEnumOrId:'+record.TableEnumOrId);
                    
                }

                
                this.logger.debug('['+this.conn.userInfo.organization_id + '] Completed ' + (i + 1) + ' of ' + layouts.length);
                await super.updateMetadataStatus('In Progress',{type:'Layouts',totalTypes:layouts.length,completed:(i + 1)})

            }
            await super.updateMetadataStatus('Completed',{type:'Layouts'})
        }catch(err){
            this.logger.error(err);
            throw err;
        }
              
    }

}