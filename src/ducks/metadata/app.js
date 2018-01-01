import { API_URL, APP_NAME, APP_DESCRIPTION } from '../../config/constants';

export const getApp = state => state.metadata.app || {};

export const getAppUrl = state => getApp(state).url || '';

const initialState = {
  name: APP_NAME,
  url: API_URL,
  description: APP_DESCRIPTION,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    default:
      console.log(type, payload);

      return state;
  }
};
