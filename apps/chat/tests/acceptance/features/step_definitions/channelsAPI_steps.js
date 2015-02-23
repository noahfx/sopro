var channelsAPI_steps = module.exports = function(){

  this.Given(/^I have a valid authentication token$/, function (next) {
    this.token = "12345";
    next();
  });

  this.When(/^I make the correct GET request to the API server with a role id$/, function (next) {
    this.roleID = "abc";
    next();
  })

  this.Then(/^the response should contain a list of channels for that role$/, function (next) {
    var http = require('http');
    var req = http.request({
      port: 8080,
      method: "GET",
      path: "/channels?userID="+this.roleID,
      headers: {
        'token-auth': this.token
      }
    }, function (res) {
      res.on('data', function (chunk) {
        var response = JSON.parse(chunk);
        if (response.channels != undefined && response.peers != undefined) {
          next();  
        } else {
          next.fail(new Error(response.error));    
        }
        
      });
    });

    req.on('error', function(e) {
      next.fail(new Error(e.message));
    });

    req.end();
  });
}