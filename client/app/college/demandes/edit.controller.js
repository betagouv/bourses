'use strict';

angular.module('boursesApp')
  .controller('DemandeEditCtrl', function($scope, $timeout, $http, $window, $modal, $state, Auth, demandeId, demande) {
    $scope.demande = demande;
    $scope.demandeId = demandeId;
    $scope.token = Auth.getToken();

    $scope.$emit('updateCount');

    var myEl = angular.element(document.querySelector('#nav-menu'));

    angular.element($window).bind('scroll', function() {
      if (this.pageYOffset >= 395) {
        myEl.addClass('affix');
      } else {
        myEl.removeClass('affix');
      }
    });

    $scope.pauseDemande = function() {
      $http.post('/api/demandes/' + demande._id + '/pause').then(function() {
        $scope.$emit('updateCount');
        $state.go('layout.college.demandes.new', {}, {reload: true});
      });
    };

    $scope.delete = function() {
      var instance = $modal.open({
        animation: true,
        templateUrl: 'app/college/demandes/delete/delete.html',
        controller: 'DeleteCtrl',
        resolve: {
          demande: function() {
            return demande;
          }
        }
      });

      instance.result.then(function() {
        $state.go('layout.college.demandes.new', {}, {reload: true});
      });
    };

    $scope.save = function() {
      $scope.saving = 'pending';
      $http.post('/api/demandes/comment/' + demandeId, {observations: demande.observations}).then(function() {
        $scope.saving = 'success';
        $timeout(function() {
          $scope.saving = '';
        }, 500);
      });
    };
  });
