import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import metadata from './metadata';
import search from './search';

export default combineReducers({
  router,
  metadata,
  search,
});
