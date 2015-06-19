'use strict';

angular.module('boursesApp')
  .controller('VosRessourcesCtrl', function($scope, $http, $window, $state, $timeout, $modal, store, fc, svair, isLoggedIn) {

    var oldStatus = null;

    if (isLoggedIn) {
      $scope.status = 'success';

      if (fc) {
        $scope.fc = fc;
      } else {
        $scope.svair = svair;
      }
    }

    $scope.credentials = (svair && svair.credentials) ? _.cloneDeep(svair.credentials) : {};
    $scope.identite = store.get('identite-adulte') || {garde: 'non'};

    var currentYear = new Date().getFullYear();
    $scope.nMinus1 = currentYear - 1;
    $scope.nMinus2 = currentYear - 2;

    $scope.validateSvair = function(form) {
      if (form.$valid) {
        $scope.loading = true;
        $http.get('/api/connection/svair', {params: $scope.credentials})
        .success(function(data) {
          data.identites = [];
          if (data.declarant1) {
            data.identites.push(data.declarant1);
          }
          if (data.declarant2) {
            data.identites.push(data.declarant2);
          }

          store.set('svair', data);
          $scope.svair = data;
          saveCredentials('success');
        })
        .error(function(err) {
          $scope.error = err.message;
          $scope.status = 'error';
        })
        .finally(function() {
          $scope.loading = false;
        });
      }
    };

    $scope.edit = function() {
      oldStatus = $scope.status;
      $scope.status = 'pending';
    };

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
        store.set('identite-adulte', $scope.identite);
        $state.go('layout.nouvelle_demande.vos-renseignements');
      }
    };

    function saveAndConnect(event) {
      event.preventDefault();
      store.set('identite-adulte', $scope.identite);
      $window.open('/oauth/fc', '_self');
    }

    function cancelCredentials() {
      $scope.credentials = _.cloneDeep($scope.credentials);
      $scope.status = oldStatus;
    }

    function saveCredentials(status) {
      $scope.svair.credentials = $scope.credentials;
      oldStatus = $scope.status = status;
      store.set('svair', $scope.svair);
    }

    $scope.saveAndConnect = saveAndConnect;
    $scope.cancelCredentials = cancelCredentials;
  });
