import { combineReducers } from 'redux';

import router from './router';
import metadata from './metadata';
import resources from './resources';

export default combineReducers({
  router,
  metadata,
  resources,
});
