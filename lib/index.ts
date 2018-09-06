/// <reference path="index.d.ts" />
import { identity, noop } from './utils';

export const createAction = (type: string): ReduxAsyncHelper.ActionCreator => {
  const actionCreator = (payload = null) => ({
    type,
    payload,
    error: payload instanceof Error
  });
  actionCreator.toString = () => type;

  return actionCreator;
};

export const createAsyncActions = (name: string): ReduxAsyncHelper.AsyncActions => ({
  request: createAction(`${name}/request`),
  success: createAction(`${name}/success`),
  fail: createAction(`${name}/fail`),
  reset: createAction(`${name}/reset`)
});

export const asyncInitialState = {
  isLoading: false,
  isLoaded: false,
  data: null,
  error: null
};

export const createReducer = (
  handlers: ReduxAsyncHelper.Handlers,
  initialState: ReduxAsyncHelper.State
) => {
  return (state = initialState, { type, payload }) => {
    if (handlers.hasOwnProperty(type)) {
      return handlers[type](state, payload);
    }
    return state;
  };
};

export const createAsyncHandlers = (
  actions: ReduxAsyncHelper.AsyncActions,
  { onRequest = identity, onSuccess = identity, onFail = identity }: ReduxAsyncHelper.Handlers = {}
): ReduxAsyncHelper.Handlers => ({
  [actions.request.toString()]: (state, payload) =>
    onRequest({ ...state, isLoading: true }, payload),
  [actions.success.toString()]: (state, payload) =>
    onSuccess({ ...state, isLoading: false, isLoaded: true, error: null, data: payload }, payload),
  [actions.fail.toString()]: (state, payload) =>
    onFail({ ...state, isLoading: false, error: payload }, payload),
  [actions.reset.toString()]: () => asyncInitialState
});

export const createAsyncThunk = (
  actions: ReduxAsyncHelper.AsyncActions,
  func: (...args) => Promise<object>,
  { onSuccess = noop, onFail = noop, rethrow = true } = {}
) => (...params) => async (dispatch, getState) => {
  dispatch(actions.request());
  try {
    const data = await func(...params);
    dispatch(actions.success(data));
    await onSuccess(dispatch, getState);
    return data;
  } catch (e) {
    dispatch(actions.fail(e.message));
    onFail(dispatch, getState);

    if (rethrow) throw e;
  }
};
