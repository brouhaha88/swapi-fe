import express from 'express';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { ConnectedRouter } from 'react-router-redux';

import { routes, storeConfig } from '../config';

const router = express.Router();

router.get('*', (req, res) => {
  const components = matchRoutes(routes, req.path);
  const promises = [];
  const history = storeConfig.getHistory();
  const store = storeConfig.getStore(history);

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

    res.render('index', {
      application,
      state: JSON.stringify(store.getState()),
    });
  });
});

export default router;
