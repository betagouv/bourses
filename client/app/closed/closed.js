'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.closed', {
        url: '/closed',
        templateUrl: 'app/closed/closed.html',
        controller: function($scope, $http, store) {
          var etablissementId = store.get('identite-enfant').college;
          $http.get('/api/etablissements/byId/' + etablissementId).then(function(result) {
            $scope.etablissement = result.data;
          });
        }
      });
  });
