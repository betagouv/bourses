'use strict';

angular.module('boursesApp')
  .controller('ModificationsCtrl', function($scope, $http, $state, store) {
    $scope.data = store.get('svair-data');
    $scope.identite = store.get('identite-adulte');

    function refreshCities() {
      $http.get('/api/communes/' + $scope.identite.codePostal)
        .then(function(result) {
          $scope.cities = result.data;
          $scope.identite.ville = $scope.cities[0];
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
        refreshCities();
    };

    $scope.submit = function() {
      store.set('identite-adulte', $scope.identite);
    };
  });
