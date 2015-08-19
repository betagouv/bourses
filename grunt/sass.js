module.exports = {
  server: {
    options: {
      sourceMap: true,
      includePaths: [
        'client/bower_components',
        'client/app',
        'client/components'
      ]
    },
    files: [{
      expand: true,
      cwd: 'client',
      src: 'app/app.scss',
      dest: '.tmp/',
      ext: '.css'
    }]
  }
};
