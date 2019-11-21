import { createAction, createReducer } from '@redux-companion/core';

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
