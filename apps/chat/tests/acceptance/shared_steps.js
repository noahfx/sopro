var CAM_MOCKS = require('../mock-data.js');

var changeIndentity = function (i) {
  console.log("changeIndentity:");
  var Q = require('q');
  var fs = require('fs');
  var user1 = fs.readFileSync("couchdb/mocks/user1.json", 'utf8');
  var user2 = fs.readFileSync("couchdb/mocks/user2.json", 'utf8');
  var defer = Q.defer();
  browser.get("/")
  .then(function(){
    element(by.css("body")).getAttribute('data-soproenv')
    .then(function (env) {
      if (env == "standard") {
        element(by.css("#role-selection")).click()
        .then(function () {
          element.all(by.repeater('role in roles')).get(i).click()
          .then(function () {
            defer.resolve();
          });  
        });
      } else {
        browser.getCurrentUrl()
        .then(function (url) {
          var fillForm = function () {
            var user = (i == 0)? user1 : user2;
            var d = "\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b";
            var u = JSON.parse(user);
            element(by.css('#main-stage > form > label:nth-child(1) > input[type="text"]'))
            .sendKeys(d+u.username)
            .then(function () {
              element(by.css('#main-stage > form > label:nth-child(2) > input[type="text"]'))
              .sendKeys(d+"password")
              .then(function () {
                element(by.css('#main-stage > form > input[type="submit"]'))
                .click()
                .then(function () {
                  defer.resolve();
                });
              });
            });    
          }
          if (url.indexOf("login") == -1) { // if url not contains 'login'
            browser.get("/logout")
            .then(function () {
              fillForm();
            })
          } else {
            fillForm();
          }
        });
        
      }
    });
  });
  return defer.promise;
}

module.exports = {
  appStarted: {
    regex: /^I have started the chatlog application$/,
    fn: function (next) {
      browser.get('/')
      .then(function () {
        changeIndentity(0)
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
      changeIndentity(roleIndex)
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
      var http = require('http');
      var req = http.request({
        port: 8080,
        method: "GET",
        path: "/api/channels?role="+CAM_MOCKS.roleId1,
        headers: {
          'token-auth': CAM_MOCKS.validToken,
        }
      }, function (res) {
        res.on('data', function (chunk) {
          var response = JSON.parse(chunk);
          if (response.peers != undefined) {
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
    }
  },
  roleChosen: {
    regex: /^I choose a( different)? role$/,
    fn: function (arg1, next) {
        var roleIndex =
        (arg1 == undefined)
        ? 0
        : 1
      changeIndentity(roleIndex)
      .then(function () {
        next();
      });
    },
  },
}