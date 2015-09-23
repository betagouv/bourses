'use strict';

angular.module('boursesApp')
  .controller('DemandeCreateCtrl', function($scope, $http, $state, college) {
    $scope.demande = {
      identiteEnfant: {
        garde: 'non'
      },
      foyer: {
        nombreEnfantsACharge: 1,
        nombreEnfantsAdultes: 0,
        concubinage: 'non'
      },
      data: {
        anneeImpots: '2014',
        anneeRevenus: '2013'
      },
    };

    $scope.submit = function(form) {
      if (!form.$valid) {
        return;
      }

      $http.post('/api/demandes/' + college._id, $scope.demande).then(function() {
        $state.go('layout.college.demandes.new');
      });
    };
  });
