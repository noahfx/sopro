var CAM_MOCKS = require('../../../mock-data.js');
var S_STEPS = require('../../shared_steps.js');
var protractorHelpers = require('../../../protractorHelpers.js')(browser,element);
var fs = require('fs');
var assert = require('assert');

var enterpriseUsers_steps = module.exports = function() {

  this.Given(S_STEPS.usingEE.regex,
    S_STEPS.usingEE.fn)

  this.When(/^I launch the application$/, function (next) {
    browser.get("/login")
    .then(function(err){
      if (err) {
        console.log(err);
        next.fail(new Error(err));
      } else {
        next(); 
      }
    });
  });

  this.When(S_STEPS.iAuthenticate.regex,
    S_STEPS.iAuthenticate.fn);

  this.Then(/^the application should use the default role for my user$/, function (next) {
    element(by.css("body")).getAttribute("data-currentuser")
    .then(function (currentUserJSON) {
      var currentUser = JSON.parse(currentUserJSON);
      var expectedIdentity = JSON.parse(
        fs.readFileSync("./couchdb/mocks/identity1.json", 'utf8')
      );
      if (currentUser.identities.length === 1) {
        next();
        if (currentUser.identities[0].identityid === expectedIdentity.identityid) {
          next();
        } else {
          next.fail(new Error("Wrong default role ("+currentUser.identities[0].identityid+") for user."));
        }
      } else {
        next.fail(new Error("Multiple roles attached to user"));
      }
      //expect(currentUser.identities.length).toEqual(1);
      //expect(currentUser.identities[0].identityid).toEqual(expectedIdentity.identityid);
    })
  });

  this.When(/^I click the toolbar dropdown button associated with my username$/, function (next) {
    browser.element(by.css("#role-selection")).click()
    .then(function () {
      next();
    });
  });

  this.Then(/^I should not see multiple roles listed$/, function (next) {
    browser.element.all(by.css(".sopro-role-item"))
    .count()
    .then(function (count) {
      assert(count === 0);
      next();
    });
  });
}