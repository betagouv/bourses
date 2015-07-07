
'use strict';

angular.module('boursesApp')
  .controller('DemandeListCtrl', function($scope, $state, $timeout, Etablissement, id, status) {
    $scope.college = Etablissement.get({id: id});
    $scope.demandes = Etablissement.queryDemandes({id: id, status: status});
    $scope.goTo = function(demande) {
      $state.go('layout.college.demandes.edit', {'demandeId': demande._id});
    };
  });
