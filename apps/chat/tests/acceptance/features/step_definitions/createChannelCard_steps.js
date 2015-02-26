var CAM_MOCKS = require('../../../mock-data.js');
var SSTEPS = require('../../shared_steps.js');
module.exports = function(){
/*
 * Scenario:
 * opening the channel creation card
 */
  this.Given(SSTEPS.appStarted.regex, SSTEPS.appStarted.fn);

  this.Given(SSTEPS.viewingListOfChannels.regex, SSTEPS.viewingListOfChannels.fn);

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

  this.When(/^I select "\+ Add Channel"$/, clickAddChannelButton)


function checkCardPresence (arg1, next) {
  var cardExpected = 
  arg1 === undefined
  ? true
  : false;

  var channelCreationCard = element(by.css('#card-create-channel'));
  channelCreationCard.isDisplayed()
  .then(function(isDisplayed){
    if(isDisplayed === cardExpected){
      return next();
    } else {
      if(!cardExpected){
        return next(new Error('Found an unexpected channel creation card'));
      } else {
        return next(new Error('Did not find an expected channel creation card'));
      }
    }
  })
}

  this.Then(/^I should( not)? see a channel creation card$/, checkCardPresence);

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

/*
 * Scenario:
 * closing open create/add cards when "+ add a channel" is clicked
 */
  this.Given(SSTEPS.viewingListOfChannels.regex,
             SSTEPS.viewingListOfChannels.fn);

  this.Given(/^there is an open "create channel" card on the main stage$/,
    ensureChannelCreationCard);

  this.When(/^I select "\+ Add Channel"$/, clickAddChannelButton)

  this.Then(/^the open "create channel" card should close$/, function(next){
    var creationCard = element.all(by.css('#main-stage .creation-card'));
    creationCard.count()
    .then(function(count){
      if(count === 0){
        next()
      } else {
        next(new Error('Creation card found on main stage.'));
      }
    })
  });


/*
 * Scenario:
 * Scenario: submiting the create channel form
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

  this.Then(/^I should( not)? see a channel creation card$/, checkCardPresence);
  this.Then(/^I should see a channel card for that channel$/, function(next){
    var channelCards = element.all(by.css('#main-stage .sopro-card.channel-card'))
    channelCards
    .count()
    .then(function(count){
      if(count === 0){
        return next(new Error('Zero channel cards found after creation'))
      } else {
        channelCards
        .get(0)
        .element(by.css('.card-content .title'))
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
  });

/*
  this.Then(/^the channel creation card should become a new channel history card$/, function(next){
    next()
  });
*/

  this.Then(/^the new channel should be POSTed via the API$/, function(next){

    next()
  });


}