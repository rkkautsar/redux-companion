import {
  createAction,
  createAsyncActions,
  createReducer,
  createAsyncHandlers,
  asyncInitialState,
  createAsyncSelectors
} from '../lib/core';
import { identity } from '@redux-companion/utils';

describe('createAction', () => {
  const id = 'MY_ACTION';
  const actionCreator = createAction(id);

  it('creates an action creator', () => {
    const action = actionCreator();
    expect(actionCreator).toBeInstanceOf(Function);
    expect(action).toBeInstanceOf(Object);
    expect(action).toHaveProperty('type', id);
  });

  it('creates an action with payload', () => {
    const payload = Symbol();
    const action = actionCreator(payload);
    expect(action).toHaveProperty('payload', payload);
  });

  it('stringifies as the identifier', () => {
    expect(`${actionCreator}`).toBe(id);
  });
});

test('createAsyncActions', () => {
  const id = 'MY_ASYNC_ACTION';
  const actions = createAsyncActions(id);
  expect(actions).toHaveProperty('request');
  expect(actions).toHaveProperty('success');
  expect(actions).toHaveProperty('fail');
  expect(`${actions.request}`).toBe(`${id}_REQUEST`);
  expect(`${actions.success}`).toBe(`${id}_SUCCESS`);
  expect(`${actions.fail}`).toBe(`${id}_FAILURE`);
});

describe('createReducer', () => {
  const initialState = 1;
  const handlers = {
    ADD: (state, payload) => state + payload
  };
  const reducer = createReducer(handlers, initialState);

  it('creates a reducer', () => {
    expect(reducer).toBeInstanceOf(Function);
    expect(reducer()).toEqual(initialState);
  });

  it('handles undefined actions', () => {
    const state = reducer(initialState, { type: 'UNDEFINED' });
    expect(state).toEqual(initialState);
  });

  it('tranform state based on its handlers', () => {
    const state = reducer(initialState, { type: 'ADD', payload: 2 });
    expect(state).toEqual(3);
  });
});

describe('createAsyncHandlers', () => {
  const asyncActions = createAsyncActions('MY_ASYNC_ACTION');
  const onRequest = jest.fn(identity);
  const onSuccess = jest.fn(identity);
  const onFail = jest.fn(identity);
  const path = ['a'];
  const asyncHandlers = createAsyncHandlers(asyncActions, { onRequest, onSuccess, onFail, path });

  const initialState = {
    a: asyncInitialState
  };

  it('creates a request handler', () => {
    expect(asyncHandlers).toHaveProperty(`${asyncActions.request}`);
    const newState = asyncHandlers[asyncActions.request](initialState);
    expect(newState).toHaveProperty('a.isLoading', true);
    expect(onRequest).toHaveBeenCalledTimes(1);
    expect(onRequest).toHaveBeenCalledWith(newState);
  });

  it('creates a success handler', () => {
    expect(asyncHandlers).toHaveProperty(`${asyncActions.success}`);
    const data = Symbol();
    const newState = asyncHandlers[asyncActions.success](initialState, data);
    expect(newState).toHaveProperty('a.isLoading', false);
    expect(newState).toHaveProperty('a.isLoaded', true);
    expect(newState).toHaveProperty('a.data', data);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(newState);
  });

  it('creates a failure handler', () => {
    expect(asyncHandlers).toHaveProperty(`${asyncActions.fail}`);
    const error = new Error();
    const newState = asyncHandlers[asyncActions.fail](initialState, error);
    expect(newState).toHaveProperty('a.isLoading', false);
    expect(newState).toHaveProperty('a.error', error);
    expect(onFail).toHaveBeenCalledTimes(1);
    expect(onFail).toHaveBeenCalledWith(newState);
  });

  it('treat options argument optionally', () => {
    const handlers = createAsyncHandlers(asyncActions);
    expect(handlers).toHaveProperty(`${asyncActions.request}`);
    expect(handlers).toHaveProperty(`${asyncActions.success}`);
    expect(handlers).toHaveProperty(`${asyncActions.fail}`);

    expect(handlers).toHaveProperty(`${asyncActions.request}`);
    const state = { isLoading: false };
    const newState = handlers[asyncActions.request](state);
    expect(newState).toEqual({ isLoading: true });
  });
});

describe('createAsyncSelectors', () => {
  it('creates getData, getError, isLoading, and isLoaded selectors', () => {
    const selectors = createAsyncSelectors();
    expect(selectors).toHaveProperty('getData');
    expect(selectors).toHaveProperty('getError');
    expect(selectors).toHaveProperty('isLoading');
    expect(selectors).toHaveProperty('isLoaded');

    expect(selectors.getData).toBeInstanceOf(Function);
    expect(selectors.getError).toBeInstanceOf(Function);
    expect(selectors.isLoading).toBeInstanceOf(Function);
    expect(selectors.isLoaded).toBeInstanceOf(Function);
  });

  it('selects from given shallow state', () => {
    const data = Symbol();
    const error = Symbol();
    const isLoading = Symbol();
    const isLoaded = Symbol();

    const state = {
      data,
      error,
      isLoading,
      isLoaded
    };

    const selectors = createAsyncSelectors();

    expect(selectors.getData(state)).toBe(data);
    expect(selectors.getError(state)).toBe(error);
    expect(selectors.isLoading(state)).toBe(isLoading);
    expect(selectors.isLoaded(state)).toBe(isLoaded);
  });

  it('selects from given deep state trough path', () => {
    const data = Symbol();
    const error = Symbol();
    const isLoading = Symbol();
    const isLoaded = Symbol();

    const state = {
      a: {
        b: {
          data,
          error,
          isLoading,
          isLoaded
        }
      }
    };

    const selectors = createAsyncSelectors(['a', 'b']);

    expect(selectors.getData(state)).toBe(data);
    expect(selectors.getError(state)).toBe(error);
    expect(selectors.isLoading(state)).toBe(isLoading);
    expect(selectors.isLoaded(state)).toBe(isLoaded);
  });

  it('getData handles null value', () => {
    const data = null;
    const state = { data };
    const normalSelectors = createAsyncSelectors();
    const arraySelectors = createAsyncSelectors([], { isArray: true });
    expect(normalSelectors.getData(state)).toBe(null);
    expect(arraySelectors.getData(state)).toEqual([]);
  });
});
