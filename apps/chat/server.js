var vertx = require('vertx');
var console = require('vertx/console');

var server = vertx.createHttpServer();
var routeMatcher = new vertx.RouteMatcher();
var eb = vertx.eventBus;


//**************Authentication*************************
var authenticate = function (req, cb) {
  var token = '';

  req.headers().forEach(function(key, value) {
    if (key == "token-auth") {
      token = value;
    }
  });
  if (token) {
    eb.send("token.authentication",token, function (reply) {
      if (reply) {
        cb(null, true);  
      } else {
        cb("Invalid Token!", null);
      }
    });
  } else {
    cb("No token auth!", null);
  }
}
//*******************************************************

//****************Route Matcher**************************
server.requestHandler(routeMatcher);

routeMatcher.get('/channels', function(req) {
  authenticate(req, function (err, data) {
    if (err) {
      req.response.end(err);  
    } else {
      eb.send("get.channels",null, function (reply) {
        if (reply) {
          req.response.end(reply);
        } else {
          cb("Error when getting channels!", null);
        }
      });
    }
  });
});
//*******************************************************

//*******************MOCKS****************************
eb.registerHandler('token.authentication', function(token, replier) {
  if (token == "12345") {
    replier(true);
  } else {
    replier(false);
  }
});

eb.registerHandler('get.channels', function(msg, replier) {
    replier(JSON.stringify({
    "ok": true,
    "channels": [
        {
            "id": "C024BE91L",
            "name": "fun",
            "created": 1360782804,
            "creator": "U024BE7LH",
            "is_archived": false,
            "is_member": false,
            "num_members": 6,
            "topic": {
                "value": "Fun times",
                "creator": "U024BE7LV",
                "last_set": 1369677212
            },
            "purpose": {
                "value": "This channel is for fun",
                "creator": "U024BE7LH",
                "last_set": 1360782804
            }
        },
        {
            "id": "C024BE91L",
            "name": "genereal",
            "created": 1360782804,
            "creator": "U024BE7LH",
            "is_archived": false,
            "is_member": false,
            "num_members": 6,
            "topic": {
                "value": "Fun times",
                "creator": "U024BE7LV",
                "last_set": 1369677212
            },
            "purpose": {
                "value": "This channel is for fun",
                "creator": "U024BE7LH",
                "last_set": 1360782804
            }
        }
      ]
  }));
});
//******************************************************

server.listen(8080, "localhost", function(err) {
  if (!err) {
    console.log("Listen succeeded!");
  } else { 
    console.log(err);
  }
});

