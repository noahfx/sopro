var fs = require('fs');

module.exports = function(app, eb){
  var indexHTML = fs.readFileSync('./web/index.html');
  var loginHTML = fs.readFileSync('./web/login.html');
  //var err404HTML = fs.readFileSync('./web/handler_404.html');
  //var err404HTML = fs.readFileSync('./web/handler_404.html');
  app.get('/', function(req, res){
    res.set('Content-Type', 'text/html');
    res.status(200).end(indexHTML)
  })


  app.all('/api/*', function(req, res, next){
    var token = req.header('token-auth')
    if(token == undefined){
      res.status(401).send('{"ok":false, "error":"not_authed"}');
    } else {
      req.authToken = token;
      next();
    }
  })


function ensureAuthed(req, res, next){
  var sessionCookie = req.header('Cookie');
  if(sessionCookie === undefined){
    res.status(401).send()
  }
}

  app.get('/api/channels', function(req, res, next) {
    var role = req.query['role'];
    if (role == undefined) {
      return res.end(
        '{"ok":false, "error":"role_not_found"}'
      );
    }

    var params = {
      requester: role,
      token: req.authToken,
      payload: {
        role: role
      }
    }
    eb.send("get.channels",JSON.stringify(params), function (reply) {
      res.send(reply);
    });
  });

  app.post('/api/channel', function(req, res, next) {
    var role = req.query['role'];
    var name = req.query['name'];
    var topic = req.query['topic'];
    var purpose = req.query['purpose'];
    if (role == undefined) {
      return res.send(
        '{"ok":false, "error":"role_not_found"}'
      );
    } else if(name == undefined){
      return res.send(
        '{"ok":false, "error":"no_channel"}'
      );
    }

    var params = {
      requester: role,
      token: req.authToken,
      payload: {
        role: role,
        name: name,
        topic: topic,
        purpose: purpose
      }
    }
    eb.send("channel.create",JSON.stringify(params), function (reply) {
      res.send(reply);
    });
  });


  app.post('/api/channels.invite', function(req, res, next) {

    if (req.query['role'] == undefined) {
      return res.send(
        '{"ok":false, "error":"role_not_found"}'
      );
    } else if(req.query['user'] == undefined){
      return res.send(
        '{"ok":false, "error":"user_not_found"}'
      );
    } else if(req.query['channel'] == undefined){
      return res.send(
        '{"ok":false, "error":"channel_not_found"}'
      );
    }
    var user = req.query['user'];
    var role = req.query['role'];
    var channel = req.query['channel'];
    var params = {
      requester: role,
      token: req.authToken,
      payload: {
        user: user,
        channel: channel,
      }
    }
    eb.send("user."+user+".invites.channels",JSON.stringify(params), function (reply) {
      res.send(reply);
    });
  });

  app.get('/api/channel.info', function(req, res, next) {

    if (req.query['role'] == undefined) {
      return res.send(
        '{"ok":false, "error":"role_not_found"}'
      );
    } else if(req.query['channel'] == undefined){
      return res.send(
        '{"ok":false, "error":"channel_not_found"}'
      );
    }
    var params = {
        requester: req.query['role'],
        token: req.authToken,
        payload: {
          channel: req.query['channel'],
        }
      };
    eb.send("channel.info",JSON.stringify(params),
      function(reply) {
        res.send(reply);
      }
    );
  });



  // 4-ary function sig indicates an Express error handler:
  app.use(function(err, req, res, next){
    console.log('error for',req.originalUrl);
    console.log(err);
    res.status(404).end()
  })
}

app.get('/login', function(req, res, next) {
    res.set('Content-Type', 'text/html');
    res.status(200).end(loginHTML)
});

/*
app.post('/login/password', function(req, res, next){
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
      }
    })
})
*/
