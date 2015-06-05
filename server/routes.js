/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/connection', require('./api/connection'));
  app.use('/api/communes', require('./api/communes'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      var indexPath = path.join(app.get('appPath'), 'index.html');
      res.sendFile(indexPath);
    });
};
