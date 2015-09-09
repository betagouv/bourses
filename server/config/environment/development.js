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

  port: 5000
};
