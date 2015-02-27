if(CAM === undefined){
  throw new Error('routes.js requires a global CAM object')
}

var server = CAM.server;
var vertx = CAM.vertx;
var routeMatcher = new vertx.RouteMatcher();

server.requestHandler(routeMatcher);

routeMatcher.getWithRegEx('\/(web)\/([^¡]+)', function(req) {
    req.response.sendFile(req.path().substring(1,req.path().length), "web/handler_404.html"); 
});

routeMatcher.get('/', function(req) {
  req.response.sendFile("web/index.html", "web/handler_404.html");
});

routeMatcher.get('/channels', function(req) {
  CAM.send.authenticate(req, function (err, data) {
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

routeMatcher.post('/channel', function(req) {
  CAM.send.authenticate(req, function (err, data) {
    if (err) {
      req.response.end(err);
    } else {
      var roleID = "";
      var name = "";
      var topic = "";
      var purpose = "";
      //___________________________________________________
      req.params().forEach(function(key, value) {
        if (key == "userID") {roleID = value;console.log(roleID);}
        else if (key == "name") name = value;
        else if (key == "topic") topic = value;
        else if (key == "purpose") purpose = value; 
      });
      if (!roleID) {
        req.response.end('{"ok":false, "error":"No role id specified!"}');
        return;
      }
      var params = {
        roleID: roleID,
        name: name,
        topic: topic,
        purpose: purpose 
      }
      eb.send("channel.create",JSON.stringify(params), function (reply) {
        req.response.end(reply);
      });
    }
  });
});
