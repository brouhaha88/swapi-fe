const getResources = state => state.resources || {};

export const getResourcesByType = (state, type) => getResources(state)[type];

const FETCH_RESOURCES_SUCCESS = 'swapi/metadata/FETCH_RESOURCES_SUCCESS';
const fetchResourcesSuccess = (payload = {}) => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCES_SUCCESS,
});

const FETCH_RESOURCES_FAILED = 'swapi/metadata/FETCH_RESOURCES_FAILED';
const fetchResourcesFailed = (payload = {}) => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCES_FAILED,
});

const FETCH_RESOURCES_STARTED = 'swapi/metadata/FETCH_RESOURCES_STARTED';
export const fetchResources = (payload = {}) => (dispatch) => {
  const { activeType } = payload;

  dispatch({
    payload: {
      fetching: true,
      activeType: '',
    },
    type: FETCH_RESOURCES_STARTED,
  });

  return fetch(`https://swapi.co/api/${activeType}/`)
    .then(res => res.json())
    .then(json => dispatch(fetchResourcesSuccess({
      activeType,
      [activeType]: Object.assign({}, json, { error: '' }),
    })))
    .catch(error => dispatch(fetchResourcesFailed({
      activeType,
      [activeType]: { error: error.message },
    })));
};

const FETCH_RESOURCES_MORE_SUCCESS = 'swapi/search/FETCH_RESOURCES_MORE_SUCCESS';
const fetchResourcesMoreSuccess = (payload = {}) => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCES_MORE_SUCCESS,
});

const FETCH_RESOURCES_MORE_FAILED = 'swapi/search/FETCH_RESOURCES_MORE_FAILED';
const fetchResourcesMoreFailed = (payload = {}) => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_RESOURCES_MORE_FAILED,
});

const FETCH_RESOURCES_MORE_STARTED = 'swapi/search/FETCH_RESOURCES_MORE_STARTED';
export const fetchResourcesMore = (payload = {}) => (dispatch, getState) => {
  const { activeType } = payload;
  const resources = getResourcesByType(getState(), activeType);

  dispatch({ type: FETCH_RESOURCES_MORE_STARTED });

  return fetch(resources.next)
    .then(res => res.json())
    .then(json => dispatch(fetchResourcesMoreSuccess({
      [activeType]: Object.assign({}, resources, json, {
        error: '',
        results: [...resources.results, ...json.results],
      }),
    })))
    .catch(error => dispatch(fetchResourcesMoreFailed({ error: error.message })));
};

const initialState = {
  fetching: false,
  error: '',
  activeType: '',
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_RESOURCES_STARTED:
    case FETCH_RESOURCES_SUCCESS:
    case FETCH_RESOURCES_FAILED:
    case FETCH_RESOURCES_MORE_STARTED:
    case FETCH_RESOURCES_MORE_SUCCESS:
    case FETCH_RESOURCES_MORE_FAILED:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};
