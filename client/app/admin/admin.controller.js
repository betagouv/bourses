'use strict';

angular.module('boursesApp')
  .controller('AdminCtrl', function($scope, $http, Auth, User, Etablissement) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    $scope.etablissements = Etablissement.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });
