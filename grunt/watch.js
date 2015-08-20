module.exports = {
  injectJS: {
    files: [
      'client/{app,components}/**/*.js',
      '!client/{app,components}/**/*.spec.js',
      '!client/{app,components}/**/*.mock.js',
      '!client/app/app.js'],
    tasks: ['injector:scripts']
  },
  injectCss: {
    files: [
      'client/{app,components}/**/*.css'
    ],
    tasks: ['injector:css']
  },
  mochaTest: {
    files: ['server/**/*.spec.js'],
    tasks: ['env:test', 'mochaTest']
  },
  jsTest: {
    files: [
      'client/{app,components}/**/*.spec.js',
      'client/{app,components}/**/*.mock.js'
    ],
    tasks: ['newer:jshint:all', 'karma']
  },
  injectSass: {
    files: [
      'client/{app,components}/**/*.{scss,sass}'],
    tasks: ['injector:sass']
  },
  sass: {
    files: [
      'client/{app,components}/**/*.{scss,sass}'],
    tasks: ['sass', 'autoprefixer']
  },
  gruntfile: {
    files: ['Gruntfile.js']
  },
  livereload: {
    files: [
      '{.tmp,client}/{app,components}/**/*.css',
      '{.tmp,client}/{app,components}/**/*.html',
      '{.tmp,client}/{app,components}/**/*.js',
      '!{.tmp,client}{app,components}/**/*.spec.js',
      '!{.tmp,client}/{app,components}/**/*.mock.js',
      'client/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
    ],
    options: {
      livereload: true
    }
  },
  express: {
    files: [
      'server/**/*.{js,json}'
    ],
    tasks: ['express:dev'],
    options: {
      livereload: true,
      nospawn: true //Without this option specified express won't be reloaded
    }
  }
};
