/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/connection', require('./api/connection'));
  app.use('/api/caf', require('./api/caf'));
  app.use('/api/communes', require('./api/communes'));
  app.use('/api/demandes', require('./api/demande'));
  app.use('/api/etablissements', require('./api/etablissement'));
  app.use('/api/users', require('./api/user'));

  app.use('/oauth', require('./oauth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|oauth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      var indexPath = path.join(app.get('appPath'), 'index.html');
      res.sendFile(indexPath);
    });
};
