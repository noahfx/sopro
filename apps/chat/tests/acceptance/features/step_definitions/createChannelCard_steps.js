var CAM_MOCKS = require('../../../mock-data.js');
var SSTEPS = require('../../shared_steps.js');
module.exports = function(){
  // Before configuring scenario steps, define a few functions that are used more than once:

var clickAddChannelButton = function(next){
  var addChannelButton = element(by.css('#collection-channels-create'));
  addChannelButton.isDisplayed()
  .then(function(isDisplayed){
    if(!isDisplayed){
      return next(new Error('Can\'t find the create new channel button'));
    }
    addChannelButton.click()
    .then(function(){
      next();
    })
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

  var cardFound = undefined;

  element.all(by.css('#card-create-channel'))
  .count()
  .then(function(length){
    if(length === 0){
      cardFound = false;
    } else if(length === 1){
      cardFound = true;
    } else {
      return next(new Error('Found more than one channel creation card'));
    }

    if(cardFound === cardExpected){
      // Don't check the title if it's not expected:
      if(cardExpected){
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
      } else { // No card? No problem!
        return next();
      }
    } else { // Expected and actual didn't match
      if(!cardExpected){
        return next(new Error('Found an unexpected channel creation card'));
      } else {
        return next(new Error('Did not find an expected channel creation card'));
      }
    }
  })
}


function ensureChannelCreationCard(next){
  element.all(
    by.css('#main-stage #card-create-channel')
  )
  .count()
  .then(function(count){
    if(count === 0){
      clickAddChannelButton(next)
    } else if (count > 1){
      next(new Error('More than one creation cards found on main stage.'))
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
  channelCards
  .count()
  .then(function(count){
    if(count === 0){
      return next(new Error('Zero channel cards found after creation'))
    } else {
      channelCards
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
  this.Given(SSTEPS.appStarted.regex, SSTEPS.appStarted.fn);

  this.Given(SSTEPS.viewingListOfChannels.regex, SSTEPS.viewingListOfChannels.fn);


  this.When(/^I select "\+ Add Channel"$/,
    clickAddChannelButton)

  this.Then(/^I should( not)? see a( blank)? channel creation card$/,
    checkChannelCreationCardPresence);

  this.Then(/^the card should be in the number 1 position on the main stage$/, function(next){
    var firstCard = element(by.css('#main-stage #card-create-channel:first-child'));
    firstCard.isDisplayed()
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
    var nameInput = element(by.css("#card-create-channel .card-content .title"));
    nameInput.isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
        next(new Error('Can\'t find the channel name input'))
      }
      nameInput.sendKeys(CAM_MOCKS.newChannelName)
      .then(function(){
        next();
      })
    });
  });

  this.When(/^I click the "Create Channel" button$/, function(next){
    var createButton = element(by.css("#card-create-channel .create-button"));
    createButton.isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
        next(new Error('Can\'t find the channel creation button'))
      }
      createButton.click()
      .then(function(){
        next();
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
    var cancel = element(by.css('#card-create-channel .cancel-button'));
    cancel.isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
        return next(new Error('Cancel button not found on create channel card'))
      }
      cancel.click()
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
    var cancel = element(by.css('#card-create-channel .cancel-button'));
    cancel.isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
        return next(new Error('X button not found on create channel card'))
      }
      cancel.click()
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