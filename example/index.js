import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import {
  createReducer,
  createAsyncHandlers,
  createAction,
  createAsyncActions,
  asyncInitialState
} from '../dist';

import { createAsyncThunk } from '../dist/thunk';

const action = createAsyncActions('fetch_hello');
const incrementCounter = createAction('increment');

const handlers = {
  ...createAsyncHandlers(action),
  [incrementCounter]: state => ({ ...state, counter: state.counter + 1 })
};

const initialState = {
  ...asyncInitialState,
  counter: 0
};

const reducer = createReducer(handlers, initialState);

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const mockFetch = async () => {
  await sleep(1000);
  return 'Hello!';
};

const mockFetchFailed = async () => {
  await sleep(1000);
  throw new Error('Failed!');
};

const fetchThunk = createAsyncThunk(action, mockFetch);

const fetchFailedThunk = createAsyncThunk(action, mockFetchFailed);

const store = createStore(reducer, applyMiddleware(thunk, logger));

const App = connect(
  state => ({ state }),
  dispatch => ({ dispatch })
)(({ state, dispatch }) => (
  <div>
    <pre>
      <code>{JSON.stringify(state, null, 2)}</code>
    </pre>
    <button onClick={() => dispatch(fetchThunk())}>Fetch</button>
    <button onClick={() => dispatch(fetchFailedThunk())}>Fetch Failed</button>
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
