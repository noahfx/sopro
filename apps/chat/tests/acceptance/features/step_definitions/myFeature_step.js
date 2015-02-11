var sharedSteps = module.exports = function(){

  this.Given(/^I have downloaded the Society Pro source code$/, function (next) {
    next();
  });

  this.When(/^I list the source files$/, function (next) {
    next();
  })

  this.Then(/^I should see a file named CHANGELOG.md$/, function (next) {
    next();
  });
}