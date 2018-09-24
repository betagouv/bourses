'use strict';

var config = require('../../config/environment').sendGrid;
const {callbackify, promisify} = require('util');
const sgMail = require('@sendgrid/mail');
const readFile = promisify(require('fs').readFile);

sgMail.setApiKey(config.apiKey);

async function sendMail(to, replyto, subject, body, filepath) {

  var email = {
    from: 'contact@bourse.beta.gouv.fr',
    to: to,
    replyTo: replyto,
    subject: 'Bourse - ' + subject,
    html: body
  };

  if (filepath) {
    email.attachments = [{
      filename: 'notification.pdf',
      content: await readFile(filepath, 'base64'),
      type: 'application/pdf'
    }];
  }

  if (process.env.NODE_ENV === 'production') {
    return sgMail.send(email);
  }
  // else {
  //   console.log(email);
  // }
};

exports.sendMail = callbackify(sendMail)
