var path = require('path');
module.exports = function(config){
  config.set({

    basePath : '../../../web/',

    files : [
     'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/jquery/dist/jquery.min.js',
      'js/*.js',
      'js/components/**/*.js',
      '../tests/unit/frontend/spec/*.js',
      '../tests/mock-data.js',
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],
    
    reporters: ['progress','junit'],
    
    junitReporter : {
      outputFile: path.join(__dirname, '..', '..', 'unit-frontend-out.xml'),
      suite: ''
    },
    
    hostname: process.env.IP || 'localhost',
    
    port: process.env.PORT || 8000
  });
};
