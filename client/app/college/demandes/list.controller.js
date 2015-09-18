
'use strict';

angular.module('boursesApp')
  .controller('DemandeListCtrl', function($scope, $http, $modal, $state, $timeout, Auth, Etablissement, id, status, recherche, page) {
    $scope.status = status;
    $scope.recherche = recherche;
    $scope.page = page;
    $scope.token = Auth.getToken();

    $scope.college = Etablissement.get({id: id});

    Etablissement.queryDemandes({id: id, status: status, searchQuery: {
      q: recherche,
      offset: (page - 1) * 10
    }}, function(demandes, getResponseHeaders) {
      $scope.demandes = demandes;
      $scope.totalItems = getResponseHeaders('count');
    });

    $scope.search = function(recherche) {
      $state.go('.', {recherche: recherche});
    };

    $scope.pageChanged = function(page) {
      $state.go('.', {recherche: recherche, page: page});
    };

    $scope.pause = function(demande) {
      $http.post('/api/demandes/' + demande._id + '/pause').then(function() {
        $scope.$emit('updateCount');
        $state.go('.', {}, {reload: true});
      });
    };

    $scope.notification = function(demande) {
      var instance = $modal.open({
        animation: true,
        templateUrl: 'app/college/demandes/notification/notification.html',
        controller: 'NotificationCtrl',
        resolve: {
          demande: function() {
            return demande;
          }
        }
      });

      instance.result.then(function() {
        $state.go('layout.college.demandes.' + status, {}, {reload: true});
      });
    };

    $timeout(function() {
      angular.element('#recherche').trigger('focus');
    });
  });
