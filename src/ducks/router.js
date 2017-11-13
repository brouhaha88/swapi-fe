import { routerReducer as reducer } from 'react-router-redux';

export const getRouter = state => state.router || {};

export const getRouterLocation = state => getRouter(state).location || {};

export const getRouterLocationSearch = state => getRouterLocation(state).search || {};

export default reducer;
