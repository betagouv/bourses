'use strict';

angular.module('boursesApp')
  .controller('DemandeEditCtrl', function($scope, $timeout, $http, demandeId, demande) {
    $scope.demande = demande;
    $scope.demandeId = demandeId;
    $scope.save = function() {
      $scope.saving = 'pending';
      $http.post('/api/demandes/comment/' + demandeId, {observations: demande.observations}).then(function() {
        $scope.saving = 'success';
        $timeout(function() {
          $scope.saving = '';
        }, 500);
      });
    }
  });