/**
 * Result module - Rust-inspired error handling for TypeScript
 */

export {
  type Result,
  type Ok,
  type Err,
  type AsyncResult,
  type MaybeAsyncResult,
  ok,
  err,
  isOk,
  isErr
} from './types.js';

export {
  map,
  mapErr,
  andThen,
  orElse,
  unwrapOr,
  unwrapOrElse,
  unwrap,
  expect,
  match,
  mapAsync,
  andThenAsync,
  combine,
  combineAsync,
  tryCatch,
  tryCatchAsync,
  filter
} from './utils.js';