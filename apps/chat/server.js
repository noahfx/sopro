var fs = require('fs');
var os = require('os');
var argh = require('argh').argv;
var express = require('express');
var app = express();



var PI = require('./persistence-interface.js')();
var PICouch = require('./persistence-couchdb');
PI.use(PICouch);

/*
 * CONFIGURATION
 */

var serverConfig = require('./cfg/servers.js');

try{
  fs.readFileSync('./cfg/locals.js', {encoding: 'utf8'});
} catch(e){
  if(e.code == 'ENOENT') {
    var file = fs.readFileSync('./cfg/locals.example.js', {encoding: 'utf8'});
    console.log('cfg/locals.js not found. Cannot start.')
    process.setgid(serverConfig.express.runtimeGroup);
    process.setuid(serverConfig.express.runtimeUser);
    fs.writeFileSync('./cfg/locals.js', file, {encoding: 'utf8'});
    console.log('Wrote example local config in cfg/locals.js. Edit and set your secrets there.');
    process.exit();
  }
}

var localConfig = require('./cfg/locals.js');
var featureConfig;


app.sopro = {};
app.sopro.servers = serverConfig;
app.sopro.local = localConfig;
app.sopro.PI = PI;
app.sopro.PICouch = PICouch;

// Override env variable with --enterprise flag:
if(argh.enterprise){
  app.set('env', 'enterprise');
  featureConfig = require('./cfg/features.enterprise.js');
} else{
  if(app.get('env') === undefined){
    app.set('env', 'standard');
  }
  featureConfig= require('./cfg/features.standard.js');
}

app.sopro.env = app.get('env');
app.sopro.features = featureConfig;

/*
 *  EXPRESS CONFIGURATION:
 *  Keep in mind Express constructs a request pipeline in order.
 *  So every time we call app.use(fn) it adds that function to the end of the request pipeline.
 *  Requests go through the pipeline in order.
 *  E.g. the first handler that a request hits is the static middleware, below
 */

// Serve static files matching /web/* from the ./web directory:
app.use('/web', express.static(__dirname+'/web'));

// Log non-static requests
var logger = require('connect-logger');
app.use(logger());

// Parse header cookies into req.cookies on every request:
var cookieParser = require('cookie-parser')
app.use(cookieParser())

// Have Express set up sessions:
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

// Use ejs templates from the default views folder:
app.set('view engine', 'ejs');

/*
 * ACL AUTHORIZATION SETUP
 */

var acl = require('./auth-matrix.js')();
/*
 *  VERTX EVENT BUS:
 */

var vertx = require('vertx-eventbus-client');
var eventbus = new vertx.EventBus(serverConfig.vertx.eburl);
process.stdout.write('Waiting for eventbus connection...');
var passport;

var flagConnected = false;
eventbus.onopen = function() {
  process.stdout.write(' Connected!\n');
  flagConnected = true;
  startExpress()
};

/*
 *  EXPRESS STARTUP:
 */

var flagHTTPStarted = false;
var flagHTTPSStarted = false;
function startExpress(){
  // Configure authentication logic:
  console.log('Environment:', app.sopro.env);
  console.log('Configuring auth...');
  passport = require('./passport.auth.js')(app);
  app.use(passport.initialize());
  app.use(passport.session());

  console.log('Binding routes...')
  // The routing logic needs some dependencies:
  var sopro = require('./sopro.js')(app, PI);
 

  // Start http server:
  app.listen(serverConfig.express.port, serverConfig.express.bindAddress, function(){
    console.log('Listening on http://'+serverConfig.express.bindAddress+':'+serverConfig.express.port);
    flagHTTPStarted = true;
    dropPrivileges();
  })

  // Load ssl credentials:
  var key = fs.readFileSync(serverConfig.express.sslOptions.keyfile);
  var cert = fs.readFileSync(serverConfig.express.sslOptions.certfile);

  // Start https server:
var https = require('https')
  .createServer({
    key: key,
    cert: cert
  }, app)
  .listen(serverConfig.express.sslPort, serverConfig.express.bindAddress, function(){
    console.log('Listening on https://'+serverConfig.express.bindAddress+':'+serverConfig.express.sslPort);
    flagHTTPSStarted = true;
    dropPrivileges();
  });

  var io = require('socket.io')(https);
  console.log("Socket listening on port", serverConfig.express.sslPort);

  var pubnub = require("pubnub")({
    ssl           : true,
    publish_key   : app.sopro.local.pubnub.publish_key,
    subscribe_key : app.sopro.local.pubnub.subscribe_key,
  });

  require('./routes.js')(app, eventbus, passport, acl, PI, sopro, io, pubnub);
}




function dropPrivileges(){
  if(!flagHTTPStarted || !flagHTTPSStarted){ 
    return;
  }
  if(os.platform() === 'win32'){
    console.log('NOT dropping privileges because windows doesn\'t do that');
    return;
  }

  try {
    console.log('Old User ID: ' + process.getuid() + ', Old Group ID: ' + process.getgid());
    process.setgid(app.sopro.servers.express.runtimeGroup);
    process.setuid(app.sopro.servers.express.runtimeUser);
    console.log('New User ID: ' + process.getuid() + ', New Group ID: ' + process.getgid());
  } catch (err) {
    console.log('Tried and failed to switch user away from root.');
    process.exit(1);
  }

  var didThrow = null;
  try{
    fs.writeFileSync('/root/shouldNotBeWritable.txt', 'foo')
  } catch(e) {
    didThrow = true;
  } finally {
    if(!didThrow){
      fs.unlinkSync('/root/shouldNotBeWritable.txt');
      throw new Error('Successfully wrote to /root; expected failure')
    }
  }

}

// Handler to gracefully exit if the process is killed:
process.on('SIGTERM', function(){
  console.log('Gracefully exiting on SIGTERM');
  process.exit();
})

// Helpful warning if socksjs is delayed:
setTimeout(function(){
  if(flagConnected){return}
  console.log('\nIf your eventbus SocksJS server is on a local network it should have connected in less than 5 seconds. Is it running on '+serverConfig.vertx.eburl+'?')
}, 5000)
