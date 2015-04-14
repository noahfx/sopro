module.exports = function JsonOutputHook() {
  var Cucumber = require('cucumber');
  var JsonFormatter = Cucumber.Listener.JsonFormatter();
  var fs = require('fs');

  JsonFormatter.log = function (json) {
    fs.writeFile('tests/acceptance/cucumberReport.json', json, function (err) {
      if (err) throw err;
      console.log('json file location: tests/acceptance/cucumberReport.json');
    });
  };

  this.registerListener(JsonFormatter);
};