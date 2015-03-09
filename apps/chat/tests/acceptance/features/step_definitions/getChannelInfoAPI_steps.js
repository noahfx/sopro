var CAM_MOCKS = require('../../../mock-data.js');
var SSTEPS = require('../../shared_steps.js');
var SA_STEPS = require('../../sharedAPI_steps.js');

var channelsList_steps = module.exports = function(){

/*
 * Scenario: listing channel subscribers via API
 */

  this.Given(SA_STEPS.haveValidAuthToken.regex,
    SA_STEPS.haveValidAuthToken.fn)

  this.Given(/^I have a role with correct permissions on the channel$/, function(next){
    next();
  });

  this.When(/^I make the correct GET request to the API server with a channel id$/, function(next){
    next();
  });

  this.Then(/^the response should contain a list of peers that are subscribed to that channel$/, function (next) {
    var http = require('http');
    var req = http.request({
      port: 8080,
      method: "GET",
      path: '/api/channel.info?role='
        + CAM_MOCKS.roleId1
        + '&channel='
        + encodeURIComponent(CAM_MOCKS.newChannelName),
      headers: {
        'token-auth': CAM_MOCKS.validToken,
      },
    }, function (res) {
      res.on('data', function (chunk) {
        var response = JSON.parse(chunk);
        var members = [];
        if(response.ok !== true){
          return next.fail(response.error || "Unknown vertx error")
        }
        try{
          members = response.channel.members;
        } catch(e){
          return next.fail(e);
        }
        if(!response.ok){
          return next.fail(new Error(response.error));
        }
        if(members.length !== CAM_MOCKS.getChannelInfoResponse.channel.members.length){
          return next.fail(new Error('/api/channel.info got an unexpected number of members'));
        };

        // Got here without a failure? Great, pass:
        return next();
      });
    });

    req.on('error', function(e) {
      next.fail(new Error(e.message));
    });

    req.end(); 
  });

}