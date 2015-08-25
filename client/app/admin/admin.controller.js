'use strict';

angular.module('boursesApp')
  .controller('AdminCtrl', function($scope, $http, $soap, Auth, User, Etablissement) {

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

    $scope.soap = function(fnName, args) {
      $soap.post('https://pep-test.caf.fr/sgmap/wswdd/v1?wsdl', fnName, args).then(function(result) {
        console.log(result);
        $scope.result = result;
      });
    };

  });
