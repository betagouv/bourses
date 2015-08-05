'use strict';

angular.module('boursesApp')
  .controller('EditCollegeCtrl', function($scope, $state, Etablissement, college) {
    $scope.college = _.cloneDeep(college);
    $scope.submit = function(form) {
      if (!form.$valid) {
        return;
      }

      Etablissement.update($scope.college, function() {
        $state.go('layout.college.demandes.pending', {}, {reload: true});
      });
    };
  });
