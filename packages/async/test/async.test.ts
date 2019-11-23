import {
  AsyncStatus,
  createAsyncActions,
  createAsyncHandlers,
  createAsyncMiddleware,
  createAsyncStatusReducer
} from '../lib/async';
import { createAction } from '@redux-companion/core';

describe('createAsyncActions', () => {
  const actionTypes = ['request', 'success', 'fail'];
  it('creates three action creators', () => {
    const actions = createAsyncActions('');
    actionTypes.forEach(actionType => {
      expect(actions).toHaveProperty(actionType);
      expect(actions[actionType]).toBeInstanceOf(Function);
    });
  });
});

describe('createAsyncHandlers', () => {
  const actions = createAsyncActions('');
  const testCase = {
    request: AsyncStatus.Pending,
    success: AsyncStatus.Success,
    fail: AsyncStatus.Fail
  };

  it('creates three handlers', () => {
    const handlers = createAsyncHandlers(actions);
    Object.entries(testCase).forEach(([actionType, result]) => {
      const action = actions[actionType];
      expect(handlers).toHaveProperty(action.toString());
      expect(handlers[action]).toBeInstanceOf(Function);
      expect(handlers[action]()).toEqual(result);
    });
  });
});

describe('createAsyncStatusReducer', () => {
  it('produces actions and reducer', () => {
    const result = createAsyncStatusReducer('');
    expect(result).toHaveProperty('actions');
    expect(result).toHaveProperty('reducer');
    expect(result.actions).toBeInstanceOf(Object);
    expect(result.reducer).toBeInstanceOf(Function);
  });

  const { actions, reducer } = createAsyncStatusReducer('');

  it('reduces to correct state', () => {
    const testCase = {
      request: AsyncStatus.Pending,
      success: AsyncStatus.Success,
      fail: AsyncStatus.Fail
    };
    Object.entries(testCase).forEach(([actionType, result]) => {
      expect(reducer(AsyncStatus.Initial, actions[actionType]())).toEqual(result);
    });
  });

  it('keep the state in case of unknown action', () => {
    const unrelatedAction = createAction('other_action');
    expect(reducer(AsyncStatus.Initial, unrelatedAction('payload'))).toEqual(AsyncStatus.Initial);
  });
});

describe('createAsyncMiddleware', () => {
  const action = createAction('action');
  const handlerResult = Symbol.for('handler');
  const handler = jest.fn(() => Promise.resolve(handlerResult));
  const handlers = {
    [action.toString()]: handler
  };
  const middleware = createAsyncMiddleware(handlers);
  const nextMiddlewareResult = Symbol.for('nextMiddleware');
  const nextMiddleware = jest.fn(() => Promise.resolve(nextMiddlewareResult));
  const store = Symbol.for('result');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a middleware', () => {
    expect(middleware).toBeInstanceOf(Function);
  });

  it('calls handler on matching action', async () => {
    const result = await middleware(store)(nextMiddleware)(action());
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(store, action());
    expect(result).toEqual(handlerResult);
  });

  it("doesn't call handler on unspecified actions", async () => {
    const otherAction = createAction('other');
    middleware(store)(nextMiddleware)(otherAction());
    expect(handler).toHaveBeenCalledTimes(0);
  });
});
