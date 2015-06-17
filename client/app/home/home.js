'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('layout.home', {
        url: '',
        templateUrl: 'app/home/home.html'
      });
  });
