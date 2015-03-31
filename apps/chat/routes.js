var fs = require('fs');
var crypto = require('crypto');
var async = require('async');
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');

module.exports = function(app, eb, passport, acl, PI){
  
  /*
   *  EMAIL CONFIGURATION
   */

  var mailer = nodemailer.createTransport(
    sesTransport(
      app.sopro.local.amazon.mailerSES
    )
  );

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

  function compareAuthedUserAndRole(req, res, next){
    if (req.user){
      if(req.user.userid === req.query['role']){
        // The logged in user requested his own role
        return next()
      }
      res.status(401).json({ok: false, error: "That is not your role"})
    } else {
      res.status(401).json({ok: false, error: "unauthorized"})
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
    successRedirect: '/',
    failureRedirect: '/login'
  }))

  app.get('/login', function(req, res, next) {
    res.locals.features = app.sopro.features;
    res.locals.currentUser = JSON.stringify(req.user)
    res.render('login');
  });

  app.get('/logout', function(req, res, next){
    req.logOut();
    req.session.userId = undefined;
    res.redirect('/');
  })

  /*
   *  API ROUTING
   */

  app.get('/api/denyauth', acl.middleware());

  app.all('/api/*', function(req, res, next){
    var token = req.header('token-auth')
    if(token == undefined){
      res.status(401).send('{"ok":false, "error":"not_authed"}');
    } else {
      req.authToken = token;
      PI.read('user-abc', function(err, user){
        if(err){
          console.log(err);
          return res.status(500).json({
            ok: false,
            error: "server error",
          })
        }
        var identityId = req.query['role'] || 'abc';
        req.session.userId = identityId;
        if(!req.user){ // Don't override an existing user session
          req.logIn(user, function(){
            next();
          });
        } else {
          next();
        }
      })
    }
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


  app.post('/api/users', function(req, res, next){
    // Validate the posted data:
    async.waterfall([
      function(done){
        var opts = {
          user: {
            soproModel: 'user',
            username: req.query['username'],
            email: req.query['email'],
            realname: req.query['realname'],
            pendingInitialPassword: true,
          }
        }
        done(null, opts);
      },
      function(opts, done){
        if(!opts.user.email.match(/^[^@]+@[^@]+\.[^@]+$/)){
          done('validation');
        }
        if(!opts.user.username){
          done('validation');
        }
        done(null, opts);
      },
      function(opts, done){
        PI.find('user', 'username', opts.user.username, function(err, data){
          if(err){
            return done(err)
          }
          if(data.length > 0){
            return done('existing');
          }
          done(null, opts);
        })
      },
      function(opts, done){
        PI.find('user', 'email', opts.user.email, function(err, data){
          if(err){
            return done(err)
          }
          if(data.length > 0){
            return done('existing');
          }
          done(null, opts);
        })
      },
      function(opts, done){
        PI.create('user', opts.user, function(err, result){
          if(err){
            return done(err);
          }
          opts.user = result;
          done(null, opts);
        })
      },
      function(opts, done){
        var identity = {
          soproModel: 'identity',
          rolename: 'Default',
          for_userid: opts.user._id,
        }
        PI.create('identity', identity, function(err, result){
          if(err){
            return done(err);
          }
          opts.user.identities = [result._id];
          opts.identity = result;
          done(null, opts);
        })
      },
      function(opts, done){
        crypto.randomBytes(32, function(err, buffer){
          var now = new Date().valueOf();
          opts.token = {
            soproModel: 'passwordResetToken',
            for_userid: opts.user._id,
            token: buffer.toString('hex'),
            creationTimeMs: now,
            expiryTimeMs: now + app.sopro.features.pwdTokenExpiryMs,
          };
          PI.create('passwordResetToken', opts.token, function(err, result){
            if(err){
              return done(err);
            }
            opts.token = result;
            done(null, opts)
          })
        })
      },
      function(opts, done){
        // var html = "https://localhost/confirmUser/"+opts.token.token
        // SES.sendEmail(opts.user.email, html, done)
        var msg = '<p>Welcome to Captains of Society!</p>'
        + '<a href="https://' + app.sopro.servers.express.host + '/confirmAccount/' + opts.token.token + '">'
        + 'Click this link to activate your new account, <strong>' + opts.user.username + '</strong></a>'
        var mailOptions = {
          from: 'ahoy@captains.io',
          to: opts.user.email,
          subject: 'Confirm your new Captains of Society Pro account',
          html: msg,
        }
        mailer.sendMail(mailOptions, done);
      }
    ], function(err){
      if(err){
        if(err == 'validation'){
          return res.status(400).json({ok: false, error: 'Validation error'})
        } else if (err == 'existing'){
          return res.status(400).json({ok: false, error: 'Username or email exists'})
        } else {
          console.log(err);
          return res.status(500).json({ok: false, error: err})
        }
      }
      res.status(200).json({ok: true})
    })

  })

  app.get('/confirmAccount/:token', function(req, res, next){
    var token = req.params.token;
    PI.find('passwordResetToken', 'token', token, function(err, results){
      if(err){ res.status(500).send(err) }
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
      }
    })
  })
  app.post('/confirmAccount/done', function(req, res, next){
    async.waterfall([
      function(done){
        var opts = {
          tokenString: req.body.token,
          password1: req.body.password1,
          password2: req.body.password2,
        };
        if(opts.password1 !== opts.password2){
          return res.status(400).send('The passwords did not match.');
        }
        done(null, opts);
      },
      function(opts, done){
        PI.find('passwordResetToken', 'token', opts.tokenString, function(err, results){
          if(err){
            return done(err);
          }
          if(results.length === 1){  // found this token
            var userId = results[0].for_userid;
            opts.tokenObj = results[0];
            done(null, opts)
          } else {
            done('Found non-1 number of matching tokens');
          }
        })
      },
      function(opts, done){
        PI.read(opts.tokenObj.for_userid, function(err, user){
          if(err){
            done(err);
          }
          opts.user = user;
          done(null, opts);
        })
      },
      function(opts, done){
        // Generate password salt:
        crypto.randomBytes(32, function(err, buffer){
          if(err){
            return done(err)
          };
          opts.salt = buffer.toString('hex');
          done(null, opts)
        })
      },
      function(opts, done){
        // Generate password hash:
        var toHash = opts.password1.concat(opts.salt);
        var sha256er = crypto.createHash('sha256');
        sha256er.update(toHash,'utf8');
        opts.hash = sha256er.digest('hex');
        done(null, opts);
      },
      function(opts, done){
        // Save credentials object
        var creds = {
          soproModel: 'pwdcred',
          for_userid: opts.user._id,
          salt: opts.salt,
          hash: opts.hash,
        }
        PI.create('pwdcred', creds, function(err, result){
          if(err){ return done(err) };
          opts.pwdcred = result;
          done(null, opts);
        })
      },
      function(opts, done){
        // Remove the used one-time-use token:
        PI.destroy(opts.tokenObj, function(err){
          if(err){ return done(err) };
          done(null, opts)
        })
      },
      function(opts, done){
        // Remove the pendingInitialPassword flag:
        delete opts.user.pendingInitialPassword;
        PI.update('user', opts.user, function(err, result){
          if(err){ return done(err) };
          opts.user._id = result.id;
          opts.user._rev = result.rev;
          done(null, opts);
        })
      },
      function(opts, done){
        req.logIn(opts.user, function(err){
          if(err){ return done(err) };
          res.locals.currentUser = opts.user;
          done(null, opts);
        });
      }
    ], function(err, result){
      if(err){ return res.status(500).send(err) }
      res.redirect('/');
    })

  })


  /*
   *  CHANNELS API ROUTES
   */

  app.get('/api/channels',
  function(req, res, next) {
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

  app.post('/api/channel',
    function(req, res, next) {
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

  /*
   *  UNHANDLED ERROR ROUTING
   */

  // 4-ary function sig indicates an Express error handler:
  app.use(function(err, req, res, next){
    console.log('error for',req.originalUrl);
    console.log(err);
    if(err.errorCode == 403){
      res.status(403).send('You do not have permission to do that.')
    } else {
      res.status(404).end()
    }
  })
}