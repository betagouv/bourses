'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.merci', {
        url: '/merci',
        templateUrl: 'app/merci/merci.html',
        controller: function($scope, $http, store) {
          $scope.email = store.get('identite-adulte').email;

          var etablissementId = store.get('identite-enfant').college;

          $http.get('/api/etablissements/byId/' + etablissementId).then(function(result) {
            $scope.etablissement = result.data;
          });

          $scope.clean = function() {
            store.set('identite-enfant', {});
            store.set('steps', {});
          };
        }
      });
  });
