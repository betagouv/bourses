module.exports = {
  html: ['dist/{,*/}*.html'],
  css: ['dist/{,*/}*.css'],
  js: ['dist/{,*/}*.js'],
  options: {
    assetsDirs: [
      'dist',
      'dist/assets/images'
    ],

    // This is so we update image references in our ng-templates
    patterns: {
      js: [
        [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
      ]
    }
  }
};
