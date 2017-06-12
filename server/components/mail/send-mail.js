'use strict';

var config = require('../../config/environment').sendGrid;
var sendgrid  = require('sendgrid')(config.apiKey);

exports.sendMail = function(to, replyto, subject, body, filepath, done) {

  var email = new sendgrid.Email({
    from: 'contact@bourse.beta.gouv.fr',
    to: to,
    replyto: replyto,
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

  if (config.env === 'production') {
    sendgrid.send(email, done);
  } else {
    console.log(email);
  }
};
