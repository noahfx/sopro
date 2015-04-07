// This suite of unit tests is for the functionality exposed in the `sopro` object from sopro.js

var async = require('async');

// Construct mock app object:
var app = {
  sopro: {
    local: require('../../../../cfg/locals.js'),
    servers: require('../../../../cfg/servers.js'),
    // Hardcode standard features for now:
    features: require('../../../../cfg/features.standard.js'),
  }
}

// Load mocks:
var CAM_MOCKS = require('../../../mock-data.js');

// Load real persistence interface:
var PI = require('../../../../persistence-interface')();
var PICouch = require('../../../../persistence-couchdb');

PI.use(PICouch);

var sopro;
var token;

describe('sopro.js', function(){
  beforeAll(function(){
    function tryRequire(){
      sopro = require('../../../../sopro.js')(app, PI);
      expect(typeof sopro).toBe('object');
      expect(sopro.crypto).toBeDefined();
    }
    expect(tryRequire).not.toThrow();
  })

  afterAll(function(done){
    var userid;
    async.series([
      function(done2){
        PI.find('user', 'username', 'testUser', function(err, users){
          expect(err).toBeFalsy();
          expect(users.length).toBe(1);
          userid = users[0]._id;
          PI.destroy(users[0], function(err){
            if(err){  console.log(err)  }
            expect(err).toBeFalsy();
            done2();
          })
        })
      },
      function(done2){
        PI.find('passwordResetToken', 'token', token, function(err, tokens){
          expect(err).toBeFalsy();
          expect(tokens.length).toBe(1);
          PI.destroy(tokens[0], function(err){
            if(err){  console.log(err)  }
            expect(err).toBeFalsy();
            done2();
          })
        })
      },
      function(done2){
        PI.find('identities', 'for_userid', userid, function(err, identities){
          expect(err).toBeFalsy();
          expect(identities.length).toBe(1);
          PI.destroy(identities[0], function(err){
            if(err){  console.log(err)  }
            expect(err).toBeFalsy();
            done2();
          })
        })
      },
    ], function(err){
      expect(err).toBeFalsy();
      done()
    })
  })

  describe('sopro', function(){
    describe('.crypto', function(){
      describe('.createToken', function(){
        it('is a function', function(){
          expect(typeof sopro.crypto.createToken).toBe('function');
        })
      })
      describe('.hash', function(){
        it('is a function', function(){
          expect(typeof sopro.crypto.hash).toBe('function');
        })
      })
    })
    describe('.validate', function(){
      describe('.username', function(){
        it('is a function', function(){
          expect(typeof sopro.validate.username).toBe('function');
        })

      })
      describe('.email', function(){
        it('is a function', function(){
          expect(typeof sopro.validate.email).toBe('function');
        })
      })
    })
    describe('.routes', function(){
      describe('.createUser', function(){
        beforeAll(function(done){
          var req = {
            query: {
              username: "testUser",
              realname: "Test User",
              email: CAM_MOCKS.postUserRequest.email,
            }
          };
          var res = {
            status: function(){
              return {
                json: function(obj){
                  expect(obj.ok).toBeTruthy();
                  if(!obj.ok){console.log(obj)  }
                  done();
                }
              }
            }
          }
          spyOn(sopro.mailer, 'sendMail').and.callFake(function(opts, callback) {
            token = opts.html.match(/confirmAccount\/([0-9a-f]+)/)[1];
            return callback(null);
          });

          // The done() callback to continue from this before block will be invoked when res.status().json() is called
          sopro.routes.createUser(req, res);
        })

        it('creates a user', function(done){
          PI.find('user', 'username', 'testUser', function(err, users){
            expect(err).toBeFalsy();
            expect(users.length).toBe(1);
            done();
          })
        })

        it('sends a mail', function(){
          expect(sopro.mailer.sendMail).toHaveBeenCalled()
        })

        it('creates a passwordResetToken', function(){
          // The token was set by the spy
          expect(token).toBeTruthy();
        })

      })
    })
  })
})
