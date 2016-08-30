var webpack = require('webpack');

var webpackConfig = {
  entry: './src/js/client.js',
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: __dirname + '/public/js',
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  }
};

module.exports = webpackConfig;
