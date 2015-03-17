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

container.deployVerticle("mock-backend.vertx.js");
var sockJSServer = vertx.createSockJSServer(server);

// Todo: Security analysis: 
// This is an allow all rule as per http://vertx.io/core_manual_js.html#sockjs-server
// Assume web clients can spoof any eventbus message
sockJSServer.bridge({prefix : '/eventbus'}, [{}], [{}] );

server.listen(3333, "localhost", function(err) {
  if (!err) {
    console.log("Listen succeeded!");
  } else { 
    console.log(err);
  }
});
