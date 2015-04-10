var CAM_MOCKS = require('../../../mock-data.js');
var S_STEPS = require('../../shared_steps.js');
var SA_STEPS = require('../../sharedAPI_steps.js');
var acl = require('../../../../auth-matrix.js')();
var assert = require('assert');
var PI = require('../../../../persistence-interface.js')();
var PICouch = require('../../../../persistence-couchdb');
PI.use(PICouch);

module.exports = function(){
  /*
   * Scenario: GETting a list of users
   */
  this.Given(SA_STEPS.haveValidAuthToken.regex,
    SA_STEPS.haveValidAuthToken.fn);

  this.Given(/^the authentication token is for an identity with the authorization to create new users$/, 
    function (next){
      var userid = "abc";
      acl.isAllowed(userid, '/api/users', 'post', function(err, ok){
        if(err){
          return next.fail('Authentication failure: '+err);
        }
        if(ok){
          next();
        } else {
          next.fail('Authentication passed; expected failure: '+err+'\n'+ok);
        }
      });
    }
  );

  this.When(/^I make the correct https POST request with a username and email address$/, function(next){
    var self = this;
    self.dateSent = new Date().getTime();
    this.soproRequest('https://localhost/api/users',
      {
        method: "POST",
        qs: {
          username: CAM_MOCKS.postUserRequest.username,
          realname: CAM_MOCKS.postUserRequest.realname,
          email: CAM_MOCKS.postUserRequest.email,
        },
      },
       function(err, res, body){
      if(err){
        return next.fail(err)
      }
      self.response = JSON.parse(body);
      setTimeout(next,10000);
    })
  });

  this.Then(/^a new user should be created$/, function(next){
    assert(this.response.ok);
    next();
  });

  this.Then(/^an email should be sent to that email address with a one time activation link$/, function(next){
    var self = this;

    var correctFrom = false;
    var correctSubject = false;
    var correctDate = false;

    var Imap = require('imap'),
    inspect = require('util').inspect;

    var imap = new Imap({
      user: CAM_MOCKS.postUserRequest.email,
      password: CAM_MOCKS.postUserRequest.emailPassword,
      host: 'imap.gmail.com',
      port: 993,
      tls: true
    });

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function() {
      openInbox(function(err, box) {
        if (err) throw err;
        var f = imap.seq.fetch(box.messages.total + ':*', {
          bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
          struct: true
        });
        f.on('message', function(msg, seqno) {
          var prefix = '(#' + seqno + ') ';
          msg.on('body', function(stream, info) {
            var buffer = '';
            stream.on('data', function(chunk) {
              buffer += chunk.toString('utf8');
            });
            stream.once('end', function() {
              var header = Imap.parseHeader(buffer);
              var from = header.from[0]; 
              var subject = header.subject[0];
              correctFrom = from == "ahoy@captains.io";
              correctSubject = subject == "Confirm your new Captains of Society Pro account";
            });
          });
          msg.once('attributes', function(attrs) {
            var dateReceived = new Date(attrs.date).getTime();
            correctDate = (dateReceived - self.dateSent) <= (1000*60); 
          });
          msg.once('end', function() {
          });
        });
        f.once('error', function(err) {
          console.log('Fetch error: ' + err);
          next.fail(new Error(err));
        });
        f.once('end', function() {
          imap.end();
          if (!correctFrom) {
            return next.fail(new Error("From incorrect email"));
          }
          if (!correctSubject) {
            return next.fail(new Error("incorrect subject"));
          }
          if (!correctDate) {
            return next.fail(new Error("More than a minute elapse"));
          }
        });
      });
    });

    imap.once('error', function(err) {
      console.log(err);
      next.fail(new Error(err));
    });

    imap.once('end', function() {
      PI.destroy(self.response.user,function(err,user){
        if(err) {
          return next.fail(new Error(err));
        }
        next();
      });
    });

    imap.connect();
  });
}