'use strict';

angular.module('boursesApp')
  .controller('DemandeCreateCtrl', function($scope, $http, $state, college, store) {
    store.set('svair_demandeur', null);
    store.set('svair_conjoint', null);
    store.set('status_conjoint', null);
    store.set('status_demandeur', null);

    $scope.demande = {
      identiteEnfant: {
        garde: 'non'
      },
      foyer: {
        nombreEnfantsACharge: 1,
        nombreEnfantsAdultes: 0,
        concubinage: 'non'
      }
    };

    $scope.saveSvair = function(svair, id) {
      if (id === 'demandeur') {
        $scope.demande.data = svair;
      } else {
        $scope.demande.data_conjoint = svair;
      }
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
