import { createStateUpdate, identity, get, compose } from './utils';

export const asyncInitialState = {
  isLoading: false,
  isLoaded: false,
  data: null,
  error: null
};

export const createAction = type => {
  const actionCreator = (payload = null) => ({
    type,
    payload,
    error: payload instanceof Error
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
        isLoading: true
      }))
    ),
    [actions.success]: compose(
      onSuccess,
      updateState(payload => ({
        isLoading: false,
        isLoaded: true,
        data: payload
      }))
    ),
    [actions.fail]: compose(
      onFail,
      updateState(payload => ({
        isLoading: false,
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
