# Redux Companion

![GitHub](https://img.shields.io/github/license/rkkautsar/redux-companion.svg?style=flat-square)
![GitHub package version](https://img.shields.io/github/package-json/v/rkkautsar/redux-companion.svg?style=flat-square)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/redux-companion.svg?style=flat-square)
[![npm](https://img.shields.io/npm/dt/redux-companion.svg?style=flat-square)](https://www.npmjs.com/package/redux-companion)
[![Travis](https://img.shields.io/travis/com/rkkautsar/redux-companion.svg?style=flat-square)](https://travis-ci.com/rkkautsar/redux-companion)
[![Codecov](https://img.shields.io/codecov/c/github/rkkautsar/redux-companion.svg?style=flat-square)](https://codecov.io/gh/rkkautsar/redux-companion)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frkkautsar%2Fredux-companion.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Frkkautsar%2Fredux-companion?ref=badge_shield)

Opinionated way to reduce boilerplate on async (or sync) logic, like fetching data etc.
Zero dependency (Although it only makes sense to use together with `Redux` AND `Redux Thunk`).

## Packages

- [redux-companion](#installation)
- [@redux-companion/core](./packages/core)
- [@redux-companion/async](./packages/async)

## Installation

```sh
npm i redux-companion
```

## Why?

I find myself exhausted of writing (or copying) a lot of the same set of redux state, reducer,
actions, and thunks for interacting with the api, so I thought why not make it easier?

## Quick Start

See [example usage](example).

Let's recreate [Redux Todo List example](https://redux.js.org/basics/example/)
with redux-companion and [Ducks pattern](https://github.com/erikras/ducks-modular-redux).

### Reducers

<details>
<summary>reducers/todos.js</summary>

```js
import { createAction, createReducer } from 'redux-companion';

export const addTodo = createAction('ADD_TODO');
export const toggleTodo = createAction('TOGGLE_TODO');

const handlers = {
  [addTodo]: (state, payload) => [
    ...state,
    {
      id: payload.id,
      text: payload.text,
      completed: false
    }
  ],
  [toggleTodo]: (state, payload) =>
    state.map(todo => (todo.id === payload ? { ...todo, completed: !todo.completed } : todo))
};
const todo = createReducer(handlers, []);
export default todo;
```

</details>

<details>
<summary>reducers/visibilityFilter.js</summary>

```js
import { createAction, createReducer } from 'redux-companion';

export const setVisibilityFilter = createAction('SET_VISIBILITY_FILTER');

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

const handlers = {
  [setVisilibityFilter]: (state, payload) => payload
};
const visibilityFilter = createReducer(handlers, []);
export default visibilityFilter;
```

</details>

Not too much different, eh? But for me it's slightly better and less boilerplate.
How about async actions?

Let's actually save our todo list to the server.

<details>
<summary>services/api.js</summary>

```js
import axios from 'axios';
export const putTodos = todos => axios.put(`${BASE_URL}/todos/`, todos).then(res => res.data);
```

</details>

<details>
<summary>reducers/todos.js</summary>

```diff
import {
  createAction,
  createReducer,
+  createAsyncMiddleware,
+  createAsyncStatusReducer
} from 'redux-companion';
import { putTodos } from '../services/api';

export const addTodo = createAction('ADD_TODO');
export const toggleTodo = createAction('TOGGLE_TODO');

const handlers = {
  [addTodo]: (state, payload) => [
    ...state,
    {
      id: payload.id,
      text: payload.text,
      completed: false
    }
  ],
  [toggleTodo]: (state, payload) =>
    state.map(todo => (todo.id === payload ? { ...todo, completed: !todo.completed } : todo))
};

+ export const todosMiddleware = createAsyncMiddleware({
+   [saveTodos]: async ({ dispatch, getState }) => {
+     const todos = getState().todos;
+     try {
+       await putTodos(todos);
+       // do something after save action complete
+     } catch (e) {
+       // handle error here
+     }
+   }
+ });

+ export const { actions: saveTodos, reducer: saveTodosStatusReducer } = createAsyncStatusReducer(
+   'SAVE_TODOS'
+ );

const todo = createReducer(handlers, []);
export default todo;
```

</details>

And that's it, when you dispatch the saveTodos() action, the middleware (that you have to register, see [example](example))
will catch the action and run the associated api call with the todos.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frkkautsar%2Fredux-companion.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Frkkautsar%2Fredux-companion?ref=badge_large)
