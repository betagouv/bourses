'use strict';

module.exports = {
  options: {

  },

  // Inject application script files into index.html
  scripts: {
    options: {
      transform: function(filePath) {
        filePath = filePath.replace('/client/', '');
        filePath = filePath.replace('/.tmp/', '');
        return '<script src="' + filePath + '"></script>';
      },
      starttag: '<!-- injector:js -->',
      endtag: '<!-- endinjector -->'
    },
    files: {
      'client/index.html': [
          ['{.tmp,client}/{app,components}/**/*.js',
           '!{.tmp,client}/app/app.js',
           '!{.tmp,client}/{app,components}/**/*.spec.js',
           '!{.tmp,client}/{app,components}/**/*.mock.js']
        ]
    }
  },

  // Inject component scss into app.scss
  sass: {
    options: {
      transform: function(filePath) {
        filePath = filePath.replace('/client/app/', '');
        filePath = filePath.replace('/client/components/', '');
        return '@import \'' + filePath + '\';';
      },

      starttag: '// injector',
      endtag: '// endinjector'
    },
    files: {
      'client/app/app.scss': [
        'client/{app,components}/**/*.{scss,sass}',
        '!client/app/app.{scss,sass}'
      ]
    }
  },

  // Inject component css into index.html
  css: {
    options: {
      transform: function(filePath) {
        filePath = filePath.replace('/client/', '');
        filePath = filePath.replace('/.tmp/', '');
        return '<link rel="stylesheet" href="' + filePath + '">';
      },

      starttag: '<!-- injector:css -->',
      endtag: '<!-- endinjector -->'
    },
    files: {
      'client/index.html': [
        'client/{app,components}/**/*.css'
      ]
    }
  }
};
