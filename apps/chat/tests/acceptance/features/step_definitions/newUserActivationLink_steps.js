var assert = require('assert');
var CAM_MOCKS = require('../../../common/mock-data.js');
var protractorHelpers = require('../../../common/protractor-helpers.js')(browser,element);

module.exports = function(){

  /*
   *  Scenario: valid activation link
      Given I have a valid activation token
      When I visit the confirm account page for that token
      And I set a secure password
      Then my password is created
   */

  this.Given(/^I have an? (in)?valid activation token$/, function (arg1, next) {
    var self = this;
    var express = require('express');
    var app = express();
    app.sopro = {
      local: require('../../../../cfg/locals.js'),
      servers: require('../../../../cfg/servers.js'),
      // Hardcode enterprise features for now:
      features: require('../../../../cfg/features.enterprise.js'),
    }
    self.app = app;

    // Skip generating a real token if we want an invalid one:
    if(arg1){
      this.tokenObj = {
        token: "invalid-token"
      };
      return next();
    };

    var PI = require('../../../../persistence-interface.js')();
    var PICouch = require('../../../../persistence-couchdb');
    PI.use(PICouch);
    var sopro = require('../../../../sopro.js')(app, PI);
    var opts = {
      user: {
        _id: "user-abc"
      }
    };

    sopro.crypto.createToken(function(err, token){
      if(err){
        return next.fail(new Error(err));
      }
      opts.passwordResetToken = token;
      sopro.crypto.createAndSavePasswordResetToken(opts, function (err, result) {
        if (err) {
          return next.fail(new Error(err));
        }
        self.tokenObj = opts.tokenObj;
        next();
      });
    });
  });

  this.When(/^I visit the confirm account page for that token$/,function (next) {
    var self = this;
    var uri = 'https://' + this.app.sopro.servers.express.hostname + '/confirmAccount/' + this.tokenObj.token
    console.log(uri);
    browser.driver.get(uri)
    .then(function () {
      browser.driver.getPageSource()
      .then(function(src){
        self.pageSrc = src;
        next();
      });
    });
  });

  this.When(/^I set a secure password$/, function (next) {
    var self = this;
    self.password = "password";
    var pwd1 = element(by.css("input[name=password1]"));
    var pwd2 = element(by.css("input[name=password2]"));

    element(by.css("input[name=password1]"))
    .isDisplayed()
    .then(function (isDisplayed) {
      assert(isDisplayed);
      pwd1
      .sendKeys(self.password);
      pwd2
      .sendKeys(self.password);
       // browser.ignoreSynchronization = true;

      element(by.css('input[type="submit"]'))
      .click()
      .then(function(){
        next();
        //browser.ignoreSynchronization = false;
      });
    });
  });

  this.When(/^I set mismatched passwords$/, function (next) {
    var self = this;
    self.password = "password";
    self.passwordConfirm = "pa55word";
    var pwd1 = element(by.css("input[name=password1]"));
    var pwd2 = element(by.css("input[name=password2]"));

    element(by.css("input[name=password1]"))
    .isDisplayed()
    .then(function (isDisplayed) {
      assert(isDisplayed);
      pwd1
      .sendKeys(self.password);
      pwd2
      .sendKeys(self.passwordConfirm);
        //browser.ignoreSynchronization = true;
      next();
      //browser.ignoreSynchronization = false;
    });
  });

  this.Then(/my password is created/, function(next){
    var self = this;
     // Log out and back in to see if it worked:
     browser.get('/logout')
     .then(function(){
        browser.get('/login')
        .then(function(){
          element(by.css('input[name="username"]'))
          .isDisplayed()
          .then(function (isDisplayed) {
            assert(isDisplayed);
            element(by.css('input[name="username"]'))
            .sendKeys('\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\blouise');
            element(by.css('input[name="password"]'))
            .sendKeys('\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b'+self.password);
            element(by.css('input[type="submit"]'))
            .click()
            .then(function(){
              element(by.css('body'))
              .getAttribute('data-currentuser')
              .then(function(userJSON){
                var user = JSON.parse(userJSON);
                assert(user._id === 'user-abc');
                next();
              })
            })
          });
        })
     })
  })

 /*
  *  Scenario: reusing an activation link
  */
  //Given I have a valid activation token
  //When I visit the confirm account page for that token
  //And I set a secure password
  //And I visit the confirm account page for that token
  //Then I should see a failure message

  this.Then(/^I should see a failure message$/, function (next) {
    var correct = !!this.pageSrc.match(/token not found/)
    if (correct) {
      next();
    } else {
      console.log(this.pageSrc)
      next.fail(new Error("Expected 'token not found' error message"));
    }
  });


  /*
   * Scenario: invalid activation link
   */

  //Given I have an invalid activation link
  //When I visit the confirm account page
  //Then I should see a failure message

  this.Then(/^I should not be able to submit the form$/, function (next) {
    element(by.css('input[type="submit"]'))
    .getAttribute('disabled')
    .then(function (attr) {
      if (attr == false) {
        next.fail(new Error('Expected submit button to be disabled'));
      } else {
        next();
      }
    });
  });
}
