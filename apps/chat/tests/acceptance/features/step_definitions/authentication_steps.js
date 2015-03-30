var protractorHelpers = require('../../../protractorHelpers.js')(browser,element);
var fs = require('fs');

var authentication_steps = module.exports = function() {

  this.Given(/^I have not configured Society Pro to use an authentication application$/,function (next) {
    protractorHelpers.getFeaturesConfig()
    .then(function(result){
      var cfg;
      try{
        cfg = {
          useLDAP: result.ee.useLDAP,
          useActiveDirectory: result.ee.useActiveDirectory,
        }
      } catch(e){
        console.log(e);
        return next.fail(new Error('Could not load config'))
      }
      if(cfg.useLDAP || cfg.useActiveDirectory){
        console.log('Skipping auth checks because you are using an auth application');
        return next.pending()
      }
      next();
    }, function(err){
      next.fail(new Error(err));
    })
  });

  this.When(/^I login to the Society Pro server$/, function (next) {
    protractorHelpers.changeIdentity(0)
    .then(next);
/*
    var request = require('request');
    var self = this;
    request.get('https://localhost/', {
      strictSSL: false,
      followRedirect: true,
    }, function(err, res, body){
      if(err){
        console.log(err);
      }
      self.client = res.client;
      next();
    });
*/
  });


  this.Then(/^the session is authenticated against local Society Pro users$/, function (next) {
    element(by.css('body'))
    .getAttribute('data-currentuser')
    .then(function(userJSON){
      var actualUser = JSON.parse(userJSON);
      var expectedUser = JSON.parse(
        fs.readFileSync('./couchdb/mocks/user1.json')
      );
      if(actualUser._id === undefined || expectedUser._id === undefined){
        return next.fail('Got an undefined _id');
      }
      if(actualUser._id === expectedUser._id){
        return next();
      } else {
        return next.fail('Expected '+expectedUser._id+', got '+actualUser._id);
      }

    })
  });
}