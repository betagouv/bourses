'use strict';

angular.module('boursesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('layout.home', {
        url: '',
        templateUrl: 'app/home/home.html',
        controller: function($scope, $timeout, simulation) {
          $scope.adultes = 0;
          $scope.enfants = 1;
          $scope.montant = null;
          $scope.submit = function(form) {
            if (form.$valid) {
              var nbEnfants = $scope.enfants + $scope.adultes;
              var rfr = $scope.rfr;
              $scope.computing = true;
              $timeout(function() {
                $scope.computing = false;
                $scope.montant = simulation(rfr, nbEnfants);
              }, 300);
            } else {
              $scope.montant = null;
            }
          }
        }
      });
  });
