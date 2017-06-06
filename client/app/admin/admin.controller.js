'use strict';

angular.module('boursesApp')
  .controller('AdminCtrl', function($scope, $http, Auth, User, Etablissement) {
    $scope.users = User.query();
    $scope.etablissements = Etablissement.query();
  });
