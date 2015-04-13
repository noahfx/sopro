# Migration

Recommend to use custom cucumber-js reporter: [cucumberjs-junitxml](https://github.com/sonyschan/cucumberjs-junitxml)

More report details. Fewer steps to adapt.

## protractor-cucumber-junit

Converts Protractor Cucumber framework generated JSON output into JUnitXML for software like Jenkins to read.

## Description

Protractor set configuration "resultJsonOutputFile" to be true to save the JSON output of cucumber-js. However the JSON output is not in ideal Cucumber output format. Currently this package only convert this JSON output to be an acceptable JUnitXML for Jenkins to read, please noticed it's not a well defined report yet.

## Install

cucumber-junit should be added to your test codebase as a dev dependency.  You can do this with:

``` shell
$ npm install protractor-cucumber-junit --save-dev 
```

Alternatively you can manually add it to your package.json file:

``` json
{
  "devDependencies" : {
    "protractor-cucumber-junit": "latest"
  }
}
```

then install with:

``` shell
$ npm install --dev
```

## Run

protractor-cucumber-junit will convert your protractor cucumber test result to JUnitXML

``` shell
$ cat tests/features/cucumber_report.json | ./node_modules/.bin/cucumber-junit > tests/features/cucumber_report.xml
```

## License

[MIT](http://opensource.org/licenses/MIT)
