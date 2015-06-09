'use strict';

angular.module('boursesApp')
  .controller('DemandeCtrl', function($scope, id, key, demande) {
    $scope.id = id;
    $scope.key = key;
    $scope.demande = demande;
  });
