'use strict';

angular.module('boursesApp')
  .controller('EditCollegeCtrl', function($scope, $state, Etablissement, college) {
    $scope.college = _.cloneDeep(college);

    $scope.submit = function(form) {
      if (!form.$valid) {
        return;
      }

      Etablissement.update($scope.college, function() {
        $state.go('.', {}, {reload: true});
      });
    };

    $scope.changePassword = function(form) {
      form.oldPassword.$setValidity('mongoose', true);
      $scope.message = '';

      if (!form.$valid) {
        return;
      }

      Etablissement
        .changePassword({human_id: college.human_id, oldPassword: $scope.oldPassword, newPassword: $scope.newPassword}, function() {
          $state.go('.', {}, {reload: true});
        },

        function() {
          form.oldPassword.$setValidity('mongoose', false);
          $scope.message = 'Mot de passe incorrect';
        });
    };
  });
