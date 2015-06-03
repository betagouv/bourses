'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '',
        templateUrl: 'app/main/main.html',
        controller: function($scope, Auth) {
          $scope.isLoggedIn = Auth.isLoggedIn;
          $scope.submit = function(form) {
            if (form.$valid) {
              console.log('Valide !');
            } else {
              console.log('Pas valide !');
            }
          };
        }
      });
  });
