const SFConnectionUtils = require('./utils/SFConnectionUtils.js');
const MdataIndexer = require('./MdataIndexer.js');
async function main() {
    var sfConn = new SFConnectionUtils();
    await sfConn.login();
    var indexer = new MdataIndexer(sfConn);
    await sfConn.setOrgNamespacePrefix();
    await sfConn.setIdentityInfo();
    await indexer.startIndexing();
}
main();