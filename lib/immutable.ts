/// <reference types="seamless-immutable"/>

import { ImmutableObject } from 'seamless-immutable';
import { ReduxCompanion } from './index';
import { identity } from './utils';

export declare namespace ReduxCompanionImmutable {
  type ImmutableState = ImmutableObject<ReduxCompanion.State>;
  interface AsyncModule extends ReduxCompanion.AsyncModule {
    states: ImmutableState;
  }
  type Handler = (state?: ImmutableState, payload?: any) => ImmutableState;
  type Handlers = { [type: string]: Handler };
}

export const createAsyncHandlers = (
  asyncModule: ReduxCompanionImmutable.AsyncModule,
  {
    onRequest = identity,
    onSuccess = identity,
    onFail = identity
  }: ReduxCompanionImmutable.Handlers = {}
): ReduxCompanionImmutable.Handlers => ({
  [asyncModule.actions.request.toString()]: (state, payload) =>
    onRequest(state.setIn([asyncModule.id, 'isLoading'], true), payload),
  [asyncModule.actions.success.toString()]: (state, payload) =>
    onSuccess(
      state.merge(
        {
          [asyncModule.id]: {
            isLoading: false,
            isLoaded: true,
            error: null,
            data: payload
          }
        },
        { deep: true }
      ),
      payload
    ),
  [asyncModule.actions.fail.toString()]: (state, payload) =>
    onFail(
      state.merge(
        {
          [asyncModule.id]: { isLoading: false, error: payload }
        },
        { deep: true }
      ),
      payload
    ),
  [asyncModule.actions.reset.toString()]: state => state.merge(asyncModule.states, { deep: true })
});
