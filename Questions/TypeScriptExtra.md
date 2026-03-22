# TypeScript — Full Coverage (All Topics + Tricky Questions)
### Deep Dive: Every Topic + Output Questions
### Format: Same as JavascriptExtra.md

---

## Topic 1 : TypeScript Internals (Deep Dive)

---

**21. What is the TypeScript Compiler (tsc)? What is tsconfig.json?**

Answer:
`tsc` is the **TypeScript Compiler** — it converts `.ts` / `.tsx` files into plain `.js` files that browsers can run. `tsconfig.json` is the **configuration file** that controls how the compiler behaves.

```bash
# Install TypeScript globally
npm install -g typescript

# Compile single file
tsc app.ts               # creates app.js

# Watch mode — auto-recompiles on save
tsc app.ts --watch

# Initialize project config
tsc --init               # creates tsconfig.json
```

```json
// tsconfig.json — key options explained
{
  "compilerOptions": {
    "target": "ES6",           // which JS version to compile TO (ES5, ES6, ESNext)
    "module": "CommonJS",      // module system (CommonJS=Node, ESNext=Vite/React)
    "strict": true,            // enables ALL strict checks — ALWAYS use this
    "outDir": "./dist",        // compiled JS files destination folder
    "rootDir": "./src",        // source TypeScript files folder
    "jsx": "react-jsx",        // required for React .tsx files
    "esModuleInterop": true,   // allows: import React from 'react' (not just * as)
    "noImplicitAny": true,     // error if TypeScript infers 'any' type
    "strictNullChecks": true   // null/undefined are NOT assignable to other types
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

Note:
- Key Point: `"strict": true` is the most important option — it enables all safety checks including `noImplicitAny` and `strictNullChecks`. Always use it. Without strict mode, TypeScript is much less useful.
- Why Interviewer Asks: Practical question. They want to know if you've actually set up a TypeScript project. Knowing `strict: true` is essential shows maturity.

---

**22. What is the difference between `.ts` and `.tsx` files?**

Answer:
`.ts` is for regular TypeScript files (logic, utilities, types). `.tsx` is for TypeScript files that contain **JSX** (React component files). Without `.tsx`, TypeScript doesn't know how to parse JSX syntax.

```tsx
// ✅ app.ts — regular TypeScript (no JSX)
interface User { id: number; name: string }
function formatUser(user: User): string {
    return `${user.id}: ${user.name}`;
}

// ✅ Button.tsx — TypeScript + JSX (React component)
interface ButtonProps { label: string; onClick: () => void }
function Button({ label, onClick }: ButtonProps) {
    return <button onClick={onClick}>{label}</button>;   // JSX — needs .tsx
}

// In tsconfig.json, "jsx": "react-jsx" enables .tsx support
```

Note:
- Key Point: Use `.ts` for utilities, hooks, store, types. Use `.tsx` for any file that returns JSX (React components). The `<T>` generic syntax inside `.tsx` can sometimes conflict with JSX — TypeScript handles this, but it's why you need separate extensions.
- Why Interviewer Asks: Basic but important. Shows you've actually worked with TypeScript in a React project.

---

## Topic 2 : Arrays, Tuples & Objects (Deep Dive)

---

**23. What is the difference between Array and Tuple in TypeScript?**

Answer:

```typescript
// ARRAY — same type, any length
let scores: number[] = [85, 90, 78, 95];
scores.push(100);   // ✅
scores[10] = 60;    // ✅ — can grow

// TUPLE — fixed positions, each position has a specific type
let person: [string, number, boolean] = ["Dev", 23, true];
person[0] = "Jigo";   // ✅ string in position 0
person[0] = 100;      // ❌ Error: position 0 must be string
person[3] = "extra";  // ❌ Error: tuple has no position 3

// Named tuples (TS 4.0+) — more readable
let employee: [name: string, age: number, active: boolean] = ["Dev", 23, true];

// Real world tuple — useState return type!
// const [count, setCount] = useState(0)
// returns → [number, React.Dispatch<SetStateAction<number>>]
// That return is a TUPLE — why you can destructure it!

// Readonly tuple — cannot be changed
const point: readonly [number, number] = [23.5, 72.3];
point[0] = 10;   // ❌ Error: read-only
```

Note:
- Key Point: Array = same type, flexible length. Tuple = mixed types, fixed length. Key real-world example: `useState` returns a tuple — that's why `const [state, setState] = useState()` works with destructuring.
- Why Interviewer Asks: Tests deeper understanding. Mentioning useState's return type as a tuple is a strong answer that connects theory to practice.

---

## Topic 3 : Functions (Deep Dive)

---

**24. What is Function Overloading in TypeScript?**

Answer:
Function overloading lets you define **multiple type signatures** for the same function. You write multiple signatures (declarations), then ONE implementation that handles all cases.

```typescript
// Multiple overload signatures
function format(value: string): string;   // signature 1
function format(value: number): string;   // signature 2
function format(value: Date): string;     // signature 3

// Single implementation — must cover ALL signatures
function format(value: string | number | Date): string {
    if (typeof value === "string") return value.trim().toUpperCase();
    if (typeof value === "number") return value.toFixed(2);
    return value.toISOString();
}

format("  hello  ");    // ✅ "HELLO"
format(3.14159);        // ✅ "3.14"
format(new Date());     // ✅ "2024-01-01T00:00:00.000Z"
format(true);           // ❌ Error: boolean doesn't match any overload

// Difference from union parameters:
// Union: callers see ONE signature with string | number | Date (confusing)
// Overload: callers see THREE separate clear signatures
```

Note:
- Key Point: Overloading = multiple input signatures, one implementation. The implementation signature is NOT directly callable — only the overload signatures are. Used when a function behaves differently based on argument type.
- Why Interviewer Asks: Tests advanced function knowledge. Shows you understand TypeScript's type system deeply beyond basic annotations.

---

## Topic 4 : Generics (Deep Dive)

---

**25. What is the `keyof` operator? How does it work with generics?**

Answer:
`keyof` gets all the **keys of a type as a union** of string literals.

```typescript
interface User { id: number; name: string; age: number; email: string }

// keyof User = "id" | "name" | "age" | "email"
type UserKeys = keyof User;

// PRACTICAL USE — type-safe property access
// Without keyof — 'key' is just string, no safety
function getProp(obj: object, key: string): unknown {
    return (obj as any)[key];   // unsafe!
}

// With keyof — key MUST be an actual property of T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];   // TypeScript knows: return type matches the key!
}

const user: User = { id: 1, name: "Dev", age: 23, email: "dev@test.com" };
const name  = getProperty(user, "name");    // ✅ returns string
const age   = getProperty(user, "age");     // ✅ returns number
const sal   = getProperty(user, "salary");  // ❌ Error: "salary" not in User
```

Note:
- Key Point: `keyof T` = union of all keys of T. `K extends keyof T` in a generic means K must be a real key of T. `T[K]` = the type of property K in T (indexed access type). Together they enable fully type-safe property access.
- Why Interviewer Asks: Advanced TypeScript concept. Shows you understand how TypeScript models object keys as types.

---

**26. What are Mapped Types?**

Answer:
Mapped types **transform every property of an existing type** programmatically using `[K in keyof T]` syntax.

```typescript
interface User { id: number; name: string; age: number }

// Making ALL properties optional manually — tedious:
// { id?: number; name?: string; age?: number }

// Mapped type — transform all properties at once
type Optional<T> = {
    [K in keyof T]?: T[K];   // for every key K in T, make it optional
};
type OptionalUser = Optional<User>;
// { id?: number; name?: string; age?: number } — same as Partial<T>!

// Make all properties nullable
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};
type NullableUser = Nullable<User>;
// { id: number | null; name: string | null; age: number | null }

// Make all properties readonly
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};
// This is exactly how TypeScript's built-in Readonly<T> works internally!

// Remove readonly (using - modifier)
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

// Remove optional (using -)
type AllRequired<T> = {
    [K in keyof T]-?: T[K];
};
// This is exactly how Required<T> works internally!
```

Note:
- Key Point: Mapped types iterate over all keys using `[K in keyof T]`. Add `?` to make optional, `readonly` to make immutable. The `-` modifier removes the modifier (like `-?` removes optional, `-readonly` removes readonly). This is how all built-in utility types like `Partial`, `Required`, `Readonly` are built.
- Why Interviewer Asks: Shows you understand TypeScript's advanced type system. Knowing that `Partial<T>` is built using mapped types shows you understand the language deeply.

---

**27. What are Conditional Types?**

Answer:
Conditional types are types that **act like ternary operators** — choosing between two types based on a condition.

```typescript
// Syntax: T extends Condition ? TrueType : FalseType
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;   // "yes"
type B = IsString<number>;   // "no"
type C = IsString<"hello">;  // "yes" — "hello" extends string

// Practical — how NonNullable is built
type MyNonNullable<T> = T extends null | undefined ? never : T;

type Result = MyNonNullable<string | null | undefined>;   // string
// string extends null | undefined? No → string (kept)
// null extends null | undefined? Yes → never (removed)
// undefined extends null | undefined? Yes → never (removed)
// Union becomes: string | never | never = string

// infer keyword — extract type from condition
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function greet(): string { return "Hello"; }
function add(): number { return 5; }

type GreetReturn = GetReturnType<typeof greet>;  // string
type AddReturn   = GetReturnType<typeof add>;    // number
// This is exactly how ReturnType<T> is built!
```

Note:
- Key Point: Conditional types = ternary for types. `T extends X ? A : B`. The `infer` keyword extracts types from within a conditional — used to build `ReturnType<T>`. Distributive behavior: conditional types distribute over union members automatically.
- Why Interviewer Asks: Advanced TypeScript topic. Interviewers use this to gauge if you understand TypeScript at a deep level beyond basic usage.

---

## Topic 5 : Type Assertions & Narrowing (Tricky Output Questions)

---

**28. What is the output? (Type narrowing with null)**

```typescript
function getLength(value: string | null): number {
    if (value == null) {
        return 0;
    }
    return value.length;
}

console.log(getLength("Dev"));   // ?
console.log(getLength(null));    // ?
console.log(getLength(undefined)); // ?
```

Answer:
```
3
0
0
```

**Explanation:**
`value == null` (loose equality) checks for BOTH `null` AND `undefined`. So `undefined` also hits the first branch and returns 0. TypeScript also recognizes `== null` as a type guard that narrows out both null and undefined — inside the `else` branch, TypeScript knows `value` is `string`.

Note:
- Key Point: `== null` is the one case where loose equality is preferred in TypeScript — it narrows out BOTH null AND undefined in one check. TypeScript's control flow analysis recognizes this as a valid type guard.
- Why Interviewer Asks: Tests understanding of null narrowing. The `undefined` case surprising developers is a classic gotcha.

---

**29. What is the output? (Generic type inference)**

```typescript
function identity<T>(value: T): T {
    return value;
}

const a = identity(42);
const b = identity("hello");
const c = identity<boolean>(true);

console.log(typeof a);  // ?
console.log(typeof b);  // ?
console.log(typeof c);  // ?
```

Answer:
```
"number"
"string"
"boolean"
```

**Explanation:**
TypeScript infers the generic type `T` from the argument. When you pass `42`, T becomes `number`. When you pass `"hello"`, T becomes `string`. `c` explicitly specifies `T = boolean`. The `typeof` at runtime matches the inferred types perfectly.

Note:
- Key Point: TypeScript generic type inference works at compile time. At runtime, the types are gone (TypeScript compiles to plain JS). `typeof` here is the JavaScript `typeof`, not TypeScript's type system.
- Why Interviewer Asks: Tests if you understand the difference between compile-time TypeScript types and runtime JavaScript values.

---

**30. What is the output? (Readonly and mutation)**

```typescript
interface Config {
    host: string;
    port: number;
}

const config: Readonly<Config> = {
    host: "localhost",
    port: 3000
};

config.port = 8080;
console.log(config.port);
```

Answer:
```
TypeScript ERROR: Cannot assign to 'port' because it is a read-only property.
(Compile error — code doesn't run)
```

**Explanation:**
`Readonly<Config>` marks all properties as readonly. Trying to reassign causes a **compile-time error**. The code never runs — TypeScript stops compilation. Note: `Readonly` is shallow — nested objects inside can still be mutated (only first-level properties are protected).

Note:
- Key Point: `Readonly<T>` is a COMPILE TIME check only — it gets removed in compiled JS. It is shallow — only top-level properties are protected. For deep readonly, you need recursive types or libraries like `immer`.
- Why Interviewer Asks: Tests understanding of TypeScript's type system being compile-time only, and the shallow nature of Readonly.

---

**31. What is the output? (Union narrowing exhaustiveness)**

```typescript
type Shape = "circle" | "square" | "triangle";

function describeShape(shape: Shape): string {
    if (shape === "circle") return "Round";
    if (shape === "square") return "4 sides";
    // triangle case missing!

    const _check: never = shape;  // what happens here?
    return _check;
}
```

Answer:
```
TypeScript ERROR at `const _check: never = shape`
Type 'string' is not assignable to type 'never'
(This is intentional — it catches missing cases at compile time!)
```

**Explanation:**
The `never` type check is an **exhaustiveness check pattern**. After handling "circle" and "square", TypeScript knows only "triangle" is left. Assigning it to `never` should be fine if ALL cases are handled. Since "triangle" is missing, `shape` is still `"triangle"` at that point — which is NOT `never` — so TypeScript shows a compile error. This forces you to handle all union cases.

Note:
- Key Point: Assigning to `never` is an exhaustiveness check pattern — it ensures ALL union members are handled. If you add a new case to the `Shape` type later, this check immediately shows a compile error reminding you to handle the new case. Very useful in switch statements.
- Why Interviewer Asks: Advanced pattern. Shows you understand `never` type and how to write bulletproof type-safe code that scales as types grow.

---

## Topic 6 : TypeScript with React (Deep Dive)

---

**32. How do you type Redux Toolkit with TypeScript?**

Answer:

```typescript
// store.ts — export RootState and AppDispatch types
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

const store = configureStore({
    reducer: { counter: counterReducer }
});

// These types are used throughout the app
export type RootState   = ReturnType<typeof store.getState>;
// RootState = { counter: { value: number } }

export type AppDispatch = typeof store.dispatch;
export default store;

// -------------------------------------------------------

// counterSlice.ts — PayloadAction types actions
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState { value: number; name: string }

const counterSlice = createSlice({
    name: "counter",
    initialState: { value: 0, name: "Dev" } as CounterState,
    reducers: {
        increment: (state) => { state.value += 1; },

        // PayloadAction<number> — tells TS that action.payload is number
        incrementBy: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },

        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        }
    }
});
export const { increment, incrementBy, setName } = counterSlice.actions;
export default counterSlice.reducer;

// -------------------------------------------------------

// hooks.ts — create typed versions of useSelector and useDispatch
// Do this ONCE and import these everywhere instead of bare useSelector/useDispatch
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
    useSelector(selector);

// -------------------------------------------------------

// Counter.tsx — using typed hooks
import { useAppDispatch, useAppSelector } from "./hooks";
import { increment, incrementBy } from "./counterSlice";

function Counter() {
    const count = useAppSelector(state => state.counter.value);  // number ✅
    const name  = useAppSelector(state => state.counter.name);   // string ✅
    const dispatch = useAppDispatch();

    return (
        <div>
            <h2>{name}: {count}</h2>
            <button onClick={() => dispatch(increment())}>+1</button>
            <button onClick={() => dispatch(incrementBy(10))}>+10</button>
            <button onClick={() => dispatch(incrementBy("hello"))}>
                {/* ❌ Error: string not assignable to number */}
            </button>
        </div>
    );
}
```

Note:
- Key Point: Three key patterns — (1) `RootState = ReturnType<typeof store.getState>`, (2) `PayloadAction<T>` for typed action payloads, (3) create typed `useAppSelector` and `useAppDispatch` hooks once and use them everywhere. This is the official Redux Toolkit + TypeScript pattern.
- Why Interviewer Asks: The most practical TypeScript + React question for MERN roles. If you can set up RTK with full TypeScript, you're ready for production.

---

**33. How do you type a Custom Hook in TypeScript?**

Answer:

```typescript
// useFetch — generic custom hook, fully typed
import { useState, useEffect } from "react";

// Return type interface — clear contract for hook consumers
interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
    const [data,    setData]    = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error,   setError]   = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json: T = await res.json();
            setData(json);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [url]);

    return { data, loading, error, refetch: fetchData };
}

// Usage — fully typed
interface Product { id: number; name: string; price: number }

function ProductList() {
    const { data: products, loading, error } = useFetch<Product[]>("/api/products");

    if (loading) return <p>Loading...</p>;
    if (error)   return <p>Error: {error}</p>;

    return (
        <ul>
            {products?.map(p => (
                <li key={p.id}>{p.name} — ₹{p.price}</li>
                // TypeScript knows: p.name is string, p.price is number ✅
            ))}
        </ul>
    );
}
```

Note:
- Key Point: Custom hooks need to type both their parameters and return values. Generic hooks like `useFetch<T>` are the most common pattern. Define a return type interface for complex returns — makes the hook self-documenting and easier to use.
- Why Interviewer Asks: Combines custom hooks (React) + generics (TypeScript) — tests both skills at once. A very common interview coding task.

---

## Topic 7 : Advanced TypeScript (Template Literals + Decorators)

---

**34. What are Template Literal Types?**

Answer:

```typescript
// Combine string literals like JS template literals
type EventName = "click" | "focus" | "blur";

// Creates: "onClick" | "onFocus" | "onBlur"
type Handler = `on${Capitalize<EventName>}`;

type CSSUnit  = "px" | "em" | "rem" | "%";
type CSSValue = `${number}${CSSUnit}`;
// Allows: "16px", "1.5em", "100%", "2rem"

function setSize(size: CSSValue): void {
    document.body.style.fontSize = size;
}
setSize("16px");     // ✅
setSize("1.5rem");   // ✅
setSize("16");       // ❌ Error: no unit
setSize("big");      // ❌ Error: not a valid CSS value

// Type-safe API route builder
type ApiRoute = `/api/${string}`;
function fetchApi(route: ApiRoute): Promise<unknown> {
    return fetch(route).then(r => r.json());
}
fetchApi("/api/users");    // ✅
fetchApi("/users");        // ❌ Error: must start with /api/
```

Note:
- Key Point: Template literal types combine string literal types at the TYPE level — not at runtime. They enable very precise string pattern types like `CSSValue` or route patterns. Used in advanced library typings.
- Why Interviewer Asks: Tests advanced TypeScript knowledge. If you know template literal types, you show TypeScript mastery beyond basic usage.

---

**35. What are Decorators? Where are they used?**

Answer:
Decorators are **special syntax that adds behavior to classes, methods, or properties** using the `@` symbol. They are heavily used in frameworks like Angular and NestJS.

```typescript
// tsconfig.json needs: "experimentalDecorators": true (for legacy)

// ===== Method Decorator — runs logic before/after a method =====
function log(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${key} with`, args);
        const result = original.apply(this, args);
        console.log(`${key} returned:`, result);
        return result;
    };
    return descriptor;
}

class Calculator {
    @log
    add(a: number, b: number): number {
        return a + b;
    }
}

const calc = new Calculator();
calc.add(3, 5);
// Logs: "Calling add with [3, 5]"
// Logs: "add returned: 8"

// ===== Class Decorator =====
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class Person { constructor(public name: string) {} }

// ===== Real-world: NestJS uses decorators heavily =====
// @Controller("/users")
// @Get("/:id")
// @Injectable()
// @Body(), @Param(), @Query()
```

Note:
- Key Point: Decorators use `@functionName` syntax. They modify class/method behavior without changing the source. For React + TypeScript — decorators are rarely used. For NestJS (Node.js backend) — decorators are everywhere. Know the concept, but focus on NestJS usage for MERN backend context.
- Why Interviewer Asks: If interviewer asks about decorators, they might be testing NestJS knowledge or Angular background. For pure React roles, this is rarely asked — but knowing it shows TypeScript breadth.

---

## Summary Table — All TypeScript Questions by Topic

| Topic | Questions | Count |
|-------|-----------|:-----:|
| TypeScript Basics (What is TS, JS vs TS, types) | 1–2 | 2 |
| Basic Types (string, number, any, unknown, void, never) | 3–4 | 2 |
| Arrays, Tuples, Objects | 5, 23 | 2 |
| Union, Intersection, Literal Types | 6, 7 | 2 |
| type vs interface | 8 | 1 |
| Functions (typed, optional, default, overloading) | 9, 24 | 2 |
| Enums (numeric, string, const, vs union) | 10 | 1 |
| Generics (functions, interfaces, constraints, keyof) | 11, 25 | 2 |
| Type Narrowing & Type Guards (typeof, instanceof, in, custom, discriminated) | 12, 27–28 | 3 |
| Classes (access modifiers, shorthand, abstract, implements) | 13 | 1 |
| Utility Types (Partial, Required, Readonly, Pick, Omit, Record, NonNullable, ReturnType) | 14 | 1 |
| TypeScript + React (props, useState, useRef, events, custom hooks) | 15, 33 | 2 |
| TypeScript + Redux Toolkit | 16, 32 | 2 |
| tsconfig + compiler | 21 | 1 |
| .ts vs .tsx | 22 | 1 |
| Mapped Types | 26 | 1 |
| Conditional Types + infer | 27 | 1 |
| Template Literal Types | 34 | 1 |
| Decorators | 35 | 1 |
| Tricky Output Questions | 28–31 | 4 |
| **Total** | | **33** |