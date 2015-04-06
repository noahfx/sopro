var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');

module.exports = function(app, PI){
  
  /*
   *  EMAIL CONFIGURATION
   */

  var mailer = nodemailer.createTransport(
    sesTransport(
      app.sopro.local.amazon.mailerSES
    )
  );

  /*
   *  SOPRO LIBRARY SETUP
   */
  var sopro = {};

  /*
   *  ROUTING FUNCTIONS
   */
  sopro.routes = {};
  sopro.routes.createUser = function(req, res, next){
    console.log(req.query);
    // Validate the posted data:
    async.waterfall([
      function(done){
        if(!req.query['email']){
          return done('validation: no email');
        }
        if(!req.query.email.match(/^[^@]+@[^@]+\.[^@]+$/)){
          return done('validation: bad email');
        }
        if(!req.query['username']){
          return done('validation: no username');
        }
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
        + '<a href="https://' + app.sopro.servers.express.hostname + '/confirmAccount/' + opts.token.token + '">'
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
  };

  sopro.routes.confirmUser = function(req, res, next){
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

  };

  return sopro;
}