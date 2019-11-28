console.log(`NEO4J_URL: ${process.env.NEO4J_URL}`);
console.log(`REDIS_URL: ${process.env.REDIS_URL}`);
const sleep = require('sleepjs');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(process.env.NEO4J_URL);

var redis = require("redis"),
    client = redis.createClient({
        url: process.env.REDIS_URL
    });
client.on("error", function (err) {
    console.log("Redis client Error " + err);
});

async function runMain() {
    console.info('Sleeping for 20 secs');
    await sleep(20000);
    db.cypher({
        query: 'MERGE (alice:Person {name : {nameParam} }) RETURN alice.name AS name',
        params: {
            nameParam: 'Alice',
        },
    }, function (err, results) {
        if (err) throw err;
        console.log(`neo4j results: ${JSON.stringify(results, null, 4)}`);
    });

    client.set('some-key', '42', function (err) {
        if (err) {
            throw err; 
        } else {
            client.get('some-key', function (err, value) {
                if (err) {
                    throw err;
                } else {
                    console.log(`redis results ${value}`);
                }
            });
        }
    });
}

runMain();