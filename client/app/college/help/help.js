'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college.help', {
        url: '/aide',
        templateUrl: 'app/college/help/help.html',
        authenticate: true,
        controller: 'HelpCollegeCtrl'
      });
  });
