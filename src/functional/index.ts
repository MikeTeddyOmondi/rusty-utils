/**
 * Functional programming utilities inspired by Rust and functional languages
 */

/**
 * Function composition - applies functions from right to left
 */
export const compose = <T>(...functions: Array<(arg: T) => T>) =>
  (value: T): T => functions.reduceRight((acc, fn) => fn(acc), value);

/**
 * Pipe function - applies functions from left to right
 * Supports type evolution through the pipeline
 * Works with any data structure with proper type inference
 */
export const pipe = <T>(value: T, ...functions: Array<(arg: T) => T>): T =>
  functions.reduce((acc, fn) => fn(acc), value);

// export const pipe: {
//   <T>(value: T): T;
//   <T, A>(value: T, f1: (arg: T) => A): A;
//   <T, A, B>(value: T, f1: (arg: T) => A, f2: (arg: A) => B): B;
//   <T, A, B, C>(value: T, f1: (arg: T) => A, f2: (arg: A) => B, f3: (arg: A) => C): C;
//   // Add more overloads as needed for additional functions
//   <T>(value: T, ...functions: Array<(arg: any) => any>): unknown;
// } = <T>(value: T, ...functions: Array<(arg: any) => any>): unknown =>
//   functions.reduce((acc, fn) => fn(acc), value);

// export const pipe = <T, U>(
//   value: T,
//   ...functions: Array<(arg: any) => any>
// ): U => functions.reduce((acc, fn) => fn(acc), value) as U;

/**
 * Curry a binary function
 */
export const curry2 = <T, U, V>(fn: (a: T, b: U) => V) =>
  (a: T) => (b: U) => fn(a, b);

/**
 * Curry a ternary function
 */
export const curry3 = <T, U, V, W>(fn: (a: T, b: U, c: V) => W) =>
  (a: T) => (b: U) => (c: V) => fn(a, b, c);

/**
 * Partial application helper
 */
export const partial = <T extends any[], U>(
  fn: (...args: T) => U,
  ...partialArgs: Partial<T>
) => (...remainingArgs: any[]): U => 
  fn(...([...partialArgs, ...remainingArgs] as T));

/**
 * Identity function - returns its argument unchanged
 */
export const identity = <T>(value: T): T => value;

/**
 * Constant function - always returns the same value
 */
export const constant = <T>(value: T) => (): T => value;

/**
 * Flip the arguments of a binary function
 */
export const flip = <T, U, V>(fn: (a: T, b: U) => V) =>
  (b: U, a: T): V => fn(a, b);

/**
 * Creates a memoized version of a function
 */
export const memoize = <T extends any[], U>(
  fn: (...args: T) => U,
  keyFn: (...args: T) => string = (...args) => JSON.stringify(args)
): ((...args: T) => U) => {
  const cache = new Map<string, U>();
  
  return (...args: T): U => {
    const key = keyFn(...args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Debounce a function - delay execution until after delay milliseconds
 */
export const debounce = <T extends any[]>(
  fn: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: T): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle a function - limit execution to once per interval
 */
export const throttle = <T extends any[]>(
  fn: (...args: T) => void,
  interval: number
): ((...args: T) => void) => {
  let lastCall = 0;
  
  return (...args: T): void => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
};

/**
 * Creates a predicate function for filtering arrays
 */
export const createFilter = <T>(predicate: (item: T) => boolean) =>
  (items: T[]): T[] => items.filter(predicate);

/**
 * Creates a mapper function for transforming arrays
 */
export const createMapper = <T, U>(transform: (item: T) => U) =>
  (items: T[]): U[] => items.map(transform);

/**
 * Creates a reducer function
 */
export const createReducer = <T, U>(
  reducer: (acc: U, item: T) => U,
  initialValue: U
) => (items: T[]): U => items.reduce(reducer, initialValue);

/**
 * Safe array access that returns an Option
 */
import { Option, some, none } from '../option/index.js';

export const safeGet = <T>(array: T[], index: number): Option<T> => {
  return index >= 0 && index < array.length ? some(array[index]) : none;
};

/**
 * Safe object property access that returns an Option
 */
export const safeProp = <T, K extends keyof T>(obj: T, key: K): Option<T[K]> => {
  return obj[key] !== undefined ? some(obj[key]) : none;
};

/**
 * Try to parse JSON safely
 */
export const safeJsonParse = <T = any>(json: string): Option<T> => {
  try {
    return some(JSON.parse(json));
  } catch {
    return none;
  }
};

/**
 * Range function similar to Python's range
 */
export const range = (start: number, end?: number, step = 1): number[] => {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Chunk an array into smaller arrays of specified size
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  if (size <= 0) return [];
  
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Group array elements by a key function
 */
export const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    (groups[key] = groups[key] || []).push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

/**
 * Get unique elements from an array
 */
export const unique = <T>(array: T[]): T[] => [...new Set(array)];

/**
 * Get unique elements by a key function
 */
export const uniqueBy = <T, K>(array: T[], keyFn: (item: T) => K): T[] => {
  const seen = new Set<K>();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * Zip two arrays together
 */
export const zip = <T, U>(arr1: T[], arr2: U[]): Array<[T, U]> => {
  const length = Math.min(arr1.length, arr2.length);
  const result: Array<[T, U]> = [];
  
  for (let i = 0; i < length; i++) {
    result.push([arr1[i], arr2[i]]);
  }
  
  return result;
};

/**
 * Partition an array into two arrays based on a predicate
 */
export const partition = <T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] => {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  
  return [truthy, falsy];
};