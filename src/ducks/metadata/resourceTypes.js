import { getAppUrl } from './app';

const FETCH_RESOURCE_TYPES_SUCCESS = 'swapi/metadata_resourceTypes/FETCH_RESOURCE_TYPES_SUCCESS';
const fetchResourceTypesSuccess = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCE_TYPES_SUCCESS,
});

const FETCH_RESOURCE_TYPES_FAILED = 'swapi/metadata_resourceTypes/FETCH_RESOURCE_TYPES_FAILED';
const fetchResourceTypesFailed = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCE_TYPES_FAILED,
});

const FETCH_RESOURCE_TYPES_STARTED = 'swapi/metadata_resourceTypes/FETCH_RESOURCE_TYPES_STARTED';
export const fetchResourceTypes = payload => (dispatch, getState) => {
  const url = getAppUrl(getState());

  dispatch({
    payload: Object.assign({}, payload, { fetching: true }),
    type: FETCH_RESOURCE_TYPES_STARTED,
  });

  return fetch(url)
    .then(res => res.json())
    .then((json) => {
      const keys = Object.keys(json);

      dispatch(fetchResourceTypesSuccess(Object.assign({ keys }, json)));
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
    case FETCH_RESOURCE_TYPES_SUCCESS:
    case FETCH_RESOURCE_TYPES_FAILED:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};
