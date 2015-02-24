exports.config = {
  allScriptsTimeout: 60000,

  //seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'specs/*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8080/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  onPrepare: function() {
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter("tests/gui/",true,true,"test-out",true));
  }
};
