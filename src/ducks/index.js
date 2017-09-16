import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import search from './search';
import searchResults from './searchResults';

export default combineReducers({
  search,
  searchResults,
  router,
});
