var CAM_MOCKS = require('../mock-data.js');
var changeIdentity = require('../protractorHelpers.js')(browser,element).changeIdentity;
var request = require('request');

module.exports = {
  appStarted: {
    regex: /^I have started the chatlog application$/,
    fn: function (next) {
      browser.get('/')
      .then(function () {
        changeIdentity(0)
        .then(function(){
          next();
        });
      });
    },
  },
  viewingListOfChannels: {
    regex: /^I am viewing a (long )?list of channels$/,
    fn: function(arg1, next){
      var roleIndex = (arg1 == undefined)? 0: 1;
      changeIdentity(roleIndex)
      .then(function(){
        var channels = browser.element.all(by.css('#collection-channels .channel-item'));
        channels.count()
        .then(function (count) {
          if (count >= 2) {
            next();
          } else {
            next.fail(new Error("Less than two Channels displayed"));
          }
        })
      })
    }
  },
  roleHasPeers: {
    regex: /^a specific role has peers$/,
    fn: function (next) {
      this.soproRequest('https://localhost/api/channels', {
        method: "GET",
        qs: {
          role: CAM_MOCKS.roleId1,
        }
      }, function (err, res, body) {
        if(err){
          return next.fail(new Error(err));
        }
        var parsed = JSON.parse(body);
        if (parsed.peers != undefined) {
          next();
        } else {
          next.fail(new Error(parsed.error));
        }
      })
    }
  },
  roleChosen: {
    regex: /^I choose a( different)? role$/,
    fn: function (arg1, next) {
        var roleIndex =
        (arg1 == undefined)
        ? 0
        : 1
      changeIdentity(roleIndex)
      .then(function () {
        next();
      });
    },
  },
}