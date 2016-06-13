module.exports = {
  dist: {
    files: [{
      expand: true,
      dot: true,
      cwd: 'client',
      dest: 'dist',
      src: [
        '*.{ico,png,txt,pdf}',
        '.htaccess',
        'bower_components/**/*',
        'assets/images/{,*/}*.{webp}',
        'assets/files/*',
        'index.html'
      ]
    }, {
      expand: true,
      cwd: '.tmp/images',
      dest: 'dist/assets/images',
      src: ['generated/*']
    }]
  },
  styles: {
    expand: true,
    cwd: 'client',
    dest: '.tmp/',
    src: ['{app,components}/**/*.css']
  }
};
