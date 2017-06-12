'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  rfr:            { type: Number },
  period:         { type: String, enum: ['2015-2016', '2016-2017', '2017-2018'], default: '2017-2018'}
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

function getExpression(sortType, demande) {
  switch (sortType) {
  case 'adulte':
    return demande.data.identiteAdulte.demandeur.nom;
  case 'email':
    return demande.data.identiteAdulte.email;
  case 'taux':
    return demande.notification.montant;
  case 'enfant':
    return demande.data.identiteEnfant.nom;
  default:
    return demande.data.identiteEnfant.nom;
  }
}

DemandeSchema.methods.compare = function(otherDemande, sortType) {
  var thisValue = getExpression(sortType, this);
  var otherValue = getExpression(sortType, otherDemande);

  return thisValue.localeCompare(otherValue, 'fr');
};

DemandeSchema.index(textIndexDefinition, textIndexOptions);

module.exports = mongoose.model('Demande', DemandeSchema);
