const FETCH_SEARCH_TYPES_STARTED = 'swapi/metadata/FETCH_SEARCH_TYPES_STARTED';
function fetchSearchTypesStarted(payload = { fetching: true }) {
  return {
    payload,
    type: FETCH_SEARCH_TYPES_STARTED,
  };
}

const FETCHED_SEARCH_TYPES_SUCCESS = 'swapi/metadata/FETCHED_SEARCH_TYPES_SUCCESS';
function fetchedSearchTypesSuccess(payload) {
  return {
    payload: Object.assign({}, payload, { fetching: false }),
    type: FETCHED_SEARCH_TYPES_SUCCESS,
  };
}

const FETCHED_SEARCH_TYPES_FAILED = 'swapi/metadata/FETCHED_SEARCH_TYPES_FAILED';
function fetchedSearchTypesFailed(payload) {
  return {
    payload: Object.assign({}, payload, { fetching: false }),
    type: FETCHED_SEARCH_TYPES_FAILED,
  };
}

export function fetchSearchTypes(payload) {
  return (dispatch) => {
    dispatch(fetchSearchTypesStarted(payload));

    return fetch('https://swapi.co/api/')
      .then(res => res.json())
      .then((json) => {
        const searchTypes = Object.keys(json);

        dispatch(fetchedSearchTypesSuccess({ searchTypes }));
      })
      .catch(error => dispatch(fetchedSearchTypesFailed({ error: error.message })));
  };
}

const initialState = {
  searchTypes: [],
  fetching: false,
  error: '',
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_SEARCH_TYPES_STARTED:
      return Object.assign({}, state, payload);
    case FETCHED_SEARCH_TYPES_SUCCESS:
      return Object.assign({}, state, payload);
    case FETCHED_SEARCH_TYPES_FAILED:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
}
