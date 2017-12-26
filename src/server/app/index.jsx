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
  const preloading = [];
  const fetching = [];
  const history = storeConfig.getHistory({
    initialEntries: [`${requestUrl.pathname}${requestUrl.search}`],
    initialIndex: 0,
  });
  const store = storeConfig.getStore(history);

  for (let i = 0, length = components.length; i < length; i += 1) {
    const { preload } = components[i].route.component;

    preloading.push(preload instanceof Function ? preload() : Promise.resolve(null));
  }

  return Promise.all(preloading).then((preloaded) => {
    for (let i = 0; i < preloaded.length; i += 1) {
      if (preloaded) {
        const { fetchData } = preloaded[i];

        fetching.push(fetchData instanceof Function ? fetchData(store) : Promise.resolve(null));
      }
    }

    return Promise.all(fetching).then(() => {
      const application = renderToString(
        <AppContainer>
          <Provider store={store}>
            <StaticRouter location={requestUrl.pathname} context={context}>
              {renderRoutes(routes)}
            </StaticRouter>
          </Provider>
        </AppContainer>,
      );
      const { url: redirectUrl } = context;

      if (redirectUrl) {
        res.redirect(redirectUrl);
      } else {
        const chunkNames = flushChunkNames();
        const { js, styles, cssHash } = flushChunks(res.locals.webpackStats.toJson(), {
          chunkNames,
          before: ['client'],
          after: [],
        });
        const head = Helmet.renderStatic();

        res.render('index', {
          head,
          application,
          scripts: js.toString(),
          styles: styles.toString(),
          cssHash: cssHash.toString(),
          preloadedState: `<script type='text/javascript'>window.__STATE__ = ${JSON.stringify(store.getState())}</script>`,
        });
      }
    });
  });
});

export default router;
