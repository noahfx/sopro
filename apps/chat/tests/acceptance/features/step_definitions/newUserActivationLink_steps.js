var assert = require('assert');
var CAM_MOCKS = require('../../../mock-data.js');
var protractorHelpers = require('../../../protractorHelpers.js')(browser,element);

module.exports = function(){
/*
 *  Scenario: activation link
 */

 this.Given(/^I have received a one-time activation link$/, function (next) {
  var self = this;
  var express = require('express');
  var app = express();
  app.sopro = {};
  var localConfig = require('../../../../cfg/locals.js');
  app.sopro.local = localConfig;
  var featureConfig = require('../../../../cfg/features.enterprise.js');
  app.sopro.features = featureConfig;
  var serverConfig = require('../../../../cfg/servers.js');
  app.sopro.servers = serverConfig;
  var PI = require('../../../../persistence-interface.js')();
  var PICouch = require('../../../../persistence-couchdb');
  PI.use(PICouch);
  var sopro = require('../../../../sopro.js')(app, PI);
  var opts = {
    user: {
      _id: "abc"
    }
  };
  self.app = app;
  sopro.crypto.createToken(function(err, token){
    if(err){
      return next.fail(new Error(err));
    }
    opts.token = token;
    sopro.crypto.saveToken(opts, function (err, result) {
      if (err) {
        return next.fail(new Error(err));
      }
      self.tokenObj = opts.tokenObj;
      next();
    });
  });
 });

 this.When(/^I click the link$/,function (next) {
  browser.get('https://' + this.app.sopro.servers.express.hostname + '/confirmAccount/' + this.tokenObj.token)
  .then(function () {
    next();
  });
 });

 this.Then(/^the system should check that the activation link is valid$/, function (next) {
  next();
 });

 this.Then(/^I should be prompted to set a secure password$/, function (next) {
  element(by.css("input[name=password1]")).isDisplayed()
  .then(function (isDisplayed) {
    if (isDisplayed) {
      next();
    } else {
      next.fail(new Error("No input for password found"));
    }
  });
 });

 /*
 *  Scenario: reusing an activation link
 */

  this.Given(/^the activation link has already been used$/, function (next) {
    var wrongToken = "zxcvbnm";
    var self = this;
    this.soproRequest('https://localhost/confirmAccount/'+wrongToken,
      function(err, res, body){
        if(err){
          return next.fail(err)
        }
        self.body = JSON.parse(res.body);
        if (self.body.ok === false) {
          next();
        } else {
          next.fail(new Error("Wrong Response"));
        }
    });
  });

  this.Then(/^I should see a failure message$/, function (next) {
    if (this.body.error === "Wrong Token") {
      next();
    } else {
      next.fail(new Error("Wrong message"));
    }
  });

}