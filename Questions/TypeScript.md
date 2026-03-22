# TypeScript — Focused Interview Questions
### Must-Ask Questions Every Interviewer Asks (Entry Level MERN)
### Format: Same as JavaScript.md

---

> **📊 Internet Analysis — What Interviewers Actually Ask**
> Sources: GeeksforGeeks, InterviewBit, Edureka, Hirist, CoderPad, GitHub interview repos, Hackr.io
>
> **Most Asked TypeScript Topics (in frequency order):**
> 1. What is TypeScript, why use it, JS vs TS (100%)
> 2. Basic types — string, number, boolean, any, unknown (100%)
> 3. type vs interface — differences (95%)
> 4. Generics — what, why, how (90%)
> 5. Union & Intersection types (85%)
> 6. Utility Types — Partial, Omit, Pick, Record (80%)
> 7. Type Narrowing / Type Guards (75%)
> 8. Enums vs union types (70%)
> 9. Access modifiers in classes (65%)
> 10. TypeScript with React — typed props, events, hooks (60%)
>
> **Sequence:** Basics → Types → Functions → Generics → Advanced → React+TS

---

## Topic 1 : TypeScript Basics

---

**1. What is TypeScript? How is it different from JavaScript?**

Answer:
TypeScript is a **superset of JavaScript** developed by Microsoft. "Superset" means every valid JavaScript file is also valid TypeScript, but TypeScript adds **static typing** on top. You define what type a variable holds and TypeScript catches type errors at **compile time** (while writing code), not at runtime (while running).

```typescript
// JavaScript — error discovered only at RUNTIME
function add(a, b) {
    return a + b;
}
add(5, "10");  // returns "510" — wrong behavior, no warning shown!

// TypeScript — error caught IMMEDIATELY in editor
function add(a: number, b: number): number {
    return a + b;
}
add(5, "10");  // ❌ Compile Error: Argument of type 'string' not assignable to 'number'
add(5, 10);    // ✅ returns 15
```

| Feature | JavaScript | TypeScript |
|---------|------------|------------|
| Typing | Dynamic (runtime) | Static (compile time) |
| Error detection | When code runs | While writing |
| File extension | `.js` | `.ts` / `.tsx` (React) |
| Browser support | Direct | Must compile to JS first |
| Learning curve | Easy | Moderate |

Note:
- Key Point: TypeScript = JavaScript + Static Types. Browser cannot run TS directly — it is compiled to JS by `tsc`. The biggest benefit is **catching bugs before running the code**.
- Why Interviewer Asks: First question in every TS interview. They want to hear "compile time error detection" and "superset of JavaScript". These two phrases show you understand the core purpose.

---

**2. What are the basic types in TypeScript?**

Answer:
TypeScript adds type annotations using `: typeName` syntax. It also has **type inference** — automatically figuring out the type from the assigned value.

```typescript
// ===== PRIMITIVE TYPES =====
let name: string = "Dev";
let age: number = 23;            // covers int AND float — no separate types
let isActive: boolean = true;
let nothing: null = null;
let notSet: undefined = undefined;

// ===== TYPE INFERENCE — TypeScript figures out the type automatically =====
let city = "Ahmedabad";    // inferred as string — no annotation needed
let score = 100;           // inferred as number
city = 456;                // ❌ Error: Type 'number' not assignable to type 'string'

// ===== SPECIAL TYPES =====
// any — disables type checking completely (AVOID in real code)
let data: any = "hello";
data = 123;          // ✅ no error — dangerous!
data.anything();     // ✅ no error — TypeScript trusts you blindly

// unknown — safe version of any (MUST check type before using)
let input: unknown = "hello";
input.toUpperCase();  // ❌ Error: Object is of type 'unknown'
if (typeof input === "string") {
    input.toUpperCase();  // ✅ Safe after type check
}

// void — function returns nothing
function logMessage(msg: string): void {
    console.log(msg);   // no return value
}

// never — function NEVER returns (always throws or infinite loop)
function throwError(msg: string): never {
    throw new Error(msg);   // always throws — execution never continues
}
```

Note:
- Key Point: `any` = unsafe, disables TypeScript. `unknown` = safe alternative, forces type check before use. Always prefer `unknown` over `any`. Type inference means you don't always need to write type annotations — TypeScript is smart enough.
- Why Interviewer Asks: Tests foundation knowledge. They will ask: "What is the difference between `any` and `unknown`?" — This is the most important distinction here. `any` bypasses checks, `unknown` enforces checks.

---

**3. What is the difference between `type` and `interface`?**

Answer:
Both `type` and `interface` describe the **shape of an object** in TypeScript. They look similar but have key differences.

```typescript
// ===== INTERFACE — for object shapes and class contracts =====
interface User {
    id: number;
    name: string;
    email?: string;   // optional property with ?
}

// Extending interface
interface Admin extends User {
    permissions: string[];
}

// ===== TYPE ALIAS — for any type including unions, tuples, primitives =====
type ID = string | number;           // ✅ union — only type can do this
type Status = "active" | "inactive"; // ✅ literal union

type User = {
    id: number;
    name: string;
};

// Extending type — use intersection (&)
type Admin = User & { permissions: string[] };
```

**Key Differences:**
```typescript
// 1. UNION TYPES — only 'type' can define unions
type ID = string | number;        // ✅ works
interface ID = string | number;   // ❌ doesn't work

// 2. DECLARATION MERGING — only 'interface' can merge
interface Window { title: string }
interface Window { theme: string }
// Window now has BOTH title AND theme — they merged!
// type cannot do this — redeclaring type causes error

// 3. TUPLES — type is cleaner
type Point = [number, number];    // ✅ clean
// interface for tuple is awkward and not recommended

// 4. PRIMITIVES — only type can alias primitives
type Name = string;   // ✅
// interface Name = string — ❌ invalid
```

| Feature | `interface` | `type` |
|---------|-------------|--------|
| Object shapes | ✅ | ✅ |
| Union types | ❌ | ✅ |
| Tuples | ❌ | ✅ |
| Declaration merging | ✅ | ❌ |
| Class implements | ✅ | ✅ |
| Extending | `extends` | `&` intersection |

Note:
- Key Point: Use `interface` for objects and class contracts. Use `type` for unions, tuples, and primitives. When in doubt with objects, `interface` is preferred by TypeScript docs. The biggest unique feature of `interface` is **declaration merging** — useful for extending library types.
- Why Interviewer Asks: One of the top 3 most asked TypeScript questions. Always give the table, then mention declaration merging as the unique interface feature, and unions as the unique type feature.

---

**4. What are Union and Intersection types?**

Answer:

```typescript
// ===== UNION TYPE — value can be ONE of these types (OR) =====
let id: string | number = "ABC123";
id = 101;     // ✅ both string and number are allowed

function formatId(id: string | number): string {
    // TypeScript forces you to handle both cases (type narrowing)
    if (typeof id === "string") {
        return id.toUpperCase();   // TypeScript knows: string here
    }
    return id.toFixed(0);          // TypeScript knows: number here
}

// Union with null — very common pattern
let username: string | null = null;
username = "Dev";   // ✅

// ===== INTERSECTION TYPE — combines ALL types together (AND) =====
type Person   = { name: string; age: number };
type Employee = { company: string; role: string };

// IntersectionType = ALL properties from ALL types REQUIRED
type Staff = Person & Employee;

const staff: Staff = {
    name: "Dev",       // from Person
    age: 23,           // from Person
    company: "TCS",    // from Employee
    role: "Dev"        // from Employee
    // ALL four required — it is Person AND Employee
};
```

Note:
- Key Point: Union (`|`) = OR — value matches one of the types. Intersection (`&`) = AND — value must satisfy ALL types. Union is used more often (nullable types, multiple input types). Intersection is used to combine object shapes.
- Why Interviewer Asks: Tests understanding of how TypeScript composes types. Very commonly asked alongside `type vs interface`. They may give you a scenario and ask which to use.

---

**5. What are Generics? Why are they used?**

Answer:
Generics allow you to write **reusable code that works with multiple types** while still maintaining type safety. Think of `<T>` as a **type variable** — a placeholder that gets filled in when the function/class is used.

```typescript
// ===== PROBLEM without generics — duplicate code for each type =====
function getFirstString(arr: string[]): string { return arr[0]; }
function getFirstNumber(arr: number[]): number { return arr[0]; }
// Duplicated just for different types — not scalable!

// ===== SOLUTION with generics — one function for all types =====
function getFirst<T>(arr: T[]): T {
    return arr[0];
}
// TypeScript infers T from what you pass
getFirst(["Dev", "Jigo"]);    // T = string → returns string
getFirst([1, 2, 3]);          // T = number → returns number
getFirst([true, false]);       // T = boolean → returns boolean

// ===== GENERIC INTERFACE — very common for API responses =====
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

const userRes: ApiResponse<{ name: string; age: number }> = {
    data: { name: "Dev", age: 23 },
    status: 200,
    message: "OK"
};

const listRes: ApiResponse<string[]> = {
    data: ["Dev", "Jigo"],
    status: 200,
    message: "OK"
};

// ===== GENERIC CONSTRAINTS — limit what T can be =====
// T extends { length: number } means T MUST have length property
function getLength<T extends { length: number }>(item: T): number {
    return item.length;
}
getLength("Dev");        // ✅ string has length
getLength([1, 2, 3]);    // ✅ array has length
getLength(123);          // ❌ Error: number has no length

// ===== GENERIC fetch function — used constantly in React =====
async function fetchData<T>(url: string): Promise<T> {
    const res = await fetch(url);
    return res.json() as T;
}

interface User { id: number; name: string }
const user = await fetchData<User>("/api/user/1");
user.name;   // ✅ TypeScript knows this is string
user.xyz;    // ❌ Error: 'xyz' does not exist on User
```

Note:
- Key Point: Generics = type variables. `<T>` is a placeholder replaced when you call the function. They enable reusable, type-safe code. Most common uses: generic functions, `ApiResponse<T>` interface, `fetchData<T>()` pattern.
- Why Interviewer Asks: Always asked. Generics are what separate intermediate from beginner TS developers. Know the `fetchData<T>` and `ApiResponse<T>` patterns by heart — they are used in every React project.

---

**6. What are Utility Types? Explain the most important ones.**

Answer:
Utility types are **built-in TypeScript generic types** that transform existing types into new ones. They are used constantly in real projects.

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    age: number;
}

// ===== Partial<T> — makes ALL properties optional =====
// Use case: update/patch functions where you send only changed fields
function updateUser(id: number, changes: Partial<User>): void {
    // changes can have ANY subset of User properties
}
updateUser(1, { name: "New Name" });            // ✅ only name
updateUser(1, { email: "e@mail.com", age: 25 }); // ✅ partial update

// ===== Required<T> — makes ALL properties required (opposite of Partial) =====
type StrictUser = Required<User>;   // every field is now mandatory

// ===== Readonly<T> — prevents modification after creation =====
const frozenUser: Readonly<User> = { id: 1, name: "Dev", email: "d@e.com", password: "1234", age: 23 };
frozenUser.name = "Other";  // ❌ Error: Cannot assign to 'name' — read-only

// ===== Pick<T, Keys> — keep ONLY selected properties =====
// Use case: public profile from full user (no password)
type PublicProfile = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string }

// ===== Omit<T, Keys> — remove specific properties (opposite of Pick) =====
type SafeUser = Omit<User, "password">;
// { id: number; name: string; email: string; age: number } — password removed

// ===== Record<Keys, Value> — dictionary / lookup table =====
type Role = "admin" | "user" | "guest";
const permissions: Record<Role, string[]> = {
    admin: ["read", "write", "delete"],
    user:  ["read", "write"],
    guest: ["read"]
};

// ===== NonNullable<T> — removes null and undefined =====
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;   // string

// ===== ReturnType<T> — get return type of a function =====
function getUser() { return { id: 1, name: "Dev" }; }
type UserType = ReturnType<typeof getUser>;
// { id: number; name: string }
```

Note:
- Key Point: Know these 6 by heart — `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`. These appear in almost every production TypeScript project. `Partial` is the most commonly used (for update functions). `Omit` is used to hide sensitive fields like password.
- Why Interviewer Asks: Very practical question. They'll ask: "How would you create a type for updating a user where all fields are optional?" — answer is `Partial<User>`. Or "How do you exclude password from a User type?" — answer is `Omit<User, "password">`.

---

**7. What is Type Narrowing? What are Type Guards?**

Answer:
**Type Narrowing** is when TypeScript reduces a broad type to a more specific type inside a conditional block. **Type Guards** are the checks that trigger this narrowing.

```typescript
// ===== typeof guard — for primitives =====
function process(input: string | number): string {
    if (typeof input === "string") {
        return input.toUpperCase();  // TS knows: string
    }
    return input.toFixed(2);         // TS knows: number
}

// ===== instanceof guard — for class instances =====
class Dog { bark() { return "Woof!"; } }
class Cat { meow() { return "Meow!"; } }

function makeSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        return animal.bark();   // TS knows: Dog
    }
    return animal.meow();       // TS knows: Cat
}

// ===== 'in' operator — check if property exists =====
interface Bird { fly(): void }
interface Fish { swim(): void }

function move(animal: Bird | Fish) {
    if ("fly" in animal) {
        animal.fly();    // TS knows: Bird
    } else {
        animal.swim();   // TS knows: Fish
    }
}

// ===== Custom Type Guard — using 'is' keyword =====
interface Admin { role: "admin"; permissions: string[] }
interface RegularUser { role: "user" }

// Return type "user is Admin" is the type guard signature
function isAdmin(user: Admin | RegularUser): user is Admin {
    return user.role === "admin";
}

function handleUser(user: Admin | RegularUser) {
    if (isAdmin(user)) {
        console.log(user.permissions);  // ✅ TS knows: Admin
    }
}

// ===== Discriminated Union — most powerful narrowing pattern =====
type Circle    = { shape: "circle";    radius: number };
type Rectangle = { shape: "rectangle"; width: number; height: number };
type Shape = Circle | Rectangle;

function getArea(s: Shape): number {
    switch (s.shape) {
        case "circle":    return Math.PI * s.radius ** 2;
        case "rectangle": return s.width * s.height;
    }
}
```

Note:
- Key Point: Four type guards — `typeof` (primitives), `instanceof` (classes), `in` (property check), custom `is` guard. Discriminated unions are the most powerful pattern — add a common literal property (`shape`, `type`, `kind`) to narrow safely in a switch statement.
- Why Interviewer Asks: Tests real TypeScript usage knowledge. Custom type guards and discriminated unions show advanced understanding. They may ask: "How do you handle a value that could be a string or number?" — show the `typeof` narrowing.

---

**8. What are Enums? When do you use Enum vs Union Type?**

Answer:
Enums are **named constant groups**. TypeScript has numeric and string enums.

```typescript
// ===== STRING ENUM — most used in real projects =====
enum Role {
    Admin  = "ADMIN",
    User   = "USER",
    Guest  = "GUEST"
}

let userRole: Role = Role.Admin;
console.log(userRole);   // "ADMIN"

function checkAccess(role: Role): boolean {
    return role === Role.Admin;
}

// ===== NUMERIC ENUM — auto-assigned 0, 1, 2... =====
enum Direction {
    North,  // 0
    South,  // 1
    East,   // 2
    West    // 3
}
console.log(Direction.North);      // 0
console.log(Direction[0]);         // "North" — reverse lookup!

// ===== const enum — compile-time optimization =====
// Completely inlined at compile time, no runtime object
const enum Color { Red = "RED", Blue = "BLUE" }
let c: Color = Color.Red;   // compiled to: let c = "RED"

// ===== ENUM vs UNION TYPE =====
// Enum approach
enum ThemeEnum { Light = "light", Dark = "dark" }

// Union type approach — simpler, more common in modern TypeScript
type Theme = "light" | "dark";

// When to use ENUM:
// - Numeric constants with meaningful names
// - Need reverse lookup (Direction[0] → "North")
// - Working with external systems/APIs with fixed numeric values

// When to use UNION TYPE:
// - Simple string constants (most cases)
// - Less runtime overhead (no generated JS object)
// - More concise and readable
```

Note:
- Key Point: String enums are preferred over numeric when values matter (readable). In modern TypeScript (2024), **union literal types are often preferred over enums** for simple string constants — less code, no runtime overhead. Use enums when you need numeric constants or reverse lookup.
- Why Interviewer Asks: Tests if you know modern TypeScript patterns. Saying "I prefer union types for simple string constants" shows you know current best practices.

---

**9. What are Access Modifiers in TypeScript Classes?**

Answer:
Access modifiers control **who can access** class properties and methods.

```typescript
class BankAccount {
    public  accountId: string;     // accessible EVERYWHERE (default)
    private balance: number;       // accessible only INSIDE this class
    protected owner: string;       // accessible inside class + SUBCLASSES
    readonly bankName: string;     // can only be SET once (in constructor)

    constructor(id: string, owner: string, balance: number) {
        this.accountId = id;
        this.owner     = owner;
        this.balance   = balance;
        this.bankName  = "Dev Bank";
    }

    public deposit(amount: number): void {
        this.balance += amount;          // ✅ private accessible inside class
    }

    public getBalance(): number {
        return this.balance;             // expose private via public getter
    }
}

const acc = new BankAccount("ACC1", "Dev", 1000);
acc.deposit(500);           // ✅ public method
acc.getBalance();           // ✅ public method — returns 1500
acc.balance;                // ❌ Error: 'balance' is private
acc.bankName = "Other";     // ❌ Error: 'bankName' is read-only

// ===== CONSTRUCTOR SHORTHAND — declare AND assign in one step =====
// Without shorthand (verbose)
class UserLong {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age  = age;
    }
}

// With shorthand (clean — TypeScript specific feature)
class User {
    constructor(
        public  name: string,     // auto-declares AND assigns this.name
        private age: number,      // auto-declares AND assigns this.age
        readonly email: string    // auto-declares AND assigns this.email
    ) {}
}
const u = new User("Dev", 23, "dev@test.com");
console.log(u.name);    // ✅ "Dev"
console.log(u.age);     // ❌ private
console.log(u.email);   // ✅ "dev@test.com"
```

Note:
- Key Point: `public` = anywhere, `private` = class only, `protected` = class + subclasses, `readonly` = set once. Constructor shorthand (adding modifier in parameter) is a TypeScript-only feature that saves significant boilerplate.
- Why Interviewer Asks: Tests OOP knowledge in TypeScript. The constructor shorthand is a TypeScript-specific feature many beginners don't know — knowing it shows real TS experience.

---

**10. How do you use TypeScript with React? (Props, Events, useState)**

Answer:
TypeScript in React adds type safety to props, state, events, and refs — catching mistakes at compile time.

```tsx
// ===== TYPING PROPS =====
interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;                              // optional
    variant?: "primary" | "secondary" | "danger";   // literal union
    children?: React.ReactNode;                      // anything React renders
}

function Button({ label, onClick, disabled = false, variant = "primary" }: ButtonProps) {
    return (
        <button onClick={onClick} disabled={disabled} className={`btn-${variant}`}>
            {label}
        </button>
    );
}

<Button label="Click" onClick={() => {}} />    // ✅
<Button label="Click" />                       // ❌ onClick is required

// ===== TYPING useState =====
const [count, setCount]       = useState(0);            // inferred: number
const [name,  setName]        = useState("");            // inferred: string
const [user,  setUser]        = useState<User | null>(null); // explicit: needs type

setCount(10);       // ✅
setCount("hello");  // ❌ Error: string not assignable to number

// ===== TYPING EVENTS =====
// Input change
function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    console.log(e.target.value);   // TypeScript knows: string
}

// Form submit
function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
}

// Button click
function handleClick(e: React.MouseEvent<HTMLButtonElement>): void {
    console.log("clicked");
}

// In JSX — TypeScript infers event types automatically
<input onChange={(e) => console.log(e.target.value)} />
<form onSubmit={(e) => { e.preventDefault(); }}>

// ===== TYPING useRef =====
const inputRef = useRef<HTMLInputElement>(null);
// inputRef.current is HTMLInputElement | null
useEffect(() => {
    inputRef.current?.focus();   // optional chaining — safe
}, []);
return <input ref={inputRef} />;
```

Note:
- Key Point: Interface for props, explicit generic for useState when starting with null (`useState<User | null>(null)`), `React.ChangeEvent<HTMLInputElement>` for input onChange. In JSX TypeScript usually infers event types — manual typing needed only in separate handler functions.
- Why Interviewer Asks: If you're applying for a MERN role with TypeScript, this is the most practical question. Shows you can actually use TypeScript in a real React project, not just theory.

---

## Quick Revision — Top TypeScript Questions

| # | Question | One-Line Answer |
|---|----------|----------------|
| 1 | What is TypeScript | Superset of JS with static typing. Catches errors at compile time |
| 2 | TS vs JS | TS = static types + compile time errors. JS = dynamic + runtime errors |
| 3 | any vs unknown | any = unsafe, disables checks. unknown = safe, forces type check before use |
| 4 | type vs interface | interface = objects/classes, declaration merging. type = unions, tuples, primitives |
| 5 | Union type | `string \| number` — value can be one of these types (OR) |
| 6 | Intersection type | `TypeA & TypeB` — value must satisfy ALL types (AND) |
| 7 | Generics | Type variable `<T>` — reusable code that works with multiple types safely |
| 8 | Partial | Makes all properties optional — used for update functions |
| 9 | Omit | Removes specific properties — used to hide password from User type |
| 10 | Pick | Keeps only specific properties — used for public profiles |
| 11 | Record | `Record<Keys, Value>` — typed dictionary/lookup table |
| 12 | Type narrowing | typeof / instanceof / in / custom guard — narrows broad type to specific |
| 13 | Discriminated union | Common literal property on each type — enables safe switch narrowing |
| 14 | Enum vs union type | Enum for numeric/reverse lookup. Union type for simple string constants |
| 15 | Access modifiers | public=anywhere, private=class only, protected=class+subclasses, readonly=once |
| 16 | Constructor shorthand | `constructor(public name: string)` — declares AND assigns in one step |
| 17 | Typed React props | `interface ButtonProps { label: string; onClick: () => void }` |
| 18 | Typed useState | `useState<User \| null>(null)` — needed when initial is null |
| 19 | Typed events | `React.ChangeEvent<HTMLInputElement>` for onChange |
| 20 | ReturnType | `ReturnType<typeof fn>` — get the return type of a function |