// features/support/world.js
var CAM_MOCKS = require('../../../common/mock-data.js');
var request = require('request');
var fs = require('fs');

module.exports = function() {
  
  //zombie.localhost('localhost', 8080);
  this.World = function World(callback) {
    var certfile = require('../../../../cfg/servers.js').express.sslOptions.certfile;
    //this.browser = new zombie(); // this.browser will be available in step definitions
    this.soproRequest = request.defaults({
      headers: {
        'token-auth': CAM_MOCKS.validToken,
      },
      strictSSL: false,
      agentOptions: {
        ca: fs.readFileSync(certfile),
        checkServerIdentity: function(name, cert){
          console.log('Assuming valid server certificate');
          return undefined;
        }
      }

    })
    callback(); // tell Cucumber we're finished and to use 'this' as the world instance
  };
}