import { createStateUpdate, identity, get, compose } from '@redux-companion/utils';

export const asyncStatus = {
  FAILED: -1,
  PENDING: 0,
  SUCCESS: 1,
};

export const asyncInitialState = {
  status: asyncStatus.PENDING,
  data: null,
  error: null
};

export const createAction = type => {
  const actionCreator = (payload = null) => ({
    type,
    payload,
    isError: payload instanceof Error
  });
  actionCreator.toString = () => type;

  return actionCreator;
};

export const createAsyncActions = id => ({
  request: createAction(`${id}_REQUEST`),
  success: createAction(`${id}_SUCCESS`),
  fail: createAction(`${id}_FAILURE`)
});

export const createReducer = (handlers, initialState) => (
  state = initialState,
  { type, payload } = {}
) => {
  if (handlers.hasOwnProperty(type)) {
    return handlers[type](state, payload);
  }
  return state;
};

export const createAsyncHandlers = (
  actions,
  { onRequest = identity, onSuccess = identity, onFail = identity, path = [] } = {}
) => {
  const updateState = createStateUpdate(path);

  return {
    [actions.request]: compose(
      onRequest,
      updateState(() => ({
        status: asyncStatus.PENDING,
      }))
    ),
    [actions.success]: compose(
      onSuccess,
      updateState(payload => ({
        status: asyncStatus.SUCCESS,
        data: payload
      }))
    ),
    [actions.fail]: compose(
      onFail,
      updateState(payload => ({
        status: asyncStatus.FAILED,
        error: payload
      }))
    )
  };
};

export const createAsyncSelectors = (path = [], { isArray = false } = {}) => ({
  getData: compose(
    data => (isArray && data === null ? [] : data),
    get([...path, 'data'])
  ),
  getError: get([...path, 'error']),
  isLoading: get([...path, 'isLoading']),
  isLoaded: get([...path, 'isLoaded'])
});
