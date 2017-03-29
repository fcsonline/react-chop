module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false
  },
  webpack: {
    rules: {
      css: {
        options: {
          modules: true,
          localIdentName: '[hash:base64:5]'
        }
      }
    },
    uglify: {
      mangle: false,
      beautify: true
    }
  }
}
