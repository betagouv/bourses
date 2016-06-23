'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EtablissementSchema = new Schema({
  human_id: String,
  nom: String,
  type: String,
  contact: String,
  telephone: String,
  chef_etablissement: String,
  adresse: String,
  ville: {
    nom: String,
    codePostal: String
  },
  ouverture_service: {type: Boolean, default: false}
});

module.exports = mongoose.model('Etablissement', EtablissementSchema);
