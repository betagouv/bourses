'use strict';

angular.module('boursesApp')
  .controller('EditCollegeCtrl', function($scope, $state, Etablissement, college, demandes) {
    $scope.college = _.cloneDeep(college);
    $scope.demandes = demandes;

    $scope.submit = function(form) {
      if (!form.$valid) {
        return;
      }

      Etablissement.update($scope.college, function() {
        $state.go('layout.college.demandes.pending', {}, {reload: true});
      });
    };
  });
