
'use strict';

angular.module('boursesApp')
  .controller('DemandeListCtrl', function($scope, $http, $uibModal, $state, $timeout, Auth, Etablissement, id, status, recherche, currentPage) {
    $scope.status = status;
    $scope.recherche = recherche;
    $scope.currentPage = currentPage;
    $scope.token = Auth.getToken();

    $scope.college = Etablissement.get({id: id});
    $scope.itemsPerPage = 10;

    Etablissement.queryDemandes({id: id, status: status, searchQuery: {
      q: recherche,
      offset: (currentPage - 1) * $scope.itemsPerPage,
      limit: $scope.itemsPerPage
    }}, function(demandes) {
      $scope.demandes = demandes;
    });

    $scope.search = function(recherche) {
      $state.go('.', {recherche: recherche, currentPage: 1});
    };

    $scope.pageChanged = function(page) {
      $state.go('.', {recherche: recherche, currentPage: page});
    };

    $scope.pauseDemande = function(demande) {
      $http.post('/api/demandes/' + demande._id + '/pause').then(function() {
        $scope.$emit('updateCount');
        $state.go('.', {}, {reload: true});
      });
    };

    $scope.notification = function(demande) {
      var instance = $uibModal.open({
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
  });
