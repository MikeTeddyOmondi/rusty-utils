/**
 * @locci/rusty-utils - Rust-inspired utilities for TypeScript
 *
 * A comprehensive collection of functional programming and error handling
 * utilities inspired by Rust's type system and functional languages.
 */

// Result type exports
export {
  type Result,
  type Ok,
  type Err,
  type AsyncResult,
  type MaybeAsyncResult,
  ok,
  err,
  isOk,
  isErr,
} from "./result/types.js";

export {
  map as mapResult,
  mapErr,
  andThen as andThenResult,
  orElse as orElseResult,
  unwrapOr as unwrapOrResult,
  unwrapOrElse as unwrapOrElseResult,
  unwrap as unwrapResult,
  expect as expectResult,
  match as matchResult,
  mapAsync as mapResultAsync,
  andThenAsync as andThenResultAsync,
  combine as combineResults,
  combineAsync as combineResultsAsync,
  tryCatch,
  tryCatchAsync,
  filter as filterResult,
} from "./result/utils.js";

// Option type exports
export {
  type Option,
  type Some,
  type None,
  type AsyncOption,
  some,
  none,
  isSome,
  isNone,
  fromNullable,
  toNullable,
  toUndefined,
} from "./option/types.js";

export {
  map as mapOption,
  andThen as andThenOption,
  orElse as orElseOption,
  unwrapOr as unwrapOrOption,
  unwrapOrElse as unwrapOrElseOption,
  unwrap as unwrapOption,
  expect as expectOption,
  match as matchOption,
  mapAsync as mapOptionAsync,
  andThenAsync as andThenOptionAsync,
  filter as filterOption,
  map2,
  map3,
  combine as combineOptions,
  combineAsync as combineOptionsAsync,
  findSome,
  collectSome,
} from "./option/utils.js";

// Functional programming utilities
export {
  compose,
  pipe,
  curry2,
  curry3,
  partial,
  identity,
  constant,
  flip,
  memoize,
  debounce,
  throttle,
  createFilter,
  createMapper,
  createReducer,
  safeGet,
  safeProp,
  safeJsonParse,
  range,
  chunk,
  groupBy,
  unique,
  uniqueBy,
  zip,
  partition,
} from "./functional/index.js";

// Re-export everything with namespace for convenience
import * as ResultUtils from "./result/utils.js";
import * as OptionUtils from "./option/utils.js";
import * as FunctionalUtils from "./functional/index.js";

export { ResultUtils, OptionUtils, FunctionalUtils };
