var CAM_MOCKS = require('../common/mock-data.js');
var protractorHelpers = require('../common/protractor-helpers.js')(browser,element);
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
        element(by.css('#collection-channels li.sopro-config-collection-link.sopro-more-channels'))
        .isDisplayed()
        .then(function (isDisplayed) {
          if (arg1) {
            if (isDisplayed) {
              next();
            } else {
              next.fail(new Error("Less than three Channels displayed"));
            }
          } else {
            next(); 
          }
        })
      })
    }
  },
  roleHasPeers: {
    regex: /^a specific role has peers$/,
    fn: function (next) {
      this.soproRequest({
        uri: '/api/channels',
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
        var jsonUser = fs.readFileSync('couchdb/mocks/user1.json', {encoding:'utf8'});
        var jsonIdentity = fs.readFileSync('couchdb/mocks/identity1.json', {encoding:'utf8'});
        self.authenticatedUserId = JSON.parse(jsonUser)._id;
        self.authenticatedIdentityId = JSON.parse(jsonIdentity)._id;
        next();
      },function (err) {
        console.log(err);
        next.fail(new Error(err));
      });
    }
  }

}