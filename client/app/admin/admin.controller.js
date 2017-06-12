'use strict';

angular.module('boursesApp')
  .controller('AdminCtrl', function($scope, $http, Auth, User, Etablissement) {
    $scope.users = User.query();
    $scope.etablissements = Etablissement.query();

    $scope.college = new Etablissement();

    $scope.search = function() {
      $scope.searchError = null;
      $http
        .get(`api/etablissements/byRne/${$scope.college.human_id}`)
        .then(response => {
          const etablissement = response.data;

          $scope.college.human_id = etablissement.human_id;
          $scope.college.nom = etablissement.nom;
          $scope.college.type = etablissement.type;
          $scope.college.adresse = etablissement.adresse;
          $scope.college.ville = {
            nom: etablissement.ville.nom,
            codePostal: etablissement.ville.codePostal
          };
        })
        .catch(() => {
          $scope.searchError = 'Collège introuvable.';
        });
    }

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
