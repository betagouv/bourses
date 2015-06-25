'use strict';

angular.module('boursesApp')
  .controller('VosRenseignementsCtrl', function($scope, $http, $state, $timeout, store) {
    $scope.dataDemandeur = store.get('svair_demandeur') || {};
    $scope.identite = store.get('identite-adulte') || {};
    $scope.identiteEnfant = store.get('identite-enfant');

    $timeout(function() {
      refreshCities();
      if (!$scope.cities) {
        $scope.cities = [$scope.identite.ville];
      }
    });

    if ($scope.dataDemandeur && !$scope.identite.demandeur) {
      $scope.identite.demandeur = $scope.dataDemandeur.identites[0];
    }

    $scope.submit = function(form) {
      if ($scope.cities.length === 0 && form) {
        form.codePostal.$setValidity('notFound', false);
      } else {
        store.set('identite-adulte', $scope.identite);

        if (!form.$valid) {
          return;
        }

        $scope.loading = true;
        var demande = {
          identiteEnfant: store.get('identite-enfant'),
          identiteAdulte: store.get('identite-adulte'),
          foyer: store.get('foyer'),
          data: store.get('svair_demandeur')
        };

        $http.post('/api/demandes/' + demande.identiteEnfant.college, demande).then(function() {
          $state.go('layout.merci');
        });
      }
    };

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

    function updateCities() {
      $scope.retrievingCities = true;
      refreshCities(true);
    }

    function getLabel(declarant) {
      return declarant.prenoms + ' ' + declarant.nom;
    }

    $scope.getLabel = getLabel;
    $scope.updateCities = updateCities;
  });
