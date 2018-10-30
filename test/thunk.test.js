import { createAsyncThunk, createFetchThunk } from '../lib/thunk';
import { createAsyncActions } from '../lib';

describe('createAsyncThunk', () => {
  const actions = createAsyncActions('MY_ASYNC_ACTIONS');

  it('handles resolving promises', async () => {
    const data = Symbol();
    const promise = data => Promise.resolve(data);
    const thunk = createAsyncThunk(actions, promise);
    const dispatch = jest.fn();
    await thunk(data)(dispatch);
    expect(dispatch).toBeCalledTimes(2);
    const expected = [actions.request(), actions.success(data)];
    expected.forEach((action, index) =>
      expect(dispatch).toHaveBeenNthCalledWith(index + 1, action)
    );
  });

  it('handles rejecting promises', async () => {
    const data = Symbol();
    const error = new Error('something went wrong');
    const promise = () => Promise.reject(error);
    const thunk = createAsyncThunk(actions, promise);
    const dispatch = jest.fn();
    await thunk(data)(dispatch);
    expect(dispatch).toBeCalledTimes(2);
    const expected = [actions.request(), actions.fail(error.message)];
    expected.forEach((action, index) =>
      expect(dispatch).toHaveBeenNthCalledWith(index + 1, action)
    );
  });
});

describe('createFetchThunk', () => {
  const actions = createAsyncActions('MY_ASYNC_ACTIONS');

  it('handles resolving promises', async () => {
    const data = Symbol();
    const promise = data => Promise.resolve({ data });
    const thunk = createFetchThunk(actions, promise);
    const dispatch = jest.fn();
    await thunk(data)(dispatch);
    expect(dispatch).toBeCalledTimes(2);
    const expected = [actions.request(), actions.success(data)];
    expected.forEach((action, index) =>
      expect(dispatch).toHaveBeenNthCalledWith(index + 1, action)
    );
  });

  it('handles rejecting promises', async () => {
    const data = Symbol();
    const response = Symbol();
    const promise = () => Promise.reject({ response });
    const thunk = createFetchThunk(actions, promise);
    const dispatch = jest.fn();
    await thunk(data)(dispatch);
    expect(dispatch).toBeCalledTimes(2);
    const expected = [actions.request(), actions.fail(response)];
    expected.forEach((action, index) =>
      expect(dispatch).toHaveBeenNthCalledWith(index + 1, action)
    );
  });
});
