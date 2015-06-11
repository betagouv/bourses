'use strict';

angular.module('boursesApp')
  .controller('IdentiteEnfantCtrl', function($scope, $state, $http, store) {
    $scope.etablissements = [];
    $http.get('/api/etablissements').then(function(result) {
      $scope.etablissements = result.data;
    });

    $scope.identite = store.get('identite-enfant');
    var steps = store.get('steps');

    $scope.submit = function(form) {
      store.set('identite-enfant', $scope.identite);
      steps.identiteEnfant = form.$valid;

      if (form.$valid) {
        store.set('steps', steps);
        $state.go('main.formulaire.vos-ressources');
      }
    };
  });
