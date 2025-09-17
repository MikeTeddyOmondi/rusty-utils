/**
 * Rust-inspired Option type for TypeScript
 * Represents either a value (Some) or no value (None)
 */
export type Option<T> = Some<T> | None;

/**
 * Represents an Option containing a value
 */
export interface Some<T> {
  readonly _tag: 'Some';
  readonly value: T;
}

/**
 * Represents an Option containing no value
 */
export interface None {
  readonly _tag: 'None';
}

/**
 * Creates an Option containing a value
 */
export const some = <T>(value: T): Some<T> => ({
  _tag: 'Some',
  value
});

/**
 * Represents the absence of a value
 */
export const none: None = {
  _tag: 'None'
};

/**
 * Type guard to check if Option is Some
 */
export const isSome = <T>(option: Option<T>): option is Some<T> => 
  option._tag === 'Some';

/**
 * Type guard to check if Option is None
 */
export const isNone = <T>(option: Option<T>): option is None => 
  option._tag === 'None';

/**
 * Async Option type for Promise-based operations
 */
export type AsyncOption<T> = Promise<Option<T>>;

/**
 * Creates an Option from a nullable value
 * Returns Some(value) if value is not null/undefined, otherwise None
 */
export const fromNullable = <T>(value: T | null | undefined): Option<T> => {
  return value != null ? some(value) : none;
};

/**
 * Converts an Option to a nullable value
 * Returns the value if Some, otherwise null
 */
export const toNullable = <T>(option: Option<T>): T | null => {
  return isSome(option) ? option.value : null;
};

/**
 * Converts an Option to an undefined value
 * Returns the value if Some, otherwise undefined
 */
export const toUndefined = <T>(option: Option<T>): T | undefined => {
  return isSome(option) ? option.value : undefined;
};