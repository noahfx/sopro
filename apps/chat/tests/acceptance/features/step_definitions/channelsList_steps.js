var CAM_MOCKS = require('../../../mock-data.js');
var SSTEPS = require('../../shared_steps.js');


var channelsList_steps = module.exports = function(){

  this.Given(/^I have started the chatlog application$/, function (next) {
    browser.get('/');
    next();
  });

  this.When(SSTEPS.roleChosen.regex, SSTEPS.roleChosen.fn);

  this.Then(/^I should see a list of channels to which that role is subscribed$/, function (next) {
    var channelsRepeater =
    element.all(by.css('#collection-channels .channel-item'));

    channelsRepeater.isDisplayed()
    .then(function(isDisplayed) {
      if (isDisplayed) {
        channelsRepeater.count()
        .then(function (size) {
          if (size == CAM_MOCKS.channels1.channels.length) {
            next();
          } else {
            console.log('Found ', size)
            console.log('Expected ', CAM_MOCKS.channels1.channels.length)
            next.fail(new Error("Wrong channels for role"));
          }
        });
      } else {
        next.fail(new Error("List of channels is not displayed"));
      }
    });
  });

  // This time it will match "a different role" and click it:
  this.When(SSTEPS.roleChosen.regex, SSTEPS.roleChosen.fn);

  this.Then(/^the list of channels for that role should update automatically$/, function (next) {
    var channelsRepeater =
    element.all(by.css('#collection-channels .channel-item'));

    channelsRepeater
    .isDisplayed()
    .then(function  (isDisplayed) {
      if (isDisplayed) {
        channelsRepeater
        .get(0).getText()
        .then(function (text) {
          if (text == CAM_MOCKS.channels2.channels[0].name) {
            next();
          } else {
            next.fail(new Error("Wrong channels for role"));
          }
        });
      } else {
        next.fail(new Error("List of channels is no displayed"));
      }
    });
  });

  this.Given(/^I am viewing a list of channels for a role$/, function (next) {
    browser.get("/")
    .then(function () {
      browser.element.all(by.repeater("channel in channels")).isDisplayed()
      .then(function  (isDisplayed) {
        if (isDisplayed) {
          next();
        } else {
          next.fail(new Error("List of channels is no displayed"));
        }
      });
    });
  });

  this.When(/^the number of channels exceeds a pre\-defined number$/, function (next) {
    browser.element(by.css('.role-selection')).click()
    .then(function () {
      browser.element.all(by.repeater('role in roles')).get(1).click()
      .then(function () {
        next();
      });
    });
  });

  this.Then(/^the list of channels is truncated at the pre\-defined number$/, function (next) {
    element.all(by.css('#collection-channels .channel-item'))
    .count()
    .then(function (count) {
      if (count == 2) {
          next();
        } else {
          next.fail(new Error("List of channels is bad displayed"));
        }
    });
  });

  this.Then(/^the remainder is displayed as "([^"]*)"$/, function (arg1,next) {
    browser.element(by.css(".sopro-more-channels")).isDisplayed()
    .then(function (isDisplayed) {
      if (isDisplayed) {
        next()
      } else {
        next.fail(new Error("more channels is no displayed"));
      }
    });
  });

  this.Given(/^I am viewing a list of channels$/, function (next) {
    browser.element(by.css('.role-selection')).click()
    .then(function () {
      browser.element.all(by.repeater('role in roles')).get(1).click()
      .then(function () {
        element.all(by.css('#collection-channels .channel-item'))
        .count()
        .then(function (count) {
          if (count != 0) {
            next()
          } else {
            next.fail(new Error("Channels are not being displayed"));
          }
        });
      });
    });
  });

  this.When(/^I click "([^"]*)"$/, function (arg1, next) {
   browser.element(by.css(".sopro-more-channels")).click()
    .then(function () {
      next();
    });
  });

  this.Then(/^I should see the entire list of channels to which that role is subscribed$/, function (next) {
    // Write code here that turns the phrase above into concrete actions
    browser.element(by.css(".sopro-channels-overflow")).isDisplayed()
    .then(function (isDisplayed) {
      if (isDisplayed) {
        next();
      } else {
        next.fail(new Error("Channels overflow dropdown is not displayed"));
      }
    })
  });

}