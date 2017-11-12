import qs from 'qs';

function getRouter(state) {
  return state.router || {};
}

function getRouterLocation(state) {
  return getRouter(state).location || {};
}

function getRouterLocationSearch(state) {
  return getRouterLocation(state).search || {};
}

function getSearch(state) {
  return state.search || {};
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
    const searchQuery = getRouterLocationSearch(getState());
    const { t, q } = qs.parse(searchQuery, { ignoreQueryPrefix: true });

    dispatch(searchStarted(Object.assign({}, payload, { t, q })));

    return fetch(`https://swapi.co/api/${t}/?search=${q}`)
      .then(res => res.json())
      .then(json => dispatch(searchSuccess(json)))
      .catch(error => dispatch(searchFailed({ error: error.message })));
  };
}

const SEARCH_MORE_STARTED = 'swapi/search/SEARCH_MORE_STARTED';
function searchMoreStarted(payload = { fetching: true }) {
  return {
    payload,
    type: SEARCH_MORE_STARTED,
  };
}

const SEARCH_MORE_SUCCESS = 'swapi/search/SEARCH_MORE_SUCCESS';
function searchMoreSuccess(payload) {
  return {
    payload: Object.assign({}, payload, { fetching: false }),
    type: SEARCH_MORE_SUCCESS,
  };
}

const SEARCH_MORE_FAILED = 'swapi/search/SEARCH_MORE_FAILED';
function searchMoreFailed(payload) {
  return {
    payload: Object.assign({}, payload, { fetching: false }),
    type: SEARCH_MORE_FAILED,
  };
}

export function startSearchMore(payload) {
  return (dispatch, getState) => {
    const { next, results } = getSearch(getState());

    dispatch(searchMoreStarted(payload));

    return fetch(next)
      .then(res => res.json())
      .then(json => dispatch(searchMoreSuccess({
        next: json.next,
        previous: json.previous,
        results: [...results, ...json.results],
      })))
      .catch(error => dispatch(searchMoreFailed({ error: error.message })));
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
    case SEARCH_SUCCESS:
    case SEARCH_FAILED:
    case SEARCH_MORE_STARTED:
    case SEARCH_MORE_SUCCESS:
    case SEARCH_MORE_FAILED:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
