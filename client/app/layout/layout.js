'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('layout', {
        url: '/',
        templateUrl: 'app/layout/layout.html',
        abstract: true
      });
  });
