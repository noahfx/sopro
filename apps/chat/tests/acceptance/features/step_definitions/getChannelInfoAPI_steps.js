var CAM_MOCKS = require('../../../common/mock-data.js');
var SSTEPS = require('../../shared_steps.js');
var SA_STEPS = require('../../sharedAPI_steps.js');
var request = require('request');
var fs = require('fs');

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
    this.soproRequest({
      method: "GET",
      uri: '/api/channel.info',
      qs: {
        role: CAM_MOCKS.roleId1,
        channel: CAM_MOCKS.newChannelName,
      },
    }, function onResponse(err, res, body) {
      if(err){
        return next.fail(new Error(err));
      }

      var parsed = JSON.parse(body);
      var members = [];
      if(parsed.ok !== true){
        return next.fail(parsed.error || "Unknown vertx error")
      }
      try{
        members = parsed.channel.members;
      } catch(e){
        return next.fail(e);
      }
      if(!parsed.ok){
        return next.fail(new Error(parsed.error));
      }
      if(members.length !== CAM_MOCKS.getChannelInfoResponse.channel.members.length){
        return next.fail(new Error('/api/channel.info got an unexpected number of members'));
      };

      // Got here without a failure? Great, pass:
      return next() ;
    });

  });

}