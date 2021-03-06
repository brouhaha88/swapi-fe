import { createStore, applyMiddleware, compose } from 'redux';
import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import thunkMiddleware from 'redux-thunk';

import routerUtil from '../utils/router';
import reducers from '../ducks';

function getComposer() {
  // eslint-disable-next-line no-underscore-dangle
  return typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    // eslint-disable-next-line no-underscore-dangle
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
}

function getPreloadedState() {
  let state = {};

  // eslint-disable-next-line no-underscore-dangle
  if (typeof window === 'object' && window.__STATE__) {
    // eslint-disable-next-line no-underscore-dangle
    state = window.__STATE__;
  }

  return state;
}

export function getHistory(opts) {
  return process.env.SERVER
    ? createMemoryHistory(opts)
    : createBrowserHistory(opts);
}

export function getStore(history) {
  const {
    enhancer: routerEnhancer,
    middleware: routerMiddleware,
  } = routerUtil.connectToHistory(history);

  return createStore(
    reducers,
    process.env.SERVER
      ? null
      : getPreloadedState(),
    getComposer()(
      routerEnhancer,
      applyMiddleware(
        thunkMiddleware,
        routerMiddleware,
      ),
    ),
  );
}
