'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.merci', {
        url: '/merci',
        templateUrl: 'app/merci/merci.html',
        controller: function($scope, $http, store) {
          $scope.email = store.get('identite-adulte').email;

          var identite = store.get('identite-enfant');
          var etablissementId = identite.college;
          $scope.cantine = identite.college && identite.regime === 'demi-pensionnaire' && identite.cantine === true;

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
