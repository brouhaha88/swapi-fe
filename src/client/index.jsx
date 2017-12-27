import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { renderRoutes } from 'react-router-config';

import { routes, getHistory, getStore } from '../config';
import reducers from '../ducks';

const history = getHistory();
const store = getStore(history);

function render() {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider store={store}>
        <Router history={history}>
          {renderRoutes(routes)}
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
}

render();

if (module.hot) {
  module.hot.accept('../config', () => {
    render();
  });

  module.hot.accept('../ducks', () => {
    store.replaceReducer(reducers);
  });
}
