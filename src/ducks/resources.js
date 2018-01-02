import qs from 'qs';

import { getRouterLocationPathname, getRouterLocationSearch } from './router';
import { getAppApiUrl } from './metadata/app';

export const getResources = state => state.resources || {};

export const getResourcesByType = (state, type) => getResources(state)[type] || {};

const FETCH_RESOURCES_SUCCEEDED = 'swapi/resources/FETCH_RESOURCES_SUCCEEDED';
const fetchResourcesSucceeded = (payload = {}) => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCES_SUCCEEDED,
});

const FETCH_RESOURCES_FAILED = 'swapi/resources/FETCH_RESOURCES_FAILED';
const fetchResourcesFailed = (payload = {}) => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCES_FAILED,
});

const FETCH_RESOURCES_STARTED = 'swapi/resources/FETCH_RESOURCES_STARTED';
// Technically it's not an action creator. made to split logic between fetching and searching.
const fetchResources = (payload, dispatch, state) => {
  const url = getAppApiUrl(state);
  const activeType = getRouterLocationPathname(state).replace('/', '');

  dispatch({
    payload: { fetching: true },
    type: FETCH_RESOURCES_STARTED,
  });

  return fetch(`${url}${activeType}/`)
    .then(res => res.json())
    .then(json => dispatch(fetchResourcesSucceeded({
      [activeType]: Object.assign({}, json, { error: '' }),
    })))
    .catch(error => dispatch(fetchResourcesFailed({
      [activeType]: { error: error.message },
    })));
};

const SEARCH_RESOURCES_SUCCEEDED = 'swapi/resources/SEARCH_RESOURCES_SUCCEEDED';
const searchResourcesSucceeded = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: SEARCH_RESOURCES_SUCCEEDED,
});

const SEARCH_RESOURCES_FAILED = 'swapi/resources/SEARCH_RESOURCES_FAILED';
const searchResourcesFailed = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: SEARCH_RESOURCES_FAILED,
});

const SEARCH_RESOURCES_STARTED = 'swapi/resources/SEARCH_RESOURCES_STARTED';
// Technically it's not an action creator. made to split logic between fetching and searching.
const searchResources = (payload, dispatch, state) => {
  const url = getAppApiUrl(state);
  const activeType = getRouterLocationPathname(state).replace('/', '');
  const searchQuery = getRouterLocationSearch(state);
  const { q: query } = qs.parse(searchQuery, { ignoreQueryPrefix: true });

  dispatch({
    payload: Object.assign({}, payload, { fetching: true }),
    type: SEARCH_RESOURCES_STARTED,
  });

  return fetch(`${url}${activeType}/?search=${query}`)
    .then(res => res.json())
    .then(json => dispatch(searchResourcesSucceeded({
      [activeType]: Object.assign({}, json, { error: '' }),
    })))
    .catch(error => dispatch(searchResourcesFailed({
      [activeType]: { error: error.message },
    })));
};

export const fetchOrSearchResources = payload => (dispatch, getState) => {
  const searchQuery = getRouterLocationSearch(getState());
  const { q: query } = qs.parse(searchQuery, { ignoreQueryPrefix: true });

  if (query) {
    return searchResources(payload, dispatch, getState());
  }

  return fetchResources(payload, dispatch, getState());
};

const FETCH_RESOURCES_MORE_SUCCEEDED = 'swapi/resources/FETCH_RESOURCES_MORE_SUCCEEDED';
const fetchResourcesMoreSucceeded = (payload = {}) => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCES_MORE_SUCCEEDED,
});

const FETCH_RESOURCES_MORE_FAILED = 'swapi/resources/FETCH_RESOURCES_MORE_FAILED';
const fetchResourcesMoreFailed = (payload = {}) => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCES_MORE_FAILED,
});

const FETCH_RESOURCES_MORE_STARTED = 'swapi/resources/FETCH_RESOURCES_MORE_STARTED';
export const fetchResourcesMore = () => (dispatch, getState) => {
  const activeType = getRouterLocationPathname(getState()).replace('/', '');
  const resources = getResourcesByType(getState(), activeType);

  dispatch({ type: FETCH_RESOURCES_MORE_STARTED });

  return fetch(resources.next)
    .then(res => res.json())
    .then(json => dispatch(fetchResourcesMoreSucceeded({
      [activeType]: Object.assign({}, resources, json, {
        error: '',
        results: [...resources.results, ...json.results],
      }),
    })))
    .catch(error => dispatch(fetchResourcesMoreFailed({
      [activeType]: Object.assign({}, resources, {
        error: error.message,
      }),
    })));
};

const initialState = {
  fetching: false,
  error: '',
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_RESOURCES_STARTED:
    case FETCH_RESOURCES_SUCCEEDED:
    case FETCH_RESOURCES_FAILED:
    case SEARCH_RESOURCES_STARTED:
    case SEARCH_RESOURCES_SUCCEEDED:
    case SEARCH_RESOURCES_FAILED:
    case FETCH_RESOURCES_MORE_STARTED:
    case FETCH_RESOURCES_MORE_SUCCEEDED:
    case FETCH_RESOURCES_MORE_FAILED:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};
