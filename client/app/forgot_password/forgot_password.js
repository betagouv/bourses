'use strict';

angular.module('boursesApp').config(function($stateProvider) {
  $stateProvider
    .state('forgot_password', {
      url: '/forgot_password',
      parent: 'layout',
      templateUrl: 'app/forgot_password/forgot_password.html',
      controller: function($scope, $state, User) {
        $scope.user = {};
        $scope.errors = {};

        $scope.checkMail = function(form) {
          $scope.submitted = true;

          if (form.$valid) {
            User.generateToken({email: $scope.user.email}, function success() {
              $state.go('email_sent');
            });
          }
        };
      }
    })
    .state('email_sent', {
      parent: 'forgot_password',
      url: '/email_sent',
      templateUrl: 'app/forgot_password/email_sent.html'
    });
});
