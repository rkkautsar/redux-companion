declare namespace ReduxAsyncHelper {
  interface Action {
    type: string;
    payload: any;
    error: boolean;
  }

  type ActionCreator = (payload?: any) => Action;

  interface AsyncActions {
    request: ActionCreator;
    success: ActionCreator;
    fail: ActionCreator;
    reset: ActionCreator;
  }

  type State = object;

  type Handler = (state: State, payload: any) => State;

  type Handlers = { [type: string]: Handler };
}
