'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN:                 'http://localhost:9000',
  SESSION_SECRET:         'bourses-secret',

  FC_CLIENT_ID:           'fc-client-if',
  FC_CLIENT_SECRET:       'fc-client-secret',

  SMTP_USER:              'toto',
  SMTP_PASS:              'password',
  SMTP_HOST:              'localhost'
};
