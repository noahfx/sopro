var vertx = require('vertx');
console = require('vertx/console');
var eb = vertx.eventBus;

// set CAM_MOCKS:
//load('tests/mock-data.js');

load('couchdb/config.js');
CAM.couchdb = {};
CAM.couchdb.http = 
  vertx.createHttpClient()
  // TODO: Enable SSL and configure key store with pinned certs:
  //.ssl(true)
  //.trustAll(true);
  .host(SOPRO_CONFIG_COUCHDB.host)
  .port(+SOPRO_CONFIG_COUCHDB.port);

CAM.couchdb.checkAuth = function(user, pass, callback){
  var request =
  CAM.couchdb.http.get('/mocks/_design/soprochat/_view/pwdauth/?key="'+user+'"', function(res){
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