var CAM_MOCKS = require('../../../common/mock-data.js');
var SSTEPS = require('../../shared_steps.js');
var assert = require('assert');

module.exports = function () {
	this.Given(SSTEPS.viewingListOfChannels.regex, SSTEPS.viewingListOfChannels.fn);

	this.When(/^I click on a channel item$/, function (next) {
		element.all(by.css("#collection-channels .channel-item"))
		.get(0)
		.click()
		.then(function(){setTimeout(next,1500)});
	});

	this.Then(/^I should see the channel history displayed on the main stage$/, function (next) {
		element.all(by.css("#messages-container"))
		.isDisplayed()
		.then(function (isDisplayed) {
			assert(isDisplayed);
			next();
		});
	});
};