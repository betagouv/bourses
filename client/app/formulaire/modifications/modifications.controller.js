'use strict';

angular.module('boursesApp')
  .controller('ModificationsCtrl', function($scope, $http, $state, store) {
    $scope.data = store.get('svair-data');
    $scope.identite = store.get('identite-adulte');
    $scope.cities = [$scope.identite.ville];

    function refreshCities(changeSelection) {
      $http.get('/api/communes/' + $scope.identite.codePostal)
        .then(function(result) {
          $scope.cities = result.data;
          if (changeSelection) {
            $scope.identite.ville = $scope.cities[0];
          }
        }, console.error.bind(console)
        ).finally(function() {
          $scope.retrievingCities = false;
        });
    }

    if ($scope.identite.codePostal) {
      refreshCities();
    }

    $scope.updateCities = function updateCities() {
      $scope.retrievingCities = true;
      refreshCities(true);
    };

    $scope.submit = function() {
      store.set('identite-adulte', $scope.identite);
    };
  });
