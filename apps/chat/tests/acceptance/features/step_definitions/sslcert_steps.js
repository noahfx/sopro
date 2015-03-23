var serverConfig = require('../../../../cfg/servers.js');

module.exports = function(){
 /*
  *  Scenario: SSL certificate
  */
  this.Given(/^I have an SSL certificate$/, function(next){
    var fingerprint;
    try {
      fingerprint = serverConfig.express.sslOptions.fingerprint;
    } catch(e){
      console.log('No SSL certificate available. Skipping SSL tests.')
      return next.pending()
    }
    this.expectedFP = fingerprint;
    next();
  });


  this.When(/^Society Pro is configured to use that certificate$/, function(next){
    var sslEnabled;;
    try {
      sslEnabled = serverConfig.express.sslEnabled;
    } catch(e){
      console.log('sslEnabled not configured. Skipping SSL tests.')
      return next.pending()
    }
    if(sslEnabled){
      return next();
    } else {
      console.log('sslEnabled false. Skipping SSL tests.')
      return next.pending();
    }
  });

  this.Then(/^users will receive that certificate when connecting to Society Pro over https$/, function(next){
    var self = this;
    this.soproRequest('https://localhost', function(err, res, body){
      if(err){
        next.fail(new Error(err));
      }
      if(res.client.pair){
        var cert = res.client.pair.cleartext.getPeerCertificate();
        self.actualFP = cert.fingerprint;
        if(self.actualFP === self.expectedFP){
          return next();
        } else {
          next.fail(new Error('Found an SSL keypair with the wrong fingerprint'))
        }
      } else {
        next.fail(new Error('Did not find an SSL keypair in the response.'))
      }

    })
  })

 /*
  *  Scenario: redirection to SSL/TLS
  */
  this.Given(/^I am using an application capable of http requests$/, function(next){
    // this.soproRequest defined in World.js
    next();
  });

  this.When(/^I connect to the Society Pro server with http$/, function(next){
    var self = this;
    this.soproRequest('http://localhost:8080', function(err, res, body){
      if(err){
        next.fail(new Error(err));
      }
      self.response = res;
      self.httpsErr = err;
      next();
    })

  });

  this.Then(/^I am redirected to https$/, function(next){
    var protocol = this.response.request.uri.protocol;
    if(protocol === 'https:'){
      return next();
    } else {
      console.log(this.response.request.uri);
      return next.fail(new Error('Received http response; expected https redirection'));
    }
  })

  this.Then(/^the transaction is secured with SSL\/TLS$/, function(next){
    if(this.httpsErr){
      next.fail('Error making https request')
    } else {
      next();
    }
  })
}