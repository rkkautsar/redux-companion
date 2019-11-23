import { ActionType, createAction, createReducer } from '@redux-companion/core';
import { MiddlewareHandler, Store } from './types';

export * from './types';

export const enum AsyncStatus {
  Initial = 'initial',
  Pending = 'pending',
  Success = 'success',
  Fail = 'fail'
}

export const createAsyncActions = (id: string) => ({
  request: createAction(`${id}_REQUEST`),
  success: createAction(`${id}_SUCCESS`),
  fail: createAction(`${id}_FAILURE`)
});

export const createAsyncHandlers = (actions: ReturnType<typeof createAsyncActions>) => {
  return {
    [actions.request.toString()]: () => AsyncStatus.Pending,
    [actions.success.toString()]: () => AsyncStatus.Success,
    [actions.fail.toString()]: () => AsyncStatus.Fail
  };
};

export const createAsyncStatusReducer = (id: string) => {
  const actions = createAsyncActions(id);
  const handlers = createAsyncHandlers(actions);
  const reducer = createReducer<AsyncStatus>(handlers, AsyncStatus.Initial);

  return {
    actions,
    reducer
  };
};

export const createAsyncMiddleware = (handlers: { [key: string]: MiddlewareHandler }) => (
  store: Store
) => (next: Function) => (action: ActionType) => {
  const result = next(action);

  const { type } = action;
  if (handlers.hasOwnProperty(type)) {
    return handlers[type](store, action);
  }

  return Promise.resolve(result);
};
