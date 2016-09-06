'use strict';

var async = require('async');
var Demande = require('../../api/demande/demande.model');

exports.findDuplicates = function(demandes, etablissement, done) {
  var foundDuplicates = [];

  async.each(demandes, function(demande, callback) {
    Demande
      .find({etablissement: etablissement,
        'data.identiteEnfant.prenom': demande.data.identiteEnfant.prenom,
        'data.identiteEnfant.nom': demande.data.identiteEnfant.nom,
        'data.identiteAdulte.demandeur.nom': demande.data.identiteAdulte.demandeur.nom,
        'data.identiteAdulte.demandeur.prenoms': demande.data.identiteAdulte.demandeur.prenoms
      })
      .lean()
      .exec(function(err, duplicates) {
        if (duplicates.length >= 2) {
          duplicates.forEach(function(duplicate) {
            foundDuplicates.push(duplicate._id.toString());
          });
        }

        callback();
      });

  }, function(err) {

    done(err, demandes, foundDuplicates);
  });
};
