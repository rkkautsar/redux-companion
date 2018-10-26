export const identity = (x, ..._) => x;
export const compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)));
export const get = path => obj => path.reduce((o, p) => (o && o[p] ? o[p] : null), obj);
export const mergeDeep = (path, value, obj) => {
  if (path.length === 0) return { ...obj, ...value };
  const [p, ...rest] = path;
  return {
    ...obj,
    [p]: mergeDeep(rest, value, obj[p])
  };
};

// lens -> transformations -> (state, payload) -> state
export const createStateUpdate = path => transformation => (state, payload) =>
  mergeDeep(path, transformation(payload), state);
