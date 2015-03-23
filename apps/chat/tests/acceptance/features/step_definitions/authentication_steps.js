var protractorHelpers = require('../../../protractorHelpers.js')(browser,element);

var authentication_steps = module.exports = function() {

  this.Given(/^I have not configured Society Pro to use an authentication application$/,function (next) {
    protractorHelpers.getFeaturesConfig()
    .then(function(result){
      console.log(result);
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

  this.When(/^I connect to the Society Pro server$/, function (next) {
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
  });

  this.Then(/^the session is authenticated against a Society Pro database of user credentials$/, function (next) {
    if (this.client && this.client.pair.cleartext.getPeerCertificate()) {
      next();
    } else {
      next.fail("No peer Certificate");
    }
  });
}