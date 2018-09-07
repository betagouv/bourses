'use strict';

angular.module('boursesApp').constant('definitions', {
  taux1: {
    plafonds: [15048, 18521, 21993, 25466, 28939, 32412, 35884, 39357],
    montant: 35
  },
  taux2: {
    plafonds: [8134, 10012, 11889, 13767, 15644, 17521, 19399, 39357],
    montant: 96
  },
  taux3: {
    plafonds: [2870, 3532, 4195, 4857, 5520, 6182, 6844, 7507],
    montant: 150
  },

  taux: [0, 35, 96, 150]
});
