'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var DemandeSchema = new Schema({
  createdAt:      { type: Date, default: Date.now },
  observations:   { type: String },
  data:           { type: Schema.Types.Mixed },
  etablissement:  { type: Schema.Types.ObjectId, ref: 'Etablissement' },
  status:         { type: String, enum: ['new', 'pending', 'pause', 'error', 'done'], default: 'new' },
  notification:   {
    montant:      { type: Number },
    email:        { type: String },
    createdAt:    { type: Date }
  },
  error:          {
    msg:          { type: String },
    detail:       { type: Schema.Types.Mixed }
  },
  rfr:            { type: Number }
});

/*
** Indexes
*/
var textIndexOptions = {
  default_language: 'french',
  name: 'default_text_index'
};

var textIndexDefinition = {
  'data.identiteEnfant.prenom': 'text',
  'data.identiteEnfant.nom': 'text',
  'data.identiteAdulte.demandeur.nom': 'text',
  'data.identiteAdulte.demandeur.prenoms': 'text'
};

DemandeSchema.index(textIndexDefinition, textIndexOptions);

module.exports = mongoose.model('Demande', DemandeSchema);
