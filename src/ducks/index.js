import { combineReducers } from 'redux';
import search from './search';
import searchResults from './searchResults';

export default combineReducers({
  search,
  searchResults,
});
