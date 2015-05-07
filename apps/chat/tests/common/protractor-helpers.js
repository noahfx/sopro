module.exports = function (browser, element) {
  var Q = require('q');
  var fs = require('fs');
  var request = require('request');
  var login = {}
  login.changeIdentity = changeIdentity;
  login.changeIdentity2 = changeIdentity2;
  login.getFeaturesConfig = getFeaturesConfig;

  function changeIdentity2 (username) {
    var defer = Q.defer();
    browser.get("/")
    .then(function(){
      
    });
    return defer.promise;
  }

  function changeIdentity (i) {
    var user1 = fs.readFileSync("couchdb/mocks/user1.json", 'utf8');
    var user2 = fs.readFileSync("couchdb/mocks/user2.json", 'utf8');
    var user3 = fs.readFileSync("couchdb/mocks/user3.json", 'utf8');
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
              var user = user1;
              switch (i) {
                case 1: user = user2
                        break;
                case 2: user = user3;
              }
              var d = "\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b";
              var u = JSON.parse(user);
              element(by.css('input[name="username"]'))
              .sendKeys(d+u.username)
              .then(function () {
                element(by.css('input[name="password"]'))
                .sendKeys(d+"password")
                .then(function () {
                  element(by.css('.login-button'))
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

  function getFeaturesConfig() {
    var defer = Q.defer();
    browser.get("/").then(function () {
      element(by.css("body")).getAttribute('data-soproenv')
      .then(function (env) {
        var configFile = '../../cfg/features.standard.js';
        if (env == "enterprise" ) {
          configFile = '../../cfg/features.enterprise.js';
        }
        var features = require(configFile);
        features.env = env;
        defer.resolve(features);
      }, function(err){
        defer.reject(err)
      })
    }, function(err){
      defer.reject(err)
    });
    return defer.promise;
  }

  return login;
}