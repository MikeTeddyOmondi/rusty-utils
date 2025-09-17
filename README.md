# Rusty Utils

[![npm version](https://badge.fury.io/js/@locci%2Frusty-utils.svg?icon=si%3Anpm)](https://badge.fury.io/js/@locci%2Frusty-utils)
[![Build Status](https://github.com/MikeTeddyOmondi/rusty-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/MikeTeddyOmondi/rusty-utils/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Rust-inspired error handling and functional programming utilities for TypeScript. Bring the power of Rust's `Result<T, E>` and `Option<T>` types to your TypeScript projects with full type safety and ergonomic APIs.

## 🚀 Features

- **Result Type**: Rust-style error handling without exceptions
- **Option Type**: Safe nullable value handling
- **Functional Utilities**: Pipe, compose, curry, and more
- **Full Type Safety**: Comprehensive TypeScript support
- **Zero Dependencies**: Lightweight and focused
- **Tree Shakeable**: Import only what you need
- **Extensive Testing**: 100% test coverage

## 📦 Installation

```bash
npm install @locci/rusty-utils
```

```bash
yarn add @locci/rusty-utils
```

```bash
pnpm add @locci/rusty-utils
```

## 🔧 Usage

### Result Type - Error Handling

Replace try-catch blocks and error-prone nullable returns with expressive, type-safe error handling:

```typescript
import { ok, err, isOk, map, andThen, match } from "@locci/rusty-utils";

// Define your domain errors
type ValidationError =
  | { type: "InvalidEmail"; email: string }
  | { type: "TooYoung"; age: number };

// Functions that can fail return Result<T, E>
const validateEmail = (email: string): Result<string, ValidationError> => {
  return email.includes("@") ? ok(email) : err({ type: "InvalidEmail", email });
};

const validateAge = (age: number): Result<number, ValidationError> => {
  return age >= 18 ? ok(age) : err({ type: "TooYoung", age });
};

// Chain operations safely
const createUser = (email: string, age: number) =>
  andThen(validateEmail(email), (validEmail) =>
    andThen(validateAge(age), (validAge) =>
      ok({ email: validEmail, age: validAge })
    )
  );

// Handle results with pattern matching
const handleResult = (result: Result<User, ValidationError>) =>
  match(result, {
    ok: (user) => `Created user: ${user.email}`,
    err: (error) => {
      switch (error.type) {
        case "InvalidEmail":
          return `Invalid email: ${error.email}`;
        case "TooYoung":
          return `Too young: ${error.age}`;
      }
    },
  });

// Usage
const result = createUser("john@example.com", 25);
console.log(handleResult(result)); // "Created user: john@example.com"
```

### Option Type - Nullable Safety

Handle nullable values without null/undefined errors:

```typescript
import { some, none, isSome, map, andThen, unwrapOr } from "@locci/rusty-utils";

interface User {
  id: string;
  name: string;
  email?: string;
}

const users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob" },
];

// Safe array access
const findUser = (id: string): Option<User> => {
  const user = users.find((u) => u.id === id);
  return user ? some(user) : none;
};

// Chain operations safely
const getUserEmail = (id: string): Option<string> =>
  andThen(findUser(id), (user) => (user.email ? some(user.email) : none));

// Transform values safely
const getEmailDomain = (id: string): Option<string> =>
  map(getUserEmail(id), (email) => email.split("@")[1]);

// Provide defaults
const displayEmail = (id: string): string =>
  unwrapOr(getUserEmail(id), "No email provided");

console.log(displayEmail("1")); // "alice@example.com"
console.log(displayEmail("2")); // "No email provided"
```

### Functional Programming Utilities

```typescript
import { pipe, compose, memoize, debounce, groupBy } from "@locci/rusty-utils";

// Data transformation pipelines
const processUsers = (users: User[]) =>
  pipe(
    users,
    (users) => users.filter((u) => u.age >= 18),
    (users) => users.map((u) => ({ ...u, isAdult: true })),
    (users) => groupBy(users, (u) => u.department)
  );

// Function composition
const addTax = (rate: number) => (price: number) => price * (1 + rate);
const formatCurrency = (amount: number) => `${amount.toFixed(2)}`;
const calculateTotal = compose(formatCurrency, addTax(0.1));

console.log(calculateTotal(100)); // "$110.00"

// Performance optimizations
const expensiveCalculation = memoize((x: number) => {
  // Some expensive operation
  return x * x * x;
});

const debouncedSave = debounce((data: any) => {
  // Save to database
}, 300);
```

## 📚 API Reference

### Result<T, E>

| Function                    | Description                |
| --------------------------- | -------------------------- |
| `ok(value)`                 | Create a successful Result |
| `err(error)`                | Create a failed Result     |
| `isOk(result)`              | Type guard for Ok results  |
| `isErr(result)`             | Type guard for Err results |
| `map(result, fn)`           | Transform Ok value         |
| `mapErr(result, fn)`        | Transform Err value        |
| `andThen(result, fn)`       | Chain Result operations    |
| `orElse(result, fn)`        | Handle Err cases           |
| `match(result, patterns)`   | Pattern matching           |
| `unwrapOr(result, default)` | Get value or default       |
| `tryCatch(fn)`              | Wrap throwing function     |

### Option<T>

| Function                    | Description                 |
| --------------------------- | --------------------------- |
| `some(value)`               | Create an Option with value |
| `none`                      | Represents no value         |
| `isSome(option)`            | Type guard for Some         |
| `isNone(option)`            | Type guard for None         |
| `fromNullable(value)`       | Create from nullable        |
| `map(option, fn)`           | Transform Some value        |
| `andThen(option, fn)`       | Chain Option operations     |
| `filter(option, predicate)` | Filter based on predicate   |
| `unwrapOr(option, default)` | Get value or default        |

### Functional Utilities

| Function                 | Description                        |
| ------------------------ | ---------------------------------- |
| `pipe(value, ...fns)`    | Left-to-right function composition |
| `compose(...fns)`        | Right-to-left function composition |
| `memoize(fn)`            | Cache function results             |
| `debounce(fn, delay)`    | Delay function execution           |
| `throttle(fn, interval)` | Limit function call rate           |
| `groupBy(array, keyFn)`  | Group array elements               |
| `chunk(array, size)`     | Split array into chunks            |
| `unique(array)`          | Remove duplicates                  |

## 🏗️ Integration Examples

### With Express.js

```typescript
import express from "express";
import { tryCatchAsync, match } from "@locci/rusty-utils";

app.get("/users/:id", async (req, res) => {
  const result = await tryCatchAsync(() => userService.findById(req.params.id));

  const response = match(result, {
    ok: (user) => res.json(user),
    err: (error) => res.status(404).json({ error: error.message }),
  });
});
```

### With NestJS

```typescript
import { Injectable } from "@nestjs/common";
import { Result, ok, err, andThen } from "@locci/rusty-utils";

@Injectable()
export class UserService {
  async createUser(
    data: CreateUserDto
  ): Promise<Result<User, ValidationError>> {
    return andThen(this.validateInput(data), (validData) =>
      andThen(this.checkEmailExists(validData.email), () =>
        this.saveUser(validData)
      )
    );
  }
}
```

### With React

```typescript
import React from "react";
import { Option, match } from "@locci/rusty-utils";

interface Props {
  user: Option<User>;
}

const UserProfile: React.FC<Props> = ({ user }) => {
  return match(user, {
    some: (u) => (
      <div>
        <h1>{u.name}</h1>
        <p>{u.email}</p>
      </div>
    ),
    none: () => <div>No user found</div>,
  });
};
```

## 🎯 Why Use This Library?

### Before (Traditional Error Handling)

```typescript
// Prone to runtime errors, unclear error types
async function getUser(id: string) {
  try {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.email) {
      throw new Error("User has no email");
    }

    return user.email.split("@")[1];
  } catch (error) {
    // What type of error is this?
    // Did findById throw? Was user null? Was email null?
    throw error;
  }
}
```

### After (With @locci/rusty-utils)

```typescript
// Type-safe, explicit error handling, composable
async function getUser(id: string): Promise<Result<string, UserError>> {
  return andThenAsync(
    tryCatchAsync(() => userRepository.findById(id)),
    (user) =>
      user
        ? andThen(fromNullable(user.email), (email) =>
            ok(email.split("@")[1])
          ) ?? err({ type: "NoEmail", userId: id })
        : err({ type: "NotFound", userId: id })
  );
}
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License. See [LICENSE](LICENSE.md) file for details.

## 🙏 Acknowledgments

Inspired by:

- [Rust's Result and Option types](https://doc.rust-lang.org/std/)
- [Functional programming concepts](https://en.wikipedia.org/wiki/Functional_programming)
- [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)

---

**Built with ❤️ for the Locci Cloud and the TypeScript community**
