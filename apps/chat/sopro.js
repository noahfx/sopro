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

  // If you are not using Amazon SES, you can edit this to use any SMTP server and credentials.
  // See: https://github.com/andris9/Nodemailer/#use-the-default-smtp-transport

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
    if(typeof toHash === 'string'){
      toHash = new Buffer(toHash, 'utf8');
    }
    try {
      toHash instanceof Buffer
    } catch(e){
      throw new Error('toHash should be string or buffer')
    }
    var sha256er = crypto.createHash(algorithm);
    sha256er.update(toHash,'utf8');
    var result = sha256er.digest('hex');
    return result
  };

  sopro.crypto.createAndSavePasswordResetToken =  function(opts, done){
    var now = new Date().valueOf();
    opts.tokenObj = {
      soproModel: 'passwordResetToken',
      for_userid: opts.user._id,
      token: opts.passwordResetToken,
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
  };

  /*
   *  VALIDATION FUNCTIONS
   */
  sopro.validate = {};

  sopro.validate.username = function(username, callback){
    if(username === undefined || username === ""){
      return callback(false, 'validation: Missing username')
    }
    if(typeof username !== "string"){
      return callback(false, 'validation: Username must be a string')
    }
    if(username.match(/^\s*$/)){
      return callback(false, 'validation: Whitespace-only username')
    }
    callback(true, null);
  }

  sopro.validate.email = function(email, callback){
    if(email === undefined || email === ""){
      return callback(false, 'validation: No email');
    }
    if(!email.match(/^[^@]+@[^@]+\.[^@]+$/)){
      return callback(false, 'validation: Bad email');
    }
    callback(true, null);
  }

  /*
   *  API HELPER FUNCTIONS
   */

  sopro.channelsForIdentity = function(identityId, callback){
    PI.read(identityId, function(err, identity){
      if(err){
        return callback(err);
      }

      PI.readAll('channel', function(err, channels){
        if(err){
          return callback(err);
        }
        var results = channels.map(function(channel){
          channel.is_member =
            identity.channels.indexOf(channel._id) === -1
            ? false
            : true;
          return channel;
        })
        callback(err, results)
      })

    })
  };


  /*
   *  ROUTING FUNCTIONS
   */
  sopro.routes = {};
  sopro.routes.createUser = function(req, res, next){
    // Validate username:
    async.waterfall([
      function(done){
        sopro.validate.username(req.query['username'], function(valid, reason){
          if(!valid){
            return done(reason)
          }
          done(null)
        })
      },
      // Validate email:
      function(done){
        sopro.validate.email(req.query['email'], function(valid, reason){
          if(!valid){
            return done(reason)
          }
          done(null)
        })
      },
      // Construct an options object:
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
      // Look for an existing user matching that username:
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
      // Look for an existing user matching that email:
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
      // Create the new user object:
      function(opts, done){
        PI.create('user', opts.user, function(err, result){
          if(err){
            return done(err);
          }
          opts.user = result;
          done(null, opts);
        })
      },
      // Create a new identity object for that user:
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
      // Create a new apiToken object for that user's single identity:
      function(opts, done){
        sopro.crypto.createToken(function(err, token){
          if(err){
            return done(err)
          }
          var apiToken = {
            soproModel: 'apiToken',
            for_identityid: opts.identity._id,
            token: token,
          }
          PI.create('apiToken', apiToken, function(err, result){
            if(err){
              return done(err);
            }
            opts.apiToken = result;
            done(null, opts);
          })
        })
      },
      // Generate a one-time token, for the user to set a password:
      function(opts, done){
        sopro.crypto.createToken(function(err, token){
          if(err){
            return done(err);
          }
          opts.passwordResetToken = token;
          done(null, opts);
        });
      },
      // Save the passwordResetToken into the database:
      sopro.crypto.createAndSavePasswordResetToken,
      // Send a confirmation mail:
      function(opts, done){
        var msg = '<p>Welcome to Captains of Society!</p>'
        + '<a href="https://' + app.sopro.servers.express.hostname + '/confirmAccount/' + opts.tokenObj.token + '">'
        + 'Click this link to activate your new account, <strong>' + opts.user.username + '</strong></a>'
        var mailOptions = {
          from: 'ahoy@captains.io',
          to: opts.user.email,
          subject: 'Confirm your new Captains of Society Pro account',
          html: msg,
        }
        sopro.mailer.sendMail(mailOptions, function(err){
          return done(err, opts);
        });
      }
    ], function(err, opts){
      if(err){
        if(err instanceof Error){
          err = err.message;
        }
        console.log('Create user error:', err)
        if(err.match(/^validation/i)){
          return res.status(400).json({ok: false, error: err})
        } else if(err.match(/^existing/i)){
          return res.status(400).json({ok: false, error: 'Username or email exists'})
        } else {
          console.log(err);
          return res.status(500).json({ok: false, error: err})
        }
      }
      res.status(200).json({ok: true, user: opts.user})
    })
  };

  sopro.routes.confirmUser = function(req, res, next){
    async.waterfall([
      // Sanity checks for the passwords:
      function(done){
        if(req.body['password1'] === ""
         ||req.body['password1'] === undefined
         ||req.body['password2'] === ""
         ||req.body['password2'] === undefined
         ||req.body['password1'] !== req.body['password2']
        ){
          return done('The passwords did not match.');
        }
        var opts = {
          tokenString: req.body.token,
          password1: req.body.password1,
          password2: req.body.password2,
        };
        done(null, opts);
      },
      // Look for the claimed token id in the database:
      function(opts, done){
        PI.find('passwordResetToken', 'token', opts.tokenString, function(err, results){
          if(err){
            return done(err);
          }
          if(results.length === 1){  // found this token
            var userId = results[0].for_userid;
            opts.tokenObj = results[0];
            done(null, opts)
          } else if(results.length === 0){
            done('token not found');
          } else {
            done('too many passwordResetTokens found');
          }
        })
      },
      // Look for any existing password credentials matching this token's userid:
      function(opts, done){
        PI.find('pwdcred', 'for_userid', opts.tokenObj.for_userid, function(err, results){
          if(err){
            return done(err);
          }
          if(results.length === 1){  // One existing password credentials
            opts.oldPwdcred = results[0];
            done(null, opts)
          } else if(results.length === 0){
            done(null, opts);
          } else {
            done('too many pwdcreds found');
          }
        })
      },
      // Load the user matching this id:
      function(opts, done){
        PI.read(opts.tokenObj.for_userid, function(err, user){
          if(err){
            done(err);
          }
          opts.user = user;
          done(null, opts);
        })
      },
      // Generate a password salt:
      function(opts, done){
        sopro.crypto.createToken(function(err, token){
          if(err){
            return done(err)
          };
          opts.salt = token;
          done(null, opts)
        })
      },
      // Calculate the hash of password+salt:
      function(opts, done){
        var toHash = opts.password1.concat(opts.salt);
        opts.hash = sopro.crypto.hash(toHash, 'sha256')
        done(null, opts);
      },
      // Save the new credentials object:
      function(opts, done){
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
      // Remove the used one-time-use token:
      function(opts, done){
        PI.destroy(opts.tokenObj, function(err){
          done(err, opts)
        })
      },
      // Remove the old password credentials, if any:
      function(opts, done){
        if(opts.oldPwdcred){
          PI.destroy(opts.oldPwdcred, function(err){
            done(err, opts);
          });
        } else {
          done(null, opts);
        }
      },
      // Remove the pendingInitialPassword flag on the user:
      function(opts, done){
        delete opts.user.pendingInitialPassword;
        PI.update('user', opts.user, function(err, result){
          if(err){ return done(err) };
          opts.user._id = result.id;
          opts.user._rev = result.rev;
          done(null, opts);
        })
      },
      // Log in the user to Passport and additionally set a session variable for acl:
      function(opts, done){
        req.session.userId = opts.user._id;
        req.logIn(opts.user, function(err){
          if(err){ return done(err) };
          res.locals.currentUser = opts.user;
          done(null, opts);
        });
      }
    ], function(err, result){
      if(err){
        return res.status(500).json({ok:false, error: err})
      }
      res.redirect('/');
    })

  };

  return sopro;
}