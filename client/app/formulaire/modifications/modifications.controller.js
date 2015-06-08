'use strict';

angular.module('boursesApp')
  .controller('ModificationsCtrl', function($scope, $http, $state, store, DemandeService) {
    $scope.data = store.get('svair-data');
    $scope.identite = store.get('identite-adulte');

    function updateFormValidity(form) {
      if ($scope.cities.length === 0 && form) {
        form.codePostal.$setValidity('notFound', false);
      } else{
        form.codePostal.$setValidity('notFound', true);
      }
    }

    function refreshCities(changeSelection, form) {
      $http.get('/api/communes/' + $scope.identite.codePostal)
        .then(function(result) {
          $scope.cities = result.data;
          if (changeSelection) {
            $scope.identite.ville = $scope.cities[0];
          }
          if (form) {
            updateFormValidity(form);
          }
        }, console.error.bind(console)
        ).finally(function() {
          $scope.retrievingCities = false;
        });
    }

    if ($scope.identite) {
      refreshCities();
      $scope.cities = [$scope.identite.ville];
    }

    $scope.updateCities = function updateCities() {
      $scope.retrievingCities = true;
      refreshCities(true);
    };

    $scope.submit = function(form) {
      if ($scope.cities.length === 0 && form) {
        form.codePostal.$setValidity('notFound', false);
      } else {
        store.set('identite-adulte', $scope.identite);
        $scope.loading = true;

        var demande = {
          identiteEnfant: store.get('identite-enfant'),
          identiteAdulte: store.get('identite-enfant'),
          data: store.get('svair-data')
        };

        DemandeService.save(demande).then(function() {
          $state.go('main.merci');
        });
      }
    };
  });
