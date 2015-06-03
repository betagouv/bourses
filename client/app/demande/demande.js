'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.demande', {
        url: '',
        templateUrl: 'app/demande/demande.html',
        controller: function($scope) {
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
