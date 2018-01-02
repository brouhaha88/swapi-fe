import { API_URL, APP_NAME, APP_DESCRIPTION } from '../../config/constants';

export const getApp = state => state.metadata.app || {};

export const getAppApiUrl = state => getApp(state).apiUrl || '';

const APP_SET = 'swapi/metadata_app/APP_SET';
export const setApp = payload => ({
  payload,
  type: APP_SET,
});

const initialState = {
  name: APP_NAME,
  apiUrl: API_URL,
  description: APP_DESCRIPTION,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case APP_SET:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};
