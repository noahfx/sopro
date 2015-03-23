var authentication_steps = module.exports = function() {

  this.Given(/^I have not configured Society Pro to use an authentication application$/,function (next) {
    next();
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