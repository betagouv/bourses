'use strict';

angular.module('boursesApp')
  .controller('DemandeEditCtrl', function($scope, $http, demandeId, demande) {
    $scope.demande = demande;
    $scope.demandeId = demandeId;
    $scope.save = function() {
      $scope.saving = 'pending';
      $http.post('/api/demandes/' + demandeId, {observations: demande.observations}).then(function() {
        $scope.saving = 'success';
      });
    }
  });
