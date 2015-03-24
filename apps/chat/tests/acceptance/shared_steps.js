var CAM_MOCKS = require('../mock-data.js');
var protractorHelpers = require('../protractorHelpers.js')(browser,element);
var changeIdentity = protractorHelpers.changeIdentity;
var fs = require('fs');

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

  usingEE: {
    regex: /^I am( not)? using the Society Pro Enterprise Edition$/,
    fn: function(arg1, next){
      browser.get("/")
      .then(function(){
        protractorHelpers.getFeaturesConfig()
        .then(function (sopro) {
          var ee = false;
          if (sopro.env == "enterprise") {
            ee = true;
          }

          if(arg1){ // Standard expected
            if(ee){
              console.log('Skipping standard edition tests; this is EE')
              next.pending();
            } else { // Standard found
              next()
            }
          } else { // EE expected
            if(ee){
              next();
            } else {
              console.log('Skipping EE tests; this is standard')
              next.pending()
            }
          }
        });
      });
    }
  },

  iAuthenticate: {
    regex: /^I authenticate$/,
    fn: function (next) {
      var self = this;
      protractorHelpers.changeIdentity(0)
      .then(function () {
        var json = fs.readFileSync('couchdb/mocks/user1.json', {encoding:'utf8'});
        self.authenticatedUserId = JSON.parse(json)._id;
        next();
      },function (err) {
        console.log(err);
        next.fail(new Error(err));
      });
    }
  }

}