var sharedSteps = module.exports = function(){

  this.Given(/^I have downloaded the Society Pro source code$/, function (next) {
    next();
  });

  this.When(/^I list the source files$/, function (next) {
    next();
  })

  this.Then(/^I should see a file named "(.*)"$/, function (file ,next) {
  	var glob = require("glob");

  	glob(file, {}, function (er, files) {
		// files is an array of filenames.
		// If the `nonull` option is set, and nothing
		// was found, then files is ["**/*.js"]
		// er is an error object or null.
		if (er) {
			next.fail(new Error(er));
		} else {
			if (files.length == 0) {
				next.fail(new Error("CHANGELOG not found"));
			} else {
				next();	
			}
		}
	});
  });
}