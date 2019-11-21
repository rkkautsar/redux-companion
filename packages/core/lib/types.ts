export interface ActionType {
  type?: string;
  payload?: any;
}

export type HandlerType<T> = (state: T, payload: any) => T;
