'use strict';

angular.module('boursesApp')
  .controller('AdminCtrl', function($scope, $http, Auth, User, Etablissement) {
    $scope.users = User.query();
    $scope.etablissements = Etablissement.query();

    $scope.college = new Etablissement();

    $scope.createEtablissement = function(form) {
      $scope.message = '';
      $scope.errorMessage = '';

      if (form.$valid) {
        $http
          .post('/api/etablissements', $scope.college)
          .then(function success(created) {
            $scope.message = 'Sauvegarde effectuée';
            $scope.etablissements.push(created.data);
            form.$setPristine();
            form.$setUntouched();
            $scope.college = new Etablissement();
          })
          .catch(function(err) {
            $scope.errorMessage = err.data.errors;
          })
      }
    }

  });
