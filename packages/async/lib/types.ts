import { ActionType } from '@redux-companion/core';

interface Store {
  getState: Function;
  dispatch: Function;
}

export type MiddlewareHandler = (store: Store, action: ActionType) => Promise<any>;
