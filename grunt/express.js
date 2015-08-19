module.exports = {
  options: {
    port: '<%= port %>'
  },
  dev: {
    options: {
      script: 'server/app.js',
      debug: true
    }
  },
  prod: {
    options: {
      script: 'server/app.js'
    }
  }
};
