module.exports = {
  options: {
    jshintrc: 'client/.jshintrc'
  },
  server: {
    options: {
      jshintrc: 'server/.jshintrc'
    },
    src: [
      'server/**/*.js',
      '!server/**/*.spec.js'
    ]
  },
  serverTest: {
    options: {
      jshintrc: 'server/.jshintrc-spec'
    },
    src: ['server/**/*.spec.js']
  },
  all: [
    'client/{app,components}/**/*.js',
    '!client/{app,components}/**/*.spec.js',
    '!client/{app,components}/**/*.mock.js'
  ],
  test: {
    src: [
      'client/{app,components}/**/*.spec.js',
      'client/{app,components}/**/*.mock.js'
    ]
  }
};
