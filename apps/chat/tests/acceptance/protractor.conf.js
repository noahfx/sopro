exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',
  
  resultJsonOutputFile: 'tests/acceptance/report.json',
  
  specs: [
    'features/*.feature'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'https://localhost/',

  framework: 'cucumber',

};