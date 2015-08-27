'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout', {
        url: '',
        controller: function($scope, store, $timeout) {
          angular.element(document).ready(function() {
            $timeout(function() {
              $scope.showIntro = !store.get('hideIntro');
            }, 500);
          });

          $scope.hideIntro = function() {
            $scope.showIntro = false;
            store.set('hideIntro', true);
          };
        },

        templateUrl: 'app/layout/layout.html',
        abstract: true
      });
  });
