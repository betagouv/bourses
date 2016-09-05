'use strict';

angular.module('boursesApp').constant('definitions', {
  taux1: {
    plafonds: [14831, 18253, 21675, 25097, 28520, 31943, 35365, 38787],
    montant: 84
  },
  taux2: {
    plafonds: [8017, 9867, 11717, 13568, 15418, 17267, 19118, 20968],
    montant: 231
  },
  taux3: {
    plafonds: [2829, 3481, 4134, 4787, 5440, 6093, 6745, 7398],
    montant: 360
  },

  taux: [0, 84, 231, 369]
});
