
'use strict';

angular.module('boursesApp')
  .controller('DemandeListCtrl', function($scope, $modal, $state, Etablissement, id, status) {
    $scope.college = Etablissement.get({id: id});
    $scope.demandes = Etablissement.queryDemandes({id: id, status: status});

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
  });
