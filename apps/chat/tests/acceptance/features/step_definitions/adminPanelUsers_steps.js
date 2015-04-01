var assert = require('assert');
var CAM_MOCKS = require('../../../mock-data.js');
var protractorHelpers = require('../../../protractorHelpers.js')(browser,element);

module.exports = function(){
/*
 *  Scenario: administrator authentication
 */
  this.Given(/^I am a Society Pro Enterprise Edition administrator$/, function(next){
    this.adminUser = 1;
    next();
  })
  this.When(/^I authenticate to Society Pro$/, function(next){
    protractorHelpers.changeIdentity(this.adminUser)
    .then(next)
  })
  this.Then(/^I should see a link to an administration panel in the toolbar dropdown$/, function(next){
    element(by.css('#role-selection'))
    .click()
    .then(function(){
      element(by.css('#adminPanelLink'))
      .isDisplayed()
      .then(function(isDisplayed){
        assert(isDisplayed);
        next();
      })
    })
  })

/*
 *  Scenario: opening the administration panel
 */
  //Given I am a Society Pro Enterprise Edition administrator
  //When I authenticate to Society Pro
  this.When(/^I click the link to the administration panel$/, function(next){
    element(by.css('#role-selection'))
    .click()
    .then(function(){
      element(by.css('#adminPanelLink'))
      .click()
      .then(next)
    })

  })
  this.Then(/^I should see a panel with a default "users" tab$/, function(next){
    element.all(by.css('.adminTabs'))
    .count()
    .then(function(count){
      assert(count === 1);
      element(by.css('md-tab[label="Users"]'))
      .isDisplayed()
      .then(function(isDisplayed){
        assert(isDisplayed);
        next();
      })
    })
  })
  this.Then(/^I should see a list of Society Pro users$/, function(next){
    element.all(by.repeater('user in usersList'))
    .count()
    .then(function(count){
      assert(count > 0);
      next();
    })
  })

}