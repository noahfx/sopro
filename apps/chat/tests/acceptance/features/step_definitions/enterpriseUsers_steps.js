var CAM_MOCKS = require('../../../mock-data.js');
var changeIdentity = require('../../../protractorLogin.js')(browser,element).changeIdentity;
var fs = require('fs');

var enterpriseUsers_steps = module.exports = function() {

  this.Given(/^I am using the Society Pro enterprise edition$/,function (next) {
    browser.get("/")
    .then(function(){
      element(by.css("body")).getAttribute('data-soproenv')
      .then(function (env) {
        console.log(env);
        if (env == "enterprise") {
          next();      
        } else {
          next.pending();
        }
      });
    });
  });

  this.When(/^I launch the application$/, function (next) {
    browser.get("/")
    .then(function(err){
      if (err) {
        console.log(err);
        next.fail(new Error(err));
      } else {
        next(); 
      }
    });
  });

  this.When(/^I authenticate$/, function (next) {
    changeIdentity(0)
    .then(function (err) {
      if (err) {
        console.log(err);
        next.fail(new Error(err));
      } else {
        next(); 
      }
    });
  });

  this.Then(/^the application should use the default role for my user$/, function (next) {
    element(by.css("#role-selection")).getAttribute("data-currentuser")
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
  })
}