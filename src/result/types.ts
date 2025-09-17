/**
 * Rust-inspired Result type for TypeScript
 * Represents either success (Ok) or failure (Err)
 */
export type Result<T, E = Error> = Ok<T> | Err<E>;

/**
 * Represents a successful result containing a value
 */
export interface Ok<T> {
  readonly _tag: 'Ok';
  readonly value: T;
}

/**
 * Represents a failed result containing an error
 */
export interface Err<E> {
  readonly _tag: 'Err';
  readonly error: E;
}

/**
 * Creates a successful Result
 */
export const ok = <T>(value: T): Ok<T> => ({
  _tag: 'Ok',
  value
});

/**
 * Creates a failed Result
 */
export const err = <E>(error: E): Err<E> => ({
  _tag: 'Err',
  error
});

/**
 * Type guard to check if Result is Ok
 */
export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => 
  result._tag === 'Ok';

/**
 * Type guard to check if Result is Err
 */
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> => 
  result._tag === 'Err';

/**
 * Async Result type for Promise-based operations
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/**
 * Function that can return either a sync or async Result
 */
export type MaybeAsyncResult<T, E = Error> = Result<T, E> | AsyncResult<T, E>;