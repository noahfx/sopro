var SSTEPS = require('../../shared_steps.js');

module.exports = function(){
  //Scenario: viewing an overflow list of channels
  this.Given(SSTEPS.viewingListOfChannels.regex,
    SSTEPS.viewingListOfChannels.fn);

  this.When(/^I click "\+N more..."$/, function (next) {
   browser.element(by.css("#collection-channels .sopro-more-channels")).click()
    .then(function () {
      next();
    });
  });

  this.Then(/^I should see the entire list of channels to which that role is subscribed$/, function (next) {
    // Write code here that turns the phrase above into concrete actions
    browser.element(by.css("#collection-channels .sopro-channels-overflow"))
    .isDisplayed()
    .then(function (isDisplayed) {
      if (isDisplayed) {
        next();
      } else {
        next.fail(new Error("Channels overflow dropdown is not displayed"));
      }
    })
  });
}
