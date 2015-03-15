// One global variable to share state across files:
CAM = {};

var vertx = require('vertx');
console = require('vertx/console');
container = require('vertx/container');

var server = vertx.createHttpServer();
var eb = vertx.eventBus;

CAM.vertx = vertx;
CAM.server = server;
CAM.eb = eb;

load('routes.js');
load('eb-messengers.js');
container.deployVerticle("mock-backend.vertx.js");
load("couchdb.vertx.js");


console.log('Querying couchdb:');
CAM.couchdb.checkAuth('calyx', 'aaaa', onAuthComplete);
CAM.couchdb.checkAuth('calyx', 'wrong', onAuthComplete);

function onAuthComplete(err, valid, userid){
  if(err){ throw new Error(err) }
  var msg = valid ? " authed successfully" : " failed to auth";
  console.log(userid + msg)
}  


// ATM our server does not have any message handlers at all; all communication with the EB is req/rep from eb-messengers.js.
//load('eb-handlers.js');

server.listen(8080, "0.0.0.0", function(err) {
  if (!err) {
    console.log("Listen succeeded!");
  } else { 
    console.log(err);
  }
});
