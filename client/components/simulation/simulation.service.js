'use strict';

angular.module('boursesApp').factory('simulation', function(definitions) {
  function calcMontant(eligibleTaux1, eligibleTaux2, eligibleTaux3) {
    return eligibleTaux3 * definitions.taux3.montant +
    eligibleTaux2 * definitions.taux2.montant +
    eligibleTaux1 * definitions.taux1.montant;
  }

  return function(rfr, nbEnfants) {
    // If more than 8 children, compare with the 8th ceiling
    var plafondsIndex = nbEnfants >= 8 ? 7 : nbEnfants - 1;

    var plafondTaux1 = definitions.taux1.plafonds[plafondsIndex];
    var plafondTaux2 = definitions.taux2.plafonds[plafondsIndex];
    var plafondTaux3 = definitions.taux3.plafonds[plafondsIndex];

    var eligibleTaux3 = rfr <= plafondTaux3;
    var eligibleTaux2 = !eligibleTaux3 && rfr <= plafondTaux2;
    var eligibleTaux1 = !(eligibleTaux2 || eligibleTaux3) && rfr <= plafondTaux1;

    return calcMontant(eligibleTaux1, eligibleTaux2, eligibleTaux3);
  };
});
