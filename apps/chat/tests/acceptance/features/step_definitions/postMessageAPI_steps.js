var CAM_MOCKS = require('../../../common/mock-data.js');
var S_STEPS = require('../../shared_steps.js');
var SA_STEPS = require('../../sharedAPI_steps.js');
var acl = require('../../../../auth-matrix.js')();
var assert = require('assert');
var PI = require('../../../../persistence-interface.js')();
var PICouch = require('../../../../persistence-couchdb');
PI.use(PICouch);

module.exports = function(){
  /*
   *
      Scenario: send message via API POST
      Given I have an authentication token for an identity with the authorization to create new messages
      When I make the correct POST request to /api/postMessage with a message and a channel name
      Then the message should be persisted
   */

  this.Given(SA_STEPS.haveValidAuthToken.regex,
    SA_STEPS.haveValidAuthToken.fn);

  this.Given(/^I have an authentication token for an identity with the authorization to create new messages$/,
    function (next){
      var self = this;
      self.postMsgIdentityId = "abc";
      self.postMsgToken = "12345";
      acl.isAllowed(self.postMsgIdentityId, '/api/postMessage', 'post', function(err, ok){
        if(err){
          return next.fail('Authentication failure: '+err);
        }
        if(ok){
          next();
        } else {
          next.fail('Authentication failed: '+err+'\n'+ok);
        }
      });
    }
  );

  this.When(/^I make the correct POST request to \/api\/postMessage with a message and a channel name$/, function(next){
    var self = this;
    this.dateSent = new Date().getTime();
    this.msgChannel = 'channel-random';
    this.msgString = 'Hello from postMessageAPI_steps.js!';
    this.soproRequest({
      uri: '/api/postMessage',
      method: "POST",
      json: true,
      headers: {
        "token-auth": self.postMsgToken,
      },
      body: {
        channel: self.msgChannel,
        text: self.msgString
      },
    },
    function(err, res, body){
      if(err){
        return next.fail(err)
      }
      self.response = body;
      setTimeout(next,10000);
    })
  });

  this.Then(/^the message should be persisted$/, function(next){
    var self = this;
    console.log(this.response);
    assert(this.response.ok);
    PI.read(this.response.message._id, function(err, msg){
      assert(!err, 'error reading newly created message id')
      assert(msg.text === self.msgString);
      next();
    })
  });

}