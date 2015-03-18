var express = require('express');
var app = express();

var serverConfig = require('./cfg/server.cfg.js');
var featureConfig = require('./cfg/feature.cfg.js');

app.sopro = {};
app.sopro.servers = serverConfig;
app.sopro.features = featureConfig;

// Serve static files under /web from the ./web directory
app.set('view engine', 'ejs');
//app.set('views', __dirname+'/views')
app.use('/web', express.static(__dirname+'/web'));

var vertx = require('vertx-eventbus-client');
var eventbus = new vertx.EventBus(serverConfig.vertx.eburl);
process.stdout.write('Waiting for eventbus connection...');

var flagConnected = false;
eventbus.onopen = function() {
  process.stdout.write(' Connected!\n');
  flagConnected = true;
  //console.log('eb.onopen start.');
  console.log('Binding routes...')
  require('./routes.js')(app, eventbus);


  app.listen(serverConfig.server.port, serverConfig.server.host, function(){
    console.log('Listening on '+serverConfig.server.host+':'+serverConfig.server.port);
  })

};


/*
  CAM.couchdb.checkAuth('calyx', 'aaaa', onAuthComplete);
  CAM.couchdb.checkAuth('calyx', 'wrong', onAuthComplete);

  function onAuthComplete(err, valid, userid){
    if(err){ throw new Error(err) }
    var msg = valid ? " authed successfully" : " failed to auth";
    console.log(userid + msg)
  }
*/

setTimeout(function(){
  if(flagConnected){return}
  console.log('\nIf your eventbus SocksJS server is on a local network it should have connected in less than 5 seconds. Is it running on '+serverConfig.vertx.eburl+'?')
}, 5000)
