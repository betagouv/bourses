'use strict';

angular.module('boursesApp')
  .controller('VosRessourcesCtrl', function($scope, $http, $window, $state, $timeout, $modal, store) {

    $scope.identite = store.get('identite-adulte') || {garde: 'non', concubinage: 'non'};

    $scope.next = function(form) {
      if (form.$valid) {
        if ($scope.status !== 'success') {
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
        steps.connexion = form.$valid;
        store.set('steps', steps);
        saveIdentite();
        $state.go('layout.nouvelle_demande.vos-renseignements');
      }
    };

    function saveAndConnect(event) {
      event.preventDefault();
      saveIdentite();
      $window.open('/oauth/fc', '_self');
    }

    function saveIdentite() {
      store.set('identite-adulte', $scope.identite);
    }

    $scope.saveIdentite = saveIdentite;
    $scope.saveAndConnect = saveAndConnect;
  });
