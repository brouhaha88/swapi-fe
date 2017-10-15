import { getSearchQuery, getSearchType } from './search';

const SEARCH_SWAPI_STARTED = 'swapi/searchResults/SEARCH_SWAPI_STARTED';
function searchSwapiStarted(payload = { fetching: true }) {
  return {
    payload,
    type: SEARCH_SWAPI_STARTED,
  };
}

const SEARCHED_SWAPI_SUCCESS = 'swapi/searchResults/SEARCHED_SWAPI_SUCCESS';
function searchedSwapiSuccess(payload) {
  return {
    payload: Object.assign({}, payload, { fetching: false }),
    type: SEARCHED_SWAPI_SUCCESS,
  };
}

const SEARCHED_SWAPI_FAILED = 'swapi/searchResults/SEARCHED_SWAPI_FAILED';
function searchedSwapiFailed(payload) {
  return {
    payload: Object.assign({}, payload, { fetching: false }),
    type: SEARCHED_SWAPI_FAILED,
  };
}

export function searchSwapi(payload) {
  return (dispatch) => {
    dispatch(searchSwapiStarted(payload));

    return fetch(`https://swapi.co/api/${getSearchType()}/?search=${getSearchQuery()}`)
      .then(res => res.json())
      .then(json => dispatch(searchedSwapiSuccess(json)))
      .catch(error => dispatch(searchedSwapiFailed({ error: error.message })));
  };
}

const initialState = {
  fetching: false,
  error: '',
  count: 0,
  next: null,
  previous: null,
  results: [],
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SEARCH_SWAPI_STARTED:
      return Object.assign({}, state, payload);
    case SEARCHED_SWAPI_SUCCESS:
      return Object.assign({}, state, payload);
    case SEARCHED_SWAPI_FAILED:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
