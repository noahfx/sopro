var async = require('async');
var CAM_MOCKS = require('../../../common/mock-data.js');
var assert = require('assert');

module.exports = function(){
  this.Given(/^I am not logged in$/, function (next) {
    // Write code here that turns the phrase above into concrete actions
    browser.get('/logout');
    next();
  });

  this.When(/^I visit `\/login`$/, function (next) {
    // Write code here that turns the phrase above into concrete actions
    browser.get('/login');
    next();
  });

  this.Then(/^I should see a login form$/, function (next) {
    // Write code here that turns the phrase above into concrete actions
    element(by.css('input[name="username"]'))
    .isDisplayed()
    .then(function(isDisplayed){
      assert(isDisplayed, 'Failed to find username input')
      next();
    });
  });

  this.Given(/^I have (in)?valid credentials$/, function (arg1, next) {
    var invalid = !!arg1;
    if(invalid){
      this.username = CAM_MOCKS.credentialsInvalidUsername;
      this.password = CAM_MOCKS.credentialsInvalidPassword;
    } else {
      this.username = CAM_MOCKS.credentialsValidUsername;
      this.password = CAM_MOCKS.credentialsValidPassword;
    }
    next();
  });

  this.When(/^I submit the credentials$/, function (next) {
    var self = this;
    // Write code here that turns the phrase above into concrete actions
    async.series([
      function(done){
        element(by.css('input[name="username"]'))
        .sendKeys('\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b' + self.username)
        .then(done)
      },
      function(done){
        element(by.css('input[name="password"]'))
        .sendKeys('\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b' + self.password)
        .then(done)
      },
      function(done){
        element(by.css('.login-button'))
        .click()
        .then(done)
      }
    ], function(err){
      next(err)
    })
  });

  this.Then(/^I should( not)? be logged in to the chat app$/, function (arg1, next) {
    var shouldLogin = !arg1;
    // Write code here that turns the phrase above into concrete actions
    browser.getCurrentUrl()
    .then(function(currentUrl){
      console.log(currentUrl)
      var isChatApp = /\/$/.test(currentUrl);
      var isLogin = /\/login$/.test(currentUrl);
      if(shouldLogin){
        assert(isChatApp === true, 'Expected url to match /')
      } else {
        assert(isLogin === true, 'Expected url to match /login')
      }
      next();
    })
  });

  this.Then(/^I should see a failure message about my credentials$/, function (next) {
    element(by.css('form .sopro-warn'))
    .getText()
    .then(function(warning){
      var okWarning = warning.match(/invalid username or password/i);
      assert(okWarning, 'Didn\'t find expected bad credentials warning in the form');
      next();
    })
  });

  this.Then(/^the username should be prefilled with my last attempted credential$/, function (next) {
    var self = this;
    // Write code here that turns the phrase above into concrete actions
    element(by.css('input[name="username"]'))
    .getText()
    .then(function(username){
      assert.equal(username, self.username, 'Expected last attempted username to be visible on the input');
      next();
    })
  });

}