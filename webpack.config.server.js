const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    server: [
      'webpack/hot/poll?1000',
      './src/server',
    ],
  },
  watch: true,
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
      }, {
        loader: 'eslint-loader',
      }],
    }, {
      test: /\.sss$/,
      use: [{
        loader: 'css-loader/locals',
      }, {
        loader: 'postcss-loader',
        options: {
          parser: 'sugarss',
          includePaths: ['./node_modules'],
        },
      }],
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
    new StartServerPlugin({
      name: 'server.js',
      nodeArgs: ['--inspect'],
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.SERVER': 'true',
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js',
    chunkFilename: 'server.js',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
};
