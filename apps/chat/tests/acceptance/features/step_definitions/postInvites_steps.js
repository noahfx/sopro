var CAM_MOCKS = require('../../../mock-data.js');
var SSTEPS = require('../../shared_steps.js');

var peersCollection_steps = module.exports = function(){

  this.Given(/^a specified role is a subscriber to a channel$/, function (next) {
    this.roleSubscribed = CAM_MOCKS.roleId1;
    this.userToSubscribe = CAM_MOCKS.userId1;
    this.channel = CAM_MOCKS.getChannelsResponse1.channels[0].id; 
    next();
  });

  this.When(/^I make the correct POST request with that channels id, that peer's id, and role id$/, function (next) {
    var self = this;
    var http = require('http');
    var req = http.request({
      port: 8080,
      method: "POST",
      path: "/api/channels.invite?role="+this.roleSubscribed+"&channel="+this.channel+"&user="+this.userToSubscribe,
      headers: {
        'token-auth': CAM_MOCKS.validToken
      }
    }, function (res) {
      res.on('data', function (chunk) {
        var response = JSON.parse(chunk);
        self.response = response;
        next();
      });
    });

    req.on('error', function(e) {
      next.fail(new Error(e.message));
    });

    req.end();
  });

  this.Then(/^a channel join invitation should (not )?be sent for that peer ID$/, function (arg1, next) {
    var valid = (arg1 == undefined)? this.response.ok:!this.response.ok;
    if (valid){
      next();
    } else {
      next.fail(new Error(this.response.error));
    }
  });

  this.Given(/^I have a peer who is a channel subscriber$/, function (next) {
    this.roleSubscribed = CAM_MOCKS.roleId1;
    this.userToSubscribe = this.roleSubscribed;
    this.channel = CAM_MOCKS.getChannelsResponse1.channels[0].id; 
    next();
  });

  this.Then(/^the response should indicate the peer is already a subscriber$/, function (next) {
    if (this.response.error == "cant_invite_self") {
      next();
    } else {
      next.fail(new Error("Wrong Response in request"));
    }
  });

  this.Given(/^a specified role is not a subscriber to a channel$/, function (next) {
    this.roleSubscribed = CAM_MOCKS.roleId2;
    this.userToSubscribe = CAM_MOCKS.userId1;
    this.channel = CAM_MOCKS.getChannelsResponse1.channels[0].id; 
    next();
  });

  this.Then(/^the response should indicate the role is not a channel subscriber$/, function (next) {
    if (this.response.error == "not_in_channel") {
      next();
    } else {
      next.fail(new Error("Wrong Response in request"));
    }
  });
}