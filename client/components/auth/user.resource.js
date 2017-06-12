'use strict';

angular.module('boursesApp').factory('User', function($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  },
    {
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },

      generateToken: {
        method: 'POST',
        params: {
          id: 'generate_token'
        }
      }
    });
});
