module.exports = {
    plugins: [
      require('autoprefixer')({
        overrideBrowserslist: ['last 2 versions'],
        grid: true,
        flexbox: true,
        warnings: false // disable Autoprefixer warnings
      })
    ]
  }