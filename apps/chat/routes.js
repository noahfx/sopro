var fs = require('fs');
var async = require('async');

module.exports = function(app, eb, passport, acl, PI, sopro){

  var packageJSON = fs.readFileSync('./package.json', {encoding: 'utf8'});
  app.sopro.package = JSON.parse(packageJSON);

  /*
   * HTTPS ROUTING
   */

  function requireSecure(req, res, next){
    if(!req.secure){
      var port = +app.sopro.servers.express.sslPort || 443;
      if(port != 443){
        res.redirect('https://'+req.hostname+':'+port+req.originalUrl);
        //console.log('redirecting to https://'+req.host+':'+port+req.originalUrl);
      } else {
        res.redirect('https://'+req.hostname+req.originalUrl);
        //console.log('redirecting to https://'+req.host+req.originalUrl);
      };
    } else {
      next();
    };
  }

  app.all('*', requireSecure);
  app.all('*', function(req, res, next){
    if(req.user && req.session){
      req.session.userId = req.user.currentIdentity._id;
    }
    res.locals.features = app.sopro.features;
    res.locals.version = app.sopro.package.version;
    if(req.user){
      // Load permissions
      res.locals.currentUser = JSON.stringify(req.user);
      res.locals.permissions = res.locals.permissions || {};
      acl.isAllowed(req.user.currentIdentity._id, '/admin', 'get', function(err, ok){
        if(err){
          return next('Authentication failure: '+err);
        }
        if(!ok){
          res.locals.permissions.getAdmin = false;
        } else {
          res.locals.permissions.getAdmin = true;
        }
        next();
      })
    } else {
      next();
    }
  })

  /*
   * HTTP REQUEST AUTHENTICATION
   */

  // Verify that this request is for a logged in user:
  function requireLogin(req, res, next){
    if(!req.user){
      // Save the URL they wanted:
      req.session.bounceUrl = req.originalUrl;
      return res.redirect('/login');
    };
    next();
  }


  function ensureAuthed(req, res, next){
    var sessionCookie = req.header('Cookie');
    if(sessionCookie === undefined){
      res.status(401).send()
    }
  }

  /*
   *  REQUEST CONFIG MIDDLEWARES:
   */

   app.all('*', function(req, res, next){
     res.locals.config = app.sopro;
     next();
   })

  /*
   *  DEVELOPMENT ROUTES
   */

  app.get('/token', requireLogin, function(req, res, next){
    PI.find('apiToken', 'for_identityid', req.session.userId, function(err, results){
      if(err){
        console.log('Error finding an apiToken for', req.session.userId)
        return res.status(500).json({ok: false, error: 'server_error'});
      }
      if(results.length === 0){
        console.log('Did not find an apiToken for', req.session.userId)
        return res.status(500).json({ok: false, error: 'server_error'});
      }
      if(results.length > 1){
        console.log('Found more than one apiToken for', req.session.userId)
        return res.status(500).json({ok: false, error: 'server_error'});
      }
      var token = results[0];
      res.status(200).json({
        ok: true,
        apiToken: token,
      })
    })
  })
  // Danger, this route can change configs. Only use in development:
  if( app.get('env') === "development"){
    app.post('/api/dev/setconfig', function(req, res, next){
      var key = req.body.key;
      var value = req.body.value;
      if(value === 'true' || value==='false'){
        value = !!value;
      }
      var tmpObj = app.sopro;
      var tmpPath = "app.sopro"
      var path = key.split('.');
      // Drill down to the second to last segment:
      for(var i=0; i<(path.length-1); i++){
        var segment = path[i];
        if(tmpObj[segment] === undefined){
          return res.status(404).send(tmpPath+'.'+segment+' not found');
        }
        tmpObj = tmpObj[segment];
        tmpPath = tmpPath + '.' + segment;
      }
      // Set the value of the final property:
      var lastProperty = path[path.length-1];
      tmpObj[lastProperty] = value;
      res.send(200);
    })
  }

  /*
   *  ANGULAR ROUTING
   */

  app.get('/',
  requireLogin,
  function(req, res){
    res.render('index');
  })

  app.get('/admin',
  requireLogin,
  acl.middleware(),
  function(req, res, next){
    res.render('admin');
  });

  app.post('/login/password', passport.authenticate('local', {
    successRedirect: '/login/success',
    failureRedirect: '/login',
  }))

  app.get('/login', function(req, res, next) {
    if(req.user){
      return res.redirect('/');
    }
    res.locals.features = app.sopro.features;
    res.locals.currentUser = JSON.stringify(req.user)
    res.render('login');
  });

  app.get('/login/success/', function(req, res, next){
    var dest = '/';
    if(req.session.bounceUrl){
      dest = req.session.bounceUrl;
      delete req.session.bounceUrl;
    }
    res.redirect(dest);
  })

  app.get('/logout', function(req, res, next){
    if(req.user){
      req.logOut();
    }
    if(req.session.userId){
      req.session.userId = undefined;
    }
    res.redirect('/');
  })

  /*
   *  API ROUTING
   */

  app.get('/api/denyauth', acl.middleware());

  // First ping handler, skip if request has a token
  app.all('/api/ping', function(req, res, next){
    if(req.headers['token-auth']){
      return next()
    }
    res.status(200).json({
      ok: 'true',
      method: req.method,
      user: null,
      message: 'All API calls, except this one, must include a token-auth header set to your api token.',
    })
  });

  app.all('/api/*', function(req, res, next){
    var token = req.header('token-auth');
    if(token == undefined){
      var msg = 'You need a valid token-auth header. Find your token at https://'+ app.sopro.servers.hostname+'/token'
      res.status(401).json({ok:false, error:'not_authed', message: msg});
    } else {
      req.authToken = token;
      PI.find('apiToken', 'token', token, function(err, results){
        if(err){
          console.log(err);
          return res.status(500).json({ok: false, error: 'server_error'})
        } else if( results.length === 0){
          return res.status(401).json({ok: false, error: 'invalid_auth'})
        } else if( results.length > 1){
          console.log('Found more than one api token matching', token);
          return res.status(500).json({ok: false, error: 'server_error'})
        }
        var tokenObj = results[0];
        var identityId = tokenObj.for_identityid;
        PI.read(identityId, function(err, identity){
          if(err){
            console.log('Identity', identityId, 'not found while trying to login token', token);
            return res.status(500).json({ok: false, error: 'server_error'})
          }
          req.session.userId = identity._id;
          PI.read(identity.for_userid, function(err, user){
            if(err){
              console.log('User', identity.for_userid, 'not found while trying to login identity', identity._id);
              return res.status(500).json({ok: false, error: 'server_error'})
            }
            // We'll probably need the user available in subsequent routing functions.
            // I don't know if we would run into problems with req.logIn(user) here.
            // That makes Passport set session cookies.
            // Just in case that unwanted session would cause problems, avoid req.logIn:
            req.user = user;
            next();
          })
        })
      })
    }
  });

  // Second ping handler, if request had a token
  app.all('/api/ping', function(req, res, next){
    res.status(200).json({
      ok: 'true',
      method: req.method,
      user: req.user,
    })
  });

  app.get('/api/*', acl.middleware());
  app.post('/api/*', acl.middleware());
  app.put('/api/*', acl.middleware());
  app.delete('/api/*', acl.middleware());

  /*
   *  USERS API ROUTES
   */
  app.get('/api/users', function(req, res, next){
    PI.readAll('user', function(err, users){
      if(err){
        console.log(err)
        return res.status(500).json({
          ok: false,
          error: 'server error'
        })
      }
      res.status(200).json({
        ok: true,
        users: users,
      })
    })
  })

  app.post('/api/users', sopro.routes.createUser)

  app.put('/api/users', function(req, res, next){
    var updates = req.body;
    if(!updates._id){
      return res.status(400).json({ok: false, error: 'bad_request', message: 'PUT /api/users requires the JSON body to contain a _id property for the target user.'})
    }
    PI.read(updates._id, function(err, result){
      console.log(result);
      if(err){
        if(err.error === 'not_found'){
          return res.status(404).json({ok: false, error: 'not_found', message: 'User not found.'})
        } else {
          console.log(err);
          return res.status(500).json({ok: false, error: 'server_error'});
        }
      }
      if(result.soproModel !== 'user'){
        return res.status(404).json({ok: false, error: 'not_found', message: 'User not found.'})
      }
      // OK, we found a user matching that ID. Copy over all properties:
      for(prop in updates){
        if(!updates.hasOwnProperty(prop)){ continue; }
        result[prop] = updates[prop];
      }
      PI.update('user', result, function(err, result2){
        res.status(200).send({ok: true, user: result2});
      })
    })
  })

  app.get('/confirmAccount/:token', function(req, res, next){
    
    var token = req.params.token;
    PI.find('passwordResetToken', 'token', token, function(err, results){
      if(err){ 
        res.status(500).send(err) 
      }
      if(results.length === 1){  // found this token
        var userId = results[0].for_userid;
        PI.read(userId, function(err, user){
          if(err){ 
            res.status(500).send(err) 
          }
          res.locals.token = token;
          res.locals.currentUser = user;
          res.render('confirmAccount');
        })
      } else {
        res.status(404).json({"ok":false, "error":"token not found"});
      }
    })
  })
  app.post('/confirmAccount/done', sopro.routes.confirmUser)


  /*
   *  CHANNELS API ROUTES
   */

  app.get('/api/channels',
  function(req, res, next) {
    var params = {
      requester: req.session.userId,
      token: req.authToken
    }
    eb.send("get.channels",JSON.stringify(params), function (reply) {
      res.send(reply);
    });
  });

  app.post('/api/channel', function(req, res, next) {
    var name = req.query['name'];
    var topic = req.query['topic'];
    var purpose = req.query['purpose'];
    if(name == undefined){
      return res.status(400).json({
        ok: false,
        error: 'no_channel'
      });
    }

    PI.find('channel', 'name', name, function(err, results){
      if(results.length > 0){
        return res.status(400).json({
          ok: false,
          error: 'name_taken',
        });
      } else {
        var channel = {
          soproModel: 'channel',
          name: name,
          topic: topic,
          purpose: purpose,
          creator: req.session.userId
        };
        PI.create('channel', channel, function(err, result){
          if(err){
            console.log('create channel error:', err);
            return res.status(500).json({
              ok: false,
              error: 'server_error',
            });
          } else {
            return res.status(200).json({
              ok: true,
              channel: result,
            });
          }
        })
      }
    })
  });


  app.post('/api/channels.invite', function(req, res, next) {
    if(req.query['user'] == undefined){
      return res.send(
        '{"ok":false, "error":"user_not_found"}'
      );
    } else if(req.query['channel'] == undefined){
      return res.send(
        '{"ok":false, "error":"channel_not_found"}'
      );
    }
    var user = req.query['user'];
    var identity = req.session.userId;
    var channel = req.query['channel'];
    var params = {
      requester: identity,
      token: req.authToken,
      payload: {
        user: user,
        channel: channel,
      }
    };
    eb.send("user."+user+".invites.channels",JSON.stringify(params), function (reply) {
      res.send(reply);
    });
  });

  app.get('/api/channel.info', function(req, res, next) {

    if(req.query['channel'] == undefined){
      return res.status(404).json({"ok":false, "error":"channel_not_found"});
    }
    var params = {
        requester: req.session.userId,
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

  /*
   *  UNHANDLED ERROR ROUTING
   */

  // 4-ary function sig indicates an Express error handler:
  app.use(function(err, req, res, next){
    console.log('error for',req.originalUrl);
    console.log(err);
    if(err.errorCode == 403){
      res.status(403).send({ok:false,error:'invalid_auth'})
    } else {
      res.status(404).json({ok: false, error: 'Not found'})
    }
  })
}