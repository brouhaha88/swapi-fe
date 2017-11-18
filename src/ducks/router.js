export const getRouter = state => state.router || {};

export const getRouterLocation = state => getRouter(state).location || {};

export const getRouterLocationPathname = state => getRouterLocation(state).pathname || '';

export const getRouterLocationSearch = state => getRouterLocation(state).search || '';

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
export const changeLocation = payload => ({
  payload,
  type: LOCATION_CHANGE,
});

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
const callHistoryMethod = method => args => ({
  payload: {
    method,
    args,
  },
  type: CALL_HISTORY_METHOD,
});
export const push = callHistoryMethod('push');
export const replace = callHistoryMethod('replace');
export const go = callHistoryMethod('go');
export const goBack = callHistoryMethod('goBack');
export const goForward = callHistoryMethod('goForward');

const initialState = {
  location: null,
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case LOCATION_CHANGE:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
