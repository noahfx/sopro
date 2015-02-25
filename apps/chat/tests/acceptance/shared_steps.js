var CAM_MOCKS = require('../mock-data.js');

module.exports = {
  roleHasPeers: {
    regex: /^a specific role has peers$/,
    fn: function (next) {
      var http = require('http');
      var req = http.request({
        port: 8080,
        method: "GET",
        path: "/channels?userID="+CAM_MOCKS.roleId1,
        headers: {
          'token-auth': CAM_MOCKS.validToken,
        }
      }, function (res) {
        res.on('data', function (chunk) {
          var response = JSON.parse(chunk);
          if (response.peers != undefined) {
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
    }
  },
  roleChosen: {
    regex: /^I choose a( different)? role$/,
    fn: function (arg1, next) {
      var roleIndex =
      (arg1 == undefined)
      ? 0
      : 1
      browser.element(by.css('.role-selection')).click()
      .then(function () {
        browser.element.all(by.repeater('role in roles')).get(roleIndex).click()
        .then(function () {
          next();
        });
      });
    },
  }
}