'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.merci', {
        url: '/merci',
        templateUrl: 'app/merci/merci.html',
        controller: function($scope, store) {
          $scope.clean = function() {
            store.set('identite-enfant', {});
            store.set('steps', {});
          };
        }
      });
  });
