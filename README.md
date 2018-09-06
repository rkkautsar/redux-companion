# Redux Async Helper

![GitHub](https://img.shields.io/github/license/rkkautsar/redux-async-helper.svg?style=flat-square)
![GitHub package version](https://img.shields.io/github/package-json/v/rkkautsar/redux-async-helper.svg?style=flat-square)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/redux-async-helper.svg?style=flat-square)

Opinionated way to reduce boilerplate on async (or sync) logic, like fetching data etc.
Zero dependency (Although it only makes sense to use together with `Redux` AND `Redux Thunk`).

## Installation

```sh
npm i redux-async-helper
```

## Usage

See [example usage](example).

Basically, we have these utilities:

1. [createAction](#createAction)
2. [createReducer](#createReducer)
3. [createAsyncActions](#createAsyncActions)
4. [asyncInitialState](#asyncInitialState)
5. [createAsyncHandlers](#createAsyncHandlers)
6. [createAsyncThunk](#createAsyncThunk)

### createAction

This is a simplified version of the one used in [redux-act](https://github.com/pauldijou/redux-act).

```js
const myAction = createAction('my_action');
myAction.toString(); // my_action
myAction(); // { type: 'my_action', payload: null, error: false }
myAction({ my: 'payload' }); // { type: 'my_action', payload: { my: 'payload' }, error: false }
myAction(new Error('error'))); // { type: 'my_action', payload: Error('error'), error: true }
```

### createReducer

This is a helper function to make reducer based on handlers. Basically a handler is a function
receiving two arguments, `state` and `payload` and returns the modified state.

```js
const myHandlers = {
  [myAction]: state => ({ ...state, count: state.count + 1 })
};

const myInitialState = {
  count: 0
};

const myReducer = createReducer(myHandlers, myInitialState);
```

### createAsyncActions

Used to make a set of actions (request, success, fail, reset) to be used in other async helpers.

### asyncInitialState

An opinionated state for holding async state and data. Used with other async helpers.

### createAsyncHandlers

Used to make a set of handlers for the async actions generated with
[createAsyncActions](#createAsyncActions). This function also allows you to hook on each
async state with another handlers (`onRequest`, `onSuccess`, `onFail`). Received to arguments,
the async actions and hook handlers.

```js
const myFetchingHandlers = createAsyncHandlers(myAsyncActions, {
  onSuccess: state => ({ ...state, progress: 100 })
});

const myHandlers = {
  ...myFetchingHandlers
  // ... other handlers
};
```

### createAsyncThunk

Used to create a thunk (see [redux-thunk](https://github.com/reduxjs/redux-thunk)) for starting
(request) the async function. Received three arguments: async actions, the async function, and
options, which includes hooks for success (`onSuccess`) and fail (`onFail`), each receiving
the `dispatch` and `getState` as any other thunks. The async function is expected to resolve
the data (which will be placed in `data` key in the state tree produced by initialAsyncState),
any errors caught will be placed in the `error` key.

```js
const apiFetch = async () => {
  try {
    const response = await axios.get('/users');
    return response.data;
  } catch (err) {
    throw err;
  }
};

const fetchThunk = createAsyncThunk(actions, apiFetch, {
  onSuccess: () => console.log('success!')
});
```
