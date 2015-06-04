'use strict';

angular.module('boursesApp')
  .controller('IdentiteEnfantCtrl', function($scope, $state, store) {
    $scope.identite = store.get('identite');
    var steps = store.get('steps');

    $scope.submit = function(form) {
      store.set('identite', $scope.identite);
      steps.identiteEnfant = form.$valid;

      if (form.$valid) {
        store.set('steps', steps);
        $state.go('main.formulaire.connection');
      }
    };
  });
