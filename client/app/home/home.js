'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.home', {
        url: '/',
        templateUrl: 'app/home/home.html',
        controller: function($scope, $timeout, store, simulation) {
          var storedSimulation = store.get('simulation');

          $scope.adultes = storedSimulation ? storedSimulation.adultes : 0;
          $scope.enfants = storedSimulation ? storedSimulation.enfants : 1;
          $scope.montant = null;

          $scope.reset = function() {
            store.set('foyer', {});
            store.set('identite-adulte', {});
            store.set('identite-enfant', {});
            store.set('status-concubin', {});
            store.set('status-demandeur', {});
            store.set('svair-concubin', {});
            store.set('svair-demandeur', {});
            store.set('steps', {});
          };

          $scope.submit = function(form) {
            if (form.$valid) {
              store.set('simulation', {enfants: $scope.enfants, adultes: $scope.adultes});
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
          };
        }
      });
  });
