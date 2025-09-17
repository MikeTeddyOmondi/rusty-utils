import {
  some,
  none,
  isSome,
  isNone,
  fromNullable,
  toNullable,
  map,
  andThen,
  unwrapOr,
  match,
  combine,
  filter
} from '../option/index.js';

describe('Option Type', () => {
  describe('constructors and type guards', () => {
    test('some creates Some option', () => {
      const option = some(42);
      expect(isSome(option)).toBe(true);
      expect(isNone(option)).toBe(false);
      expect(option.value).toBe(42);
    });

    test('none represents absence of value', () => {
      expect(isNone(none)).toBe(true);
      expect(isSome(none)).toBe(false);
    });
  });

  describe('fromNullable', () => {
    test('creates Some for non-null values', () => {
      const option = fromNullable(42);
      expect(isSome(option)).toBe(true);
      if (isSome(option)) {
        expect(option.value).toBe(42);
      }
    });

    test('creates None for null', () => {
      const option = fromNullable(null);
      expect(isNone(option)).toBe(true);
    });

    test('creates None for undefined', () => {
      const option = fromNullable(undefined);
      expect(isNone(option)).toBe(true);
    });
  });

  describe('toNullable', () => {
    test('returns value for Some', () => {
      const option = some(42);
      expect(toNullable(option)).toBe(42);
    });

    test('returns null for None', () => {
      expect(toNullable(none)).toBe(null);
    });
  });

  describe('map', () => {
    test('maps Some value', () => {
      const option = some(5);
      const mapped = map(option, x => x * 2);
      
      expect(isSome(mapped)).toBe(true);
      if (isSome(mapped)) {
        expect(mapped.value).toBe(10);
      }
    });

    test('does not map None value', () => {
      const mapped = map(none, (x: number) => x * 2);
      expect(isNone(mapped)).toBe(true);
    });
  });

  describe('andThen', () => {
    test('chains Some values', () => {
      const option = some(5);
      const chained = andThen(option, x => some(x.toString()));
      
      expect(isSome(chained)).toBe(true);
      if (isSome(chained)) {
        expect(chained.value).toBe('5');
      }
    });

    test('returns None when chained function returns None', () => {
      const option = some(5);
      const chained = andThen(option, () => none);
      
      expect(isNone(chained)).toBe(true);
    });

    test('does not execute function on None', () => {
      const fn = jest.fn();
      const chained = andThen(none, fn);
      
      expect(fn).not.toHaveBeenCalled();
      expect(isNone(chained)).toBe(true);
    });
  });

  describe('unwrapOr', () => {
    test('returns value for Some', () => {
      const option = some(42);
      expect(unwrapOr(option, 0)).toBe(42);
    });

    test('returns default for None', () => {
      expect(unwrapOr(none, 0)).toBe(0);
    });
  });

  describe('match', () => {
    test('calls some handler for Some option', () => {
      const option = some(42);
      const matched = match(option, {
        some: x => `value: ${x}`,
        none: () => 'no value'
      });
      
      expect(matched).toBe('value: 42');
    });

    test('calls none handler for None option', () => {
      const matched = match(none, {
        some: (x: number) => `value: ${x}`,
        none: () => 'no value'
      });
      
      expect(matched).toBe('no value');
    });
  });

  describe('filter', () => {
    test('keeps Some value when predicate is true', () => {
      const option = some(10);
      const filtered = filter(option, x => x > 5);
      
      expect(isSome(filtered)).toBe(true);
      if (isSome(filtered)) {
        expect(filtered.value).toBe(10);
      }
    });

    test('returns None when predicate is false', () => {
      const option = some(3);
      const filtered = filter(option, x => x > 5);
      
      expect(isNone(filtered)).toBe(true);
    });

    test('returns None for None input', () => {
      const filtered = filter(none, (x: number) => x > 5);
      expect(isNone(filtered)).toBe(true);
    });
  });

  describe('combine', () => {
    test('combines all Some options', () => {
      const options = [some(1), some(2), some(3)];
      const combined = combine(options);
      
      expect(isSome(combined)).toBe(true);
      if (isSome(combined)) {
        expect(combined.value).toEqual([1, 2, 3]);
      }
    });

    test('returns None when any option is None', () => {
      const options = [some(1), none, some(3)];
      const combined = combine(options);
      
      expect(isNone(combined)).toBe(true);
    });
  });

  describe('real-world usage', () => {
    interface User {
      id: string;
      name: string;
    }

    const users: User[] = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ];

    const findUserById = (id: string) =>
      fromNullable(users.find(u => u.id === id));

    const getUserName = (id: string) =>
      map(findUserById(id), user => user.name);

    test('finds existing user', () => {
      const name = getUserName('1');
      expect(isSome(name)).toBe(true);
      if (isSome(name)) {
        expect(name.value).toBe('Alice');
      }
    });

    test('handles non-existent user', () => {
      const name = getUserName('999');
      expect(isNone(name)).toBe(true);
    });

    test('provides default name', () => {
      const name = getUserName('999');
      const displayName = unwrapOr(name, 'Unknown User');
      expect(displayName).toBe('Unknown User');
    });
  });
});