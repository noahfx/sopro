module.exports = function(config){
  config.set({

    files : [
      './karma/*.js'
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
      outputFile: './karma-unit.xml',
      suite: ''
    },
    
    hostname: process.env.IP || 'localhost',
    
    port: process.env.PORT || 8080
  });
};
