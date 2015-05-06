var CAM_MOCKS = require('../../../common/mock-data.js');
var SSTEPS = require('../../shared_steps.js');


var channelsList_steps = module.exports = function(){

/*
 * Scenario: viewing a list of channels
 */

  this.Given(SSTEPS.appStarted.regex, SSTEPS.appStarted.fn)

  this.When(SSTEPS.roleChosen.regex, SSTEPS.roleChosen.fn);

  this.Then(/^I should see a list of channels to which that role is subscribed$/, function (next) {
    element.all(by.css('#collection-channels .channel-item'))
    .isDisplayed()
    .then(function(isDisplayed) {
      if (isDisplayed) {
        element.all(by.css('#collection-channels .channel-item'))
        .count()
        .then(function (size) {
          if (size == CAM_MOCKS.getChannelsResponse1.channels.length) {
            next();
          } else {
            next.fail(new Error("Wrong channels for role"));
          }
        });
      } else {
        next.fail(new Error("List of channels is not displayed"));
      }
    });
  });

/*
 * Scenario: changing the list of channels on role change
 */

  this.Given(SSTEPS.appStarted.regex, SSTEPS.appStarted.fn)

  // First it matches "choose a role":
  this.When(SSTEPS.roleChosen.regex, SSTEPS.roleChosen.fn);

  // Then it matches "choose a different role":
  this.When(SSTEPS.roleChosen.regex, SSTEPS.roleChosen.fn);

  this.Then(/^the list of channels for that role should update automatically$/, function (next) {
    element.all(by.css('#collection-channels .channel-item'))
    .isDisplayed()
    .then(function  (isDisplayed) {
      if (isDisplayed) {
        element.all(by.css('#collection-channels .channel-item'))
        .get(0).getText()
        .then(function (text) {
          if (text == CAM_MOCKS.getChannelsResponse2.channels[0].name) {
            next();
          } else {
            next.fail(new Error("Wrong channels for role"));
          }
        });
      } else {
        next.fail(new Error("List of channels is not displayed"));
      }
    });
  });

/*
 * Scenario: truncating the list of channels
 */

  this.Given(SSTEPS.viewingListOfChannels.regex,
    SSTEPS.viewingListOfChannels.fn)

  this.When(/^the number of channels exceeds a pre\-defined number$/, function (next) {
    var rolesChannels = CAM_MOCKS.getChannelsResponse2.channels;
    if(rolesChannels.length > CAM_MOCKS.displayedChannelCount){
      return next();
    } else {
      return next(new Error("Fewer mock channels than the mock displayedChannelCount"))
    }
  });

  this.Then(/^the list of channels is truncated at the pre\-defined number$/, function (next) {
    element.all(by.css('#collection-channels .channel-item'))
    .count()
    .then(function (count) {
      if (count == CAM_MOCKS.displayedChannelCount) {
        next();
      } else {
        next.fail(new Error("Incorrect number of channels displayed"));
      }
    });
  });

  this.Then(/^the hidden channel count is displayed as "\+N more"$/, function (next) {
    browser.element(by.css("#collection-channels .sopro-more-channels"))
    .isDisplayed()
    .then(function (isDisplayed) {
      if (!isDisplayed) {
        return next.fail(new Error("more channels is not displayed"));
      }
      element.all(by.css('#collection-channels .channel-item'))
      .count()
      .then(function (count) {
        var rolesChannels = CAM_MOCKS.getChannelsResponse2.channels;
        var difference = rolesChannels.length - count;
        browser.element(by.css("#collection-channels .sopro-more-channels"))
        .getText()
        .then(function(text){
          var correct =
            text.match(/\+\d+ more/)
            ? true
            : false;
          if(correct){
            return next()
          } else {
            return next(
              new Error("Expected label +N more; got label "+text)
            )
          }
        })
      });
    });
  });
}