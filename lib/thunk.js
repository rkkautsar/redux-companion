export const createAsyncThunk = (actions, promise) => (...params) => dispatch => {
  dispatch(actions.request());
  return promise(...params)
    .then(data => dispatch(actions.success(data)))
    .catch(error => dispatch(actions.fail(error.message)));
};

export const createFetchThunk = (actions, promise) => (...params) => dispatch => {
  dispatch(actions.request());
  return promise(...params)
    .then(res => res.data)
    .then(data => dispatch(actions.success(data)))
    .catch(e => dispatch(actions.fail(e.response)));
};
