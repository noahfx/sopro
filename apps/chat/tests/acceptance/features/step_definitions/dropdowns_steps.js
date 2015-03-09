var CAM_MOCKS = require('../../../mock-data.js');
var SSTEPS = require('../../shared_steps.js');



module.exports = function(){

function findPOICSS(isSecond, isNested){
  var css;
  if(!isSecond){
    if(!isNested){ // first non-nested POI
      css = "#collection-channels .sopro-more-channels";
    } else { // first nested POI
      css = "#collection-channels .sopro-channels-overflow .overflow-item:first-child";
    }
  } else {
    if(!isNested){ // second non-nested POI
      css = "#collection-peers .sopro-more-channels";
    } else {
      css = "#collection-peers .sopro-channels-overflow .overflow-item:first-child";
    }
  }
  return css;
}

function findDropdownCSS(isSecond, isNested){
  var css;
  if(!isSecond){
    if(!isNested){ // first non-nested dropdown
      css = "#collection-channels .sopro-channels-overflow";
    } else { // first nested dropdown
      css = "#collection-channels .sopro-channels-overflow .sopro-channels-overflow";
    }
  } else {
    if(!isNested){ // second non-nested dropdown
      css = "#collection-peers .sopro-channels-overflow";
    } else {
      css = "#collection-peers .sopro-channels-overflow .sopro-channels-overflow";
    }
  }
  return css;
}

//     /^I have a( second)?( nested)? point of origin visible$/
function POIVisible(arg1, arg2, next){
  var isSecond = arg1 ? true : false;
  var isNested = arg2 ? true : false;
  var css = findPOICSS(isSecond, isNested);

  element(by.css(css))
  .isDisplayed()
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

function clickPOI(arg1, arg2, next){
  var isSecond = arg1 ? true : false;
  var isNested = arg2 ? true : false;
  var css = findPOICSS(isSecond, isNested);

  element(by.css(css))
  .click()
  .then(function(){
    return next();
  });
}

//   /^the( second)?( nested)? dropdown is visible$/,
function ensureDropdownIsVisible(arg1, arg2, next){
  var isSecond = arg1 ? true : false;
  var isNested = arg2 ? true : false;

  // Identify which element is relevant:
  var css = findDropdownCSS(isSecond, isNested);
  element.all(by.css(css))
  .count()
  .then(function(count){
    if(count === 0){
      openDropdown(isSecond, isNested, next)
    } else if(count === 1){
      return next()
    } else {
      return next.fail(new Error('Found more than one open dropdown'))
    }
  })
}

function openDropdown(isSecond, isNested, callback){
//  var css = findPOICSS(isSecond, isNested);
  if(!isSecond){
    if(!isNested){
      // open the first primary dropdown
      var css = findPOICSS(false, false);
      element(by.css(css))
      .click()
      .then(function(){
        return next();
      });
    } else {
      // start by opening the first primary dropdown:
      var css = findPOICSS(false, false);
      element(by.css(css))
      .click()
      .then(function(){
        // continue by opening the first nested dropdown:
        var css = findPOICSS(false, true);
        element(by.css(css))
        .click()
        .then(function(){
          return next();
        });
      });
    }
  } else {
    if(!isNested){
      // open the second primary dropdown
      var css = findPOICSS(true, false);
      element(by.css(css))
      .click()
      .then(function(){
        return next();
      });
    } else {
      // start by opening the second primary dropdown:
      var css = findPOICSS(true, false);
      element(by.css(css))
      .click()
      .then(function(){
        // continue by opening the second nested dropdown:
        var css = findPOICSS(true, true);
        element(by.css(css))
        .click()
        .then(function(){
          return next();
        });
      });
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
        return next.fail(new Error('Found an unexpected dropdown'));
      } else {
        return next();
      }
    })
  } else {
    // Element is expected to be found. Go ahead and try and access it.
    element.all(by.css(css))
    .get(0)
    .isDisplayed()
    .then(function(isDisplayed){
      if(!isDisplayed){
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
    POIVisible);

  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOI);

  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Clicking the same point of origin with an open dropdown
 */
  this.Given(/^I have a( second)?( nested)? point of origin visible$/,
    POIVisible);
  this.Given(/^the( second)?( nested)? dropdown is visible$/,
    ensureDropdownIsVisible);
  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOI);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Clicking a different point of origin with an open dropdown
 */
  this.Given(/^I have a( second)?( nested)? point of origin visible$/,
    POIVisible);
  this.Given(/^the( second)?( nested)? dropdown is visible$/,
    ensureDropdownIsVisible);
  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOI);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Closing a dropdown by clicking outside it
 */
  this.Given(/^the( second)?( nested)? dropdown is visible$/,
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
  this.Given(/^the( second)?( nested)? dropdown is visible$/,
    ensureDropdownIsVisible);
  this.Given(/^I have a( second)?( nested)? point of origin visible$/,
    POIVisible);
  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOI);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Opening a second primary dropdown while a primary and nested dropdown are shown
 */
  this.Given(/^the( second)?( nested)? dropdown is visible$/,
    ensureDropdownIsVisible);
  this.Given(/^the( second)?( nested)? dropdown is visible$/,
    ensureDropdownIsVisible);
  this.Given(/^I have a( second)?( nested)? point of origin visible$/,
    POIVisible);
  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOI);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Opening a second nested dropdown while a primary and nested dropdown are shown
 */
  this.Given(/^the( second)?( nested)? dropdown is visible$/,
    ensureDropdownIsVisible);
  this.Given(/^the( second)?( nested)? dropdown is visible$/,
    ensureDropdownIsVisible);
  this.Given(/^I have a( second)?( nested)? point of origin visible$/,
    POIVisible);
  this.When(/^I click the( second)?( nested)? point of origin$/,
    clickPOI);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);
  this.Then(/^the( second)?( nested)? dropdown is( not)? visible$/,
    isDropdownVisible);

/*
 * Scenario: Closing a nested dropdown but not the primary dropdown
 */
  this.Given(/^the( second)?( nested)? dropdown is visible$/,
    ensureDropdownIsVisible);
  this.Given(/^the( second)?( nested)? dropdown is visible$/,
    ensureDropdownIsVisible);
  this.Given(/^I have a non-point-of-origin visible within the dropdown$/, function(next){
    element(by.css('#collection-channels .sopro-channels-overflow .sopro-dropdown-title'))
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
    element(by.css('#collection-channels .sopro-channels-overflow .sopro-dropdown-title'))
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