import express from 'express';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { ConnectedRouter } from 'react-router-redux';

import { routes, store, history } from '../config';

const router = express.Router();

router.get('*', (req, res) => {
  const components = matchRoutes(routes, req.path);
  const promises = [];

  for (let i = 0, length = components.length; i < length; i += 1) {
    const { fetchData } = components[i].route.component;

    promises.push(fetchData instanceof Function ? fetchData(store) : Promise.resolve(null));
  }

  return Promise.all(promises).then(() => {
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
          <link rel="stylesheet" type="text/css" href="http://localhost:3000/public/client.css" />
        </head>
        <body>
          <section id="root">${application}</section>
          <script src="http://localhost:3000/public/client.js"></script>
        </body>
      </html>
    `;

    res.send(html);
  });
});

export default router;
