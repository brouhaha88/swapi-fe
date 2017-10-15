import http from 'http';
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { ConnectedRouter } from 'react-router-redux';

import { routes, store, history } from './config';

function createServer() {
  const app = express();

  app.use(express.static('public'));

  app.get('/*', (req, res) => {
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
