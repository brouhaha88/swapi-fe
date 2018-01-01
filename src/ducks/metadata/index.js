import { combineReducers } from 'redux';

import app from './app';
import resourceTypes from './resourceTypes';
import resourceSchemas from './resourceSchemas';

export default combineReducers({
  app,
  resourceTypes,
  resourceSchemas,
});
