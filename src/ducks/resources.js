const initialState = {};

export default function reducer(state = initialState, { type, payload }) {
  console.log('NOT IMPLEMENTED ACTIONS FOR RESOURCES', payload);

  switch (type) {
    default:
      return state;
  }
}
