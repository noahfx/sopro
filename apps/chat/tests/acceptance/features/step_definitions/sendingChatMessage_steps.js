var SSTEPS = require('../../shared_steps.js');

module.exports = function () {

/*
  Scenario: new message input
    Given I am viewing a list of channels
    When I open the channel history
    Then I should see a new message input at the bottom
*/

  this.Given(SSTEPS.viewingListOfChannels.regex,
    SSTEPS.viewingListOfChannels.fn);

  this.When(/^I open the channel history$/, function (next) {
    element.all(by.css("#collection-channels > div.channel-collection > ul > li"))
    .get(0)
    .click()
    .then(function(){setTimeout(next,1500)});
  });

  this.Then(/^I should see a new message input at the bottom$/, function (next) {
    element(by.css(".channel-card .channel-card-input"))
    .isDisplayed()
    .then(function (isDisplayed) {
      if (!isDisplayed) {
        return next.fail("Channel card input not displayed");
      }
      next();
    })
  });

/*
  Scenario: sending a message from the GUI
    Given I have entered a message in the new message input
    When I press enter
    Then the message should be sent via the API
*/

  this.Given(/^I have entered a message in the new message input$/, function (next) {
    this.messageSent = "Hello World!";
    element(by.css(".channel-card .channel-card-input"))
    .sendKeys(this.messageSent)
    .then(next);
  });

  this.When(/^I press enter$/, function() {
    element(by.css(".channel-card .channel-card-input"))
    .sendKeys(protractor.Key.ENTER)
    .then(next);
  });

  this.Then(/^the message should be sent via the API$/, function (next) {
    var self = this;
    element.all(by.css("#main-stage > ng-include > md-card > md-content > ul > li"))
    .last()
    .getText()
    .then( function (lastMessageText) {
      assert(lastMessageText === self.messageSent);
      next();
    });
  });
}