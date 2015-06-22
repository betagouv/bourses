'use strict';

angular.module('boursesApp')
  .controller('DemandeCtrl', function($scope, $http, id, key, demande) {
    $scope.id = id;
    $scope.key = key;
    $scope.demande = demande;
    $scope.save = function() {
      $scope.saving = 'pending';
      $http.post('/api/demandes/' + id, {observations: demande.observations}).then(function() {
        $scope.saving = 'success';
      });
    }
  });
