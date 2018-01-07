import qs from 'qs';

import { getRouterLocationPathname, getRouterLocationSearch } from './router';
import { getMetadataAppApiUrl } from './metadata/app';

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
// Technically it's not an action creator. Made for splitting logic between fetching and searching.
const fetchResources = (payload, dispatch, state) => {
  const url = getMetadataAppApiUrl(state);
  const type = getRouterLocationPathname(state).replace('/', '');

  dispatch({
    payload: { fetching: true },
    type: FETCH_RESOURCES_STARTED,
  });

  return fetch(`${url}${type}/`)
    .then(res => res.json())
    .then(json => dispatch(fetchResourcesSucceeded({
      [type]: Object.assign({}, json, { error: '' }),
    })))
    .catch(error => dispatch(fetchResourcesFailed({
      [type]: { error: error.message },
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
// Technically it's not an action creator. Made for splitting logic between fetching and searching.
const searchResources = (payload, dispatch, state) => {
  const url = getMetadataAppApiUrl(state);
  const type = getRouterLocationPathname(state).replace('/', '');
  const searchQuery = getRouterLocationSearch(state);
  const { q: query } = qs.parse(searchQuery, { ignoreQueryPrefix: true });

  dispatch({
    payload: Object.assign({}, payload, { fetching: true }),
    type: SEARCH_RESOURCES_STARTED,
  });

  return fetch(`${url}${type}/?search=${query}`)
    .then(res => res.json())
    .then(json => dispatch(searchResourcesSucceeded({
      [type]: Object.assign({}, json, { error: '' }),
    })))
    .catch(error => dispatch(searchResourcesFailed({
      [type]: { error: error.message },
    })));
};

export const fetchOrSearchResources = payload => (dispatch, getState) => {
  const state = getState();
  const searchQuery = getRouterLocationSearch(state);
  const { q: query } = qs.parse(searchQuery, { ignoreQueryPrefix: true });

  if (query) {
    return searchResources(payload, dispatch, state);
  }

  return fetchResources(payload, dispatch, state);
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
  const state = getState();
  const type = getRouterLocationPathname(state).replace('/', '');
  const resources = getResourcesByType(state, type);

  dispatch({ type: FETCH_RESOURCES_MORE_STARTED });

  return fetch(resources.next)
    .then(res => res.json())
    .then(json => dispatch(fetchResourcesMoreSucceeded({
      [type]: Object.assign({}, resources, json, {
        error: '',
        results: [...resources.results, ...json.results],
      }),
    })))
    .catch(error => dispatch(fetchResourcesMoreFailed({
      [type]: Object.assign({}, resources, {
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
