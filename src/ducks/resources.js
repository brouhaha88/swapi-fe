import qs from 'qs';

import {
  getRouterLocationSearch,
  getTypeFromRouterLocationPathname,
} from './router';
import { getMetadataAppApiUrl } from './metadata/app';

export const getResources = state =>
  state.resources || {};

export const getResourcesByType = (state, type) =>
  getResources(state)[type] || {};

export const getFetchingFromResourcesByType = (state, type) =>
  getResourcesByType(state, type).fetching || false;

export const getResourceFromResourcesByType = (state, type, id) =>
  getResourcesByType(state, type).results.filter(resource => resource.url === id)[0] || {};

const FETCH_RESOURCES_SUCCEEDED = 'swapi/resources/FETCH_RESOURCES_SUCCEEDED';
const fetchResourcesSucceeded = (payload = {}) => ({
  payload: Object.assign({}, payload),
  type: FETCH_RESOURCES_SUCCEEDED,
});

const FETCH_RESOURCES_FAILED = 'swapi/resources/FETCH_RESOURCES_FAILED';
const fetchResourcesFailed = (payload = {}) => ({
  payload: Object.assign({}, payload),
  type: FETCH_RESOURCES_FAILED,
});

const FETCH_RESOURCES_STARTED = 'swapi/resources/FETCH_RESOURCES_STARTED';
// Technically it's not an action creator. Made for splitting logic between fetching and searching.
const fetchResources = (payload, dispatch, state) => {
  const url = getMetadataAppApiUrl(state);
  const type = getTypeFromRouterLocationPathname(state);

  dispatch({
    payload: {
      [type]: {
        fetching: true,
      },
    },
    type: FETCH_RESOURCES_STARTED,
  });

  return fetch(`${url}${type}/`)
    .then(res => res.json())
    .then(json => dispatch(fetchResourcesSucceeded({
      [type]: Object.assign({}, json, {
        error: '',
        fetching: false,
      }),
    })))
    .catch(error => dispatch(fetchResourcesFailed({
      [type]: {
        error: error.message,
        fetching: false,
      },
    })));
};

const SEARCH_RESOURCES_SUCCEEDED = 'swapi/resources/SEARCH_RESOURCES_SUCCEEDED';
const searchResourcesSucceeded = payload => ({
  payload: Object.assign({}, payload),
  type: SEARCH_RESOURCES_SUCCEEDED,
});

const SEARCH_RESOURCES_FAILED = 'swapi/resources/SEARCH_RESOURCES_FAILED';
const searchResourcesFailed = payload => ({
  payload: Object.assign({}, payload),
  type: SEARCH_RESOURCES_FAILED,
});

const SEARCH_RESOURCES_STARTED = 'swapi/resources/SEARCH_RESOURCES_STARTED';
// Technically it's not an action creator. Made for splitting logic between fetching and searching.
const searchResources = (payload, dispatch, state) => {
  const url = getMetadataAppApiUrl(state);
  const type = getTypeFromRouterLocationPathname(state);
  const searchQuery = getRouterLocationSearch(state);
  const { q: query } = qs.parse(searchQuery, { ignoreQueryPrefix: true });

  dispatch({
    payload: {
      [type]: {
        fetching: true,
      },
    },
    type: SEARCH_RESOURCES_STARTED,
  });

  return fetch(`${url}${type}/?search=${query}`)
    .then(res => res.json())
    .then(json => dispatch(searchResourcesSucceeded({
      [type]: Object.assign({}, json, {
        error: '',
        fetching: false,
      }),
    })))
    .catch(error => dispatch(searchResourcesFailed({
      [type]: {
        error: error.message,
        fetching: false,
      },
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
  payload: Object.assign({}, payload),
  type: FETCH_RESOURCES_MORE_SUCCEEDED,
});

const FETCH_RESOURCES_MORE_FAILED = 'swapi/resources/FETCH_RESOURCES_MORE_FAILED';
const fetchResourcesMoreFailed = (payload = {}) => ({
  payload: Object.assign({}, payload),
  type: FETCH_RESOURCES_MORE_FAILED,
});

const FETCH_RESOURCES_MORE_STARTED = 'swapi/resources/FETCH_RESOURCES_MORE_STARTED';
export const fetchResourcesMore = () => (dispatch, getState) => {
  const state = getState();
  const type = getTypeFromRouterLocationPathname(state);
  const resources = getResourcesByType(state, type);

  dispatch({ type: FETCH_RESOURCES_MORE_STARTED });

  return fetch(resources.next)
    .then(res => res.json())
    .then(json => dispatch(fetchResourcesMoreSucceeded({
      [type]: Object.assign({}, resources, json, {
        error: '',
        fetching: false,
        results: [...resources.results, ...json.results],
      }),
    })))
    .catch(error => dispatch(fetchResourcesMoreFailed({
      [type]: Object.assign({}, resources, {
        error: error.message,
        fetching: false,
      }),
    })));
};

const initialState = {};

export default (state = initialState, { type, payload = {} }) => {
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
