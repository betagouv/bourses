'use strict';

angular.module('boursesApp')
  .controller('NotificationCtrl', function($scope, $http, $state, $modalInstance, Auth, demande, simulation) {
    $scope.demande = demande;
    $scope.token = Auth.getToken();
    $scope.listeMontants = [0, 84, 231, 360];

    if (demande.status === 'done') {
      $scope.email = demande.notification.email;
      $scope.montant = demande.notification.montant;
    } else {
      $scope.email = demande.identiteAdulte.email;

      var rfr;
      if (demande.data_conjoint) {
        rfr = demande.data.revenuFiscalReference + demande.data_conjoint.revenuFiscalReference;
      } else {
        rfr = demande.data.revenuFiscalReference;
      }

      $scope.montant = simulation(rfr, demande.foyer.nombreEnfantsACharge + demande.foyer.nombreEnfantsAdultes);
    }

    $scope.submit = function(form) {
      if (!form.$valid) {
        return;
      }

      $http
        .post('api/demandes/' + demande._id + '/notification', {email: $scope.email, montant: $scope.montant})
        .then(function() {
          $modalInstance.close();
        });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };
  });
