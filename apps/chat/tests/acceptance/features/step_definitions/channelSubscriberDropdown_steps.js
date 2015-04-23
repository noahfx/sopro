var CAM_MOCKS = require('../../../common/mock-data.js');
var SSTEPS = require('../../shared_steps.js');

var channelSubscriberDropdown_steps = module.exports = function(){

  this.Given(SSTEPS.appStarted.regex, SSTEPS.appStarted.fn)
  
  this.When(/^I select a channel from the list$/, function (next) {
    browser
    .actions()
    .doubleClick(element.all(by.css("#collection-channels .channel-item")).get(0))
    .perform()
    .then(next);
  });

  this.Then(/^I should see a list of channel subscribers$/, function (next) {
    setTimeout(function () {
      element(by.css("sopro-subscribers-dropdown")).isDisplayed()
      .then(function(isDisplayed) {
        if (isDisplayed) {
          next();
        } else {
          next.fail(new Error("Subscribers Dropdown is not being displayed"));
        }
      });
    }, 1000);
  });
}