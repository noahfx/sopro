var express = require('express');
var app = express();
var config = require('./cfg/server.cfg.js');

//require('./routes.js')(app);

app.listen(config.server.port, config.server.host, function(){
  console.log('Listening on '+config.server.host+':'+config.server.port);
})
