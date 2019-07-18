// @flow

// Type Helpers
// ------------------------------

export const isObject = (o: *) =>
  typeof o === 'object' && o !== null && !Array.isArray(o);
export const isPromise = (p: *) => p.then && typeof p.then === 'function';
export const isEmptyString = (str: *) =>
  typeof str === 'string' && str.length === 0;

type X = Object;
type Z = Array<any>;

// Array Helpers
// ------------------------------

export const uniqueArr = (arr: Z): Z => [...new Set(arr)];
export const diffArr = (a: Z, b: Z): Z => a.filter(i => b.indexOf(i) < 0);

// NOTE: only use `isEqualArr` for primitives (string, number etc.) like "keys"
const stringifyArr = (a: Z): string =>
  a
    .filter(Boolean)
    .sort()
    .join(',');
export const isEqualArr = (a: Z, b: Z): boolean => {
  return stringifyArr(a) === stringifyArr(b);
};

type cloneArrOptions = { add?: any, remove?: any, sort?: boolean };
export const cloneArr = (arr: Z, options: cloneArrOptions = {}): Z => {
  const { add, remove, sort } = options;

  let array = [...arr];

  if (Array.isArray(add)) array = [...array, ...add];
  else if (add) array.push(add);
  if (remove) array = array.filter(v => v !== remove);

  return sort ? array.sort() : array;
};

// Object Helpers
// ------------------------------

export const isEmptyObj = (obj: X): boolean => Object.keys(obj).length === 0;

type cloneObjOptions = { add?: X, remove?: string };
export const cloneObj = (obj: X, options: cloneObjOptions = {}) => {
  const { add, remove } = options;

  // add key/value pair
  if (add) {
    return { ...obj, ...add };
  }

  // remove by key
  if (remove) {
    const n = { ...obj };
    delete n[remove];
    return n;
  }

  return { ...obj };
};

export const objectMap = (object: X, mapFn: (any, string) => any) => {
  return Object.keys(object).reduce((res, key) => {
    const result = cloneObj(res);
    const value = mapFn(object[key], key);

    if (value) {
      result[key] = value;
      return result;
    }

    return res;
  }, {});
};

// String Helpers
// ------------------------------

export const stringCompare = (a: any, b: any): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};
