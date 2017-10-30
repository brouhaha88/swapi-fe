import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import thunk from 'redux-thunk';

import reducers from '../ducks';

function getComposer() {
  // eslint-disable-next-line no-underscore-dangle
  return typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :
    compose;
}

function getAndResetState() {
  let state = {};

  // eslint-disable-next-line no-underscore-dangle
  if (typeof window === 'object' && window.__STATE__) {
    // eslint-disable-next-line no-underscore-dangle
    state = JSON.parse(window.__STATE__);

    // eslint-disable-next-line no-underscore-dangle
    delete window.__STATE__;
  }

  return state;
}

function getHistory(options = {}) {
  return process.env.SERVER ?
    createMemoryHistory(options) :
    createBrowserHistory(options);
}

function getStore(history) {
  const router = routerMiddleware(history);

  return createStore(
    reducers,
    getAndResetState(),
    getComposer()(
      applyMiddleware(
        thunk,
        router,
      ),
    ),
  );
}

export default {
  getHistory,
  getStore,
};
