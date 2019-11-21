import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import logger from 'redux-logger';

import { createReducer, createAction } from '@redux-companion/core';
import { createAsyncMiddleware, createAsyncStatusReducer } from '@redux-companion/async';

const { actions: fetchHello, reducer: fetchHelloStatusReducer } = createAsyncStatusReducer(
  'fetch_hello'
);

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const mockFetch = async () => {
  await sleep(1000);
  return 'Hello!';
};

const mockFetchFailed = async () => {
  await sleep(1000);
  throw new Error('Failed!');
};

const helloMiddleware = createAsyncMiddleware({
  [fetchHello.request]: async ({ dispatch }, action) => {
    const promise = action.payload === 'success' ? mockFetch() : mockFetchFailed();
    try {
      const result = await promise;
      dispatch(fetchHello.success(result));
    } catch (e) {
      dispatch(fetchHello.fail(e));
    }
  }
});

const incrementCounter = createAction('increment');

const handlers = {
  [incrementCounter]: state => ({ ...state, counter: state.counter + 1 }),
  [fetchHello.success]: (state, payload) => ({ ...state, data: payload }),
  [fetchHello.fail]: (state, payload) => ({ ...state, error: payload.message })
};

const initialState = {
  counter: 0,
  data: null,
  error: null
};

const myReducer = createReducer(handlers, initialState);

const reducer = combineReducers({
  myReducer,
  fetchHelloStatusReducer
});

const middlewares = [helloMiddleware, logger];
const store = createStore(reducer, applyMiddleware(...middlewares));

const App = connect(
  state => ({ state }),
  dispatch => ({ dispatch })
)(({ state, dispatch }) => (
  <div>
    <pre>
      <code>{JSON.stringify(state, null, 2)}</code>
    </pre>
    <button onClick={() => dispatch(fetchHello.request('success'))}>Fetch</button>
    <button onClick={() => dispatch(fetchHello.request())}>Fetch Failed</button>
    <button onClick={() => dispatch(incrementCounter())}>Increment +</button>
  </div>
));

const rootEl = document.getElementById('app');
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootEl
);
