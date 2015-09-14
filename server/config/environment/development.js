'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/bourses'
  },

  smtp: {
    host: 'http://localhost:5000',
    user: 'toto',
    pass: 'password'
  },

  mailjet: {
    port: 465,
    host: '',
    secure: true,
    auth: {
        user: '',
        pass: ''
      }
  },

  port: 5000
};
