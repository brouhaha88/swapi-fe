import { getAppApiUrl } from './app';

const FETCH_RESOURCE_TYPES_SUCCEEDED = 'swapi/metadata_resourceTypes/FETCH_RESOURCE_TYPES_SUCCEEDED';
const fetchResourceTypesSucceeded = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCE_TYPES_SUCCEEDED,
});

const FETCH_RESOURCE_TYPES_FAILED = 'swapi/metadata_resourceTypes/FETCH_RESOURCE_TYPES_FAILED';
const fetchResourceTypesFailed = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCE_TYPES_FAILED,
});

const FETCH_RESOURCE_TYPES_STARTED = 'swapi/metadata_resourceTypes/FETCH_RESOURCE_TYPES_STARTED';
export const fetchResourceTypes = payload => (dispatch, getState) => {
  const url = getAppApiUrl(getState());

  dispatch({
    payload: Object.assign({}, payload, { fetching: true }),
    type: FETCH_RESOURCE_TYPES_STARTED,
  });

  return fetch(url)
    .then(res => res.json())
    .then((json) => {
      const keys = Object.keys(json);

      dispatch(fetchResourceTypesSucceeded(Object.assign({ keys }, json)));
    })
    .catch(error => dispatch(fetchResourceTypesFailed({ error: error.message })));
};

const initialState = {
  fetching: false,
  error: '',
  keys: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_RESOURCE_TYPES_STARTED:
    case FETCH_RESOURCE_TYPES_SUCCEEDED:
    case FETCH_RESOURCE_TYPES_FAILED:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};
