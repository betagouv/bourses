'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var wkhtmltopdf = require('wkhtmltopdf');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var async = require('async');
var tmp = require('tmp');
var request = require('superagent');

var config = require('../../config/environment');
var Demande = require('./demande.model');
var Etablissement = require('../etablissement/etablissement.model');
var Generator = require('../../components/pdf/generator');
var sendMail = require('../../components/mail/send-mail').sendMail;
var crypto = require('../../components/crypto/crypto');
var duplicates = require('../../components/duplicates/duplicates');
var isCampaignOver = require('../../components/time/time').isCampaignOver;

function logMail(logger, error, info) {
  if (error) {
    logger.error('Notification error: ' + error);
  } else {
    logger.info('Notification sent: ', info);
  }
}

function sendNotificationToUser(demande, etablissement, stream, req, cb) {
  var subject = 'Notification demande de bourse';

  var body = '<html><body><p>Merci d\'avoir passé votre demande avec notre service.</p>' +
   '<p>Le chef d\'établissement vous informe qu\'après examen du dossier de demande de bourse de collège concernant <strong>' + demande.data.identiteEnfant.prenom + ' ' +  demande.data.identiteEnfant.nom + '</strong>,' +
   '<br>et compte tenu des éléments figurants sur votre avis d\'impôt sur le revenu:' +
   '<ul><li>revenu fiscal de référence: ' + demande.rfr + ' EUR</li>' +
   '<li>nombre d\'enfants mineurs ou infirmes: ' + demande.data.foyer.nombreEnfantsACharge + '</li>' +
   '<li>nombre d\'enfants majeurs ou célibataires: ' + demande.data.foyer.nombreEnfantsAdultes + '</li></ul></p>';

  if (demande.notification.montant === 0) {
    body += '<br><p>la bourse de collège que vous avez sollicitée au titre de l\'année scolaire 2016-2017 ne peut pas vous être accordée.</p>';
  } else {
    body += '<br><p>une bourse de collège d\'un montant annuel de <strong>' + demande.notification.montant + ' EUR</strong> vous est accordée au titre de l\'année scolaire 2016-2017.</p>';
  }

  body += '<h4>Pour votre information :</h4><ol type="a">' +
  '<li>En cas d\'erreur dans les données ci-dessus indiquées, je vous prie de bien vouloir m\'en informer le plus rapidement possible.</li>' +
  '<li>Si vous contestez cette décision, vous pouvez former dans les deux mois de sa notification :' +
  '<ul><li>soit un recours administratif que vous m\'adresserez;</li>' +
  '<li>soit un recours contentieux devant le tribunal administratif.</li></ul>' +
  'En cas de recours administratif, vous disposerez à compter de la notification de la réponse, d\'un délai de deux mois pour vous pourvoir devant le tribunal administratif. Ce délai est porté à ' +
  'quatre mois à compter de l\'introduction du recours administratif, si ce dernier est resté sans réponse.</li></ol></div></body></html>';

  sendMail(demande.notification.email, etablissement.contact, subject, body, stream, function(error, info) {
    if (error) {
      var msg = 'Nous avons rencontré une erreur lors de l\'envoi d\'un mail vers ' + demande.data.identiteAdulte.email + '<br>' +
          'Si vous pensez toutefois que cette adresse est correcte, vous pouvez nous contacter à l\'adresse bourse@sgmap.fr';
      demande
        .set('status', 'error')
        .set('error', {msg: msg, detail: error})
        .save();
    }

    logMail(req.log, error, info);
  });
}

function sendConfirmationToUser(email, demande, college, req) {
  var subject = 'Accusé de réception';
  var date = moment(demande.createdAt).format('DD/MM/YYYY');
  var body = '<html><body>Votre de demande de bourse du ' + date + ' a bien été envoyée à votre établissement.';
  body += 'Vous recevrez une réponse avant le 15 octobre au plus tard.<br>';
  body += 'Merci d’avoir utilisé ce service et en cas de question n\'hésitez pas à nous écrire à "' + college.contact;

  if (college.telephone) {
    body += '" ou à contacter l\'intendance au ' + college.telephone;
  }

  body += '.<body><html>';

  sendMail(email, 'bourse@sgmap.fr', subject, body, null, function(error, info) {
    if (error) {
      var msg = 'Nous avons rencontré une erreur lors de l\'envoi d\'un mail vers ' + demande.data.identiteAdulte.email + '. ' +
          'Si vous pensez toutefois que cette adresse est correcte, vous pouvez nous contacter à l\'adresse bourse@sgmap.fr';
      demande
        .set('status', 'error')
        .set('error', {msg: msg, detail: error})
        .save();
    }

    logMail(req.log, error, info);
  });
}

function sendNotificationToAgent(identite, college, req) {
  Etablissement
    .findById(college)
    .exec(function(err, etablissement) {
      if (err) {
        req.log.error(err);
      } else if (!etablissement) {
        req.log.error('Etablissement not found: ' + college);
      } else {
        var email = etablissement.contact;
        var subject = 'Nouvelle demande - ' + identite.demandeur.prenoms + ' ' + identite.demandeur.nom;
        var dashboard = config.domain + '/college/' + etablissement.human_id + '/demandes/nouvelles';

        var body = 'Vous avez une nouvelle demande de bourse.\n' +
          '<h3><a href="' + dashboard + '">Cliquez ici pour voir la liste des demandes passées</a></h3>\n' +
          'Si le lien ne marche pas, vous pouvez copier/coller cette adresse dans votre navigateur:\n' + dashboard;

        sendMail(email, 'bourse@sgmap.fr', subject, body, null, function(error, info) {
          logMail(req.log, error, info);
        });
      }
    });
}

function saveDemande(req, done) {
  var encoded = crypto.encode(req.body);

  var rfr;
  if (encoded.data_conjoint && encoded.data_conjoint.revenuFiscalReference) {
    rfr = encoded.data.revenuFiscalReference + encoded.data_conjoint.revenuFiscalReference;
  } else {
    rfr = encoded.data.revenuFiscalReference;
  }

  Demande.create({
    etablissement: req.params.college,
    data: encoded,
    rfr: rfr
  }, function(err, demande) {
    if (err) { return done(err); }

    Etablissement
      .findById(demande.etablissement)
      .exec(function(err, college) {
        sendConfirmationToUser(req.body.identiteAdulte.email, demande, college, req);
      });

    sendNotificationToAgent(req.body.identiteAdulte, req.params.college, req);

    return done(null, demande);
  });
}

// Creates a new demande in the DB.
exports.create = function(req, res) {
  if (isCampaignOver()) {
    return res.status(500).send('Campaign is over');
  }

  saveDemande(req, function(err, demande) {
    if (err) return handleError(req, res, err);

    return res.status(201).json(demande);
  });
};

// Updates a demande in the DB.
exports.update = function(req, res) {
  var id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.sendStatus(400);
  }

  Demande
    .findById(id)
    .exec(function(err, demande) {
      if (err) { return handleError(req, res, err); }

      if (!demande) { return res.sendStatus(404); }

      demande
        .set(req.body.attr, req.body.value)
        .save(function(err, updated) {
          if (err) { return handleError(res, err); }

          return res.json(updated);
        });
    });
};

// Creates a new demande in the DB, don't make additionnal checks
exports.createAdmin = function(req, res) {
  saveDemande(req, function(err, demande) {
    if (err) return handleError(req, res, err);

    return res.status(201).json(demande);
  });
};

exports.showPublic = function(req, res) {
  if (!req.query.token) {
    return res.sendStatus(404);
  }

  var id = crypto.decryptId(req.query.token)._id;
  Demande
    .findById(id)
    .select('data.data data.foyer notification')
    .exec(function(err, demande) {
      res.json(demande);
    });
};

exports.editPublic = function(req, res) {
  if (!req.query.token) {
    return res.sendStatus(404);
  }

  var id = crypto.decryptId(req.query.token)._id;
  Demande
    .findById(id)
    .exec(function(err, demande) {
      var montant = req.body.montant;
      var newData = req.body.data;
      var msg = 'Dossier placé en erreur car relevé fiscal de ' + demande.data.data.anneeImpots;
      msg += ' , modification effectuée par l\'utilisateur.';

      demande
        .set('error', {msg: msg})
        .set('data.data', newData)
        .set('rfr', newData.revenuFiscalReference)
        .set('status', 'error')
        .save(function() {
          res.json(demande);
        });
    });
};

exports.show = function(req, res) {
  var id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.sendStatus(400);
  }

  Demande
    .findById(id)
    .exec(function(err, demande) {
      if (err) { return handleError(req, res, err); }

      if (!demande) { return res.sendStatus(404); }

      var data = demande.data.data;

      async.series([
        function(callback) {
          if (demande.status === 'new') {
            demande
              .set('status', 'pending')
              .save(callback);
          } else if (!data.anneeImpots) {
            request
              .get(config.apiParticulier.url)
              .send({ numeroFiscal: data.credentials.numeroFiscal, referenceAvis: data.credentials.referenceAvis })
              .set('X-API-Key', config.apiParticulier.token)
              .set('Accept', 'application/json')
              .end(function(err, result) {
                demande
                  .set('data.data.anneeRevenus', result.body.anneeRevenus)
                  .set('data.data.anneeImpots', result.body.anneeImpots)
                  .save(callback);
              });
          } else {
            callback();
          }
        },

        function(callback) {
          duplicates.findDuplicates([demande], demande.etablissement, function(err, demandes, duplicates) {
            var decoded = crypto.decode(demande);

            if (duplicates.length > 0) {
              decoded.isDuplicate = true;
              decoded.duplicates = duplicates;
            }

            decoded.encryptedId = crypto.encryptId(demande);

            return res.json(decoded);
          });
        }

      ]);

    });
};

exports.delete = function(req, res) {
  var id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.sendStatus(400);
  }

  Demande
    .findById(id)
    .exec(function(err, demande) {
      if (err) { return handleError(req, res, err); }

      if (!demande) { return res.sendStatus(404); }

      demande.remove(function(err) {
        if (err) { return handleError(req, res, err); }

        return res.send(204);
      });
    });
};

exports.download = function(req, res) {
  var id = req.params.id;
  var host = req.headers.host;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.sendStatus(400);
  }

  Demande
    .findById(id)
    .exec(function(err, demande) {
      if (err) { return handleError(req, res, err); }

      if (!demande) { return res.sendStatus(404); }

      var decoded = crypto.decode(demande);
      Generator.toHtml(decoded, host, function(html) {
        wkhtmltopdf(html, {encoding: 'UTF-8'}).pipe(res);
      });
    });
};

exports.pause = function(req, res) {
  var id = req.params.id;

  Demande
    .findById(id)
    .exec(function(err, demande) {
      if (err) { return handleError(req, res, err); }

      if (!demande) { return res.sendStatus(404); }

      demande.set('status', 'pause').save(function(err, result) {
        if (err) { return handleError(req, res, err); }

        res.status(200).send(result);
      });
    });
};

exports.save = function(req, res) {
  var id = req.params.id;
  var observations = req.body.observations;

  Demande
    .findById(id)
    .exec(function(err, demande) {
      if (err) { return handleError(req, res, err); }

      if (!demande) { return res.sendStatus(404); }

      demande.set('observations', observations).save(function(err, result) {
        if (err) { return handleError(req, res, err); }

        res.status(200).send(result);
      });
    });
};

exports.saveNotification = function(req, res, next) {
  var id = req.params.id;

  Demande
    .findById(id)
    .exec(function(err, demande) {
      if (err) return handleError(req, res, err);
      if (!demande) return res.sendStatus(404);

      var notification = _.assign(req.body, {createdAt: Date.now()});

      demande
        .set('notification', notification)
        .set('status', 'done')
        .save(function(err, result) {
          if (err) { return handleError(req, res, err); }

          var decoded = crypto.decode(result);
          Etablissement
            .findById(demande.etablissement)
            .exec(function(err, college) {
              Generator.editNotification(decoded, college, function(html) {

                tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
                  if (err) throw err;

                  wkhtmltopdf(html, {encoding: 'UTF-8', output: path}, function() {
                    sendNotificationToUser(demande, college, path, req, cleanupCallback);
                  });
                });

              });
            });

          res.status(200).send(result);
        });
    });
};

exports.downloadNotification = function(req, res) {
  var id = req.params.id;

  Demande
    .findById(id)
    .exec(function(err, demande) {
      if (err) return handleError(req, res, err);
      if (!demande) return res.sendStatus(404);

      var decoded = crypto.decode(demande);
      Etablissement
        .findById(demande.etablissement)
        .exec(function(err, college) {
          Generator.editNotification(decoded, college, function(html) {
            wkhtmltopdf(html, {encoding: 'UTF-8'}).pipe(res);
          });
        });
    });
};

exports.deleteNotification = function(req, res) {
  var id = req.params.id;

  Demande
    .findById(id)
    .exec(function(err, demande) {
      if (err) return handleError(req, res, err);
      if (!demande) return res.sendStatus(404);

      var file = demande.notification;
      if (!file) {
        return res.sendStatus(304);
      }

      var filePath = path.join(config.root + '/server/uploads/', file.name);

      fs.unlink(filePath, function(err) {
        if (err) {
          req.log.info(req.user + ', not deleted, not found: ' + filePath);
        } else {
          req.log.info(req.user + ', successfully deleted: ' + filePath);
        }

        file.remove();

        demande
          .save(function(err, result) {
            if (err) { return handleError(req, res, err); }

            return res.send(result).status(200);
          });
      });
    });
};

function handleError(req, res, err) {
  req.log.error(err);
  return res.status(500).send(err);
}
