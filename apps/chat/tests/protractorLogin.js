module.exports = function (browser, element) {

  var login = {}
  login.changeIdentity = changeIdentity;

  function changeIdentity (i) {  
    var Q = require('q');
    var fs = require('fs');
    var user1 = fs.readFileSync("couchdb/mocks/user1.json", 'utf8');
    var user2 = fs.readFileSync("couchdb/mocks/user2.json", 'utf8');
    var defer = Q.defer();
    browser.get("/")
    .then(function(){
      element(by.css("body")).getAttribute('data-soproenv')
      .then(function (env) {
        if (env == "standard") {
          element(by.css("#role-selection")).click()
          .then(function () {
            element.all(by.repeater('role in roles')).get(i).click()
            .then(function () {
              defer.resolve();
            });  
          });
        } else {
          browser.getCurrentUrl()
          .then(function (url) {
            var fillForm = function () {
              var user = (i == 0)? user1 : user2;
              var d = "\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b";
              var u = JSON.parse(user);
              element(by.css('#main-stage > form > label:nth-child(1) > input[type="text"]'))
              .sendKeys(d+u.username)
              .then(function () {
                element(by.css('#main-stage > form > label:nth-child(2) > input[type="text"]'))
                .sendKeys(d+"password")
                .then(function () {
                  element(by.css('#main-stage > form > input[type="submit"]'))
                  .click()
                  .then(function () {
                    defer.resolve();
                  });
                });
              });    
            }
            if (url.indexOf("login") == -1) { // if url not contains 'login'
              browser.get("/logout")
              .then(function () {
                fillForm();
              })
            } else {
              fillForm();
            }
          });
          
        }
      });
    });
    return defer.promise;
  }

  return login;
}