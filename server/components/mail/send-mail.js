'use strict';

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var config = require('../../config/environment');

var Sender = function() {
  this._user = process.env.SMTP_USER || config.SMTP_USER;
  this._pass = process.env.SMTP_PASS || config.SMTP_PASS;
};

Sender.prototype = {};

Sender.prototype.sendContent = function(from, to, subject, body, attachments, done) {
  var transporter = nodemailer.createTransport(
    smtpTransport({
      port: 465,
      host: process.env.SMTP_HOST || config.SMTP_HOST,
      secure: true,
      auth: {
        user: this._user,
        pass: this._pass
      }
    })
  );

  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: body
  };

  if (attachments) {
    mailOptions.attachments = attachments;
  }

  transporter.sendMail(mailOptions, done);
};

exports.sendMail = function(mail, title, body, attachements) {
  return Sender.sendContent(
    mail,
    'Demande de bourses simplifiées - ' + title,
    body,
    attachements
  );
};
