import { Option, some, none, isSome, isNone, AsyncOption } from './types.js';

/**
 * Maps the value of an Option to a new value
 * Similar to Rust's Option::map
 */
export const map = <T, U>(
  option: Option<T>,
  fn: (value: T) => U
): Option<U> => {
  return isSome(option) ? some(fn(option.value)) : none;
};

/**
 * Chains Option-returning operations
 * Similar to Rust's Option::and_then
 */
export const andThen = <T, U>(
  option: Option<T>,
  fn: (value: T) => Option<U>
): Option<U> => {
  return isSome(option) ? fn(option.value) : none;
};

/**
 * Provides an alternative Option if the current one is None
 * Similar to Rust's Option::or_else
 */
export const orElse = <T>(
  option: Option<T>,
  fn: () => Option<T>
): Option<T> => {
  return isSome(option) ? option : fn();
};

/**
 * Unwraps an Option, returning the value or a default
 * Similar to Rust's Option::unwrap_or
 */
export const unwrapOr = <T>(option: Option<T>, defaultValue: T): T => {
  return isSome(option) ? option.value : defaultValue;
};

/**
 * Unwraps an Option, returning the value or calling a function for default
 * Similar to Rust's Option::unwrap_or_else
 */
export const unwrapOrElse = <T>(option: Option<T>, fn: () => T): T => {
  return isSome(option) ? option.value : fn();
};

/**
 * Unwraps an Option, throwing an error if it's None
 * Similar to Rust's Option::unwrap
 * ⚠️ Use with caution - prefer unwrapOr or unwrapOrElse
 */
export const unwrap = <T>(option: Option<T>): T => {
  if (isSome(option)) {
    return option.value;
  }
  throw new Error('Called unwrap on a None value');
};

/**
 * Unwraps an Option, throwing a custom error if it's None
 * Similar to Rust's Option::expect
 */
export const expect = <T>(option: Option<T>, message: string): T => {
  if (isSome(option)) {
    return option.value;
  }
  throw new Error(message);
};

/**
 * Pattern matching for Options
 * Provides exhaustive handling of both Some and None cases
 */
export const match = <T, R>(
  option: Option<T>,
  patterns: {
    some: (value: T) => R;
    none: () => R;
  }
): R => {
  return isSome(option) ? patterns.some(option.value) : patterns.none();
};

/**
 * Async version of map
 */
export const mapAsync = async <T, U>(
  option: AsyncOption<T>,
  fn: (value: T) => U | Promise<U>
): AsyncOption<U> => {
  const resolved = await option;
  if (isSome(resolved)) {
    const mapped = await fn(resolved.value);
    return some(mapped);
  }
  return none;
};

/**
 * Async version of andThen
 */
export const andThenAsync = async <T, U>(
  option: AsyncOption<T>,
  fn: (value: T) => AsyncOption<U>
): AsyncOption<U> => {
  const resolved = await option;
  return isSome(resolved) ? await fn(resolved.value) : none;
};

/**
 * Filters an Option based on a predicate
 * Returns the Option if predicate is true, otherwise None
 * Similar to Rust's Option::filter
 */
export const filter = <T>(
  option: Option<T>,
  predicate: (value: T) => boolean
): Option<T> => {
  return isSome(option) && predicate(option.value) ? option : none;
};

/**
 * Combines two Options using a function
 * Returns Some if both Options are Some, otherwise None
 */
export const map2 = <T, U, V>(
  option1: Option<T>,
  option2: Option<U>,
  fn: (value1: T, value2: U) => V
): Option<V> => {
  if (isSome(option1) && isSome(option2)) {
    return some(fn(option1.value, option2.value));
  }
  return none;
};

/**
 * Combines three Options using a function
 * Returns Some if all Options are Some, otherwise None
 */
export const map3 = <T, U, V, W>(
  option1: Option<T>,
  option2: Option<U>,
  option3: Option<V>,
  fn: (value1: T, value2: U, value3: V) => W
): Option<W> => {
  if (isSome(option1) && isSome(option2) && isSome(option3)) {
    return some(fn(option1.value, option2.value, option3.value));
  }
  return none;
};

/**
 * Combines multiple Options into a single Option containing an array
 * Returns Some with array of values if all are Some, otherwise None
 */
export const combine = <T>(options: Option<T>[]): Option<T[]> => {
  const values: T[] = [];
  
  for (const option of options) {
    if (isNone(option)) {
      return none;
    }
    values.push(option.value);
  }
  
  return some(values);
};

/**
 * Async version of combine
 */
export const combineAsync = async <T>(
  options: AsyncOption<T>[]
): AsyncOption<T[]> => {
  const resolved = await Promise.all(options);
  return combine(resolved);
};

/**
 * Finds the first Some value in an array of Options
 */
export const findSome = <T>(options: Option<T>[]): Option<T> => {
  for (const option of options) {
    if (isSome(option)) {
      return option;
    }
  }
  return none;
};

/**
 * Collects all Some values from an array of Options
 */
export const collectSome = <T>(options: Option<T>[]): T[] => {
  const values: T[] = [];
  for (const option of options) {
    if (isSome(option)) {
      values.push(option.value);
    }
  }
  return values;
};