'use strict';

var config = require('../../config/environment').sendGrid;
var sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.apiKey);

exports.sendMail = function(to, replyto, subject, body, filepath, done) {

  var email = {
    from: 'contact@bourse.beta.gouv.fr',
    to: to,
    replyto: replyto,
    subject: 'Bourse - ' + subject,
    html: body
  };

  if (filepath) {
    email.addFile({
      filename: 'notification.pdf',
      path: filepath,
      contentType: 'application/pdf'
    });
  }

  if (process.env.NODE_ENV === 'production') {
    sgMail.send(email, done);
  }
  // else {
  //   console.log(email);
  // }
};
