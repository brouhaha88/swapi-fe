const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    'react-hot-loader/patch',
    './src/client.jsx',
  ],
  target: 'web',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: [
        'babel-loader',
        'eslint-loader',
      ],
      exclude: /node_modules/,
    }, {
      test: /\.(css|scss)$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            includePaths: ['./node_modules'],
          },
        },
      ],
    }, {
      test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          publicPath: '/',
        },
      }],
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'public/index.ejs',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    host: 'localhost',
    port: 3000,
    publicPath: '/',
    historyApiFallback: true,
    hot: true,
  },
  output: {
    path: path.join(__dirname, './build'),
    publicPath: '',
    filename: 'client.js',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
};
