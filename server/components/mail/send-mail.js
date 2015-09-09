'use strict';

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var config = require('../../config/environment').smtp;

exports.sendMail = function(to, from, subject, body, attachments, done) {
  var transporter = nodemailer.createTransport(
    smtpTransport({
      port: 587,
      host: config.host,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.user,
        pass: config.pass
      }
    })
  );

  var mailOptions = {
    from: from,
    to: to,
    subject: 'Bourse - ' + subject,
    html: body
  };

  if (attachments) {
    mailOptions.attachments = attachments;
  }

  transporter.sendMail(mailOptions, done);
};
