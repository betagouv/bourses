module.exports = {
  options: {
    port: '<%= port %>'
  },
  dev: {
    options: {
      script: 'server/app.js'
    }
  },
  prod: {
    options: {
      script: 'server/app.js'
    }
  }
};
