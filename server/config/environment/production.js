'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.IP ||
            undefined,

  // Server port
  port:     process.env.PORT ||
            9000,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGODB_URL ||
            'mongodb://localhost/bourses'
  },

  smtp: {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },

  mailjet: {
    port: 465,
    host: 'in.mailjet.com',
    secure: true,
    auth: {
      user: process.env.MAILJET_API_KEY,
      pass: process.env.MAILJET_SECRET_KEY
    }
  }

};
