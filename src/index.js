import http from 'http';
import express from 'express';
// TODO: Don't forget to manage it in production!!!
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
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

function hotReplacementMiddleware(req, res, next) {
  let middleware = serverRouter;

  if (module.hot) {
    module.hot.accept('./server', () => {
      middleware = serverRouter;
    });
  }

  middleware(req, res, next);
}

app.use('/', hotReplacementMiddleware);

const server = http.createServer(app);

server.listen(3000);
