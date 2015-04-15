var PI = require('../../../../persistence-interface.js')();
var PICouch = require('../../../../persistence-couchdb.js');
PI.use(PICouch);
var assert = require('assert');

module.exports = function(){

/*
  Scenario: viewing a list of local users
    Given I am a Society Pro Enterprise Edition administrator
    When I view the administration panel
    And I click the "users" tab
    Then I should be able to see a list of all local users
*/
  this.When(/^I view the administration panel$/, function(next){
    browser.get('/admin')
    .then(next);
  })

  this.When(/^I click the "users" tab$/, function(next){
    browser.get('/admin')
    .then(function(){
      element(by.css('md-tab[label="Users"]'))
      .click()
      .then(next)
    });
  })

  this.Then(/^I should see a list of all local users$/, function(next){
    element.all(by.repeater('user in usersList'))
    .count()
    .then(function(count){
      assert(count > 0, 'Found zero user elements on the admin page');
      PI.readAll('user', function(err, body){
        if(err){
          return next.fail(err);
        };
        assert(count === body.length, 'Count of user elements doesnt match count of users in db');
        next();
      });
    })
  })

/*
  Scenario: adding a user
    Given I am a Society Pro Enterprise Edition administrator
      And I have a new user's details
    When I view the administration panel
      And I click the "users" tab
      And I enter those details
      And I submit those details
    Then the user is created
*/
  this.Given(/^I have a new user's details$/, function (next) {
    // Write code here that turns the phrase above into concrete actions
    this.newDetails = {
      username: 'created-by-adminPanelUsers-test',
      email: 'cucumber@live.com',
      realname: 'Justice A Mungus',
    }
    next();
  });

  this.When(/^I enter those details$/, function (next) {
    // Write code here that turns the phrase above into concrete actions
    element(by.css('input[name="username"]'))
    .sendKeys(this.newDetails.username);

    element(by.css('input[name="realname"]'))
    .sendKeys(this.newDetails.realname);

    element(by.css('input[name="email"]'))
    .sendKeys(this.newDetails.email);

    next();
  });

  this.When(/^I submit those details$/, function (next) {
    element(by.css('input[type="submit"]'))
    .click()
    .then(function(){
      setTimeout(next, 2000)
    });
  });

  this.Then(/^the user is created$/, function (next) {
    var self = this;
    // Write code here that turns the phrase above into concrete actions
    PI.find('user', 'username', this.newDetails.username, function(err, results){
      assert(!err, 'PI.find error');
      assert(results.length === 1, 'Non-1 number of results searching for user '+self.newDetails.username);
      assert(results[0].username === self.newDetails.username, 'Usernames failed to match');
      assert(results[0].realname === self.newDetails.realname, 'Realnames failed to match');
      assert(results[0].email === self.newDetails.email, 'Emails failed to match');
      assert(results[0].pendingInitialPassword === true, 'Found newly created user without pendingInitialPassword flag');
      next();
    })
  });

}