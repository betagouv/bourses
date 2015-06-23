'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EtablissementSchema = new Schema({
  human_id: String,
  nom: String,
  type: String,
  contact: String,
  vile: {
    nom: String,
    codePostal: String
  }
});

module.exports = mongoose.model('Etablissement', EtablissementSchema);
