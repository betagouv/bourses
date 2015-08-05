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
  }
});

module.exports = mongoose.model('Etablissement', EtablissementSchema);
