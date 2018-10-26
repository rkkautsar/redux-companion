export const createAsyncThunk = (actions, promise) => (...params) => dispatch => {
  dispatch(actions.request());
  return promise(...params)
    .then(data => dispatch(actions.success(data)))
    .catch(error => dispatch(actions.fail(error.message)));
};

export const createFetchThunk = (actions, promise) =>
  createAsyncThunk(actions, promise.then(res => res.data).catch(e => e.response));
