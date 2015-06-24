'use strict';

angular.module('boursesApp').directive('connection', function ($http, store) {
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
            scope.fc = result.data;
            if (scope.fc) {
              scope.status = 'success';
            }
          },
          function() {
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
      };

      function cancelCredentials() {
        scope.credentials = _.cloneDeep(scope.svair.credentials);
        scope.status = oldStatus;
      }

      function edit() {
        oldStatus = scope.status;
        scope.status = 'pending';
      }

      function saveAndConnect(event) {
        event.preventDefault();
        $window.open('/oauth/fc', '_self');
      }

      scope.edit = edit;
      scope.validateSvair = validateSvair;
      scope.cancelCredentials = cancelCredentials;
      $scope.saveAndConnect = saveAndConnect;
    }
  };
});
