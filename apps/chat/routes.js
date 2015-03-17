var fs = require('fs');

module.exports = function(app, eventbus){
  var indexHTML = fs.readFileSync('./web/index.html');
  //var err404HTML = fs.readFileSync('./web/handler_404.html');
  app.get('/', function(req, res){
    res.set('Content-Type', 'text/html');
    res.status(200).send(indexHTML)
  })

  app.use(function(req, res, next, err){
    // 4-ary function sig indicates an Express error handler
    res.status(404).send()
  })
}