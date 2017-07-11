'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout', {
        url: '',
        controller: function($scope, Auth) {
          $scope.isLoggedIn = Auth.isLoggedIn;
          $scope.isAdmin = Auth.isAdmin;
        },

        templateUrl: 'app/layout/layout.html',
        abstract: true
      });
  });
