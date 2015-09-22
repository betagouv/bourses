'use strict';

angular.module('boursesApp')
  .controller('VosRenseignementsCtrl', function($scope, $http, $state, $timeout, $modal, store) {
    $scope.dataDemandeur = store.get('svair_demandeur') || store.get('fc_demandeur') || {};
    $scope.identite = store.get('identite-adulte') || {};
    $scope.identiteEnfant = store.get('identite-enfant');

    if ($scope.dataDemandeur && !$scope.identite.demandeur) {
      $scope.identite.demandeur = $scope.dataDemandeur.identites[0];
    }

    $scope.submit = function(form) {
      store.set('identite-adulte', $scope.identite);

      if (!form.$valid) {
        return;
      }

      $scope.loading = true;
      var demande = {
        identiteEnfant: store.get('identite-enfant'),
        identiteAdulte: store.get('identite-adulte'),
        foyer: store.get('foyer'),
        data: store.get('svair_demandeur'),
        data_conjoint: store.get('svair_conjoint')
      };

      if (!demande.data || typeof demande.data.revenuFiscalReference === 'undefined') {
        $scope.loading = false;
        $modal.open({
          animation: true,
          templateUrl: 'app/nouvelle_demande/vos-renseignements/error.html',
          controller: function($scope, $modalInstance) {
            $scope.ok = function() {
              $modalInstance.dismiss();
            };
          }
        });

        return;
      }

      $http.post('/api/demandes/' + demande.identiteEnfant.college, demande).then(function() {
        $state.go('layout.merci');
      });
    };

    function getLabel(declarant) {
      return declarant.prenoms + ' ' + declarant.nom;
    }

    $scope.getLabel = getLabel;
  });
