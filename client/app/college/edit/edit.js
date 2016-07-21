'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.college.edit', {
        url: '/edit',
        templateUrl: 'app/college/edit/edit.html',
        authenticate: true,
        controller: 'EditCollegeCtrl'
      });
  });
