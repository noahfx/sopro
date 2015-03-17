var fs = require('fs');

module.exports = function(app, eb){
  var indexHTML = fs.readFileSync('./web/index.html');
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


  app.use(function(err, req, res, next){
    console.log('error for',req.originalUrl);
    console.log(err);
    // 4-ary function sig indicates an Express error handler
    res.status(404).end()
  })
}