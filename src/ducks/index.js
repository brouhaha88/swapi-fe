import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import metadata from './metadata';
import search from './search';
import resources from './resources';

export default combineReducers({
  router,
  metadata,
  search,
  resources,
});
