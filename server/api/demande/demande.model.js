'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var DemandeSchema = new Schema({
  createdAt:      { type: Date, default: Date.now },
  observations:   { type: String },
  data:           { type: String },
  etablissement:  { type: Schema.Types.ObjectId, ref: 'Etablissement' },
  status:         { type: String, enum: ['new', 'pending', 'done'], default: 'new' },
  notification:   {
    edited: { type: Boolean, default: false },
    montant: { type: Number },
    email: { type: String }
  }
});

module.exports = mongoose.model('Demande', DemandeSchema);
