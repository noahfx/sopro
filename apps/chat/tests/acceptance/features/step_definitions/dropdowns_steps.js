var CAM_MOCKS = require('../../../common/mock-data.js');
var SSTEPS = require('../../shared_steps.js');



module.exports = function(){

function textCorrect(isSecond, isNested, text){
  var names = {
    p1: "CHANNELS",
    p2: "MEMBERS",
    n1: CAM_MOCKS.getChannelsResponse2.channels[0].name.toUpperCase(),
    n2: CAM_MOCKS.getChannelsResponse2.channels[1].name.toUpperCase(),
  }
  var name;
  if(!isSecond){
    if(!isNested){
      name = names.p1;
    } else {
      name = names.n1
    }
  } else {
    if(!isNested){
      name = names.p2;
    } else {
      name = names.n2
    }
  }
  return name === text;
}

function findPOOCSS(isSecond, isNested){
  var css;
  if(!isSecond){
    if(!isNested){ // first non-nested POO
      css = "#collection-channels .sopro-more-channels";
    } else { // first nested POO
      css = "sopro-collections-dropdown .dropdown-item:first-child";
    }
  } else {
    if(!isNested){ // second non-nested POO
      css = "#collection-peers .sopro-more-channels";
    } else {
      css = "sopro-collections-dropdown .dropdown-item:nth-child(2)";
    }
  }
  return css;
}

function findDropdownCSS(isSecond, isNested){
  var css;
  if(!isSecond){
    if(!isNested){ // first non-nested dropdown
      css = "sopro-collections-dropdown .sopro-dropdown-title";
    } else { // first nested dropdown
      css = "sopro-subscribers-dropdown .sopro-dropdown-title";
    }
  } else {
    if(!isNested){ // second non-nested dropdown
      css = "sopro-collections-dropdown .sopro-dropdown-title";
    } else {
      css = "sopro-subscribers-dropdown .sopro-dropdown-title";
    }
  }
  return css;
}

//     /^I have a( second)?( nested)? point of origin visible$/
function POOVisible(arg1, arg2, next){
  var isSecond = arg1 ? true : false;
  var isNested = arg2 ? true : false;
  var css = findPOOCSS(isSecond, isNested);

  element(by.css(css))
  .getText()
  .then(function(isDisplayed){
    if(isDisplayed){
      return next();
    } else {
      var str1 = isSecond ? "second" : "first";
      var str2 = isNested ? "nested" : "primary";
      return next.fail(new Error('Failed to find an expected '+str1+' '+str2+' point of origin'))
    }
  });
}

//  /^I click the( second)?( nested)? point of origin$/

function clickPOO(arg1, arg2, next){
  var isSecond = arg1 ? true : false;
  var isNested = arg2 ? true : false;
  var css = findPOOCSS(isSecond, isNested);

  element(by.css(css))
  .click()
  .then(function(){
    return next();
  });
}

//   /^the( second)?( nested)? dropdown is already visible$/,
function ensureDropdownIsVisible(arg1, arg2, next){
  var isSecond = arg1 ? true : false;
  var isNested = arg2 ? true : false;
  openDropdown(isSecond, isNested, next);

}

function openDropdown(isSecond, isNested, next){
//  var css = findPOOCSS(isSecond, isNested);
  function delay(callback){
    setTimeout(callback, 1000);
  }
  if(!isSecond){
    if(!isNested){
      // open the first primary dropdown
      var css = findPOOCSS(false, false);
      element(by.css(css))
      .click()
      .then(delay(next))
    } else {
      // start by opening the first primary dropdown:
      var css = findPOOCSS(false, false);
      element(by.css(css))
      .click()
      .then(delay(function(){
        // continue by opening the first nested dropdown:
        var css = findPOOCSS(false, true);
        element(by.css(css))
        .click()
        .then(delay(next));
      }));
    }
  } else {
    if(!isNested){
      // open the second primary dropdown
      var css = findPOOCSS(true, false);
      element(by.css(css))
      .click()
      .then(delay(next));
    } else {
      // start by opening the second primary dropdown:
      var css = findPOOCSS(true, false);
      element(by.css(css))
      .click()
      .then(delay(function(){
        // continue by opening the second nested dropdown:
        var css = findPOOCSS(true, true);
        element(by.css(css))
        .click()
        .then(delay(next));
      }));
    }
  }
}

//  /^Then the( second)?( nested)? dropdown is( not)? visible$/
function isDropdownVisible(arg1, arg2, arg3, next){
  var isSecond = arg1 ? true : false;
  var isNested = arg2 ? true : false;
  var isExpected = arg3 ? false : true;

  // Identify which element is relevant:
  var css = findDropdownCSS(isSecond, isNested);

  // Special case: If the element should not be here, we don't want to try and access it or we will error.
  if(!isExpected){
    element.all(by.css(css))
    .count()
    .then(function(count){
      if(count !== 0){
        element.all(by.css(css))
        .get(0)
        .getText()
        .then(function(text){
          if(!textCorrect(isSecond, isNested, text)){
            // Found some other element
            return next();
          } else {
            return next.fail(new Error('Found an unexpected dropdown'));
          }
        })
      } else {
        return next();
      }
    })
  } else {
    // Look for a title element that matches the expected name.
    element.all(by.css(css))
    .get(0)
    .getText()
    .then(function(text){
      if(!textCorrect(isSecond, isNested, text)){
        return next.fail(new Error('Did not find an expected dropdown'))
      } else {
        return next();
      }
    })
    
  }
}


/*
 * Scenario: Opening a dropdown
 */
  this.Given(SSTEPS.appStarted.regex,
    SSTEPS.appStarted.fn);

  this.Given(SSTEPS.viewingListOfChannels.regex,
    SSTEPS.viewingListOfChannels.fn);

  this.Given(/^I have a( second)?( nested)? point of origin visible$/,
    POOVisible);

  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOO);

  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Clicking the same point of origin with an open dropdown
 */
  this.Given(/^I have a( second)?( nested)? point of origin visible$/,
    POOVisible);
  this.Given(/^the( second)?( nested)? dropdown is already visible$/,
    ensureDropdownIsVisible);
  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOO);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Clicking a different point of origin with an open dropdown
 */
  this.Given(/^I have a( second)?( nested)? point of origin visible$/,
    POOVisible);
  this.Given(/^the( second)?( nested)? dropdown is already visible$/,
    ensureDropdownIsVisible);
  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOO);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Closing a dropdown by clicking outside it
 */
  this.Given(/^the( second)?( nested)? dropdown is already visible$/,
    ensureDropdownIsVisible);

  this.When(/I click somewhere other than the dropdown or a point of origin$/, function(next){
    element(by.css('body'))
    .click()
    .then(function(){
      next();
    })
  })
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Opening a nested dropdown
 */
  this.Given(/^the( second)?( nested)? dropdown is already visible$/,
    ensureDropdownIsVisible);
  this.Given(/^I have a( second)?( nested)? point of origin visible$/,
    POOVisible);
  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOO);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Opening a second primary dropdown while a primary and nested dropdown are shown
 */
  this.Given(/^the( second)?( nested)? dropdown is already visible$/,
    ensureDropdownIsVisible);
  this.Given(/^the( second)?( nested)? dropdown is already visible$/,
    ensureDropdownIsVisible);
  this.Given(/^I have a( second)?( nested)? point of origin visible$/,
    POOVisible);
  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOO);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Opening a second nested dropdown while a primary and nested dropdown are shown
 */
  this.Given(/^the( second)?( nested)? dropdown is already visible$/,
    ensureDropdownIsVisible);
  this.Given(/^the( second)?( nested)? dropdown is already visible$/,
    ensureDropdownIsVisible);
  this.Given(/^I have a( second)?( nested)? point of origin visible$/,
    POOVisible);
  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOO);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Closing a nested dropdown but not the primary dropdown
 */
  this.Given(/^the( second)?( nested)? dropdown is already visible$/,
    ensureDropdownIsVisible);
  this.Given(/^the( second)?( nested)? dropdown is already visible$/,
    ensureDropdownIsVisible);
  this.Given(/^I have a non-point-of-origin visible within the dropdown$/, function(next){
    element(by.css('sopro-collections-dropdown .sopro-dropdown-title'))
    .isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
        return next.fail('Could not find the non-point-of-origin dropdown title');
      } else {
        return next();
      }
    })
  });

  this.When(/^I click the non-point-of-origin$/, function(next){
    element(by.css('sopro-collections-dropdown .sopro-dropdown-title'))
    .click()
    .then(function(){
      return next();
    })
  });
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

}; // end module.exports