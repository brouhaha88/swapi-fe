import { push } from 'react-router-redux';

export function getSearch(state) {
  return state.search;
}

export function getSearchType(state) {
  return getSearch(state).type;
}

export function getSearchQuery(state) {
  return getSearch(state).query;
}

const UPDATE_SEARCH_TYPE = 'swapi/search/UPDATE_SEARCH_TYPE';
export function updateSearchType(payload) {
  return (dispatch, getState) => {
    dispatch({
      payload,
      type: UPDATE_SEARCH_TYPE,
    });

    const query = getSearchQuery(getState());

    if (query) {
      dispatch(push(`/search/${payload.type}/${query}`));
    }
  };
}

const UPDATE_SEARCH_QUERY = 'swapi/search/UPDATE_SEARCH_QUERY';
export function updateSearchQuery(payload) {
  return (dispatch, getState) => {
    dispatch({
      payload,
      type: UPDATE_SEARCH_QUERY,
    });

    const type = getSearchType(getState());

    dispatch(push(`/search/${type}/${payload.query}`));
  };
}

const FETCH_SWAPI_TYPES_STARTED = 'swapi/search/FETCH_SWAPI_TYPES_STARTED';
function fetchSwapiTypesStarted(payload = { fetching: true }) {
  return {
    payload,
    type: FETCH_SWAPI_TYPES_STARTED,
  };
}

const FETCHED_SWAPI_TYPES_SUCCESS = 'swapi/search/FETCHED_SWAPI_TYPES_SUCCESS';
function fetchedSwapiTypesSuccess(payload) {
  return {
    payload: Object.assign({}, payload, { fetching: false }),
    type: FETCHED_SWAPI_TYPES_SUCCESS,
  };
}

const FETCHED_SWAPI_TYPES_FAILED = 'swapi/search/FETCHED_SWAPI_TYPES_FAILED';
function fetchedSwapiTypesFailed(payload) {
  return {
    payload: Object.assign({}, payload, { fetching: false }),
    type: FETCHED_SWAPI_TYPES_FAILED,
  };
}

export function fetchSwapiTypes(payload) {
  return (dispatch) => {
    dispatch(fetchSwapiTypesStarted(payload));

    return fetch('https://swapi.co/api/')
      .then(res => res.json())
      .then((json) => {
        const types = Object.keys(json);

        dispatch(updateSearchType({ type: types[0] || '' }));
        dispatch(fetchedSwapiTypesSuccess({ types }));
      })
      .catch(error => dispatch(fetchedSwapiTypesFailed({ error: error.message })));
  };
}

const initialState = {
  type: '',
  query: '',
  types: [],
  fetching: false,
  error: '',
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_SWAPI_TYPES_STARTED:
      return Object.assign({}, state, payload);
    case FETCHED_SWAPI_TYPES_SUCCESS:
      return Object.assign({}, state, payload);
    case FETCHED_SWAPI_TYPES_FAILED:
      return Object.assign({}, state, payload);
    case UPDATE_SEARCH_TYPE:
      return Object.assign({}, state, payload);
    case UPDATE_SEARCH_QUERY:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
