'use strict';

angular.module('boursesApp').config(function($stateProvider) {
  $stateProvider
    .state('new_password', {
      parent: 'layout',
      url: '/nouveau_mot_de_passe/:userId/:newPasswordToken',
      templateUrl: 'app/new_password/new_password.html',
      controller: function($stateParams, $scope, $http, $state, $interval) {
        $scope.errors = {};

        $scope.changePassword = function(form) {
          $scope.passwordSubmitted = true;
          if (form.$valid) {
            $http
              .post('api/users/' + $stateParams.userId + '/new_password/' + $stateParams.newPasswordToken, {newPassword: $scope.password})
              .then(function() {
                $scope.passwordMessage = 'Votre mot de passe a été modifié.';
                $interval(function() {
                  $state.go('login');
                }, 3000, 1);
              })
              .catch(function() {
                form.password.$setValidity('mongoose', false);
                $scope.passwordMessage = 'Ce jeton de modification à déjà été utilisé pour réinitialiser votre mot de passe. Veillez refaire une demande de réinitialisation';
              });
          }
        };
      },
    });
});
