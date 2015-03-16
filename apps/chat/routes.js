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

routeMatcher.get('/login', function(req) {
  req.response.sendFile("web/login.html", "web/handler_404.html");
});

function ensureAuthed(req, callback){
  var meta = parseReq(req);
  var sessionCookie = req.headers['Cookie'];
  console.log(sessionCookie);
}

function parseReq(req){
  var out = {
    headers: {},
    qs: {},
  };
  req.headers().forEach(function(key, value) {
    out.headers[key] = value;
  });
  req.params().forEach(function(key, value) {
    out.qs[key] = value;
  });
  return out;
}


routeMatcher.post('/login/password', function(req){
  req.expectMultiPart(true);
  var meta = parseReq(req);

  req.bodyHandler(function(body) {
    var form = req.formAttributes();
    CAM.couchdb.checkAuth(form.get('username'), form.get('password'), function(err, valid, userid){
      if(err || !valid){
        req.response.end('{"ok":false, "error":"unauthorized"}')
      } else {
        //req.response.end('{"ok":true, "userid":' + userid + '}')
        var token = 'foobar';
        var header = 'sopro-auth-token=' + token;
        //header += '; expires=' +thenStr;
        header += '; httponly'

        req.response.headers().set("Set-Cookie", authString2)
        req.response.end(JSON.stringify({
          "ok":true, "userid":userid
        }))


        /*
        CAM.coudchdb.user_by_userid(userid, function(err, user){
          if(err){
            req.response.end('{"ok":false, "error":"server error"}')
          } else {
            // Create a session cookie:
            var now = new Date();
            var then = new Date(now.valueOf() + 1000*60*60);
            var thenStr = then.toUTCString();
            CAM.crypto.generateToken(function(err, token){

              CAM.couchdb.store({
                type: 'sessiontoken',
                expires: then,
                header: 
              }, function(){

              })
              CAM.sessions.create(user, function(token){
                req.response.headers().set("Authorization", authString2)

              })

            })
          }

        })
        */
      }
    })
  });
})

routeMatcher.get('/api/channels', function(req) {
  var meta = parseReq(req);

  if (meta.qs['role'] == undefined) {
    return req.response.end(
      '{"ok":false, "error":"role_not_found"}'
    );
  } else if(meta.headers['token-auth'] == undefined){
    return req.response.end(
      '{"ok":false, "error":"not_authed"}'
    );
  }
  var role = meta.qs['role'];
  var token = meta.headers['token-auth'];
  var params = {
    requester: role,
    token: token,
    payload: {
      role: role
    }
  }
  eb.send("get.channels",JSON.stringify(params), function (reply) {
    req.response.end(reply);
  });
});

routeMatcher.post('/api/channel', function(req) {
  var meta = parseReq(req);

  if (meta.qs['role'] == undefined) {
    return req.response.end(
      '{"ok":false, "error":"role_not_found"}'
    );
  } else if(meta.qs['name'] == undefined){
    return req.response.end(
      '{"ok":false, "error":"no_channel"}'
    );
  } else if(meta.headers['token-auth'] == undefined){
    return req.response.end(
      '{"ok":false, "error":"not_authed"}'
    );
  }
  var role = meta.qs['role'];
  var name = meta.qs['name'];
  var topic = meta.qs['topic'];
  var purpose = meta.qs['purpose'];
  var token = meta.headers['token-auth'];
  var params = {
    requester: role,
    token: token,
    payload: {
      role: role,
      name: name,
      topic: topic,
      purpose: purpose
    }
  }
  eb.send("channel.create",JSON.stringify(params), function (reply) {
    req.response.end(reply);
  });
});

routeMatcher.post('/api/channels.invite', function(req) {
  var meta = parseReq(req);

  if (meta.qs['role'] == undefined) {
    return req.response.end(
      '{"ok":false, "error":"role_not_found"}'
    );
  } else if(meta.qs['user'] == undefined){
    return req.response.end(
      '{"ok":false, "error":"user_not_found"}'
    );
  } else if(meta.qs['channel'] == undefined){
    return req.response.end(
      '{"ok":false, "error":"channel_not_found"}'
    );
  } else if(meta.headers['token-auth'] == undefined){
    return req.response.end(
      '{"ok":false, "error":"not_authed"}'
    );
  }
  var user = meta.qs['user'];
  var role = meta.qs['role'];
  var channel = meta.qs['channel'];
  var token = meta.headers['token-auth'];
  var params = {
    requester: role,
    token: token,
    payload: {
      user: user,
      channel: channel,
    }
  };
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
