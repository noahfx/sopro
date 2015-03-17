var fs = require('fs');

module.exports = function(app, eb){
  var indexHTML = fs.readFileSync('./web/index.html');
  //var err404HTML = fs.readFileSync('./web/handler_404.html');
  app.get('/', function(req, res){
    res.set('Content-Type', 'text/html');
    res.status(200).end(indexHTML)
  })


  app.get('/api/channels', function(req, res, next) {
    console.log('ping');
    var role = req.query['role'];
    var token = req.header('token-auth');
    if (role == undefined) {
      return res.end(
        '{"ok":false, "error":"role_not_found"}'
      );
    } else if(token == undefined){
      return res.end(
        '{"ok":false, "error":"not_authed"}'
      );
    }

    var params = {
      requester: role,
      token: token,
      payload: {
        role: role
      }
    }
    eb.send("get.channels",JSON.stringify(params), function (reply) {
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