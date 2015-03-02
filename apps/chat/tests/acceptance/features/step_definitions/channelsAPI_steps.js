var CAM_MOCKS = require('../../../mock-data.js');
var SA_STEPS = require('../../sharedAPI_steps.js');

var channelsAPI_steps = module.exports = function(){


  this.Given(SA_STEPS.haveValidAuthToken.regex,
    SA_STEPS.haveValidAuthToken.fn)


  this.When(/^I make the correct GET request to the API server with a role id$/, function (next) {
    //this.roleID = CAM_MOCKS.roleId1;
    next();
  })

  this.Then(/^the response should contain a list of channels for that role$/, function (next) {
    var http = require('http');
    var req = http.request({
      port: 8080,
      method: "GET",
      path: "/channels?userID="+CAM_MOCKS.roleId1,
      headers: {
        'token-auth': CAM_MOCKS.validToken,
      }
    }, function (res) {
      res.on('data', function (chunk) {
        var response = JSON.parse(chunk);
        if (response.channels != undefined && response.peers != undefined) {
          next();
        } else {
          next.fail(new Error(response.error));
        }
      });
    });

    req.on('error', function(e) {
      next.fail(new Error(e.message));
    });

    req.end();
  });

  //*********************POST CHANNEL*************************************
  this.When(/^I make the correct POST request to the API server$/, function (next) {
  // Write code here that turns the phrase above into concrete actions
    var self = this;
    this.postChannels = {}
    var http = require('http');
    var req = http.request({
      port: 8080,
      method: "POST",
      path: "/channel?userID="+CAM_MOCKS.roleId1+"&name=fun",
      headers: {
        'token-auth': CAM_MOCKS.validToken,
      }
    }, function (res) {
      res.on('data', function (chunk) {
        var response = JSON.parse(chunk);
        self.postChannelsResponse = response;
        next();
      });
    });

    req.on('error', function(e) {
      next.fail(new Error(e.message));
    });

    req.end();
  });

  this.Then(/^a channel should be created for the role specified$/, function (next) {
  // Write code here that turns the phrase above into concrete actions
    var response = this.postChannelsResponse;
    if (response.ok && response.channel != undefined) {
      if (response.channel.creator == CAM_MOCKS.roleId1) {
        next();
      } else {
        next.fail(new Error("No channel created for role"));
      }
    } else {
      next.fail(new Error("Error in channel creation"));
    }
  });

  this.Then(/^a channel creation message should be placed on the event bus$/, function (next) {
    next.pending();
  });

  this.Then(/^the specified role should be subscribed to the channel$/, function (next) {
    var response = this.response;
    if (response.channel.members[0] === CAM_MOCKS.roleId1) {
      next();
    } else {
      next.fail(new Error("Role not subscribed"));
    }
  });


}