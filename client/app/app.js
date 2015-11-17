'use strict';

angular
  .module('boursesApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'angular-storage',
    'ngMessages',
    'angular-ladda',
    'angular-capitalize-filter',
    'mm.iban',
    'a11yBootstrap',
    'chart.js',
    'xeditable'
  ])
  .config(function($urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider, $httpProvider, storeProvider) {
    moment.locale('fr');
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $urlMatcherFactoryProvider.strictMode(false);
    $httpProvider.interceptors.push('authInterceptor');
    storeProvider.setStore('sessionStorage');
  })

  .factory('authInterceptor', function($rootScope, $q, $cookieStore) {
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('loginToken')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('loginToken');
        }

        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401 && response.message) {
          // remove any stale tokens
          $cookieStore.remove('loginToken');
          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function($rootScope, $state, $window, $location, Auth, editableOptions) {
    editableOptions.theme = 'bs3';
    $rootScope.$on('$stateChangeSuccess', function() {
      if ($window._paq) {
        $window._paq.push(['setCustomUrl', $location.path()]);
        $window._paq.push(['trackPageView']);
      }

      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (toState.authenticate && !loggedIn) {
          event.preventDefault();
          $state.go('layout.login');
        }
      });
    });
  });
