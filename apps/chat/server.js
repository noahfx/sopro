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

routeMatcher.getWithRegEx('\/(web)\/([^¡]+)', function(req) {  
    req.response.sendFile(req.path().substring(1,req.path().length), "web/handler_404.html"); 
});

routeMatcher.get('/', function(req) {
  req.response.sendFile("web/index.html", "web/handler_404.html"); 
});

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
/*routeMatcher.noMatch(function(req) {
  req.response.sendFile("web/handler_404.html"); 
});*/
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
                "name": "random"
            },
            {
                "id": "C024BE91L",
                "name": "general"
            }
          ]
      };
    } else if (msg == "xyz") {
      channels = {
        "ok": true,
        "channels": [
            {
                "id": "C024BE91L",
                "name": "developers"
            },
            {
                "id": "C024BE91L",
                "name": "huevon"
            },
            {
                "id": "C024BE91L",
                "name": "general"
            }
          ]
      };
    }
    replier(JSON.stringify(channels));
});
//******************************************************

