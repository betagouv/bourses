'use strict';

angular.module('boursesApp')
  .controller('IdentiteEnfantCtrl', function($scope) {

    $scope.submit = function(form) {
      if (form.$valid) {
        console.log('Valide !');
      } else {
        console.log('Pas valide !');
      }
    };
  });
