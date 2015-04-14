var cwd = process.cwd();
var correctDir = !!cwd.match(/chat$/);

if(!correctDir){
  console.log('Sorry, the jasmine unit tests only work if process.cwd() is apps/chat');
  console.log('Try running: npm run unit-backend');
  process.exit(1);
}

var path = require('path');
var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var reporters = require('jasmine-reporters');

jasmine.loadConfigFile(path.join(__dirname, 'spec', 'support', 'jasmine.json'));

var junitReporter = new reporters.JUnitXmlReporter({
  savePath: path.join(__dirname, '..'),
  consolidate: true,
  consolidateAll: true,
  filePrefix: 'junit-unit-backend',
});

jasmine.addReporter(junitReporter);
jasmine.execute();
console.log('Running tests...');