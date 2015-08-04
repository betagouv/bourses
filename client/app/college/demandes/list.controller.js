
'use strict';

angular.module('boursesApp')
  .controller('DemandeListCtrl', function($scope, $modal, Etablissement, id, status) {
    $scope.college = Etablissement.get({id: id});
    $scope.demandes = Etablissement.queryDemandes({id: id, status: status});

    $scope.notification = function(demande) {
      $modal.open({
        animation: true,
        templateUrl: 'app/college/demandes/notification/notification.html',
        controller: 'NotificationCtrl',
        resolve: {
          demande: function() {
            return demande;
          }
        }
      });
    };
  });
