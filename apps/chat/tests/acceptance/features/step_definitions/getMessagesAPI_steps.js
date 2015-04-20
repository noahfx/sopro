module.exports = function(){
  /*
  Scenario: messages via API GET
    Given I have a valid authentication token for GET /api/channels.history
      And my identity is a member of a given channel
    When I make the correct GET request to the API with that channel name and the auth token
    Then the response should contain a list of chat messages from that channel
  */
  this.Given(/^I have a valid authentication token for GET \/api\/channels.history$/, function(next){
    this.authToken = 'abc';
    next();
  });

  this.Given(/^my identity is a member of a given channel$/, function(next){
    this.channel = 'channel-random';
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
      body: {
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

  /*
  Scenario: messages and metadata via API GET
    Given I have a valid authentication token for GET /api/channels.history
    When I make the correct GET request to the API with the channel name and the auth token and a metadata flag
    Then the response should contain a list of chat messages from that channel
      And the response should contain a metadata object for that channel
  */
  this.When(/^I make the correct GET request to the API with that channel name and the auth token and a metadata flag$/, function(next){
    var self = this;
    this.soproRequest({
      method: 'GET',
      uri: '/api/channel.history',
      json: true,
      headers: {
        "token-auth": self.authToken,
      },
      qs: {
        metadata: true,
      },
      body: {
        channel: self.channel,
      },
    }, function(err, result, body){
      self.err = err;
      assert(!self.err, 'request error from getMessagesAPI_steps.js')
      self.result = result;
      self.body = body;
      next();
    })
  });

  this.Then(/^the response should contain a list of chat messages from that channel$/, function(next){
    var self = this;
    assert(self.body.ok, 'body.ok was not truthy')
    assert(self.body.messages.length > 0, 'channel had no messages');
    next();
  });

  this.Then(/^the response should contain a metadata object for that channel$/, function(next){
    var self = this;
    assert(self.body.metadata !== undefined, 'body.metadata was undefined');
    assert(typeof self.body.metadata === 'object', 'body.metadata was not an object');
    assert(self.body.metadata.name === self.channel);
    next();
  });

}
