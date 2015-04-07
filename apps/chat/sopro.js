var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');

module.exports = function(app, PI){
  
  /*
   *  SOPRO LIBRARY SETUP
   */
  var sopro = {};

  /*
   *  EMAIL CONFIGURATION
   */

  sopro.mailer = nodemailer.createTransport(
    sesTransport(
      app.sopro.local.amazon.mailerSES
    )
  );

  /*
   *  SOPRO CRYPTO SETUP
   */
  sopro.crypto = {};
  sopro.crypto.createToken = function(callback){
    crypto.randomBytes(32, function(err, buffer){
      if(err){
        return callback(err);
      }
      var token = buffer.toString('hex');
      return callback(null, token);
    })
  }

  sopro.crypto.hash = function(toHash, algorithm){
    var sha256er = crypto.createHash(algorithm);
    sha256er.update(toHash,'utf8');
    return sha256er.digest('hex');
  };

  /*
   *  VALIDATION FUNCTIONS
   */
  sopro.validate = {};

  sopro.validate.username = function(username, callback){
    if(username === undefined || username === ""){
      return callback('No username')
    }
    if(typeof username !== "string"){
      return callback('Username must be a string')
    }
    callback(null);
  }

  sopro.validate.email = function(email, callback){
    if(email === undefined || email === ""){
      return callback('validation: no email');
    }
    if(!email.match(/^[^@]+@[^@]+\.[^@]+$/)){
      return callback('validation: bad email');
    }
    callback(null);
  }

  /*
   *  ROUTING FUNCTIONS
   */
  sopro.routes = {};
  sopro.routes.createUser = function(req, res, next){
    // Validate the posted data:
    async.waterfall([
      function(done){
        sopro.validate.username(req.query['username'], done)
      },
      function(done){
        sopro.validate.email(req.query['email'], done)
      },
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
        PI.find('user', 'username', opts.user.username, function(err, data){
          if(err){
            return done(err)
          }
          if(data.length > 0){
            return done('existing: username');
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
            return done('existing: email');
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
        sopro.crypto.createToken(function(err, token){
          if(err){
            return done(err);
          }
          opts.token = token;
          done(null, opts);
        });
      },
      function(opts, done){
        var now = new Date().valueOf();
        opts.tokenObj = {
          soproModel: 'passwordResetToken',
          for_userid: opts.user._id,
          token: opts.token,
          creationTimeMs: now,
          expiryTimeMs: now + app.sopro.features.pwdTokenExpiryMs,
        };
        PI.create('passwordResetToken', opts.tokenObj, function(err, result){
          if(err){
            return done(err);
          }
          opts.tokenObj = result;
          done(null, opts)
        })
    },
      function(opts, done){
        // var html = "https://localhost/confirmUser/"+opts.token.token
        // SES.sendEmail(opts.user.email, html, done)
        var msg = '<p>Welcome to Captains of Society!</p>'
        + '<a href="https://' + app.sopro.servers.express.hostname + '/confirmAccount/' + opts.tokenObj.token + '">'
        + 'Click this link to activate your new account, <strong>' + opts.user.username + '</strong></a>'
        var mailOptions = {
          from: 'ahoy@captains.io',
          to: opts.user.email,
          subject: 'Confirm your new Captains of Society Pro account',
          html: msg,
        }
        sopro.mailer.sendMail(mailOptions, done);
      }
    ], function(err){
      if(err){
        if(err instanceof Error){
          err = err.message
        }
        if(err.match(/^validation/i)){
          return res.status(400).json({ok: false, error: 'Validation error'})
        } else if(err.match(/^existing/i)){
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
        sopro.crypto.createToken(function(err, token){
          if(err){
            return done(err)
          };
          opts.salt = token;
          done(null, opts)
        })
      },
      function(opts, done){
        // Generate password hash:
        var toHash = opts.password1.concat(opts.salt);
        opts.hash = sopro.crypto.hash(toHash, 'sha256')
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