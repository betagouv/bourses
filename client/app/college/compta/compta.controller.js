
'use strict';

angular.module('boursesApp')
  .controller('ComptaCollegeCtrl', function($scope, $http, $window, Auth, id, college) {
    $scope.token = Auth.getToken();
    $scope.college = college;

    $http.get('api/etablissements/' + id + '/compta').then(function(result) {
      $scope.demandes = result.data;
    });

    $scope.search = function(bic) {
      if (bic.length === 11 && bic.slice(-3) === 'XXX') {
        bic = bic.slice(0, 8);
      }

      $window.open('//www.theswiftcodes.com/france/' + bic + '/#admiddlebottom');
    };

    $scope.update = function(demande, attr) {
      return $http.put('/api/demandes/' + demande._id, {attr: 'data.identiteAdulte.' + attr, value: demande.identiteAdulte[attr]});
    };
  });
