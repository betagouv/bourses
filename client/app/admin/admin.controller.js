'use strict';

angular.module('boursesApp')
  .controller('AdminCtrl', function($scope, $http, Auth, User, Etablissement) {
    $scope.users = User.query();
    $scope.etablissements = Etablissement.query();

    $scope.college = new Etablissement();
    $scope.college.human_id = 'foo_baz';
    $scope.college.nom = 'College de Foo Baz';
    $scope.college.chef_etablissement = 'Mr Foobaz';
    $scope.college.contact = 'foo@baz.com';
    $scope.college.telephone = '123453252';
    $scope.college.adresse = '13, rue de foo, baz';
    $scope.college.ville = {};
    $scope.college.ville.nom = 'Paris';
    $scope.college.ville.codePostal = '75001';
    $scope.college.password = '12345678';

    $scope.createEtablissement = function(form) {
      $scope.message = '';
      $scope.errorMessage = '';

      if (form.$valid) {
        $http
          .post('/api/etablissements', $scope.college)
          .then(function() {
            $scope.message = 'Sauvegarde effectuée';
            $scope.college = new Etablissement();
          })
          .catch(function(err) {
            $scope.errorMessage = err.data.errors;
          })
      }
    }

  });
