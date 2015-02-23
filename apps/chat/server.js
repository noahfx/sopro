// One global variable to share state across files:
CAM = {};

var vertx = require('vertx');
console = require('vertx/console');

var server = vertx.createHttpServer();
var eb = vertx.eventBus;

CAM.vertx = vertx;
CAM.server = server;
CAM.eb = eb;

load('routes.js');
load('eb-messengers.js');

// ATM our server does not have any message handlers at all; all communication with the EB is req/rep from eb-messengers.js.
//load('eb-handlers.js');

server.listen(8080, "localhost", function(err) {
  if (!err) {
    console.log("Listen succeeded!");
  } else { 
    console.log(err);
  }
});
