module.exports = {
  target: {
    src: 'client/index.html',
    ignorePath: 'client/',
    exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/ ]
  }
};
