var express = require('express');
var app = express();

/*
 *  EXPRESS CONFIGURATION
 */
var serverConfig = require('./cfg/server.cfg.js');
var featureConfig = require('./cfg/feature.cfg.js');

app.sopro = {};
app.sopro.servers = serverConfig;
app.sopro.features = featureConfig;

// Serve static files under /web from the ./web directory
app.use('/web', express.static(__dirname+'/web'));

// Parse cookies into req.cookies on every request:
var cookieParser = require('cookie-parser')
app.use(cookieParser())

// Have Express set up sessions
var session = require('express-session');
app.use(session({ 
  secret: 'welcometoPANTHEONNNNN',
  resave: false,
  saveUninitialized: false,
}));


// Parse json and url-encoded form bodies:
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); //  application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

// Use ejs templates
app.set('view engine', 'ejs');

/*
 * MAIN HTTP SERVER LOGIC
 */

var vertx = require('vertx-eventbus-client');
var eventbus = new vertx.EventBus(serverConfig.vertx.eburl);
process.stdout.write('Waiting for eventbus connection...');
var passport;

var flagConnected = false;
eventbus.onopen = function() {
  process.stdout.write(' Connected!\n');
  flagConnected = true;

  console.log('Configuring auth...')
  passport = require('./passport.auth.js')(app);

  app.use(passport.initialize());
  app.use(passport.session());

  console.log('Binding routes...')
  // We wait till here so we can use eventbus and passport in our routes:
  require('./routes.js')(app, eventbus, passport); 

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
