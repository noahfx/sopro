var CAM_MOCKS = require('../../../common/mock-data.js');
var SSTEPS = require('../../shared_steps.js');
var protractorHelpers = require('../../../common/protractor-helpers.js')(browser,element);
var changeIdentity = protractorHelpers.changeIdentity;
var assert = require('assert');
module.exports = function(){
  // Before configuring scenario steps, define a few functions that are used more than once:

var clickAddChannelButton = function(next){
  browser.actions()
  .mouseMove(
    element(by.css('#collection-channels .sopro-collection-title'))
  )
  .perform();

  element(by.css('#collection-channels .channel-create-link'))
  .then(function(el){
    el.click();
    next();
  })
}

// /^I should( not)? see a( blank)? channel creation card$/
function checkChannelCreationCardPresence (arg1, arg2, next) {
  var cardExpected =
  arg1 === undefined
  ? true
  : false;

  var blankExpected =
  arg2 === undefined
  ? false
  : true;

  if(cardExpected){
    element(by.css('#card-create-channel'))
    .isDisplayed()
    .then(function(isDisplayed){
      assert(isDisplayed, 'Did not find an expected channel creation card');
      if(blankExpected){
        element(by.css('#card-create-channel input.title'))
        .getText()
        .then(function(text){
          if(blankExpected){
            if(text !== ""){
              return next(new Error('Expected the channel creation card to be blank'));
            }
          }
          return next();
        })
      } else {
        return next();
      }
    })
  } else {
    element(by.css('#card-create-channel'))
    .isDisplayed()
    .then(function(isDisplayed){
      assert(!isDisplayed, 'Found an unexpected channel creation card');
      next();
    })
  }
}


function ensureChannelCreationCard(next){
  element(by.css('#main-stage #card-create-channel'))
  .isDisplayed()
  .then(function(isDisplayed){
    if(!isDisplayed){
      clickAddChannelButton(function(){
        element(by.css('#main-stage #card-create-channel'))
        .isDisplayed()
        .then(function(isDisplayed){
          assert(isDisplayed, 'Channel creation card not visible after clicking add channel button.')
          next();
        })
      })
    } else {
      next();
    }
  });
}

function checkChannelCardPresence (arg1, next){
  var cardExpected =
  arg1 === undefined
  ? true
  : false;

  var channelCards = element.all(by.css('#main-stage .sopro-card.channel-card'))
  .count()
  .then(function(count){
    if(count === 0){
      return next(new Error('Zero channel cards found after creation'))
    } else {
      element.all(by.css('#main-stage .sopro-card.channel-card'))
      .get(0)
      .element(by.css('header .title'))
      .getText()
      .then(function(text){
        if(text !== CAM_MOCKS.newChannelName){
          return next(new Error('First channel card does not match expected name'))
        } else {
          next();
        }
      })
    }
  })
}


/*
 * Scenario:
 * opening the channel creation card
 */
  this.Given(/^I am using the chatlog application as foobar$/, function (next) {
    browser.get('/')
    .then(function () {
      changeIdentity(2)
      .then(function(){
        next();
      });
    });
  });

  this.Given(SSTEPS.viewingListOfChannels.regex, SSTEPS.viewingListOfChannels.fn);


  this.When(/^I select "\+ Add Channel"$/,
    clickAddChannelButton)

  this.Then(/^I should( not)? see a( blank)? channel creation card$/,
    checkChannelCreationCardPresence);

  this.Then(/^the card should be in the number 1 position on the main stage$/, function(next){
    var firstCard = element(by.css('#main-stage #card-create-channel:first-child'))
    .isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
        return next(new Error('Channel creation card is not the first child of #main-stage.'));
      }
      next();
    })
  });


/*
 * Scenario:
 * closing open create/add cards when "+ add a channel" is clicked
 */
  this.Given(SSTEPS.viewingListOfChannels.regex,
             SSTEPS.viewingListOfChannels.fn);

  this.Given(/^there is an open "create channel" card on the main stage$/,
    ensureChannelCreationCard);

  this.When(/^I select "\+ Add Channel"$/,
    clickAddChannelButton)

  this.Then(/^I should( not)? see a( blank)? channel creation card$/,
    checkChannelCreationCardPresence);



/*
 * Scenario:
 * Scenario: submitting the create channel form
 */
  this.Given(/^there is an open "create channel" card on the main stage$/,
    ensureChannelCreationCard);

  this.When(/^I enter a name for the channel$/, function(next){
    var nameInput = element(by.css("#card-create-channel .card-content .title"))
    .isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
        next(new Error('Can\'t find the channel name input'))
      }
      element(by.css("#card-create-channel .card-content .title"))
      .sendKeys(CAM_MOCKS.newChannelName)
      .then(function(){
        next();
      })
    });
  });

  this.When(/^I click the "Create Channel" button$/, function(next){
    var self = this;
    var createButton = element(by.css("#card-create-channel .create-button"))
    .isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
        next(new Error('Can\'t find the channel creation button'))
      }
      element(by.css("#card-create-channel .create-button")).click()
      .then(function(){
        setTimeout(function() {
          next.call(self);
        },1000);
      })
    });
  });

  this.Then(/^I should( not)? see a( blank)? channel creation card$/,
    checkChannelCreationCardPresence);

  this.Then(/^a channel should( not)? be created from the creation card$/, 
    checkChannelCardPresence);


/*
 * Scenario: cancelling the create channel form with the cancel button
 *
 */
  this.Given(/^there is an open "create channel" card on the main stage$/,
    ensureChannelCreationCard);

  this.When(/^I click the "cancel" button$/, function(next){
    element(by.css('#card-create-channel .cancel-button'))
    .isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
        return next(new Error('Cancel button not found on create channel card'))
      }
      element(by.css('#card-create-channel .cancel-button'))
      .click()
      .then(function(){
        next();
      })
    })
  });

  this.Then(/^I should( not)? see a( blank)? channel creation card$/,
    checkChannelCreationCardPresence);
  this.Then(/^I should( not)? see a channel card for that channel$/,
    checkChannelCardPresence);




/*
 *   Scenario: cancelling the create channel form with the "X" icon button
 *
 */
  this.Given(/^there is an open "create channel" card on the main stage$/,
    ensureChannelCreationCard);

  this.When(/^I click the "X" icon button$/, function(next){
    var cancel = element(by.css('#card-create-channel .x-button'))
    .isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
        return next(new Error('X button not found on create channel card'))
      }
      element(by.css('#card-create-channel .x-button'))
      .click()
      .then(function(){
        next();
      })
    })
  });

  this.Then(/^I should( not)? see a( blank)? channel creation card$/,
    checkChannelCreationCardPresence);
  this.Then(/^I should( not)? see a channel card for that channel$/,
    checkChannelCardPresence);

}