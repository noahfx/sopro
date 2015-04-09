var xml = require('xml');

/**
 * Convert a step from Cucumber.JS into <testcase> XML
 *
 * @method convertStep
 * @param  {Object}    stepJson     Step output from Cucumber.JS
 * @param  {Object}    scenarioJson Scenario output from Cucumber.JS
 * @return {Array}                  Array of elements for an XML element <testcase>
 */
function convertStep (stepJson, scenarioJson) {
    var stepOutput = [{
            _attr: {
                name: stepJson.description,
                classname: ''
            }
        }];

    if (stepJson.duration) {
        // Convert from nanosecond to seconds
        stepOutput[0]._attr.time = stepJson.duration / 1000000000;
    }
    
    if (stepJson.assertions.length > 0) {
        var lastAssert = stepJson.assertions.length - 1;

        switch (stepJson.assertions[lastAssert].passed) {
            case 'true':
            case true:               
                break;
            case 'false':
            case false:
                stepOutput.push({
                    error: [
                        {
                            _attr: {
                                message: stepJson.assertions[lastAssert].errorMsg.split("\n").shift()
                            }
                        }, stepJson.assertions[lastAssert].errorMsg
                    ]
                });
                break;
            case 'skipped':
            case 'undefined':
                stepOutput.push({
                    skipped: [
                        {
                            _attr: {
                                message: ""
                            }
                        }
                    ]
                });
                break;
        }
    }
    
    return stepOutput;
}


/**
 * Convert a scenario from Cucumber.JS into an XML element <testsuite>
 *
 * @method convertScenario
 * @param  {Object}    scenarioJson Scenario output from Cucumber.JS
 * @return {Array}                  Array of elements for an XML element <testsuite>
 */
function convertScenario (scenarioJson) {
    var scenarioOutput = [{
            _attr: {
                name: scenarioJson.description,
                tests: 0,
                failures: 0,
                skipped: 0
            }
        }];
    if(scenarioJson) {
        scenarioJson.forEach(function (stepJson, index) {
            var testcase = convertStep(stepJson, scenarioJson);
            // Check for errors and increment the failure rate
            if (testcase[1] && testcase[1].error) {
                scenarioOutput[0]._attr.failures += 1;
            }
            if (testcase[1] && testcase[1].skipped) {
                scenarioOutput[0]._attr.skipped += 1;
            }
            scenarioOutput[0]._attr.tests += 1;
            scenarioOutput.push({ testcase: testcase });
        });
    }

    scenarioOutput[0]._attr.name = '1) functional test';
    return { testsuite: scenarioOutput };
}

/**
 * [convertFeature description]
 * @method convertFeature
 * @param  {[type]}       featureJson [description]
 * @return {[type]}                   [description]
 */
function convertFeature(featureJson) {
    return convertScenario(featureJson);
}

/**
 * [exports description]
 * @method exports
 * @param  {[type]} cucumberRaw [description]
 * @return {[type]}             [description]
 */
function cucumberJunit (cucumberRaw) {
    var cucumberJson,
        output = [];

    if (cucumberRaw && cucumberRaw.toString().trim() !== '') {
        cucumberJson = JSON.parse(cucumberRaw);
        //cucumberJson.forEach(function (featureJson) {
        output = output.concat(convertFeature(cucumberJson));
        //});

        // If no items, provide something
        if (output.length === 0) {
            output.push( { testsuite: [] } );
        }
    }

    // wrap all <testsuite> elements in <testsuites> element
    return xml({ testsuites: output }, { indent: '    ' });
};

module.exports = cucumberJunit;
