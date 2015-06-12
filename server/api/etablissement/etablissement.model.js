'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EtablissementSchema = new Schema({
  npm:      { type: String },
  type:     { type: String },
  contact:  { type: String },
  vile:     {
    nom:          String,
    codePostal:   String
  }
});

module.exports = mongoose.model('Etablissement', EtablissementSchema);
