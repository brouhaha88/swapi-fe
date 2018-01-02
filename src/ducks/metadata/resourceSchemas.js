import { getAppApiUrl } from './app';
import { getRouterLocationPathname } from '../router';

const FETCH_RESOURCE_SCHEMAS_SUCCEEDED = 'swapi/metadata_resourceSchemas/FETCH_RESOURCE_SCHEMAS_SUCCEEDED';
const fetchResourceSchemasSucceeded = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCE_SCHEMAS_SUCCEEDED,
});

const FETCH_RESOURCE_SCHEMAS_FAILED = 'swapi/metadata_resourceSchemas/FETCH_RESOURCE_SCHEMAS_FAILED';
const fetchResourceSchemasFailed = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCE_SCHEMAS_FAILED,
});

const FETCH_RESOURCE_SCHEMAS_STARTED = 'swapi/metadata_resourceSchemas/FETCH_RESOURCE_SCHEMAS_STARTED';
export const fetchResourceSchemas = payload => (dispatch, getState) => {
  const url = getAppApiUrl(getState());
  const activeType = getRouterLocationPathname(getState()).replace('/', '');

  dispatch({
    payload: Object.assign({}, payload, { fetching: true }),
    type: FETCH_RESOURCE_SCHEMAS_STARTED,
  });

  return fetch(`${url}${activeType}/schema`)
    .then(res => res.json())
    .then((json) => {
      const keys = Object.keys(json);

      dispatch(fetchResourceSchemasSucceeded(Object.assign({ keys }, json)));
    })
    .catch(error => dispatch(fetchResourceSchemasFailed({ error: error.message })));
};

const initialState = {
  fetching: false,
  error: '',
  keys: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_RESOURCE_SCHEMAS_STARTED:
    case FETCH_RESOURCE_SCHEMAS_SUCCEEDED:
    case FETCH_RESOURCE_SCHEMAS_FAILED:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};
