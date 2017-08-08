'use strict';

var sendgrid  = require('sendgrid')('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');

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

  if (process.env.NODE_ENV === 'production') {
    sendgrid.send(email, done);
  }
  // else {
  //   console.log(email);
  // }
};
