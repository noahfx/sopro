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


function parseReq(req){
  console.log('Parsing: '+ req.uri());
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
    from_role: role,
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
    from_role: role,
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
    from_role: role,
    token: token,
    payload: {
      user: role,
      channel: channel,
    }
  }
  eb.send("user."+user+".invites.channels",JSON.stringify(params), function (reply) {
    req.response.end(reply);
  });
});

routeMatcher.get('/api/channel.info', function(req) {
  var meta = parseReq(req);

  if (meta.qs['role'] == undefined) {
    return req.response.end(
      '{"ok":false, "error":"role_not_found"}'
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
  var params = {
      from_role: meta.qs['role'],
      token: meta.headers['token-auth'],
      payload: {
        channel: meta.qs['channel'],
      }
    };
  eb.send("channel.info",JSON.stringify(params),
    function(reply) {
      req.response.end(reply);
    }
  );
});
