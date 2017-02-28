'use strict';

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'client/lib/angular/angular.min.js',
      'client/lib/angular/angular-locale_fr-fr.js',
      'client/lib/angular/angular-aria.min.js',
      'client/lib/angular/angular-cookies.min.js',
      'client/lib/angular/angular-messages.min.js',
      'client/lib/angular/angular-resource.min.js',
      'client/lib/angular/angular-sanitize.min.js',
      'client/lib/angular-ui-router/angular-ui-router.min.js',
      'client/lib/a0-angular-storage/angular-storage.min.js',
      'client/lib/ui-bootstrap/ui-bootstrap-custom-tpls-2.1.3.min.js',
      'client/lib/angular-chart.js/Chart.min.js',
      'client/lib/angular-chart.js/angular-chart.min.js',
      'client/lib/jquery/jquery.min.js',
      'client/lib/lodash/lodash.min.js',
      'client/lib/moment/moment.min.js',
      'client/lib/moment/fr.js',
      'client/lib/ladda/angular-ladda.min.js',
      'client/lib/ladda/ladda.min.js',
      'client/lib/ladda/spin.min.js',
      'client/lib/angular-xeditable/xeditable.min.js',
      'client/lib/angular-capitalize-filter/capitalize.min.js',
      'client/lib/ng-iban/ng-iban.min.js',
      'client/lib/angular/angular-mocks.js',
      'client/app/app.js',
      'client/app/**/*.js',
      'client/components/**/*.js',
      'client/app/**/*.html',
      'client/components/**/*.html'
    ],

    preprocessors: {
      '**/*.html': 'html2js'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
