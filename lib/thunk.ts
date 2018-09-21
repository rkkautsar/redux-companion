import { ReduxCompanion } from './index';
import { noop } from './utils';

export const createAsyncThunk = (
  { actions }: ReduxCompanion.AsyncModule,
  func: (...args) => Promise<object>,
  { onSuccess = noop, onFail = noop, rethrow = true } = {}
) => (...params) => async (dispatch, getState) => {
  dispatch(actions.request());
  try {
    const data = await func(...params);
    dispatch(actions.success(data));
    await onSuccess(dispatch, getState);
    return data;
  } catch (e) {
    dispatch(actions.fail(e.message));
    onFail(dispatch, getState);

    if (rethrow) throw e;
  }
};
