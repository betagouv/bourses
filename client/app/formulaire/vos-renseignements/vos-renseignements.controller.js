'use strict';

angular.module('boursesApp')
  .controller('VosRenseignementsCtrl', function($scope, $http, $state, store, DemandeService) {
    $scope.data = store.get('svair-data') || {};
    $scope.identite = store.get('identite-adulte') || {};

    if (!$scope.identite.selected) {
      selectDeclarant(1, $scope.data.declarant1);
    }

    // Initialisation du nb d'enfants a charge, on prend par defaut le nb de personnes
    $scope.listeNombreEnfantsACharge = _.range($scope.data.nombrePersonnesCharge + 1);
    if (!$scope.identite.nombreEnfantsACharge) {
      $scope.identite.nombreEnfantsACharge = $scope.data.nombrePersonnesCharge
    }

    refreshCities();
    if (!$scope.cities) {
      $scope.cities = [$scope.identite.ville];
    }

    function updateFormValidity(form) {
      if (form) {
        form.codePostal.$setValidity('notFound', $scope.cities.length > 0);
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

    function selectDeclarant(index, declarant) {
      if ($scope.identite.selected !== index) {
        $scope.identite.selected = index;
        $scope.identite.nom = declarant.nom;
        $scope.identite.prenom = declarant.prenoms;
      }
    }

    $scope.updateCities = function updateCities() {
      $scope.retrievingCities = true;
      refreshCities(true);
    };

    $scope.selectDeclarant = selectDeclarant;

    $scope.submit = function(form) {
      if ($scope.cities.length === 0 && form) {
        form.codePostal.$setValidity('notFound', false);
      } else {
        store.set('identite-adulte', $scope.identite);

        if (!form.isValid) {
          return;
        }

        $scope.loading = true;
        var demande = {
          identiteEnfant: store.get('identite-enfant'),
          identiteAdulte: store.get('identite-adulte'),
          data: store.get('svair-data')
        };

        DemandeService.save(demande).then(function() {
          $state.go('main.merci');
        });
      }
    };
  });
