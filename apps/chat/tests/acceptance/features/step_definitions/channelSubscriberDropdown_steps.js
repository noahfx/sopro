var CAM_MOCKS = require('../../../common/mock-data.js');
var SSTEPS = require('../../shared_steps.js');

function delay(callback){
  setTimeout(callback, 2500);
}

var channelSubscriberDropdown_steps = module.exports = function(){

  this.Given(SSTEPS.viewingListOfChannels.regex, SSTEPS.viewingListOfChannels.fn);
  
  this.When(/^I select a channel from the list$/, function (next) {
    browser
    .actions()
    .mouseMove(element.all(by.css("#collection-channels .channel-item")).get(0))
    .doubleClick()
    .perform()
    .then(next);
  });

  this.Then(/^I should see a list of channel subscribers$/, function (next) {
    element(by.css("sopro-subscribers-dropdown"))
    .isDisplayed()
    .then(function(isDisplayed) {
      if (isDisplayed) {
        next();
      } else {
        next.fail(new Error("Subscribers Dropdown is not being displayed"));
      }
    });
  });
}