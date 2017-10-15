import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import thunk from 'redux-thunk';

import reducers from '../ducks';

const history = process.env.SERVER ? createMemoryHistory() : createBrowserHistory();
const router = routerMiddleware(history);

const store = createStore(
  reducers,
  compose(
    applyMiddleware(
      thunk,
      router,
    ), (
      !process.env.SERVER &&
      // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION__()
    ) || (() => {}),
  ),
);

export {
  store,
  history,
};
