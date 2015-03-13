// One global variable to share state across files:
CAM = {};

var vertx = require('vertx');
console = require('vertx/console');

load('couchdb/config.js');

var couchdb = 
vertx.createHttpClient()
// TODO: Enable SSL and configure key store with pinned certs:
//.ssl(true)
//.trustAll(true);

couchdb
.host(SOPRO_CONFIG_COUCHDB.host)
.port(+SOPRO_CONFIG_COUCHDB.port);

CAM.couchdb = couchdb;


function checkAuth(user, pass, callback){
  var request =
  couchdb.get('/mocks/_design/soprochat/_view/pwdauth/?key="'+user+'"', function(res){
    onCouchdbAuthResponse(res, user, pass, callback)
  });

  //var authString0 = SOPRO_CONFIG_COUCHDB.user+':'+SOPRO_CONFIG_COUCHDB.pass
  // Skipping the base64 encode for now... the below is "admin:sopassword" see e.g. http://javadox.com/io.vertx/vertx-core/2.0.0-CR3/org/vertx/java/core/json/impl/Base64.html
  var authString1 = 'YWRtaW46c29wYXNzd29yZA=='
  var authString2 = "Basic "+ authString1;
  request.headers().set("Authorization", authString2)
  request.end()
}

function onCouchdbAuthResponse(res, user, pass, callback){

  res.bodyHandler(function(body) {
    if(body.error){
      callback(body.error +'; '+ body.reason, false)
    }

    // Body is a buffer, not a string or object...
    body = JSON.parse(body);

    var results = body.rows;
    if(results.length === 0){
      return callback(null, false); // no error; user not found
    }
    if(results.length > 1){
      return callback('Found multiple results matching '+user, false);
    }
    // One user found
    var row = results[0];

    // Temporary check that the password equals the salt
    // TODO: Test hash(pass + user.salt) = user.hash
    if(pass === row.value[0]){
      callback(null, true, row.value[2]); // No error; auth ok
    } else {
      callback(null, false, row.value[2]) // No error; bad pass
    }
  });

}

function onAuthComplete(err, valid, userid){
  if(err){ throw new Error(err) }
  var msg = valid ? " authed successfully" : " failed to auth";
  console.log(userid + msg)
}

console.log('Querying couchdb:');
checkAuth('calyx', 'aaaa', onAuthComplete);
checkAuth('calyx', 'wrong', onAuthComplete);

var server = vertx.createHttpServer();
var eb = vertx.eventBus;

CAM.vertx = vertx;
CAM.server = server;
CAM.eb = eb;

load('routes.js');
load('eb-messengers.js');

// ATM our server does not have any message handlers at all; all communication with the EB is req/rep from eb-messengers.js.
//load('eb-handlers.js');

server.listen(8080, "0.0.0.0", function(err) {
  if (!err) {
    console.log("Listen succeeded!");
  } else { 
    console.log(err);
  }
});
