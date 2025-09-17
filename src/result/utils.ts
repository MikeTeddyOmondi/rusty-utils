import { Result, ok, err, isOk, isErr, AsyncResult } from './types.js';

/**
 * Maps the success value of a Result to a new value
 * Similar to Rust's Result::map
 */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> => {
  return isOk(result) ? ok(fn(result.value)) : result;
};

/**
 * Maps the error value of a Result to a new error
 * Similar to Rust's Result::map_err
 */
export const mapErr = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> => {
  return isErr(result) ? err(fn(result.error)) : result;
};

/**
 * Chains Result-returning operations
 * Similar to Rust's Result::and_then
 */
export const andThen = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> => {
  return isOk(result) ? fn(result.value) : result;
};

/**
 * Handles error cases by providing an alternative Result
 * Similar to Rust's Result::or_else
 */
export const orElse = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => Result<T, F>
): Result<T, F> => {
  return isErr(result) ? fn(result.error) : result;
};

/**
 * Unwraps a Result, returning the value or a default
 * Similar to Rust's Result::unwrap_or
 */
export const unwrapOr = <T, E>(
  result: Result<T, E>,
  defaultValue: T
): T => {
  return isOk(result) ? result.value : defaultValue;
};

/**
 * Unwraps a Result, returning the value or calling a function for default
 * Similar to Rust's Result::unwrap_or_else
 */
export const unwrapOrElse = <T, E>(
  result: Result<T, E>,
  fn: (error: E) => T
): T => {
  return isOk(result) ? result.value : fn(result.error);
};

/**
 * Unwraps a Result, throwing an error if it's Err
 * Similar to Rust's Result::unwrap
 * ⚠️ Use with caution - prefer unwrapOr or unwrapOrElse
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (isOk(result)) {
    return result.value;
  }
  
  const error = result.error;
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(`Unwrap failed: ${JSON.stringify(error)}`);
};

/**
 * Unwraps a Result, throwing a custom error if it's Err
 * Similar to Rust's Result::expect
 */
export const expect = <T, E>(result: Result<T, E>, message: string): T => {
  if (isOk(result)) {
    return result.value;
  }
  throw new Error(message);
};

/**
 * Pattern matching for Results
 * Provides exhaustive handling of both Ok and Err cases
 */
export const match = <T, E, R>(
  result: Result<T, E>,
  patterns: {
    ok: (value: T) => R;
    err: (error: E) => R;
  }
): R => {
  return isOk(result) ? patterns.ok(result.value) : patterns.err(result.error);
};

/**
 * Async version of map
 */
export const mapAsync = async <T, U, E>(
  result: AsyncResult<T, E>,
  fn: (value: T) => U | Promise<U>
): AsyncResult<U, E> => {
  const resolved = await result;
  if (isOk(resolved)) {
    const mapped = await fn(resolved.value);
    return ok(mapped);
  }
  return resolved;
};

/**
 * Async version of andThen
 */
export const andThenAsync = async <T, U, E>(
  result: AsyncResult<T, E>,
  fn: (value: T) => AsyncResult<U, E>
): AsyncResult<U, E> => {
  const resolved = await result;
  return isOk(resolved) ? await fn(resolved.value) : resolved;
};

/**
 * Combines multiple Results into a single Result
 * Returns Ok with array of values if all are Ok, otherwise returns first Err
 */
export const combine = <T, E>(
  results: Result<T, E>[]
): Result<T[], E> => {
  const values: T[] = [];
  
  for (const result of results) {
    if (isErr(result)) {
      return result;
    }
    values.push(result.value);
  }
  
  return ok(values);
};

/**
 * Async version of combine
 */
export const combineAsync = async <T, E>(
  results: AsyncResult<T, E>[]
): AsyncResult<T[], E> => {
  const resolved = await Promise.all(results);
  return combine(resolved);
};

/**
 * Wraps a function that might throw into a Result-returning function
 */
export const tryCatch = <T, E = Error>(
  fn: () => T,
  errorMapper?: (error: unknown) => E
): Result<T, E> => {
  try {
    return ok(fn());
  } catch (error) {
    const mappedError = errorMapper ? errorMapper(error) : error;
    return err(mappedError as E);
  }
};

/**
 * Async version of tryCatch
 */
export const tryCatchAsync = async <T, E = Error>(
  fn: () => Promise<T>,
  errorMapper?: (error: unknown) => E
): AsyncResult<T, E> => {
  try {
    const value = await fn();
    return ok(value);
  } catch (error) {
    const mappedError = errorMapper ? errorMapper(error) : error;
    return err(mappedError as E);
  }
};

/**
 * Filters a Result based on a predicate
 * Returns Err if the predicate fails
 */
export const filter = <T, E>(
  result: Result<T, E>,
  predicate: (value: T) => boolean,
  errorFn: (value: T) => E
): Result<T, E> => {
  if (isOk(result)) {
    return predicate(result.value) ? result : err(errorFn(result.value));
  }
  return result;
};