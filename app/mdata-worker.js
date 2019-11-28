require('dotenv').load();
const sleep = require('sleepjs');

var LoggerUtils = require('./utils/LoggerUtils.js');
var logger = LoggerUtils.getLogger('mdata-worker', 'debug');
const SFConnectionUtils = require('./utils/SFConnectionUtils.js');

var redis = require("redis"),
    client = redis.createClient({
        url: process.env.REDIS_URL
    });
client.on("error", function (err) {
    console.log("Redis client Error " + err);
});

const MDataIndexer = require('./MdataIndexer.js');

async function main(){
    console.info(`Sleeping for ${process.env.BOOTSTRAP_SLEEP_SECS} secs`);
    await sleep(process.env.BOOTSTRAP_SLEEP_SECS*1000);
    waitForRequest();
}
async function waitForRequest() {
    client.brpop(['mdata_org_index', 1], async function (list, items) {
        if (items && items.length === 2) {
            logger.info('Received request to index org ... ');
            await handleMdataIndexRequest(JSON.parse(items[1]));
            setTimeout(waitForRequest, 3000);
        } else {
            logger.info('No active request...');
            setTimeout(waitForRequest, 3000);
        }
        
    });
}

async function handleMdataIndexRequest(authInfo) {
    let sfConn = new SFConnectionUtils();
    sfConn.loginWithOauth(authInfo);
    await sfConn.setOrgNamespacePrefix();
    await sfConn.setIdentityInfo();

    logger.info('['+sfConn.userInfo.organization_id+'] Begin indexing org... ');
    let indexer = new MDataIndexer(sfConn);
    await indexer.startIndexing();
    logger.info('['+sfConn.userInfo.organization_id+'] Completed indexing org  ');

}


main();
