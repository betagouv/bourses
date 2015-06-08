'use strict';

angular.module('boursesApp')
  .controller('IdentiteEnfantCtrl', function($scope, $state, store) {
    $scope.identite = store.get('identite-enfant');
    var steps = store.get('steps');

    $scope.submit = function(form) {
      store.set('identite-enfant', $scope.identite);
      steps.identiteEnfant = form.$valid;

      if (form.$valid) {
        store.set('steps', steps);
        $state.go('main.formulaire.connexion');
      }
    };
  });
