'use strict';

angular.module('boursesApp').constant('definitions', {
  taux1: {
    plafonds: [14955, 18406, 21857, 25308, 28760, 32211, 35662, 39113],
    montant: 35
  },
  taux2: {
    plafonds: [8084, 9950, 11815, 13682, 15547, 17412, 19279, 21144],
    montant: 96
  },
  taux3: {
    plafonds: [2852, 3511, 4169, 4827, 5485, 6144, 6802, 7460],
    montant: 150
  },

  taux: [0, 35, 96, 150]
});
