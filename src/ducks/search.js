import qs from 'qs';

function getRouter(state) {
  return state.router || {};
}

function getLocation(state) {
  return getRouter(state).location || {};
}

function getSearch(state) {
  return getLocation(state).search || {};
}

const SEARCH_STARTED = 'swapi/search/SEARCH_STARTED';
function searchStarted(payload = { fetching: true }) {
  return {
    payload,
    type: SEARCH_STARTED,
  };
}

const SEARCH_SUCCESS = 'swapi/search/SEARCH_SUCCESS';
function searchSuccess(payload) {
  return {
    payload: Object.assign({}, payload, { fetching: false }),
    type: SEARCH_SUCCESS,
  };
}

const SEARCH_FAILED = 'swapi/search/SEARCH_FAILED';
function searchFailed(payload) {
  return {
    payload: Object.assign({}, payload, { fetching: false }),
    type: SEARCH_FAILED,
  };
}

export function startSearch(payload) {
  return (dispatch, getState) => {
    const searchQuery = getSearch(getState());
    const { t, q } = qs.parse(searchQuery, { ignoreQueryPrefix: true });

    dispatch(searchStarted(Object.assign({}, payload, { t, q })));

    return fetch(`https://swapi.co/api/${t}/?search=${q}`)
      .then(res => res.json())
      .then(json => dispatch(searchSuccess(json)))
      .catch(error => dispatch(searchFailed({ error: error.message })));
  };
}

const initialState = {
  t: '',
  q: '',
  fetching: false,
  error: '',
  count: 0,
  next: null,
  previous: null,
  results: [],
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SEARCH_STARTED:
      return Object.assign({}, state, payload);
    case SEARCH_SUCCESS:
      return Object.assign({}, state, payload);
    case SEARCH_FAILED:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
