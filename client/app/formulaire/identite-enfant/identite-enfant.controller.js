'use strict';

angular.module('boursesApp')
  .controller('IdentiteEnfantCtrl', function($scope, store) {
    $scope.identite = store.get('identite');

    $scope.submit = function(form) {
      store.set('identite', $scope.identite);

      if (form.$valid) {
        console.log('Valide !');
      } else {
        console.log('Pas valide !');
      }
    };
  });
