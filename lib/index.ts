import { identity } from './utils';

export declare namespace ReduxCompanion {
  interface Action {
    type: string;
    payload: any;
    error: boolean;
  }

  type ActionCreator = (payload?: any) => Action;

  interface AsyncActions {
    request: ActionCreator;
    success: ActionCreator;
    fail: ActionCreator;
    reset: ActionCreator;
  }

  type State = object;

  interface AsyncModule {
    id: string;
    path: string;
    actions: AsyncActions;
  }

  type Handler = (state: State, payload: any) => State;

  type Handlers = { [type: string]: Handler };
}

export const createAction = (type: string): ReduxCompanion.ActionCreator => {
  const actionCreator = (payload = null) => ({
    type,
    payload,
    error: payload instanceof Error
  });
  actionCreator.toString = () => type;

  return actionCreator;
};

export const createAsyncActions = (id: string): ReduxCompanion.AsyncActions => ({
  request: createAction(`${id}/request`),
  success: createAction(`${id}/success`),
  fail: createAction(`${id}/fail`),
  reset: createAction(`${id}/reset`)
});

export const asyncInitialState = {
  isLoading: false,
  isLoaded: false,
  data: null,
  error: null
};

export const createReducer = (
  handlers: ReduxCompanion.Handlers,
  initialState: ReduxCompanion.State
) => {
  return (state = initialState, { type, payload }) => {
    if (handlers.hasOwnProperty(type)) {
      return handlers[type](state, payload);
    }
    return state;
  };
};

export const createSubstateHandler = (
  handler: ReduxCompanion.Handler,
  path
): ReduxCompanion.Handler => (state, payload) => ({
  ...state,
  [path]: handler(state[path], payload)
});

export const createAsyncHandlers = (
  actions: ReduxCompanion.AsyncActions,
  { onRequest = identity, onSuccess = identity, onFail = identity }: ReduxCompanion.Handlers = {}
): ReduxCompanion.Handlers => ({
  [actions.request.toString()]: (state, payload) =>
    onRequest({ ...state, isLoading: true }, payload),
  [actions.success.toString()]: (state, payload) =>
    onSuccess(
      {
        ...state,
        isLoading: false,
        isLoaded: true,
        error: null,
        data: payload
      },
      payload
    ),
  [actions.fail.toString()]: (state, payload) =>
    onFail(
      {
        ...state,
        isLoading: false,
        error: payload
      },
      payload
    ),
  [actions.reset.toString()]: state => ({ ...state, ...asyncInitialState })
});
