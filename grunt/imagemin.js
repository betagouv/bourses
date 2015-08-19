module.exports = {
  dist: {
    files: [{
      expand: true,
      cwd: 'client/assets/images',
      src: '{,*/}*.{png,jpg,jpeg,gif}',
      dest: 'dist/assets/images'
    }]
  }
};
