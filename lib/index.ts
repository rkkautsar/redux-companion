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
    actions: AsyncActions;
    states: State;
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

export const createAsyncModule = (id: string): ReduxCompanion.AsyncModule => ({
  id,
  actions: createAsyncActions(id),
  states: {
    [id]: asyncInitialState
  }
});

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

export const createAsyncHandlers = (
  asyncModule: ReduxCompanion.AsyncModule,
  { onRequest = identity, onSuccess = identity, onFail = identity }: ReduxCompanion.Handlers = {}
): ReduxCompanion.Handlers => ({
  [asyncModule.actions.request.toString()]: (state, payload) =>
    onRequest(
      { ...state, [asyncModule.id]: { ...state[asyncModule.id], isLoading: true } },
      payload
    ),
  [asyncModule.actions.success.toString()]: (state, payload) =>
    onSuccess(
      {
        ...state,
        [asyncModule.id]: {
          ...state[asyncModule.id],
          isLoading: false,
          isLoaded: true,
          error: null,
          data: payload
        }
      },
      payload
    ),
  [asyncModule.actions.fail.toString()]: (state, payload) =>
    onFail(
      {
        ...state,
        [asyncModule.id]: { ...state[asyncModule.id], isLoading: false, error: payload }
      },
      payload
    ),
  [asyncModule.actions.reset.toString()]: state => ({
    ...state,
    ...asyncModule.states
  })
});
