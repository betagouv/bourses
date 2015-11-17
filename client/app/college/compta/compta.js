'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college.compta', {
        url: '/compta',
        templateUrl: 'app/college/compta/compta.html',
        authenticate: true,
        controller: 'ComptaCollegeCtrl'
      });
  });
