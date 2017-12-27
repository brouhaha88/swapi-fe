const webpack = require('webpack');
const path = require('path');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    client: [
      'babel-polyfill',
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      './src/client',
    ],
  },
  target: 'web',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: [{
        loader: 'babel-loader',
      }, {
        loader: 'eslint-loader',
      }],
      exclude: /node_modules/,
    }, {
      test: /\.sss$/,
      use: ExtractCssChunks.extract({
        use: [{
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader',
          options: {
            parser: 'sugarss',
            includePaths: ['./node_modules'],
          },
        }],
      }),
    }, {
      test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          publicPath: '/public/',
        },
      }],
    }],
  },
  plugins: [
    new ExtractCssChunks(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: Infinity,
    }),
  ],
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/public/',
    filename: 'client.js',
    chunkFilename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
};
