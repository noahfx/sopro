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
        cb('{"ok":false, "error":"Invalid Token!"}', null);
      }
    });
  } else {
    cb('{"ok":false, "error":"No token auth!"}', null);
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
      var userID = "";
      //___________________________________________________
      req.params().forEach(function(key, value) {
        if (key == "userID") {
          userID = value;
        }  
      });
      if (!userID) {
        req.response.end('{"ok":false, "error":"No role id specified!"}');
        return;
      }
      eb.send("get.channels",userID, function (reply) {
        if (reply) {
          req.response.end(reply);
        } else {
          req.response.end('{"ok":false, "error":"Error when getting channels!"}');
        }
      });
    }
  });
});
//*******************************************************

//******************Start up the server*********************
server.listen(8080, "localhost", function(err) {
  if (!err) {
    console.log("Listen succeeded!");
  } else { 
    console.log(err);
  }
});
//********************************************************





//##################################
//*******************MOCKS****************************
eb.registerHandler('token.authentication', function(token, replier) {
  if (token == "12345") {
    replier(true);
  } else {
    replier(false);
  }
});

eb.registerHandler('get.channels', function(msg, replier) {
    var channels = {};
    if (msg == "abc") {
      channels = {
        "ok": true,
        "channels": [
            {
                "id": "C024BE91L",
                "name": "random",
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
                "name": "general",
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
      };
    } else if (msg == "xyz") {
      channels = {
        "ok": true,
        "channels": [
            {
                "id": "C024BE91L",
                "name": "developers",
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
                "name": "huevon",
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
                "name": "general",
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
      };
    }
    replier(JSON.stringify(channels));
});
//******************************************************

