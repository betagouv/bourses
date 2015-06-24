'use strict';

angular.module('boursesApp')
  .controller('VosRessourcesCtrl', function($scope, $http, $window, $state, $timeout, $modal, store) {

    $scope.identite = store.get('identite-adulte') || {garde: 'non', concubinage: 'non'};
    $scope.statusDemandeur = null;
    $scope.statusConjoint = null;

    $scope.next = function(form) {
      if (!form.$valid) {
        return;
      }

      if (!isDataValid()) {
        $modal.open({
          animation: true,
          templateUrl: 'app/nouvelle_demande/vos-ressources/error.html',
          controller: function($scope, $modalInstance) {
            $scope.ok = function() {
              $modalInstance.dismiss();
            };
          }
        });

        return;
      }

      var steps = store.get('steps');
      steps.connexion = true;
      store.set('steps', steps);
      saveIdentite();
      $state.go('layout.nouvelle_demande.vos-renseignements');
    };

    function saveIdentite() {
      store.set('identite-adulte', $scope.identite);
    }

    function isDataValid() {
      if ($scope.statusDemandeur !== 'success') {
        return false;
      }

      if (!isOtherParentDisabled() && $scope.statusConjoint !== 'success') {
        return false;
      }

      return true;
    }

    function isOtherParentDisabled() {
      return $scope.identite.garde !== 'oui' && $scope.identite.concubinage !== 'oui';
    }

    $scope.isOtherParentDisabled = isOtherParentDisabled;
    $scope.saveIdentite = saveIdentite;
  });
