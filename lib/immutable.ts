/// <reference types="seamless-immutable"/>

import { ImmutableObject } from 'seamless-immutable';
import { ReduxCompanion, asyncInitialState } from './index';
import { identity } from './utils';

export declare namespace ReduxCompanionImmutable {
  type ImmutableState = ImmutableObject<ReduxCompanion.State>;
  type Handler = (state?: ImmutableState, payload?: any) => ImmutableState;
  type Handlers = { [type: string]: Handler };
}

export const createAsyncHandlers = (
  actions: ReduxCompanion.AsyncActions,
  {
    onRequest = identity,
    onSuccess = identity,
    onFail = identity
  }: ReduxCompanionImmutable.Handlers = {}
): ReduxCompanionImmutable.Handlers => ({
  [actions.request.toString()]: (state, payload) =>
    onRequest(state.set('isLoading', true), payload),
  [actions.success.toString()]: (state, payload) =>
    onSuccess(
      state.merge(
        {
          isLoading: false,
          isLoaded: true,
          error: null,
          data: payload
        },
        { deep: true }
      ),
      payload
    ),
  [actions.fail.toString()]: (state, payload) =>
    onFail(state.set('isLoading', false).set('error', payload), payload),
  [actions.reset.toString()]: state => state.merge(asyncInitialState, { deep: true })
});

export const createSubstateHandler = (
  handler: ReduxCompanionImmutable.Handler,
  path
): ReduxCompanionImmutable.Handler => (state, payload) =>
  state.set(path, handler(state[path], payload));
