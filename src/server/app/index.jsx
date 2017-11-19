import { URL } from 'url';
import express from 'express';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
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
  const history = storeConfig.getHistory({
    initialEntries: [`${requestUrl.pathname}${requestUrl.search}`],
    initialIndex: 0,
  });
  const store = storeConfig.getStore(history);

  for (let i = 0, length = components.length; i < length; i += 1) {
    const { fetchData } = components[i].route.component;

    promises.push(fetchData instanceof Function ? fetchData(store) : Promise.resolve(null));
  }

  return Promise.all(promises).then(() => {
    const application = renderToString(
      <AppContainer>
        <Provider store={store}>
          <StaticRouter location={requestUrl.pathname} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      </AppContainer>,
    );
    const chunkNames = flushChunkNames().map(name => name.replace(/\//, '-'));
    const { js, styles } = flushChunks(res.locals.webpackStats.toJson(), {
      chunkNames,
      before: ['main'],
      after: [],
    });
    const head = Helmet.renderStatic();
    const { url: redirectUrl } = context;

    if (redirectUrl) {
      res.redirect(redirectUrl);
    } else {
      res.render('index', {
        head,
        application,
        scripts: js.toString(),
        styles: styles.toString(),
        state: JSON.stringify(store.getState()),
      });
    }
  });
});

export default router;
