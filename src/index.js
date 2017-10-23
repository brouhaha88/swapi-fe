import http from 'http';
import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpackDevMiddleware from 'webpack-dev-middleware';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackClientConfig from '../webpack.config.client';
import serverRouter from './server';

const app = express();
const compiler = webpack(webpackClientConfig);

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/../public`);

app.use('/public/', express.static('build'));

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackClientConfig.output.publicPath,
  stats: {
    colors: true,
  },
}));
app.use(webpackHotMiddleware(compiler, {
  dynamicPublicPath: true,
}));

app.use('/', serverRouter);

const server = http.createServer(app);

server.listen(3000);

if (module.hot) {
  module.hot.accept('./server', () => {
    app.use('/', serverRouter);
  });
}
