'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var DemandeSchema = new Schema({
  createdAt:      { type: Date, default: Date.now },
  observations:   { type: String },
  data:           { type: Schema.Types.Mixed },
  etablissement:  { type: Schema.Types.ObjectId, ref: 'Etablissement' },
  status:         { type: String, enum: ['new', 'pending', 'done'], default: 'new' },
  notification:   {
    montant: { type: Number },
    email: { type: String }
  }
});

module.exports = mongoose.model('Demande', DemandeSchema);
