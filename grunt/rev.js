module.exports = {
  dist: {
    files: {
      src: [
        'dist/{,*/}*.js',
        'dist/{,*/}*.css',
        'dist/assets/fonts/*',
        '!dist/server/*',
        '!dist/lib/*'
      ]
    }
  }
};
