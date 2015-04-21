var assert = require('assert');

module.exports = function(){
  /*
  Scenario: messages via API GET
    Given I have a valid authentication token for GET /api/channels.history
      And my identity is a member of a given channel
    When I make the correct GET request to the API with that channel name and the auth token
    Then the response should contain a list of chat messages from that channel
      And the response should contain a metadata object for that channel
  */
  this.Given(/^I have a valid authentication token for GET \/api\/channels.history$/, function(next){
    this.authToken = '12345';
    next();
  });

  this.Given(/^my identity is a member of a given channel$/, function(next){
    this.channel = 'channel-random';
      next();
  });

  this.When(/^I make the correct GET request to the API with that channel name and the auth token$/, function(next){
    var self = this;
    this.soproRequest({
      method: 'GET',
      uri: '/api/channel.history',
      json: true,
      headers: {
        "token-auth": self.authToken,
      },
      qs: {
        channel: self.channel,
      }
    }, function(err, result, body){
      self.err = err;
      self.result = result;
      self.body = body;
      next();
    })
  });

  this.Then(/^the response should contain a list of chat messages from that channel$/, function(next){
    var self = this;
    assert(!self.err, 'request error from getMessagesAPI_steps.js')
    assert(self.body.ok, 'body.ok was not truthy')
    assert(self.body.messages.length > 0, 'channel had no messages');
    next();
  });

  this.Then(/^the response should contain a metadata object for that channel$/, function(next){
    var self = this;
    assert(self.body.channel !== undefined, 'body.channel was undefined');
    assert(typeof self.body.channel === 'object', 'body.channel was not an object');
      console.log(self.body)
      assert((self.body.channel.name === self.channel)
       || (self.body.channel._id === self.channel)
      ,'provided channel matches neither id nor name');
    next();
  });


}
