if(process.env.MDATA_LOCAL){
    require('dotenv').load();
}

console.log(`============= Environment variables =============\n ${JSON.stringify(process.env,null,4)}`);
var express = require('express'),
    oauth2 = require('salesforce-oauth2'),
    session = require('express-session');
var redis = require("redis"),
client = redis.createClient({
    url: process.env.REDIS_URL
});


const SFConnectionUtils = require('./worker/utils/SFConnectionUtils.js');

const PluginFactory = require('./worker/plugins/PluginFactory.js');

var pluginFactory = new PluginFactory();

client.on("error", function (err) {
    console.log('Error on client: '+err);
    reconnectToRedis();
});

function reconnectToRedis(){
    client = redis.createClient({
        url: process.env.REDIS_URL
    });
    client.on("error", function (err) {
        console.log("Error " + err);
    
    });
}
var callbackUrl = process.env.SF_CALLBACK_URL,
    consumerKey = process.env.SF_CLIENT_ID,
    consumerSecret = process.env.SF_CLIENT_SECRET;

var app = express();

// Which port to listen on
app.set('port', process.env.PORT || 3000);


//Middleware
app.use(session({secret: "w585hJqIfL0GWMUbD1WboOuvsjG9Urv1h8cEv8XyFZBPYV582WnLKapj1TboI5gp8sy3hDC53mbDXYDjLrIEvBbsz3MDKmzdLZCw"}));
app.use('/plugins/:id/execute',async function (req, res, next) {
    
    console.log('OAuth Header:', req.get('Authorization'));
    console.log('OrgId:', req.query.OrgId);
    let oauthHdrValid = {};
    if(!process.env.LOCAL){
        oauthHdrValid = await validOauthHeader(req);

    }else{
        oauthHdrValid.valid=true;
    }
    if(oauthHdrValid.valid && !process.env.LOCAL){
        res.locals.organization_id=oauthHdrValid.organization_id;
        next();
    }else if(process.env.LOCAL){
        res.locals.organization_id=req.query.OrgId;
        next();
    }else{
        res.statusCode = 401;
        res.json({"message":oauthHdrValid.message});
    }
});

app.use(express.static('./public'));

validOauthHeader = async function(req){
    let authHdr = req.get('Authorization');
    let instanceUrl = req.get('InstanceUrl');
    if(!authHdr){
        return {valid:false,message:"Authorization header missing"};
    }else if(!instanceUrl){
        return {valid:false,message:"Instance Url Header missing"};
    }else{
        //Make a Salesforce Identity call to check if the OAuth session Id is valid
        let hdrTokens =  authHdr.split(' ');
        if(hdrTokens.length !=2){
            return {valid:false,message:"Invalid Oauth Header format"};
        }
        else{

            let sfConn = new SFConnectionUtils();
            await sfConn.loginWithOauth({
                instance_url:instanceUrl,
                access_token:hdrTokens[1]
            });
            try{
                let userInfo = await sfConn.getIdentityInfo();
                return {valid:true,organization_id:userInfo.organization_id};
            }catch(err){
                return {valid:false,message:err.message};
            }
        }

    }
}
//REST API handlers
listAllPlugins = function(req,res){
    let results =pluginFactory.getAllPlugins();
    res.json(results);
};

pluginDetail = function(req,res){
    let plugin = pluginFactory.getPlugin(req.params.id);
    if(plugin){
        res.json(plugin);
    }else{
        res.statusCode = 500;
        res.json({"message":"Could not find plugin named:"+req.params.id});
    }
};

runPlugin = async function(req,res){
    let orgId = res.locals.organization_id;

    let plugin = pluginFactory.getPlugin(req.params.id);
    if(plugin){
        try{
            let results = await plugin.execute(orgId,req.query)
            res.json(results);
        }catch(err){
            res.statusCode = 500;
            res.json({"message":err.message});
               
        }
    }else{
        res.statusCode = 500;
        res.json({"message":"Could not find plugin named:"+req.params.id});
    }
};

oauthCallback = function (request, response) {
    var authorizationCode = request.param('code');
    var loginUrl = request.session.loginUrl;
    oauth2.authenticate({
        redirect_uri: callbackUrl,
        client_id: consumerKey,
        client_secret: consumerSecret,
        code: authorizationCode,
        // You can change loginUrl to connect to sandbox or prerelease env.
        base_url: loginUrl
    }, function (error, payload) {
        if (payload) {
            client.rpush('mdata_org_index', JSON.stringify(payload));
            response.send('Authorization successful !!!');
        } else {
            console.log('Empty Payload');
            response.send('Empty payload received. Try again !!!');
        }
    });
};

mdataInit = function (request, response) {
    request.session.loginUrl=request.query.loginUrl;
    var uri = oauth2.getAuthorizationUrl({
        redirect_uri: callbackUrl,
        client_id: consumerKey,
        scope: 'full', // 'id api web refresh_token'
        // You can change loginUrl to connect to sandbox or prerelease env.
        //base_url: 'https://test.salesforce.com'
        base_url: request.query.loginUrl
    });
    console.log(uri);
    return response.redirect(uri);
};

redisPurge = function() {
    client.del('mdata_org_index');
}


app.get('/plugins', listAllPlugins);
app.get('/plugins/:id', pluginDetail);
app.get('/plugins/:id/execute', runPlugin);
app.get('/oauth/callback', oauthCallback);


app.get("/mdata",mdataInit );

app.get("/redis/purge", redisPurge);

app.get("/mdata/restart", mdataInit);

// Start listening for HTTP requests
var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('mData listening at http://%s:%s', host, port);
});