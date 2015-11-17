
'use strict';

angular.module('boursesApp')
  .controller('ComptaCollegeCtrl', function($scope, $http, Auth, id, college) {
    $scope.token = Auth.getToken();
    $scope.college = college;

    $http.get('api/etablissements/' + id + '/compta').then(function(result) {
      $scope.demandes = result.data;
    });

    $scope.update = function(demande, attr) {
      return $http.put('/api/demandes/' + demande._id, {attr: 'data.identiteAdulte.' + attr, value: demande.identiteAdulte[attr]});
    };
  });
