module.exports = function JsonOutputHook() {
  var Cucumber = require('cucumber');
  var JsonFormatter = Cucumber.Listener.JsonFormatter();
  var fs = require('fs');

  JsonFormatter.log = function (json) {
    fs.writeFile('tests/acceptance/cucumber.json', json, function (err) {
      if (err) throw err;
      console.log('json file location: tests/acceptance/cucumber.json');
    });
  };

  this.registerListener(JsonFormatter);
};