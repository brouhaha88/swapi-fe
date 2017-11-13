import qs from 'qs';

import { getRouterLocationSearch } from './router';

const getSearch = state => state.search || {};

const SEARCH_SUCCESS = 'swapi/search/SEARCH_SUCCESS';
const searchSuccess = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: SEARCH_SUCCESS,
});

const SEARCH_FAILED = 'swapi/search/SEARCH_FAILED';
const searchFailed = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: SEARCH_FAILED,
});

const SEARCH_STARTED = 'swapi/search/SEARCH_STARTED';
export const startSearch = payload => (dispatch, getState) => {
  const searchQuery = getRouterLocationSearch(getState());
  const { t: type, q: query } = qs.parse(searchQuery, { ignoreQueryPrefix: true });

  dispatch({
    payload: Object.assign({}, payload, { type, query, fetching: true }),
    type: SEARCH_STARTED,
  });

  return fetch(`https://swapi.co/api/${type}/?search=${query}`)
    .then(res => res.json())
    .then(json => dispatch(searchSuccess(json)))
    .catch(error => dispatch(searchFailed({ error: error.message })));
};

const SEARCH_MORE_SUCCESS = 'swapi/search/SEARCH_MORE_SUCCESS';
const searchMoreSuccess = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: SEARCH_MORE_SUCCESS,
});

const SEARCH_MORE_FAILED = 'swapi/search/SEARCH_MORE_FAILED';
const searchMoreFailed = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: SEARCH_MORE_FAILED,
});

const SEARCH_MORE_STARTED = 'swapi/search/SEARCH_MORE_STARTED';
export const startSearchMore = payload => (dispatch, getState) => {
  const { next, results } = getSearch(getState());

  dispatch({
    payload: Object.assign({}, payload, { fetching: true }),
    type: SEARCH_MORE_STARTED,
  });

  return fetch(next)
    .then(res => res.json())
    .then(json => dispatch(searchMoreSuccess({
      next: json.next,
      previous: json.previous,
      results: [...results, ...json.results],
    })))
    .catch(error => dispatch(searchMoreFailed({ error: error.message })));
};

const initialState = {
  type: '',
  query: '',
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
