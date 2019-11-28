var MetadataUtils = require('../utils/MetadataUtils.js');
var JSONUtils = require('../utils/JSONUtils.js');
const LoggerUtils = require('../utils/LoggerUtils.js');
const AbstractMetadataType = require('./AbstractMetadataType.js');
const lodash = require('lodash');

const standardObjects = [
    { "type": "Standard", "name": "Account", "Id": "Account" },
    { "type": "Standard", "name": "Asset", "Id": "Asset" },
    { "type": "Standard", "name": "Campaign", "Id": "Campaign" },
    { "type": "Standard", "name": "CampaignMember", "Id": "CampaignMember" },
    { "type": "Standard", "name": "Case", "Id": "Case" },
    { "type": "Standard", "name": "CaseHistory", "Id": "CaseHistory" },
    { "type": "Standard", "name": "CaseComment", "Id": "CaseComment" },
    { "type": "Standard", "name": "Contact", "Id": "Contact" },
    { "type": "Standard", "name": "Contract", "Id": "Contract" },
    { "type": "Standard", "name": "Document", "Id": "Document" },
    { "type": "Standard", "name": "Event", "Id": "Event" },
    { "type": "Standard", "name": "Folder", "Id": "Folder" },
    { "type": "Standard", "name": "Group", "Id": "Group" },
    { "type": "Standard", "name": "GroupMember", "Id": "GroupMember" },
    { "type": "Standard", "name": "Idea", "Id": "Idea" },
    { "type": "Standard", "name": "IdeaComment", "Id": "IdeaComment" },
    { "type": "Standard", "name": "Lead", "Id": "Lead" },
    { "type": "Standard", "name": "Macro", "Id": "Macro" },
    { "type": "Standard", "name": "Note", "Id": "Note" },
    { "type": "Standard", "name": "NoteAndAttachment", "Id": "NoteAndAttachment" },
    { "type": "Standard", "name": "Opportunity", "Id": "Opportunity" },
    { "type": "Standard", "name": "OpportunityCompetitor", "Id": "OpportunityCompetitor" },
    { "type": "Standard", "name": "OpportunityLineItem", "Id": "OpportunityLineItem" },
    { "type": "Standard", "name": "Order", "Id": "Order" },
    { "type": "Standard", "name": "OrderItem", "Id": "OrderItem" },
    { "type": "Standard", "name": "Partner", "Id": "Partner" },
    { "type": "Standard", "name": "Pricebook2", "Id": "Pricebook2" },
    { "type": "Standard", "name": "PricebookEntry", "Id": "PricebookEntry" },
    { "type": "Standard", "name": "Product2", "Id": "Product2" },
    { "type": "Standard", "name": "Profile", "Id": "Profile" },
    { "type": "Standard", "name": "Question", "Id": "Question" },
    { "type": "Standard", "name": "Quote", "Id": "Quote" },
    { "type": "Standard", "name": "QuoteDocument", "Id": "QuoteDocument" },
    { "type": "Standard", "name": "QuoteLineItem", "Id": "QuoteLineItem" },
    { "type": "Standard", "name": "RecordType", "Id": "RecordType" }

];

const standardFieldsAllObjects = [
    { "name": "Id", "Id": "Id", "DeveloperName": "Id" },
    { "name": "Name", "Id": "Name", type: "Text", "DeveloperName": "Name" },
    { "name": "CreatedBy", "Id": "CreatedBy", type: "Lookup", "DeveloperName": "CreatedBy" },
    { "name": "CreatedById", "Id": "CreatedById", type: "Lookup", "DeveloperName": "CreatedById" },
    { "name": "ModifiedBy", "Id": "ModifiedBy", type: "Lookup", "DeveloperName": "ModifiedBy" },
    { "name": "ModifiedById", "Id": "ModifiedById", type: "Lookup", "DeveloperName": "ModifiedById" },
    { "name": "CreatedDate", "Id": "CreatedDate", type: "DateTime", "DeveloperName": "CreatedDate" },
    { "name": "LastModifiedDate", "Id": "LastModifiedDate", type: "DateTime", "DeveloperName": "LastModifiedDate" },
    { "name": "RecordType", "Id": "RecordType", type: "Text", "DeveloperName": "RecordType" },
    { "name": "RecordTypeId", "Id": "RecordTypeId", type: "Text", "DeveloperName": "RecordTypeId" },
    { "name": "Owner", "Id": "Owner", type: "Lookup", "DeveloperName": "Owner" },
    { "name": "OwnerId", "Id": "OwnerId", type: "Lookup", "DeveloperName": "OwnerId" }
]

const standardFieldsPerObject = [
    { "object": "Account", "name": "ShippingAddressCity", "label": "Shipping Address City", "type": "Text", "Id": "Account.ShippingAddressCity" },
    { "object": "Account", "name": "ShippingAddressState", "label": "Shipping Address State", "type": "Text", "Id": "Account.ShippingAddressState" },
    { "object": "Account", "name": "ShippingAddressCountry", "label": "Shipping Address Country", "type": "Text", "Id": "Account.ShippingAddressCountry" },
    { "object": "Account", "name": "ShippingAddressPostalCode", "label": "Shipping Address PostalCode", "type": "Text", "Id": "Account.ShippingAddressPostalCode" },
    { "object": "Account", "name": "ShippingAddressStreet", "label": "Shipping Address Street", "type": "Text", "Id": "Account.ShippingAddressStreet" },
    { "object": "Account", "name": "MailingAddressCity", "label": "Mailing Address City", "type": "Text", "Id": "Account.MailingAddressCity" },
    { "object": "Account", "name": "MailingAddressState", "label": "Mailing Address State", "type": "Text", "Id": "Account.MailingAddressState" },
    { "object": "Account", "name": "MailingAddressCountry", "label": "Mailing Address Country", "type": "Text", "Id": "Account.MailingAddressCountry" },
    { "object": "Account", "name": "MailingAddressPostalCode", "label": "Mailing Address PostalCode", "type": "Text", "Id": "Account.MailingAddressPostalCode" },
    { "object": "Account", "name": "MailingAddressStreet", "label": "Mailing Address Street", "type": "Text", "Id": "Account.MailingAddressStreet" },
    { "object": "Account", "name": "AccountNumber", "label": "Account Number", "type": "Text", "Id": "Account.AccountNumber" },
    { "object": "Account", "name": "Site", "label": "Account Site", "type": "Text", "Id": "Account.Site" },
    { "object": "Account", "name": "AccountSource", "label": "Account Source", "type": "Picklist", "Id": "Account.AccountSource" },
    { "object": "Account", "name": "AnnualRevenue", "label": "Annual Revenue", "type": "Currency", "Id": "Account.AnnualRevenue" },
    { "object": "Account", "name": "PersonAssistantName", "label": "Assistant", "type": "Text", "Id": "Account.PersonAssistantName" },
    { "object": "Account", "name": "PersonAssistantPhone", "label": "Asst. Phone", "type": "Phone", "Id": "Account.PersonAssistantPhone" },
    { "object": "Account", "name": "BillingAddress", "label": "Billing Address", "type": "Address", "Id": "Account.BillingAddress" },
    { "object": "Account", "name": "PersonBirthdate", "label": "Birthdate", "type": "Date", "Id": "Account.PersonBirthdate" },
    { "object": "Account", "name": "ChannelProgramLevelName", "label": "Channel Program Level Name", "type": "Text", "Id": "Account.ChannelProgramLevelName" },
    { "object": "Account", "name": "ChannelProgramName", "label": "Channel Program Name", "type": "Text", "Id": "Account.ChannelProgramName" },
    { "object": "Account", "name": "CreatedById", "label": "Created By", "type": "Lookup", "Id": "Account.CreatedById" },
    { "object": "Account", "name": "IsCustomerPortal", "label": "Customer Portal Account", "type": "Checkbox", "Id": "Account.IsCustomerPortal" },
    { "object": "Account", "name": "DandbCompanyId", "label": "D&B Company", "type": "Lookup", "Id": "Account.DandbCompanyId" },
    { "object": "Account", "name": "DunsNumber", "label": "D-U-N-S Number", "type": "Text", "Id": "Account.DunsNumber" },
    { "object": "Account", "name": "Jigsaw", "label": "Data.com Key", "type": "Text", "Id": "Account.Jigsaw" },
    { "object": "Account", "name": "PersonDepartment", "label": "Department", "type": "Text", "Id": "Account.PersonDepartment" },
    { "object": "Account", "name": "Description", "label": "Description", "type": "LongTextArea", "Id": "Account.Description" },
    { "object": "Account", "name": "PersonDoNotCall", "label": "Do Not Call", "type": "Checkbox", "Id": "Account.PersonDoNotCall" },
    { "object": "Account", "name": "PersonEmail", "label": "Email", "type": "Email", "Id": "Account.PersonEmail" },
    { "object": "Account", "name": "PersonHasOptedOutOfEmail", "label": "Email Opt Out", "type": "Checkbox", "Id": "Account.PersonHasOptedOutOfEmail" },
    { "object": "Account", "name": "NumberOfEmployees", "label": "Employees", "type": "Number", "Id": "Account.NumberOfEmployees" },
    { "object": "Account", "name": "IsExcludedFromRealign", "label": "Exclude from territory assignment rules", "type": "Checkbox", "Id": "Account.IsExcludedFromRealign" },
    { "object": "Account", "name": "Fax", "label": "Fax", "type": "Fax", "Id": "Account.Fax" },
    { "object": "Account", "name": "PersonHasOptedOutOfFax", "label": "Fax Opt Out", "type": "Checkbox", "Id": "Account.PersonHasOptedOutOfFax" },
    { "object": "Account", "name": "PersonHomePhone", "label": "Home Phone", "type": "Phone", "Id": "Account.PersonHomePhone" },
    { "object": "Account", "name": "Industry", "label": "Industry", "type": "Picklist", "Id": "Account.Industry" },
    { "object": "Account", "name": "LastModifiedById", "label": "Last Modified By", "type": "Lookup", "Id": "Account.LastModifiedById" },
    { "object": "Account", "name": "PersonLastCURequestDate", "label": "Last Stay-in-Touch Request Date", "type": "DateTime", "Id": "Account.PersonLastCURequestDate" },
    { "object": "Account", "name": "PersonLastCUUpdateDate", "label": "Last Stay-in-Touch Save Date", "type": "DateTime", "Id": "Account.PersonLastCUUpdateDate" },
    { "object": "Account", "name": "PersonLeadSource", "label": "Lead Source", "type": "Picklist", "Id": "Account.PersonLeadSource" },
    { "object": "Account", "name": "PersonMailingAddress", "label": "Mailing Address", "type": "Address", "Id": "Account.PersonMailingAddress" },
    { "object": "Account", "name": "PersonMobilePhone", "label": "Mobile", "type": "Phone", "Id": "Account.PersonMobilePhone" },
    { "object": "Account", "name": "NaicsCode", "label": "NAICS Code", "type": "Text(8)", "Id": "Account.NaicsCode" },
    { "object": "Account", "name": "NaicsDesc", "label": "NAICS Description", "type": "Text(120)", "Id": "Account.NaicsDesc" },
    { "object": "Account", "name": "PersonOtherAddress", "label": "Other Address", "type": "Address", "Id": "Account.PersonOtherAddress" },
    { "object": "Account", "name": "PersonOtherPhone", "label": "Other Phone", "type": "Phone", "Id": "Account.PersonOtherPhone" },
    { "object": "Account", "name": "Ownership", "label": "Ownership", "type": "Picklist", "Id": "Account.Ownership" },
    { "object": "Account", "name": "ParentId", "label": "Parent Account", "type": "Hierarchy", "Id": "Account.ParentId" },
    { "object": "Account", "name": "IsPartner", "label": "Partner Account", "type": "Checkbox", "Id": "Account.IsPartner" },
    { "object": "Account", "name": "Phone", "label": "Phone", "type": "Phone", "Id": "Account.Phone" },
    { "object": "Account", "name": "Rating", "label": "Rating", "type": "Picklist", "Id": "Account.Rating" },
    { "object": "Account", "name": "Sic", "label": "SIC Code", "type": "Text", "Id": "Account.Sic" },
    { "object": "Account", "name": "SicDesc", "label": "SIC Description", "type": "Text", "Id": "Account.SicDesc" },
    { "object": "Account", "name": "TickerSymbol", "label": "Ticker Symbol", "type": "Text", "Id": "Account.TickerSymbol" },
    { "object": "Account", "name": "PersonTitle", "label": "Title", "type": "Text", "Id": "Account.PersonTitle" },
    { "object": "Account", "name": "Tradestyle", "label": "Tradestyle", "type": "Text", "Id": "Account.Tradestyle" },
    { "object": "Account", "name": "Type", "label": "Type", "type": "Picklist", "Id": "Account.Type" },
    { "object": "Account", "name": "Website", "label": "Website", "type": "Url", "Id": "Account.Website" },
    { "object": "Account", "name": "YearStarted", "label": "Year Started", "type": "Text", "Id": "Account.YearStarted" },
    { "object": "Case", "name": "AccountId", "label": "Account Name", "type": "Lookup", "Id": "Case.AccountId" },
    { "object": "Case", "name": "AssetId", "label": "Asset", "type": "Lookup", "Id": "Case.AssetId" },
    { "object": "Case", "name": "BusinessHoursId", "label": "Business Hours", "type": "Lookup", "Id": "Case.BusinessHoursId" },
    { "object": "Case", "name": "CaseNumber", "label": "Case Number", "type": "Auto Number", "Id": "Case.CaseNumber" },
    { "object": "Case", "name": "Origin", "label": "Case Origin", "type": "Picklist", "Id": "Case.Origin" },
    { "object": "Case", "name": "OwnerId", "label": "Case Owner", "type": "Lookup", "Id": "Case.OwnerId" },
    { "object": "Case", "name": "Reason", "label": "Case Reason", "type": "Picklist", "Id": "Case.Reason" },
    { "object": "Case", "name": "RecordTypeId", "label": "Case Record Type", "type": "Text", "Id": "Case.RecordTypeId" },
    { "object": "Case", "name": "SourceId", "label": "Case Source", "type": "Lookup", "Id": "Case.SourceId" },
    { "object": "Case", "name": "IsSelfServiceClosed", "label": "Closed by Self-Service User", "type": "Checkbox", "Id": "Case.IsSelfServiceClosed" },
    { "object": "Case", "name": "IsClosedOnCreate", "label": "Closed When Created", "type": "Checkbox", "Id": "Case.IsClosedOnCreate" },
    { "object": "Case", "name": "ContactEmail", "label": "Contact Email", "type": "Email", "Id": "Case.ContactEmail" },
    { "object": "Case", "name": "ContactFax", "label": "Contact Fax", "type": "Phone", "Id": "Case.ContactFax" },
    { "object": "Case", "name": "ContactMobile", "label": "Contact Mobile", "type": "Phone", "Id": "Case.ContactMobile" },
    { "object": "Case", "name": "ContactId", "label": "Contact Name", "type": "Lookup", "Id": "Case.ContactId" },
    { "object": "Case", "name": "ContactPhone", "label": "Contact Phone", "type": "Phone", "Id": "Case.ContactPhone" },
    { "object": "Case", "name": "CreatedById", "label": "Created By", "type": "Lookup", "Id": "Case.CreatedById" },
    { "object": "Case", "name": "ClosedDate", "label": "Date/Time Closed", "type": "DateTime", "Id": "Case.ClosedDate" },
    { "object": "Case", "name": "CreatedDate", "label": "Date/Time Opened", "type": "DateTime", "Id": "Case.CreatedDate" },
    { "object": "Case", "name": "Description", "label": "Description", "type": "LongTextArea", "Id": "Case.Description" },
    { "object": "Case", "name": "EntitlementId", "label": "Entitlement Name", "type": "Lookup", "Id": "Case.EntitlementId" },
    { "object": "Case", "name": "SlaExitDate", "label": "Entitlement Process End Time", "type": "DateTime", "Id": "Case.SlaExitDate" },
    { "object": "Case", "name": "SlaStartDate", "label": "Entitlement Process Start Time", "type": "DateTime", "Id": "Case.SlaStartDate" },
    { "object": "Case", "name": "IsEscalated", "label": "Escalated", "type": "Checkbox", "Id": "Case.IsEscalated" },
    { "object": "Case", "name": "Comments", "label": "Internal Comments", "type": "Text Area(4000)", "Id": "Case.Comments" },
    { "object": "Case", "name": "Language", "label": "Language", "type": "Picklist", "Id": "Case.Language" },
    { "object": "Case", "name": "LastModifiedById", "label": "Last Modified By", "type": "Lookup", "Id": "Case.LastModifiedById" },
    { "object": "Case", "name": "MilestoneStatus", "label": "Milestone Status", "type": "Text", "Id": "Case.MilestoneStatus" },
    { "object": "Case", "name": "ParentId", "label": "Parent Case", "type": "Lookup", "Id": "Case.ParentId" },
    { "object": "Case", "name": "Priority", "label": "Priority", "type": "Picklist", "Id": "Case.Priority" },
    { "object": "Case", "name": "ProductId", "label": "Product", "type": "Lookup", "Id": "Case.ProductId" },
    { "object": "Case", "name": "FeedItemId", "label": "Question from Chatter", "type": "Lookup", "Id": "Case.FeedItemId" },
    { "object": "Case", "name": "Status", "label": "Status", "type": "Picklist", "Id": "Case.Status" },
    { "object": "Case", "name": "IsStopped", "label": "Stopped", "type": "Checkbox", "Id": "Case.IsStopped" },
    { "object": "Case", "name": "StopStartDate", "label": "Stopped Since", "type": "DateTime", "Id": "Case.StopStartDate" },
    { "object": "Case", "name": "Subject", "label": "Subject", "type": "Text(255)", "Id": "Case.Subject" },
    { "object": "Case", "name": "Type", "label": "Type", "type": "Picklist", "Id": "Case.Type" },
    { "object": "Case", "name": "IsVisibleInSelfService", "label": "Visible in Self-Service Portal", "type": "Checkbox", "Id": "Case.IsVisibleInSelfService" },
    { "object": "Case", "name": "SuppliedCompany", "label": "Web Company", "type": "Text", "Id": "Case.SuppliedCompany" },
    { "object": "Case", "name": "SuppliedEmail", "label": "Web Email", "type": "Email", "Id": "Case.SuppliedEmail" },
    { "object": "Case", "name": "SuppliedName", "label": "Web Name", "type": "Text", "Id": "Case.SuppliedName" },
    { "object": "Case", "name": "SuppliedPhone", "label": "Web Phone", "type": "Text", "Id": "Case.SuppliedPhone" },
    { "object": "CaseHistory", "name": "CaseNumber", "label": "Case Number", "type": "Text", "Id": "CaseHistory.CaseNumber" },
    { "object": "CaseHistory", "name": "Origin", "label": "Origin", "type": "Text", "Id": "CaseHistory.Origin" },
    { "object": "CaseHistory", "name": "ClosedDate", "label": "Closed Date", "type": "DateTime", "Id": "CaseHistory.ClosedDate" },
    { "object": "Contact", "name": "Account", "label": "Account Name", "type": "Lookup", "Id": "Contact.Account" },
    { "object": "Contact", "name": "AssistantName", "label": "Assistant", "type": "Text", "Id": "Contact.AssistantName" },
    { "object": "Contact", "name": "AssistantPhone", "label": "Asst. Phone", "type": "Phone", "Id": "Contact.AssistantPhone" },
    { "object": "Contact", "name": "Birthdate", "label": "Birthdate", "type": "Date", "Id": "Contact.Birthdate" },
    { "object": "Contact", "name": "CleanStatus", "label": "Clean Status", "type": "Picklist", "Id": "Contact.CleanStatus" },
    { "object": "Contact", "name": "CurrencyIsoCode", "label": "Contact Currency", "type": "Picklist", "Id": "Contact.CurrencyIsoCode" },
    { "object": "Contact", "name": "Owner", "label": "Contact Owner", "type": "Lookup", "Id": "Contact.Owner" },
    { "object": "Contact", "name": "RecordType", "label": "Contact Record Type", "type": "Record Type", "Id": "Contact.RecordType" },
    { "object": "Contact", "name": "CreatedBy", "label": "Created By", "type": "Lookup", "Id": "Contact.CreatedBy" },
    { "object": "Contact", "name": "Jigsaw", "label": "Data.com Key", "type": "Text", "Id": "Contact.Jigsaw" },
    { "object": "Contact", "name": "Department", "label": "Department", "type": "Text", "Id": "Contact.Department" },
    { "object": "Contact", "name": "Description", "label": "Description", "type": "Long Text Area(32000)", "Id": "Contact.Description" },
    { "object": "Contact", "name": "DoNotCall", "label": "Do Not Call", "type": "Checkbox", "Id": "Contact.DoNotCall" },
    { "object": "Contact", "name": "Email", "label": "Email", "type": "Email", "Id": "Contact.Email" },
    { "object": "Contact", "name": "HasOptedOutOfEmail", "label": "Email Opt Out", "type": "Checkbox", "Id": "Contact.HasOptedOutOfEmail" },
    { "object": "Contact", "name": "Fax", "label": "Fax", "type": "Fax", "Id": "Contact.Fax" },
    { "object": "Contact", "name": "HasOptedOutOfFax", "label": "Fax Opt Out", "type": "Checkbox", "Id": "Contact.HasOptedOutOfFax" },
    { "object": "Contact", "name": "HomePhone", "label": "Home Phone", "type": "Phone", "Id": "Contact.HomePhone" },
    { "object": "Contact", "name": "LastModifiedBy", "label": "Last Modified By", "type": "Lookup", "Id": "Contact.LastModifiedBy" },
    { "object": "Contact", "name": "LastCURequestDate", "label": "Last Stay-in-Touch Request Date", "type": "Date/Time", "Id": "Contact.LastCURequestDate" },
    { "object": "Contact", "name": "LastCUUpdateDate", "label": "Last Stay-in-Touch Save Date", "type": "Date/Time", "Id": "Contact.LastCUUpdateDate" },
    { "object": "Contact", "name": "LeadSource", "label": "Lead Source", "type": "Picklist", "Id": "Contact.LeadSource" },
    { "object": "Contact", "name": "MailingAddressCity", "label": "Mailing Address City", "type": "Text", "Id": "Contact.MailingAddressCity" },
    { "object": "Contact", "name": "MailingAddressState", "label": "Mailing Address State", "type": "Text", "Id": "Contact.MailingAddressState" },
    { "object": "Contact", "name": "MailingAddressCountry", "label": "Mailing Address Country", "type": "Text", "Id": "Contact.MailingAddressCountry" },
    { "object": "Contact", "name": "MailingAddressPostalCode", "label": "Mailing Address PostalCode", "type": "Text", "Id": "Contact.MailingAddressPostalCode" },
    { "object": "Contact", "name": "MailingAddressStreet", "label": "Mailing Address Street", "type": "Text", "Id": "Contact.MailingAddressStreet" },
    { "object": "Contact", "name": "MobilePhone", "label": "Mobile", "type": "Phone", "Id": "Contact.MobilePhone" },
    { "object": "Contact", "name": "Salutation", "label": "Salutation", "type": "Picklist", "Id": "Contact.Salutation" },
    { "object": "Contact", "name": "FirstName", "label": "First Name", "type": "Text", "Id": "Contact.First Name" },
    { "object": "Contact", "name": "LastName", "label": "Last Name", "type": "Text", "Id": "Contact.Last Name" },
    { "object": "Contact", "name": "MiddleName", "label": "Middle Name", "type": "Text", "Id": "Contact.Middle Name" },
    { "object": "Contact", "name": "Suffix", "label": "Suffix", "type": "Text", "Id": "Contact.Suffix" },
    { "object": "Contact", "name": "OtherAddressCity", "label": "Other Address City", "type": "Text", "Id": "Contact.OtherAddressCity" },
    { "object": "Contact", "name": "OtherAddressState", "label": "Other Address State", "type": "Text", "Id": "Contact.OtherAddressState" },
    { "object": "Contact", "name": "OtherAddressCountry", "label": "Other Address Country", "type": "Text", "Id": "Contact.OtherAddressCountry" },
    { "object": "Contact", "name": "OtherAddressPostalCode", "label": "Other Address PostalCode", "type": "Text", "Id": "Contact.OtherAddressPostalCode" },
    { "object": "Contact", "name": "OtherAddressStreet", "label": "Other Address Street", "type": "Text", "Id": "Contact.OtherAddressStreet" },
    { "object": "Contact", "name": "OtherPhone", "label": "Other Phone", "type": "Phone", "Id": "Contact.OtherPhone" },
    { "object": "Contact", "name": "Phone", "label": "Phone", "type": "Phone", "Id": "Contact.Phone" },
    { "object": "Contact", "name": "ReportsTo", "label": "Reports To", "type": "Lookup", "Id": "Contact.ReportsTo" },
    { "object": "Contact", "name": "Title", "label": "Title", "type": "Text", "Id": "Contact.Title" },
    { "object": "User", "name": "FirstName", "label": "First Name", "type": "Text", "Id": "User.FirstName" },
    { "object": "User", "name": "LastName", "label": "Last Name", "type": "Text", "Id": "User.LastName" },
    { "object": "User", "name": "Alias", "label": "Alias", "type": "Text", "Id": "User.Alias" },
    { "object": "User", "name": "Role", "label": "Role", "type": "Text", "Id": "User.Role" },
    { "object": "User", "name": "Profile", "label": "Profile", "type": "Text", "Id": "User.Profile" },
    { "object": "User", "name": "LastLogin", "label": "Last Login", "type": "DateTime", "Id": "User.LastLogin" },
    { "object": "User", "name": "EmployeeNumber", "label": "Employee Number", "type": "Text", "Id": "User.EmployeeNumber" },
    { "object": "User", "name": "Manager", "label": "Manager", "type": "Text", "Id": "User.Manager" },
    { "object": "User", "name": "Timezone", "label": "Timezone", "type": "Text", "Id": "User.Timezone" },
    { "object": "User", "name": "IsKnowledgeUser", "Label": "Is Knowledge User", "type": "Text", "Id": "User.IsKnowledgeUser" },
    { "object": "User", "name": "Email", "label": "Email", "type": "Email", "Id": "User.Email" },
    { "object": "User", "name": "IsLiveAgentUser", "label": "Is LiveAgent User", "type": "Text", "Id": "User.IsLiveAgentUser" },
    { "object": "User", "name": "FederationIdentifier", "label": "Federation Identifier", "type": "Text", "Id": "User.FederationIdentifier" },
    { "object": "User", "name": "IsActive", "label": "Active", "type": "Checkbox", "Id": "User.IsActive" },
    { "object": "Activity", "name": "What", "label": "Related To", "type": "Lookup", "Id": "Activity.What" },
    { "object": "Activity", "name": "Subject", "label": "Subject", "type": "Text", "Id": "Activity.Subject" },
    { "object": "Activity", "name": "Account", "label": "Account", "type": "Lookup", "Id": "Activity.Account" },
    { "object": "Activity", "name": "Opportunity", "label": "Opportunity", "type": "Lookup", "Id": "Activity.Opportunity" },
    { "object": "Activity", "name": "Description", "label": "Description", "type": "LongTextArea", "Id": "Activity.Description" },
    { "object": "Activity", "name": "Priority", "label": "Priority", "type": "Picklist", "Id": "Activity.Priority" },
    { "object": "Activity", "name": "ActivityDate", "label": "Due Date", "type": "DateTime", "Id": "Activity.ActivityDate" },
    { "object": "Activity", "name": "Status", "label": "Status", "type": "Text", "Id": "Activity.Status" },

];

module.exports = class CustomFields extends AbstractMetadataType {
    constructor(n4jUtils, sfConn, metajobId) {
        super(n4jUtils, sfConn, metajobId);
        this.logger = LoggerUtils.getLogger('customfields', 'debug');

    }
    async process() {
        await super.updateMetadataStatus('In Progress', { type: 'CustomFields' })
        try {
            var customObjects = await MetadataUtils.getCustomObjectsById(this.neo4jutils);
            var customObjByName = await MetadataUtils.getCustomObjectsByName(this.neo4jutils);
            await this.createStandardFieldsOnObjects();

            this.logger.debug('[' + this.conn.userInfo.organization_id + '] Created standard fields on all objects !!!');

            var customFields = await MetadataUtils.getMetadataList(this.conn, 'CustomField', 'DeveloperName,Description,TableEnumOrId', "NamespacePrefix=null");

            this.logger.debug('[' + this.conn.userInfo.organization_id + '] Total Fields:' + customFields.length);
            await super.updateMetadataStatus('In Progress', { type: 'CustomFields', totalTypes: customFields.length })

            for (var i = 0; i < customFields.length; i++) {
                var record = customFields[i];
                var theObject = customObjects.get(record.TableEnumOrId);

                var cFld = await this.conn.getMetadataForId('CustomField', record.Id);
                if (cFld) {
                    this.logger.debug('[' + this.conn.userInfo.organization_id + '] ' + record.Id + ' - Fetched field metadata for:' + (theObject ? theObject.name : record.TableEnumOrId) + '.' + cFld.DeveloperName);
                    cFld.Metadata = JSONUtils.extractPrimitiveProperties(cFld.Metadata, true);
                    cFld.Metadata.DeveloperName = record.DeveloperName + '__c';
                    cFld.Metadata.TableEnumOrId = record.TableEnumOrId;
                    cFld.Metadata.name = record.DeveloperName + '__c';
                    cFld.Metadata.Id = record.Id;

                    if (!theObject) {
                        //this is a custom field on a standard object
                        var cypRes = await this.neo4jutils.upsert('CustomObject', 'name', {
                            name: record.TableEnumOrId,
                            type: "Standard"
                        });
                        this.logger.debug('[' + this.conn.userInfo.organization_id + '] ' + record.Id + ' - ' + record.TableEnumOrId + ' - Created  ' + cypRes.summary.counters._stats.nodesCreated + ' nodes');
                        cypRes = await this.neo4jutils.runCypherQuery("match (obj:CustomObject {name:$objName}) return obj", { objName: record.TableEnumOrId });
                        theObject = cypRes.records[0].get('obj').properties;
                    }
                    var fldParams = cFld.Metadata;
                    cypRes = await this.neo4jutils.upsert("CustomField", "Id", fldParams);
                    this.logger.debug('[' + this.conn.userInfo.organization_id + '] ' + record.Id + ' - ' + cFld.Metadata.name + ' - Created  ' + cypRes.summary.counters._stats.nodesCreated + ' nodes');
                    cypRes = await this.neo4jutils.upsertRelationship(
                        //source
                        {
                            type: "CustomObject",
                            findBy: "name",
                            findByVal: theObject.name
                        },
                        //target
                        {
                            type: "CustomField",
                            findBy: "Id",
                            findByVal: cFld.Metadata.Id
                        },
                        //relationship
                        {
                            type: "BelongsTo",
                            findBy: "name",
                            params: {
                                name: theObject.name + "." + cFld.Metadata.name,
                                type: 'Field'
                            }
                        }
                    );
                    this.logger.debug('[' + this.conn.userInfo.organization_id + '] ' + record.Id + ' - ' + theObject.name + "." + cFld.Metadata.name + ' - Created  ' + cypRes.summary.counters._stats.relationshipsCreated + ' relationships');

                    if (cFld.Metadata.type == 'MasterDetail' || cFld.Metadata.type == 'Lookup') {
                        var cFldProps = cFld.Metadata;
                        //Create relationships between lookup/master-detail fields and their corresponding objects
                        var refObject = customObjByName.get(cFldProps.referenceTo);
                        if (!refObject) {

                            this.logger.debug('[' + this.conn.userInfo.organization_id + '] ' + record.Id + ' - Lookup/Master Detail field, could not find Reference Object : ' + cFldProps.referenceTo);
                            cypRes = await this.neo4jutils.upsert('CustomObject', 'name',
                                {
                                    name: cFldProps.referenceTo,
                                    type: (cFldProps.referenceTo.endsWith('__c') ? 'Custom' : 'Standard')
                                });
                        }
                        this.logger.debug('[' + this.conn.userInfo.organization_id + '] ' + record.Id + ' - ' + theObject.name + "." + cFld.Metadata.name + ' - Created  ' + cypRes.summary.counters._stats.relationshipsCreated + ' relationships');
                        cypRes = await this.neo4jutils.upsertRelationship(
                            { type: "CustomObject", findBy: "name", findByVal: cFldProps.referenceTo },
                            { type: "CustomField", findBy: "Id", findByVal: cFldProps.Id },
                            {
                                type: "RefersTo", findBy: "name",
                                params: {
                                    name: theObject.name + '.' + cFldProps.name + '.' + cFldProps.type + '.' + cFldProps.referenceTo,
                                    type: cFldProps.type,
                                    relationshipName: cFldProps.relationshipName,
                                    relationshipLabel: cFldProps.relationshipLabel
                                }
                            }
                        );
                        this.logger.debug('[' + this.conn.userInfo.organization_id + '] ' + record.Id + ' - ' + theObject.name + '.' + cFldProps.name + '.' + cFldProps.type + '.' + cFldProps.referenceTo +
                            ' - Created  ' + cypRes.summary.counters._stats.relationshipsCreated + ' relationships');
                    }
                }


                await super.updateMetadataStatus('In Progress',
                    { type: 'CustomFields', totalTypes: customFields.length, completed: (i + 1) });
                this.logger.debug('[' + this.conn.userInfo.organization_id + '] Completed ' + (i + 1) + ' of ' + customFields.length);

            }
            await super.updateMetadataStatus('Completed', { type: 'CustomFields' });

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

    async createStandardFieldsOnObjects() {
        let customObjects = await MetadataUtils.getCustomObjectsByName(this.neo4jutils);
        let custObjectList = new Array();
        customObjects.forEach(async function (value, key, map) {
            custObjectList.push(value);
        });
        
        for(var i=0;i<custObjectList.length;i++){
            let custObj = custObjectList[i];
            for(var j=0;j<standardFieldsAllObjects.length;j++){
                var custField = standardFieldsAllObjects[j];
                custField.Id = custObj.name+'.'+custField.name;
                let cypRes = await this.neo4jutils.upsert("CustomField", "Id", custField);
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+custField.Id  + ' - ' + custObj.name+'.'+custField.name  + ' - Created  ' + cypRes.summary.counters._stats.nodesCreated + ' fields');
                cypRes = await this.neo4jutils.upsertRelationship(
                    //source
                    {
                        type: "CustomObject",
                        findBy: "name",
                        findByVal: custObj.name
                    },
                    //target
                    {
                        type: "CustomField",
                        findBy: "Id",
                        findByVal: custField.Id
                    },
                    //relationship
                    {
                        type: "BelongsTo",
                        findBy: "name",
                        params: {
                            name: 'StandardField-'+custField.Id,
                            type: 'Field'
                        }
                    }
                );
                this.logger.debug('['+this.conn.userInfo.organization_id + '] '+custField.Id  + ' - ' + custObj.name+'.'+custField.name  +
                                    ' - Created  ' + cypRes.summary.counters._stats.relationshipsCreated + ' Field-Object relationships');
            }
        }

        for (var j = 0; j < standardFieldsPerObject.length; j++) {
            var custField = standardFieldsPerObject[j];
            let objName = custField.object;
            custField.DeveloperName = custField.name;
            delete custField.object;
            let cypRes = await this.neo4jutils.upsert("CustomField", "Id", custField);
            this.logger.debug('[' + this.conn.userInfo.organization_id + '] - ' + custField.Id + ' - Created  ' + cypRes.summary.counters._stats.nodesCreated + ' fields');
            cypRes = await this.neo4jutils.upsertRelationship(
                //source
                {
                    type: "CustomObject",
                    findBy: "name",
                    findByVal: objName
                },
                //target
                {
                    type: "CustomField",
                    findBy: "Id",
                    findByVal: custField.Id
                },
                //relationship
                {
                    type: "BelongsTo",
                    findBy: "name",
                    params: {
                        name: 'StandardField-' + custField.Id,
                        type: 'Field'
                    }
                }
            );
            this.logger.debug('[' + this.conn.userInfo.organization_id + '] - ' + custField.Id +
                ' - Created  ' + cypRes.summary.counters._stats.relationshipsCreated + ' Field-Object relationships');
        }


    }

}