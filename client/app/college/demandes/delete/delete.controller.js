'use strict';

angular.module('boursesApp')
  .controller('DeleteCtrl', function($scope, $http, $modalInstance, demande) {
    $scope.demande = demande;

    $scope.submit = function() {
      $http
        .delete('api/demandes/' + demande._id)
        .then(function() {
          $modalInstance.close();
        });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };
  });
