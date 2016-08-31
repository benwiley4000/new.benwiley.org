var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

var webpackConfig = {
  entry: __dirname + '/src/js/client.js',
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: __dirname + '/public/js',
    filename: 'index.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.scss$/,
        loader: 'style!css?sourceMap!postcss!sass?sourceMap'
      }
    ]
  },
  postcss: function () {
    return [autoprefixer('> 1%')];
  }
};

module.exports = webpackConfig;
