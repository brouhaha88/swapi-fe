import http from 'http';
import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpackDevMiddleware from 'webpack-dev-middleware';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpackHotMiddleware from 'webpack-hot-middleware';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { ConnectedRouter } from 'react-router-redux';

import { routes, store, history } from './config';
import webpackClientConfig from '../webpack.config.client';

function createServer() {
  const app = express();
  const compiler = webpack(webpackClientConfig);

  app.use(express.static('build'));

  app.get('/client.js', webpackDevMiddleware(compiler, {
    publicPath: webpackClientConfig.output.publicPath,
  }));
  app.get('/client.hot-update.js', webpackHotMiddleware(compiler, {
    path: '/client.hot-update.js',
  }));

  app.get('/*', (req, res) => {
    const components = matchRoutes(routes, req.path);
    const promises = [];

    for (let i = 0, length = components.length; i < length; i += 1) {
      const { fetchData } = components[i].route.component;

      promises.push(fetchData instanceof Function ? fetchData(store) : Promise.resolve(null));
    }

    return Promise.all(promises).then(() => {
      console.log(store.getState());
      const application = renderToString(
        <AppContainer>
          <Provider store={store}>
            <ConnectedRouter history={history}>
              {renderRoutes(routes)}
            </ConnectedRouter>
          </Provider>
        </AppContainer>,
      );
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>SWAPI</title>
            <link rel="stylesheet" type="text/css" href="client.css" />
          </head>
          <body>
            <section id="root">${application}</section>
            <script src="http://localhost:3000/client.js"></script>
          </body>
        </html>
      `;

      res.send(html);
    });
  });

  const server = http.createServer(app);

  server.listen(3000);

  return server;
}

let currentServer = createServer();

if (module.hot) {
  module.hot.accept('./config', () => {
    currentServer.close(() => {
      currentServer = createServer();
    });
  });
}
