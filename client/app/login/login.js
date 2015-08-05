'use strict';

angular.module('boursesApp').config(function($stateProvider) {
  $stateProvider
    .state('layout.login', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'LoginCtrl'
    });
});
