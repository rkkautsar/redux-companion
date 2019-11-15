import { identity, compose, get, mergeDeep, createStateUpdate } from '../lib/utils';

describe('utils', () => {
  test('identity', () => {
    const args = [1, 2, 3];
    const expected = 1;
    expect(identity(...args)).toBe(expected);
  });

  test('compose', () => {
    const f = x => x + 1;
    const g = x => x * 2;
    const fog = compose(
      f,
      g
    );
    const gof = compose(
      g,
      f
    );
    expect(fog(1)).toBe(3);
    expect(gof(1)).toBe(4);
  });

  test('get', () => {
    const obj = {
      a: 1,
      b: {
        c: 2
      }
    };

    expect(get([])(obj)).toBe(obj);
    expect(get(['a'])(obj)).toBe(obj.a);
    expect(get(['b'])(obj)).toBe(obj.b);
    expect(get(['b', 'c'])(obj)).toBe(obj.b.c);
    expect(get(['b', 'c', 'd'])(obj)).toBe(null);
  });

  test('mergeDeep', () => {
    const obj = {
      a: 1,
      b: {
        c: {
          d: 2
        }
      }
    };

    const update = { d: 3, e: 4 };
    const expected = {
      a: 1,
      b: {
        c: {
          d: 3,
          e: 4
        }
      }
    };

    expect(mergeDeep(['b', 'c'], update, obj)).toEqual(expected);
  });

  test('createStateUpdate', () => {
    const state = {
      a: { b: { c: 1 } }
    };
    const transformation = payload => ({ c: payload });
    const stateUpdate = createStateUpdate(['a', 'b'])(transformation);
    expect(stateUpdate(state, 2)).toEqual({ a: { b: { c: 2 } } });
  });
});
