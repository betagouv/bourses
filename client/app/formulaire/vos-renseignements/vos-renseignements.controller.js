'use strict';

angular.module('boursesApp')
  .controller('VosRenseignementsCtrl', function($scope, $http, $state, $timeout, store, DemandeService) {
    $scope.data = store.get('svair-data') || {};
    $scope.identite = store.get('identite-adulte') || {};

    $scope.setTitulaire = setTitulaire;
    $scope.selectDeclarant = selectDeclarant;
    $scope.updateCities = updateCities;

    $timeout(function() {
      refreshCities();
      if (!$scope.cities) {
        $scope.cities = [$scope.identite.ville];
      }
    });


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

    function updateCities() {
      $scope.retrievingCities = true;
      refreshCities(true);
    };

    function setTitulaire(declarant, identite) {
      identite.titutlaire = declarant.prenoms + ' ' + declarant.nom;
    }
  });
