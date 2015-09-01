
'use strict';

angular.module('boursesApp')
  .controller('DemandeListCtrl', function($scope, $modal, $state, $timeout, Auth, Etablissement, id, status, recherche, page) {
    $scope.status = status;

    $scope.recherche = recherche;
    $scope.page = page;
    $scope.token = Auth.getToken();
    $scope.college = Etablissement.get({id: id});
    $scope.demandes = Etablissement.queryDemandes({id: id, status: status, searchQuery: {
      q: recherche,
      offset: (page - 1) * 25
    }}, function(demandes, getResponseHeaders) {
      $scope.totalItems = getResponseHeaders('count');
    });

    $scope.search = function(recherche) {
      $state.go('.', {recherche: recherche});
    };

    $scope.pageChanged = function(page) {
      $state.go('.', {recherche: recherche, page: page});
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
