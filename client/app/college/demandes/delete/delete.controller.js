'use strict';

angular.module('boursesApp')
  .controller('DeleteCtrl', function($scope, $http, $uibModalInstance, demande) {
    $scope.demande = demande;

    $scope.submit = function() {
      $http
        .delete('api/demandes/' + demande._id)
        .then(function() {
          $uibModalInstance.close();
        });
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss();
    };
  });
