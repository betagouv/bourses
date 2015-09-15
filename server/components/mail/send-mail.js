'use strict';

var config = require('../../config/environment').sendGrid;
var sendgrid  = require('sendgrid')(config.apiKey);

exports.sendMail = function(to, replyTo, subject, body, filepath, done) {

  var email = new sendgrid.Email({
    from: 'bourse@sgmap.fr',
    to: to,
    replyTo: replyTo,
    subject: 'Bourse - ' + subject,
    html: body
  });

  if (filepath) {
    email.addFile({
      filename: 'notification.pdf',
      path: filepath,
      contentType: 'application/pdf'
    });
  }

  sendgrid.send(email, done);
};
