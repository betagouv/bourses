'use strict';

angular.module('boursesApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $state, Auth) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          if ($rootScope.returnToState) {
            return $state.go($rootScope.returnToState.name, $rootScope.returnToStateParams);
          }

          Auth.getCurrentUser().$promise.then(function (user) {
            if (user.etablissement) {
              $state.go('layout.college.demandes.new', {id: user.etablissement.human_id});
            } else {
              $state.go('layout.admin');
            }
          });

        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
