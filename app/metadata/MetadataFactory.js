const CustomObjects = require('./CustomObjects.js');
const CustomFields = require('./CustomFields.js');
const FormulaFields = require('./FormulaFields.js');
const Roles = require('./Roles.js');
const PicklistValues = require('./PicklistValues.js');
const PublicGroups = require('./PublicGroups.js');
const Reports = require('./Reports.js');
const ListViews = require('./ListViews.js');
const ReportTypes = require('./ReportTypes.js');
const Layouts = require('./Layouts.js');
const ValidationRules = require('./ValidationRules.js');
const WorkflowFieldUpdates = require('./WorkflowFieldUpdates.js');
const WorkflowRules = require('./WorkflowRules.js');
const ApexTriggers = require('./ApexTriggers.js');
const ApexClasses = require('./ApexClasses.js');
const Profiles = require('./Profiles.js');

const classes = { CustomObjects,CustomFields,FormulaFields,Roles,PicklistValues,
                  PublicGroups,Reports,ListViews,ReportTypes,Layouts,ValidationRules,WorkflowFieldUpdates,
                  WorkflowRules,ApexTriggers,ApexClasses,Profiles};

class MetadataFactory{

  static getPluginClass(type){
    return classes[type];
  }
  
}

module.exports=MetadataFactory; 