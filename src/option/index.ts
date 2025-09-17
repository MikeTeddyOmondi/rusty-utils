/**
 * Option module - Rust-inspired nullable handling for TypeScript
 */

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
  toUndefined
} from './types.js';

export {
  map,
  andThen,
  orElse,
  unwrapOr,
  unwrapOrElse,
  unwrap,
  expect,
  match,
  mapAsync,
  andThenAsync,
  filter,
  map2,
  map3,
  combine,
  combineAsync,
  findSome,
  collectSome
} from './utils.js';