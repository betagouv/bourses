'use strict';

var formatters = require('../utils/formatters');

exports.columns = [
  {
    title: 'Date de création de la demande',
    prepare: function(demande, college) {
      return formatters.formatCreatedAt(demande.createdAt);
    }
  },
  {
    title: 'Statut de la demande',
    prepare: function(demande, college) {
      return formatters.formatStatus(demande.status);
    }
  },
  {
    title: 'Nom de l\'enfant',
    prepare: function(demande, college) {
      return demande.data.identiteEnfant.nom;
    }
  },
  {
    title: 'Prénom de l\'enfant',
    prepare: function(demande, college) {
      return demande.data.identiteEnfant.prenom;
    }
  },
  {
    title: 'Date de naissance de l\'enfant',
    prepare: function(demande, college) {
      return formatters.formatDate(demande.data.identiteEnfant.dateNaissance);
    }
  },
  {
    title: 'Régime de l\'enfant',
    prepare: function(demande) {
      return formatters.formatRegime(demande.data.identiteEnfant.regime);
    }
  },
  {
    title: 'Revenu fiscal de référence',
    prepare: function(demande, college) {
      return demande.rfr;
    }
  },
  {
    title: 'Nombre d\'enfants mineurs ou infirmes',
    prepare: function(demande, college) {
      return demande.data.foyer.nombreEnfantsACharge;
    }
  },
  {
    title: 'Nombre d\'enfants majeurs célibataires',
    prepare: function(demande, college) {
      return demande.data.foyer.nombreEnfantsAdultes;
    }
  },
  {
    title: 'Nom du demandeur',
    prepare: function(demande, college) {
      return demande.data.identiteAdulte.demandeur.nom;
    }
  },
  {
    title: 'Prénom(s) du demandeur',
    prepare: function(demande, college) {
      return demande.data.identiteAdulte.demandeur.prenoms;
    }
  },
  {
    title: 'Lien avec l\'enfant',
    prepare: function(demande, college) {
      return formatters.formatLien(demande.data.identiteAdulte.lien);
    }
  },
  {
    title: 'E-mail',
    prepare: function(demande, college) {
      return demande.data.identiteAdulte.email;
    }
  },
  {
    title: 'Téléphone',
    prepare: function(demande, college) {
      if (!demande.data.identiteAdulte.phone) {
        return '';
      }

      return demande.data.identiteAdulte.phone;
    }
  },
  {
    title: 'IBAN',
    prepare: function(demande, college) {
      return demande.data.identiteAdulte.iban;
    }
  },
  {
    title: 'BIC',
    prepare: function(demande, college) {
      return demande.data.identiteAdulte.bic;
    }
  },
  {
    title: 'Nombre de parts',
    prepare: function(demande, college) {
      return demande.data.data.nombreParts;
    }
  },
  {
    title: 'Situation familiale',
    prepare: function(demande, college) {
      return demande.data.data.situationFamille;
    }
  },
  {
    title: 'Numéro fiscal',
    prepare: function(demande, college) {
      return demande.data.data.credentials.numeroFiscal;
    }
  },
  {
    title: 'Référence de l\'avis',
    prepare: function(demande, college) {
      return demande.data.data.credentials.referenceAvis;
    }
  },
  {
    title: 'Nombre de parts - Conjoint',
    prepare: function(demande, college) {
      if (!demande.data.data_concubin) {
        return '';
      }

      return demande.data.data_concubin.nombreParts;
    }
  },
  {
    title: 'Revenu fiscal de référence - Conjoint',
    prepare: function(demande, college) {
      if (!demande.data.data_concubin) {
        return '';
      }

      return demande.data.data_concubin.revenuFiscalReference;
    }
  },
  {
    title: 'Situation familiale - Conjoint',
    prepare: function(demande, college) {
      if (!demande.data.data_concubin) {
        return '';
      }

      return demande.data.data_concubin.situationFamille;
    }
  },
  {
    title: 'Numéro fiscal - Conjoint',
    prepare: function(demande, college) {
      if (!demande.data.data_concubin) {
        return '';
      }

      return demande.data.data_concubin.credentials.numeroFiscal;
    }
  },
  {
    title: 'Référence de l\'avis - Conjoint',
    prepare: function(demande, college) {
      if (!demande.data.data_concubin) {
        return '';
      }

      return demande.data.data_concubin.credentials.referenceAvis;
    }
  },
  {
    title: 'Vos observations',
    prepare: function(demande, college) {
      if (!demande.data.observations) {
        return '';
      }

      return demande.data.observations;
    }
  },
  {
    title: 'Notification d\'un montant de',
    prepare: function(demande, college) {
      if (!demande.notification || typeof demande.notification.montant === 'undefined') {
        return '';
      }

      return demande.notification.montant;
    }
  },
  {
    title: 'Notification envoyée le',
    prepare: function(demande, college) {
      if (!demande.notification || !demande.notification.createdAt) {
        return '';
      }

      return formatters.formatCreatedAt(demande.notification.createdAt);
    }
  },
  {
    title: 'Notification envoyée à',
    prepare: function(demande, college) {
      if (!demande.notification || !demande.notification.email) {
        return '';
      }

      return demande.notification.email;
    }
  }
];

exports.extraColumns = {
  aideDepartementale: [
    {
      title: 'Demande d\'aide départementale pour la demi-pension',
      prepare: function(demande) {
        if (!demande.data.identiteEnfant.cantine) {
          return 'Non';
        }

        return demande.data.identiteEnfant.cantine ? 'Oui' : 'Non';
      }
    }
  ]
};
