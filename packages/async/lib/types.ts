import { ActionType } from '@redux-companion/core';

export interface Store {
  getState: Function;
  dispatch: Function;
}

export type MiddlewareHandler = (store: Store, action: ActionType) => Promise<any>;
