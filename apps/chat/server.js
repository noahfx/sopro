var express = require('express');
var app = express();
var config = require('./cfg/server.cfg.js');

// Serve static files under /web from the ./web directory
app.use('/web', express.static(__dirname+'/web'));

var vertx = require('vertx-eventbus-client');
var eventbus = new vertx.EventBus(config.vertx.eburl);

require('./routes.js')(app, eventbus);

app.listen(config.server.port, config.server.host, function(){
  console.log('Listening on '+config.server.host+':'+config.server.port);
})
