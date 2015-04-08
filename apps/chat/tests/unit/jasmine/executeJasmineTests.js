var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var reporters = require('jasmine-reporters');
jasmine.loadConfigFile('./spec/support/jasmine.json');
var junitReporter = new reporters.JUnitXmlReporter({
  //savePath: path.join(__dirname, 'test-unit-backend-out.xml'),
  savePath: '..',
  consolidate: true,
  consolidateAll: true,
  filePrefix: 'jasmine-unit'
});
jasmine.addReporter(junitReporter);
jasmine.execute();