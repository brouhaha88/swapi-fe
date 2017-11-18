import { URL } from 'url';
import express from 'express';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router';
import { Helmet } from 'react-helmet';

import { routes, storeConfig } from '../../config';

const router = express.Router();

router.get('*', (req, res) => {
  const context = {};
  const requestUrl = new URL(`${req.protocol}://${req.hostname}${req.originalUrl}`);
  const components = matchRoutes(routes, requestUrl.pathname);
  const promises = [];
  const history = storeConfig.getHistory();
  const store = storeConfig.getStore(history, {
    router: {
      location: {
        pathname: requestUrl.pathname,
        search: requestUrl.search,
      },
    },
  });

  for (let i = 0, length = components.length; i < length; i += 1) {
    const { fetchData } = components[i].route.component;

    promises.push(fetchData instanceof Function ? fetchData(store) : Promise.resolve(null));
  }

  return Promise.all(promises).then(() => {
    const application = renderToString(
      <AppContainer>
        <Provider store={store}>
          <StaticRouter location={req.url} context={context} >
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      </AppContainer>,
    );
    const head = Helmet.renderStatic();

    res.render('index', {
      head,
      application,
      state: JSON.stringify(store.getState()),
    });
  });
});

export default router;
