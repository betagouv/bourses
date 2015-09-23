'use strict';

angular.module('boursesApp')
  .controller('ModificationCtrl', function($scope, demande, $modal, $state, $stateParams, $http, simulation) {
    $scope.demande = demande;

    $scope.doNothing = function() {};

    $scope.saveModifications = function(data) {
      var nbEnfants = demande.data.foyer.nombreEnfantsACharge + demande.data.foyer.nombreEnfantsAdultes;
      var rfr = data.revenuFiscalReference;
      var montant = simulation(rfr, nbEnfants);

      if (!$stateParams.token) {
        return;
      }

      $http.post('/api/demandes/modification?token=' + $stateParams.token, {data: data, montant: montant})
        .success(function() {
          $modal.open({
            animation: true,
            templateUrl: 'app/modification/success.html',
            resolve: {
              newMontant: montant
            },
            controller: function($scope, $modalInstance, newMontant) {
              $scope.newMontant = newMontant;
              $scope.ok = function() {
                $modalInstance.dismiss();
                $state.go('layout.home');
              };
            }
          });
        })
        .error(function(result) {
          $scope.error = result;
        });
    };
  });
