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

    $scope.soap = function() {
      $http.post('/api/caf', {
        dateDebutPeriode: '01072015',
        dateFinPeriode: '31072015',
        dateEnvironement: '25082015',
        codeOrganisme: '148',
        matricule: '354'
      }).then(function(result) {
        console.log(result);
        $scope.result = result;
      });
    };

  });
