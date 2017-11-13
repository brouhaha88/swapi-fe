const FETCH_SEARCH_TYPES_SUCCESS = 'swapi/metadata/FETCH_SEARCH_TYPES_SUCCESS';
const fetchSearchTypesSuccess = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_SEARCH_TYPES_SUCCESS,
});

const FETCH_SEARCH_TYPES_FAILED = 'swapi/metadata/FETCH_SEARCH_TYPES_FAILED';
const fetchSearchTypesFailed = payload => ({
  payload: Object.assign({}, payload, { fetching: false }),
  type: FETCH_SEARCH_TYPES_FAILED,
});

const FETCH_SEARCH_TYPES_STARTED = 'swapi/metadata/FETCH_SEARCH_TYPES_STARTED';
export const fetchSearchTypes = payload => (dispatch) => {
  dispatch({
    payload: Object.assign({}, payload, { fetching: true }),
    type: FETCH_SEARCH_TYPES_STARTED,
  });

  return fetch('https://swapi.co/api/')
    .then(res => res.json())
    .then((json) => {
      const searchTypes = Object.keys(json);

      dispatch(fetchSearchTypesSuccess({ searchTypes }));
    })
    .catch(error => dispatch(fetchSearchTypesFailed({ error: error.message })));
};

const initialState = {
  fetching: false,
  error: '',
  searchTypes: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_SEARCH_TYPES_STARTED:
    case FETCH_SEARCH_TYPES_SUCCESS:
    case FETCH_SEARCH_TYPES_FAILED:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};
