
'use strict';

angular.module('boursesApp')
  .controller('DemandeListCtrl', function($scope, $state, $timeout, Etablissement, id) {
    $scope.college = Etablissement.get({id: id});
    $scope.new = Etablissement.queryDemandes({id: id, status: 'new'});
    $scope.pending = Etablissement.queryDemandes({id: id, status: 'pending'});
    $scope.done = Etablissement.queryDemandes({id: id, status: 'done'});

    $scope.splice = function(idx, demande) {
      $timeout(function() {
        $scope.new.splice(idx, 1);
        $scope.pending.unshift(demande);
      }, 200);
    }
  });
