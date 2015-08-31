module.exports = {
  dist: {
    files: {
      src: [
        'dist/{,*/}*.js',
        'dist/{,*/}*.css',
        'dist/assets/fonts/*',
        '!dist/server/*',
        '!dist/bower_components/spin.js',
        '!dist/bower_components/Chart.js',
        '!dist/bower_components/angular-chart.js',
        '!dist/bower_components/Chart.StackedBar.js'
      ]
    }
  }
};
