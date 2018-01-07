import { getMetadataAppApiUrl } from './app';
import { getTypeFromRouterLocationPathname } from '../router';

export const getMetadataResourceSchemas = state => state.metadata.resourceSchemas || {};

const FETCH_RESOURCE_SCHEMAS_SUCCEEDED = 'swapi/metadata_resourceSchemas/FETCH_RESOURCE_SCHEMAS_SUCCEEDED';
const fetchResourceSchemasSucceeded = payload => ({
  payload: Object.assign({}, payload),
  type: FETCH_RESOURCE_SCHEMAS_SUCCEEDED,
});

const FETCH_RESOURCE_SCHEMAS_FAILED = 'swapi/metadata_resourceSchemas/FETCH_RESOURCE_SCHEMAS_FAILED';
const fetchResourceSchemasFailed = payload => ({
  payload: Object.assign({}, payload),
  type: FETCH_RESOURCE_SCHEMAS_FAILED,
});

const FETCH_RESOURCE_SCHEMAS_STARTED = 'swapi/metadata_resourceSchemas/FETCH_RESOURCE_SCHEMAS_STARTED';
export const fetchResourceSchemas = payload => (dispatch, getState) => {
  const state = getState();
  const url = getMetadataAppApiUrl(state);
  const type = getTypeFromRouterLocationPathname(state);

  dispatch({
    payload: Object.assign({}, payload, {
      [type]: {
        fetching: true,
      },
    }),
    type: FETCH_RESOURCE_SCHEMAS_STARTED,
  });

  return fetch(`${url}${type}/schema`)
    .then(res => res.json())
    .then((json) => {
      dispatch(fetchResourceSchemasSucceeded({
        [type]: Object.assign({}, json, {
          error: '',
          fetching: false,
        }),
      }));
    })
    .catch(error => dispatch(fetchResourceSchemasFailed({
      [type]: {
        error: error.message,
        fetching: false,
      },
    })));
};

const initialState = {};

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case FETCH_RESOURCE_SCHEMAS_STARTED:
    case FETCH_RESOURCE_SCHEMAS_SUCCEEDED:
    case FETCH_RESOURCE_SCHEMAS_FAILED:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};
