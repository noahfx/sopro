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

  this.Then(/^I should see a channel creation card$/, function (next) {
    var channelCreationCard = element(by.css('#card-create-channel'));
    channelCreationCard.isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
        return next(new Error('Can\'t find the channel creation card'));
      }
      next();
    })
  });

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
  this.Given(SSTEPS.viewingListOfChannels.regex, SSTEPS.viewingListOfChannels.fn);
  this.Given(/^there is an open "create" card on the main stage$/, function(next){
    var creationCard = element.all(by.css('#main-stage .creation-card'));
    creationCard.count()
    .then(function(count){
      if(count === 0){
        clickAddChannelButton(next)
        //next(new Error('No creation cards found on main stage.'))
      } else if (count > 1){
        next(new Error('More than one creation cards found on main stage.'))
      } else {
        next();
      }
     })
  });

  this.When(/^I select "\+ Add Channel"$/, clickAddChannelButton)

  this.Then(/^the open "create" card should close$/, function(next){
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

}