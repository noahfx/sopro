var channelsList_steps = module.exports = function(){
  this.World = require("../support/world.js").World;

  this.Given(/^I have started the chatlog application$/, function (next) {
    this.visit('localhost:8080/', next);
    next();
  });

  this.When(/^I choose a role$/, function (next) {
    console.log(this.browser.text('title'));
    next();
  })

  this.Then(/^the response should contain a list of channels for that role$/, function (next) {
    next();
  })
}