'use strict';

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var config = require('../../config/environment').mailjet;

exports.sendMail = function(to, replyTo, subject, body, attachments, done) {
  var transporter = nodemailer.createTransport(
    smtpTransport(config)
  );

  var mailOptions = {
    from: 'bourse@sgmap.fr',
    to: to,
    replyTo: replyTo,
    subject: 'Bourse - ' + subject,
    html: body
  };

  if (attachments) {
    mailOptions.attachments = attachments;
  }

  transporter.sendMail(mailOptions, done);
};
