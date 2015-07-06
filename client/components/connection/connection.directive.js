'use strict';

angular.module('boursesApp').directive('connection', function ($http, $window, $location, $timeout, $modal, store) {
  return {
    scope: {
      connectionId: '=',
      onSuccess: '=',
      status: '='
    },
    templateUrl: 'components/connection/connection.html',
    restrict: 'EA',
    link: function (scope) {

      scope.svair = store.get('svair_' + scope.connectionId);
      scope.credentials = scope.svair ? _.cloneDeep(scope.svair.credentials) : {};
      var oldStatus = scope.status = scope.svair ? 'success' : null;

      $http
        .get('/api/connection/fc')
        .then(
          function(result) {
            scope.fc = result.data.response;
            if (typeof scope.fc === 'string' && scope.fc.startsWith('{')) {
              scope.fc = JSON.parse(scope.fc);
            }
            scope.status = 'success';
            store.set('fc_' + scope.connectionId, scope.fc);
          },
          function() {
            store.set('fc_' + scope.connectionId, null);
            return null;
          });

      var currentYear = new Date().getFullYear();
      scope.nMinus1 = currentYear - 1;
      scope.nMinus2 = currentYear - 2;

      function validateSvair(form) {
        if (!form.$valid) {
          return;
        }

        scope.onSuccess();
        scope.loading = true;

        scope.credentials.numeroFiscal = trimNumeroFiscal(scope.credentials.numeroFiscal);

        $http.get('/api/connection/svair', {params: scope.credentials})
        .success(function(data) {
          data.identites = [data.declarant1];

          if (data.declarant2) {
            data.identites.push(data.declarant2);
          }

          data.credentials = scope.credentials;
          scope.svair = data;
          store.set('svair_' + scope.connectionId, scope.svair);
          oldStatus = scope.status = 'success';
        })
        .error(function(err) {
          scope.error = err.message;
          scope.status = 'error';
        })
        .finally(function() {
          scope.loading = false;
        });
      }

      function trimNumeroFiscal(numeroFiscal) {
        if (numeroFiscal && numeroFiscal.length > 13) {
          return numeroFiscal.substring(0, numeroFiscal.length - 1);
        }

        return numeroFiscal;
      }

      function cancelCredentials() {
        scope.credentials = _.cloneDeep(scope.svair.credentials);
        scope.status = oldStatus;
      }

      function edit() {
        oldStatus = scope.status;
        scope.status = 'pending';
      }

      function detailNumeroFiscal() {
        $modal.open({
          animation: true,
          templateUrl: 'components/connection/numerofiscal.html',
          controller: function($scope, $modalInstance) {
            $scope.ok = function() {
              $modalInstance.dismiss();
            };
          }
        });
      }

      function detailNumeroAvis() {
        $modal.open({
          animation: true,
          templateUrl: 'components/connection/numeroavis.html',
          controller: function($scope, $modalInstance) {
            $scope.ok = function() {
              $modalInstance.dismiss();
            };
          }
        });
      }

      function saveAndConnect(event) {
        event.preventDefault();
        scope.onSuccess();
        $window.open('/oauth/fc', '_self');
      }

      scope.edit = edit;
      scope.validateSvair = validateSvair;
      scope.cancelCredentials = cancelCredentials;
      scope.saveAndConnect = saveAndConnect;
      scope.detailNumeroFiscal = detailNumeroFiscal;
      scope.detailNumeroAvis = detailNumeroAvis;
    }
  };
});
