import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';

import reducers from '../ducks';

const history = createHistory();
const router = routerMiddleware(history);

const store = createStore(
  reducers,
  compose(
    applyMiddleware(
      thunk,
      router,
    ),
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ),
);

export {
  store,
  history,
};
