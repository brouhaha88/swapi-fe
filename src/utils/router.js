import { CALL_HISTORY_METHOD, changeLocation } from '../ducks/router';

const createRouterEnhancer = history => next => (reducer, preloadedState, enhancer) => {
  let state = preloadedState;

  if (process.env.SERVER) {
    const { location } = history;

    if (location) {
      state = Object.assign({}, { router: { location } });
    }
  }

  const store = next(reducer, state, enhancer);

  history.listen((location) => {
    store.dispatch(changeLocation({ location }));
  });

  return store;
};

const createRouterMiddleware = history => () => next => (action) => {
  if (action.type !== CALL_HISTORY_METHOD) {
    return next(action);
  }

  return history[action.payload.method](...action.payload.args);
};

export default {
  connectToHistory: history => ({
    enhancer: createRouterEnhancer(history),
    middleware: createRouterMiddleware(history),
  }),
};
