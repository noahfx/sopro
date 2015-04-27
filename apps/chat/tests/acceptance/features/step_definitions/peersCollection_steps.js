var CAM_MOCKS = require('../../../common/mock-data.js');
var SSTEPS = require('../../shared_steps.js');

var peersCollection_steps = module.exports = function(){
  this.Given(SSTEPS.roleHasPeers.regex, SSTEPS.roleHasPeers.fn);
  this.When(SSTEPS.roleChosen.regex, SSTEPS.roleChosen.fn);
  this.Then(/^I should see a collection of peer channels$/, function (next) {
    browser.element(by.css("#collection-peers"))
    .isDisplayed()
    .then(function (isDisplayed) {
      if (isDisplayed) {
        next();
      } else {
        next.fail(new Error("Peers Channel Collection is not displayed"));
      }
    })

  });
}