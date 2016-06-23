'use strict';

angular.module('boursesApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('layout.nouvelle_demande', {
        url: '/nouvelle_demande?college',
        templateUrl: 'app/nouvelle_demande/form_layout.html',
        controller: 'FormLayoutCtrl',
        abstract: true
      })
      .state('layout.nouvelle_demande.identite-enfant', {
        url: '',
        templateUrl: 'app/nouvelle_demande/identite-enfant/identite-enfant.html',
        controller: 'IdentiteEnfantCtrl',
        resolve: {
          etablissements: function($http) {
            return $http.get('/api/etablissements').then(function(result) {
              var data = result.data;

              _.map(data, function(etablissement) {
                if (etablissement.ville) {
                  etablissement.label = etablissement.nom + ', ' + etablissement.ville.nom + ' ' + etablissement.ville.codePostal;
                }
              });

              return data;
            });
          }
        }
      })
      .state('layout.nouvelle_demande.vos-ressources', {
        url: '/vos-ressources',
        templateUrl: 'app/nouvelle_demande/vos-ressources/vos-ressources.html',
        controller: 'VosRessourcesCtrl'
      })
      .state('layout.nouvelle_demande.vos-renseignements', {
        url: '/vos-renseignements',
        templateUrl: 'app/nouvelle_demande/vos-renseignements/vos-renseignements.html',
        controller: 'VosRenseignementsCtrl'
      });
  });
