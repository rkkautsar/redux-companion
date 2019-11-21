/**
 *
 */
import { ActionType, HandlerType } from './types';

export * from './types';

export function createAction(type: string) {
  function actionCreator(payload = null): ActionType {
    return {
      type,
      payload
    };
  }
  actionCreator.toString = () => type;

  return actionCreator;
}

export function createReducer<StateType>(
  handlers: { [key: string]: HandlerType<StateType> },
  initialState: StateType
) {
  return (state: StateType = initialState, action: ActionType = {}): StateType => {
    const { type, payload } = action;
    return handlers.hasOwnProperty(type) ? handlers[type](state, payload) : state;
  };
}
