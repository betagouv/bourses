'use strict';

angular.module('boursesApp')
  .controller('VosRessourcesCtrl', function($scope, $http, $window, $state, $location, $anchorScroll, $timeout, $uibModal, store) {

    function checkStatus(status, shortStatus) {
      return $scope.dataDemandeur &&
        ($scope.dataDemandeur.situationFamille === status || $scope.dataDemandeur.sitFam === shortStatus);
    }

    function isCelibataire() {
      return checkStatus('Célibataire', 'C');
    }

    function isDivorceOrSeparation() {
      return checkStatus('Divorcé(e)', 'D') ||  checkStatus('Séparé(e)', 'D');
    }

    function isVeuf() {
      return checkStatus('Veuf(ve)', 'V');
    }

    function computeShowOtherParent() {
      $scope.showOtherParent = isCelibataire() || isVeuf() || isDivorceOrSeparation();
      if (!$scope.showOtherParent) {
        store.set('svair_concubin', {});
        store.set('status_concubin', 'pending');
      }
    }

    function saveFoyer() {
      store.set('foyer', $scope.foyer);
      $scope.dataDemandeur = store.get('svair_demandeur') || store.get('fc_demandeur');
      computeShowOtherParent();
    }

    function isConcubinage() {
      return $scope.foyer.concubinage === 'oui';
    }

    function showOtherParentConnection() {
      return isConcubinage();
    }

    function isDataValid() {
      var statusDemandeur = store.get('status_demandeur');
      var statusConcubin = store.get('status_concubin');

      if (statusDemandeur !== 'success') {
        return false;
      }

      if (showOtherParentConnection() && statusConcubin !== 'success') {
        return false;
      }

      return true;
    }

    $scope.dataDemandeur = store.get('svair_demandeur') || store.get('fc_demandeur');
    var storedFoyer = store.get('foyer');
    if (storedFoyer) {
      $scope.foyer = storedFoyer;
    } else {
      $scope.foyer = {concubinage: 'non'};
      var simulation = store.get('simulation');
      if (simulation) {
        $scope.foyer.nombreEnfantsACharge = simulation.enfants;
        $scope.foyer.nombreEnfantsAdultes = simulation.adultes;
      }
    }

    if (!$scope.foyer.concubinage) {
      $scope.foyer.concubinage = 'non';
    }

    $scope.identiteEnfant = store.get('identite-enfant');

    $scope.next = function(form) {
      if (!form.nombreEnfantsACharge.$valid || !form.nombreEnfantsAdultes.$valid) {
        $location.hash('foyer');
        $anchorScroll();
        return;
      }

      if (!isDataValid()) {
        $uibModal.open({
          animation: true,
          templateUrl: 'app/nouvelle_demande/vos-ressources/error.html',
          controller: function($scope, $uibModalInstance) {
            $scope.ok = function() {
              $uibModalInstance.dismiss();
            };
          }
        });

        return;
      }

      var steps = store.get('steps');
      steps.connexion = true;
      store.set('steps', steps);
      saveFoyer();
      $state.go('layout.nouvelle_demande.vos-renseignements');
    };

    $scope.showOtherParentConnection = showOtherParentConnection;
    $scope.isCelibataire = isCelibataire;
    $scope.saveFoyer = saveFoyer;

    computeShowOtherParent();
  });
