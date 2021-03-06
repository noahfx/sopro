exports.config = {
  allScriptsTimeout: 60000,

  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'specs/*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'https://localhost/',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000,
    print: function() {},
  },

  onPrepare: function() {
    var jasmineReporters = require('jasmine-reporters');
    var jUnitXmlReporter = new jasmineReporters.JUnitXmlReporter({
      savePath: "tests/gui/",
      filePrefix: 'test-out',
      consolidateAll: true,
    })
    jasmine.getEnv().addReporter(jUnitXmlReporter);
    
    var SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: false,
      displayPendingSpec: true,
    }));
  }
};
