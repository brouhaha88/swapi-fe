import { API_URL, APP_NAME, APP_DESCRIPTION } from '../config/constants';

const FETCH_RESOURCE_TYPES_SUCCESS = 'swapi/metadata/FETCH_RESOURCE_TYPES_SUCCESS';
const fetchResourceTypesSuccess = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCE_TYPES_SUCCESS,
});

const FETCH_RESOURCE_TYPES_FAILED = 'swapi/metadata/FETCH_RESOURCE_TYPES_FAILED';
const fetchResourceTypesFailed = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCE_TYPES_FAILED,
});

const FETCH_RESOURCE_TYPES_STARTED = 'swapi/metadata/FETCH_RESOURCE_TYPES_STARTED';
export const fetchResourceTypes = payload => (dispatch) => {
  dispatch({
    payload: Object.assign({}, payload, { fetching: true }),
    type: FETCH_RESOURCE_TYPES_STARTED,
  });

  return fetch(API_URL)
    .then(res => res.json())
    .then((json) => {
      const resourceTypes = Object.keys(json);

      dispatch(fetchResourceTypesSuccess({ resourceTypes }));
    })
    .catch(error => dispatch(fetchResourceTypesFailed({ error: error.message })));
};

const initialState = {
  app: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  fetching: false,
  error: '',
  resourceTypes: [],
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
