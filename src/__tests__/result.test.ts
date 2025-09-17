import {
  ok,
  err,
  isOk,
  isErr,
  map,
  andThen,
  unwrapOr,
  match,
  combine,
  tryCatch
} from '../result/index.js';

describe('Result Type', () => {
  describe('constructors and type guards', () => {
    test('ok creates Ok result', () => {
      const result = ok(42);
      expect(isOk(result)).toBe(true);
      expect(isErr(result)).toBe(false);
      expect(result.value).toBe(42);
    });

    test('err creates Err result', () => {
      const result = err('error message');
      expect(isErr(result)).toBe(true);
      expect(isOk(result)).toBe(false);
      expect(result.error).toBe('error message');
    });
  });

  describe('map', () => {
    test('maps Ok value', () => {
      const result = ok(5);
      const mapped = map(result, x => x * 2);
      
      expect(isOk(mapped)).toBe(true);
      if (isOk(mapped)) {
        expect(mapped.value).toBe(10);
      }
    });

    test('does not map Err value', () => {
      const result = err('error');
      const mapped = map(result, x => x as number * 2);
      
      expect(isErr(mapped)).toBe(true);
      if (isErr(mapped)) {
        expect(mapped.error).toBe('error');
      }
    });
  });

  describe('andThen', () => {
    test('chains Ok values', () => {
      const result = ok(5);
      const chained = andThen(result, x => ok(x.toString()));
      
      expect(isOk(chained)).toBe(true);
      if (isOk(chained)) {
        expect(chained.value).toBe('5');
      }
    });

    test('stops chain on Err', () => {
      const result = ok(5);
      const chained = andThen(result, () => err('chain error'));
      
      expect(isErr(chained)).toBe(true);
      if (isErr(chained)) {
        expect(chained.error).toBe('chain error');
      }
    });

    test('does not execute function on Err', () => {
      const result = err('original error');
      const fn = jest.fn();
      const chained = andThen(result, fn);
      
      expect(fn).not.toHaveBeenCalled();
      expect(isErr(chained)).toBe(true);
    });
  });

  describe('unwrapOr', () => {
    test('returns value for Ok', () => {
      const result = ok(42);
      expect(unwrapOr(result, 0)).toBe(42);
    });

    test('returns default for Err', () => {
      const result = err('error');
      expect(unwrapOr(result, 0)).toBe(0);
    });
  });

  describe('match', () => {
    test('calls ok handler for Ok result', () => {
      const result = ok(42);
      const matched = match(result, {
        ok: x => `success: ${x}`,
        err: e => `error: ${e}`
      });
      
      expect(matched).toBe('success: 42');
    });

    test('calls err handler for Err result', () => {
      const result = err('failed');
      const matched = match(result, {
        ok: x => `success: ${x}`,
        err: e => `error: ${e}`
      });
      
      expect(matched).toBe('error: failed');
    });
  });

  describe('combine', () => {
    test('combines all Ok results', () => {
      const results = [ok(1), ok(2), ok(3)];
      const combined = combine(results);
      
      expect(isOk(combined)).toBe(true);
      if (isOk(combined)) {
        expect(combined.value).toEqual([1, 2, 3]);
      }
    });

    test('returns first Err when any result is Err', () => {
      const results = [ok(1), err('error'), ok(3)];
      const combined = combine(results);
      
      expect(isErr(combined)).toBe(true);
      if (isErr(combined)) {
        expect(combined.error).toBe('error');
      }
    });
  });

  describe('tryCatch', () => {
    test('returns Ok for successful function', () => {
      const result = tryCatch(() => 42);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toBe(42);
      }
    });

    test('returns Err for throwing function', () => {
      const result = tryCatch(() => {
        throw new Error('test error');
      });
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBeInstanceOf(Error);
      }
    });

    test('uses custom error mapper', () => {
      const result = tryCatch(
        () => {
          throw new Error('test error');
        },
        (error) => `Custom: ${(error as Error).message}`
      );
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('Custom: test error');
      }
    });
  });

  describe('real-world usage', () => {
    interface User {
      id: string;
      email: string;
      age: number;
    }

    const validateAge = (age: number) =>
      age >= 18 ? ok(age) : err('Must be at least 18');

    const validateEmail = (email: string) =>
      email.includes('@') ? ok(email) : err('Invalid email');

    const createUser = (id: string, email: string, age: number) =>
      andThen(validateEmail(email), validEmail =>
        andThen(validateAge(age), validAge =>
          ok({ id, email: validEmail, age: validAge })
        )
      );

    test('creates valid user', () => {
      const result = createUser('1', 'test@example.com', 25);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value).toEqual({
          id: '1',
          email: 'test@example.com',
          age: 25
        });
      }
    });

    test('fails with invalid email', () => {
      const result = createUser('1', 'invalid-email', 25);
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('Invalid email');
      }
    });

    test('fails with invalid age', () => {
      const result = createUser('1', 'test@example.com', 16);
      
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('Must be at least 18');
      }
    });
  });
});