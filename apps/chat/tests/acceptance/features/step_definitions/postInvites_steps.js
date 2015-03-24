var CAM_MOCKS = require('../../../mock-data.js');
var SSTEPS = require('../../shared_steps.js');
var SA_STEPS = require('../../sharedAPI_steps.js');

var peersCollection_steps = module.exports = function(){

  /*
   *  Scenario: sending channel invitations via API
   */
  this.Given(SA_STEPS.haveValidAuthToken.regex,
    SA_STEPS.haveValidAuthToken.fn)

  this.Given(/^a specified role is( not)? a subscriber to a channel$/,
    roleIsSubscriber);
  function roleIsSubscriber(arg1, next) {
    this.roleId =
      (arg1 === undefined)
      ? CAM_MOCKS.roleId1
      : CAM_MOCKS.nonsubscribedRoleId;
    next();
  }

  this.Given(/^I have a peer who is( not)? a channel subscriber$/, peerIsSubscriber);
  function peerIsSubscriber(arg1, next){
    this.peerId =
      (arg1 === undefined)
      ? CAM_MOCKS.subscribedPeerId
      : CAM_MOCKS.nonsubscribedPeerId;
    next();
  }

  this.When(/^I make the correct POST request with that channels id, that peer's id, and role id$/,
    sendChannelInvite);

  function sendChannelInvite(next) {
    this.channel = CAM_MOCKS.postChannelResponse.channel.id;
    var self = this;
    this.soproRequest("https://localhost/api/channels.invite", {
      method: "POST",
      qs: {
        role: this.roleId,
        channel: this.channel,
        user: this.peerId,
      },
    }, function (err, res, body) {
      if(err){
        return next.fail(new Error(err));
      }
      var parsed = JSON.parse(body);
      self.response = parsed;
      next();
    });

  }

  this.Then(/^a channel join invitation should( not)? be sent for that peer ID$/,
    inviteWasSent);
  function inviteWasSent(arg1, next) {
    var sentActual = this.response.ok;
    var sentExpected =
      (arg1 == undefined)    // true if invite should be sent
      ? true
      : false;

    if (sentActual === sentExpected){
      next();
    } else if(sentActual){
      next.fail(new Error("Peer was successfully invited; expected failure"));
    } else {
      next.fail(new Error(this.response.error));
    }
  };

  /*
   *  Scenario: channel invitations via API to subscribed peers
   */

  this.Given(SA_STEPS.haveValidAuthToken.regex,
    SA_STEPS.haveValidAuthToken.fn);

  this.Given(/^a specified role is( not)? a subscriber to a channel$/,
    roleIsSubscriber);

  this.Given(/^I have a peer who is( not)? a channel subscriber$/, 
    peerIsSubscriber);

  this.When(/^I make the correct POST request with that channels id, that peer's id, and role id$/,
    sendChannelInvite);

  this.Then(/^a channel join invitation should( not)? be sent for that peer ID$/,
    inviteWasSent);

  this.Then(/^the response should indicate the peer is already a subscriber$/, function (next) {
    if (this.response.error == "already_in_channel") {
      next();
    } else {
      next.fail(new Error("Wrong Response error code: "+this.response.error));
    }
  });

  /*
   *    Scenario: channel invitations via API to a channel not subscribed to
   */

  this.Given(SA_STEPS.haveValidAuthToken.regex,
    SA_STEPS.haveValidAuthToken.fn);

  this.Given(/^a specified role is( not)? a subscriber to a channel$/,
    roleIsSubscriber);

  this.Given(/^I have a peer$/, function(next){
    this.peerId = CAM_MOCKS.nonsubscribedPeerId;
    next();
  })

  this.When(/^I make the correct POST request with that channels id, that peer's id, and role id$/,
    sendChannelInvite);

  this.Then(/^a channel join invitation should( not)? be sent for that peer ID$/,
    inviteWasSent);

  this.Then(/^the response should indicate the role is not a channel subscriber$/, function (next) {
    if (this.response.error == "not_in_channel") {
      next();
    } else {
      next.fail(new Error("Wrong Response error code: "+this.response.error));
    }
  });
}