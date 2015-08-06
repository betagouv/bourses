'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var wkhtmltopdf = require('wkhtmltopdf');
var path = require('path');
var fs = require('fs');

var config = require('../../config/environment');
var Demande = require('./demande.model');
var Etablissement = require('../etablissement/etablissement.model');
var Generator = require('../../components/pdf/generator');
var sendMail = require('../../components/mail/send-mail').sendMail;
var crypto = require('../../components/crypto/crypto');

function sendAttributionNotification(email, stream, req, cb) {
  var subject = 'Bourse de collège - Notification d\'attribution';
  var body = 'Merci d\'avoir passé votre demande avec notre service.';
  var attachments = [{
    filename: 'notification.pdf',
    content: stream
  }];

  sendMail(email, subject, body, attachments, function(error, info) {
    if (error) {
      req.log.error('Notification error: ' + error);
      if (cb) cb(error, null);
    } else {
      req.log.info('Notification sent: ' + info.response);
      if (cb) cb(null, info.response);
    }
  });
}

function sendConfirmationToUser(email, req) {
  var subject = 'Confirmation de l\'envoi de votre demande';
  var body = 'Merci d\'avoir passé votre demande avec notre service.';

  sendMail(email, subject, body);
  req.log.info('Notification sent to: ' + email);
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

        sendMail(email, subject, body);
        req.log.info('Notification sent to: ' + etablissement.contact);
      }
    });
}

// Creates a new demande in the DB.
exports.create = function(req, res) {

  var encoded = crypto.encode(req.body);

  Demande.create({
    etablissement: req.params.college,
    data: encoded
  }, function(err, demande) {
    if (err) { return handleError(req, res, err); }

    sendConfirmationToUser(req.body.identiteAdulte.email, req);
    sendNotificationToAgent(req.body.identiteAdulte, req.params.college, req);

    return res.status(201).json(demande);
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

      if (demande.status === 'new') {
        demande
          .set('status', 'pending')
          .save();
      }

      var decoded = crypto.decode(demande);
      return res.json(decoded);
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

      demande
        .set('notification', req.body)
        .set('status', 'done')
        .save(function(err, result) {
          if (err) { return handleError(req, res, err); }

          var decoded = crypto.decode(result);
          Etablissement
            .findById(demande.etablissement)
            .exec(function(err, college) {
              Generator.editNotification(decoded, college, function(html) {
                var stream = wkhtmltopdf(html, {encoding: 'UTF-8'});
                sendAttributionNotification('del.florian@gmail.com', stream, req);
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
