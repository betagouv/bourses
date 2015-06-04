'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: function($scope, Auth) {
          $scope.isLoggedIn = Auth.isLoggedIn;
        },
        abstract: true
      });
  });
