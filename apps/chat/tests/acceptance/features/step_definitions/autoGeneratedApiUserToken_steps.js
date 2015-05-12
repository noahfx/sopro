var CAM_MOCKS = require('../../../common/mock-data.js');
var SSTEPS = require('../../shared_steps.js');
var assert = require("assert");

var PI = require('../../../../persistence-interface.js')();
var PICouch = require('../../../../persistence-couchdb');
PI.use(PICouch);

module.exports = function(){
/*
  Scenario: automatically generating an API token
*/
  this.Given(/^I am authorized to create new users$/, function (next) {
    var acl = require('../../../../auth-matrix.js')();
    var identityid = "abc";
    acl.isAllowed(identityid, '/api/users', 'post', function(err, ok){
      if(err){
        return next.fail('Authentication failure: '+err);
      }
      if(ok){
        next();
      } else {
        next.fail('Authentication fail; expected success: '+err+'\n'+ok);
      }
    });
  });
  this.When(/^I create a new user$/, function (next) {
    var self = this;
    this.soproRequest({
        uri: '/api/users',
        method: "POST",
        qs: {
          username: CAM_MOCKS.postUserRequest.username,
          realname: CAM_MOCKS.postUserRequest.realname,
          email: CAM_MOCKS.postUserRequest.email,
        },
      },
      function(err, res, body){
        if(err){
          return next.fail(err)
        }
        var response = JSON.parse(body);
        if (response.ok) {
          self.user = response.user;
          next();
        } else {
          next.fail(new Error(response.error));
        }
      }
    )
  });
  this.Then(/^an API token should be automatically generated for that user$/, function (next) {
    var self = this;
    PI.find("apiToken", "for_identityid", this.user.identities[0], function (err,results) {
      if(err){
        return next.fail(new Error(err));
      }
      if(results.length === 1){  // found this token
        if (results[0].token) {
          PI.destroy(self.user,function(err,user){
            if(err) {
              return next.fail(new Error(err));
            }
            next();
          });
        } else {
          next.fail(new Error("Token not found for that user"));
        }
      } else {
        return next.fail(new Error("Token not found for that user"));
      }
    });
  });

/*
  Scenario: viewing the API token via http

  Given I have started the chatlog application
    When I go to the correct route
    Then I should see my API token

*/
  this.Given(SSTEPS.appStarted.regex,
    SSTEPS.appStarted.fn);

  this.When(/^I go to the correct route$/,function (next) {
    browser.driver.get("https://localhost/token").then(function () {
      next();
    });
  });

  this.Then(/^I should see my API token$/,function (next) {
    browser.driver.getPageSource()
    .then(function(src){
      var correct = !!src.match(/apiToken/);
      if (correct) {
        next();
      } else {
        next.fail(new Error("Authorization token not found"));
      }
    });
  });

/*
  Scenario: transforming the token into an identity
*/
  this.Given(/^I have a valid token associated with a user$/,function (next) {
    var self = this;
    SSTEPS.appStarted.fn(function () {
      browser.driver.get("https://localhost/token").then(function () {
        browser.ignoreSynchronization = true;
        browser.findElement(by.css("pre"))
        .getText()
        .then(function(t) {
          var response = JSON.parse(t);
          assert(response.ok == true);
          self.tokenObj = response.apiToken;
          self.token = response.apiToken.token;
          browser.ignoreSynchronization = false;
          next();
        });
      });
    });
  });

  this.When(/^I make a request to the API with that token$/,function (next) { // api/ping
    var self = this;
    this.soproRequest({
      uri: "/api/ping",
      headers: {
        'token-auth' : this.token
      }
    },
    function(err, res, body){
      if(err){
        return next.fail(err)
      }
      var response = JSON.parse(body);
      if (response.ok) {
        self.user = response.user;
        next();
      } else {
        next.fail(new Error(response.error))
      }
    });
  });

  this.Then(/^the server should use that user$/,function (next) {
    var fs = require('fs');
    var identity = fs.readFileSync("couchdb/mocks/identity1.json",{encoding:'utf8'});
    assert(this.user.rolename === identity.rolename, "Wrong identity");
    next();
  });
}