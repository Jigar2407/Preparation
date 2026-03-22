/*
@@ TypeScript
- TypeScript is a SUPERSET of JavaScript developed by Microsoft (2012).
- "Superset" means — every valid JavaScript file IS valid TypeScript, but TypeScript adds extra features on top.
- TypeScript adds STATIC TYPING to JavaScript — you define what type a variable is, and TypeScript catches errors AT COMPILE TIME (before running the code), not at runtime.
- TypeScript files use `.ts` extension. For React files: `.tsx`
- Browser does NOT understand TypeScript — it must be COMPILED (transpiled) into plain JavaScript first using `tsc` (TypeScript Compiler).

=> Why TypeScript over JavaScript?
- Catches type errors BEFORE running code (at compile time)
- Better IDE autocomplete, IntelliSense, and error hints
- Makes code self-documenting (types explain what a variable holds)
- Easier to maintain large codebases
- Supports all ES6+ features + extra features (enums, generics, decorators)
- Almost universal in 2024+ — most companies expect TypeScript knowledge

=> TypeScript vs JavaScript
JS   : Dynamic typing — errors caught at RUNTIME (when app runs)
TS   : Static typing  — errors caught at COMPILE TIME (while writing)

```
// JavaScript — no error until you RUN it
let age = "23";
age + 5;       // "235" — no error shown, wrong behavior silently

// TypeScript — error shown IMMEDIATELY in editor
let age: number = "23";   //  Error: Type 'string' is not assignable to type 'number'
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 1B : Installation & Setup
---------------------------------------------------------------------------------------------------------

```bash
# Install TypeScript globally
npm install -g typescript

# Check version
tsc --version

# Compile a TypeScript file to JavaScript
tsc filename.ts          # creates filename.js

# Watch mode — auto-recompile on save
tsc filename.ts --watch

# Initialize tsconfig.json (project config file)
tsc --init
```

@@ tsconfig.json (Key options)
```json
{
  "compilerOptions": {
    "target": "ES6",           // Which JS version to compile to (ES5, ES6, ESNext)
    "module": "CommonJS",      // Module system (CommonJS for Node, ESNext for Vite/React)
    "strict": true,            // Enable ALL strict type checks (recommended — always use)
    "outDir": "./dist",        // Where compiled JS files go
    "rootDir": "./src",        // Where your .ts source files are
    "jsx": "react-jsx",        // Needed for React (.tsx files)
    "esModuleInterop": true,   // Allows default imports from CommonJS modules
    "noImplicitAny": true,     // Error if TypeScript infers 'any' type
    "strictNullChecks": true   // null and undefined are NOT valid by default
  },
  "include": ["src"],          // Which folders to compile
  "exclude": ["node_modules"]  // Which folders to skip
}
```

@@ Vite + React + TypeScript setup
```bash
npm create vite@latest my-app --template react-ts
# Creates a React project with TypeScript already configured
# .ts for logic files, .tsx for React component files
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 2 : Type Annotations & Basic Types
---------------------------------------------------------------------------------------------------------

@@ Type Annotation
- You explicitly tell TypeScript what type a variable holds using `: typeName`
- TypeScript also has TYPE INFERENCE — it automatically figures out the type from the assigned value

```typescript
// ===== BASIC TYPES =====

// string
let name: string = "Dev";
let greeting: string = `Hello ${name}`;   // template strings work fine

// number (covers integers AND decimals — no separate int/float like other languages)
let age: number = 23;
let price: number = 99.99;
let hex: number = 0xFF;       // hexadecimal also valid

// boolean
let isLoggedIn: boolean = true;
let isAdmin: boolean = false;

// null — intentionally empty
let emptyValue: null = null;

// undefined — variable declared but no value assigned
let notAssigned: undefined = undefined;

// Type Inference — TypeScript figures out type automatically (no annotation needed)
let city = "Ahmedabad";     // TypeScript infers: string
let count = 0;              // TypeScript infers: number
city = 123;                 //  Error: Type 'number' is not assignable to type 'string'

// Explicit annotation (needed when value is assigned later)
let score: number;
score = 100;   // Runs
score = "A";   //  Error
```

@@ Special Types — any, unknown, never, void
```typescript
// any — disables type checking completely (AVOID — defeats the purpose of TypeScript)
let data: any = "hello";
data = 123;         // Runs
data = true;        // Runs 
data.anything();    // Runs 

// unknown — safer version of any (you MUST check type before using)
let input: unknown = "hello";
input.toUpperCase();   //  Error: Object is of type 'unknown'

if (typeof input === "string") {
    input.toUpperCase();  // TypeScript now knows it's a string inside this block
}

// void — function returns nothing (no return value)
function logMessage(msg: string): void {
    console.log(msg);
    // no return statement — or return; with no value
}

// never — function NEVER returns (throws error or infinite loop)
function throwError(message: string): never {
    throw new Error(message);   // always throws — never returns normally
}

function infiniteLoop(): never {
    while (true) {}   // never ends — never returns
}
```

@@ any vs unknown — Key Difference
```typescript
// any — you can do ANYTHING with it (unsafe)
let a: any = "hello";
a.foo();           // no error — TypeScript ignores type
a * 5;             // no error

// unknown — you MUST verify type before using (safe)
let b: unknown = "hello";
b.foo();           //  Error — must check type first
if (typeof b === "string") {
    b.toUpperCase();  // Runs safe after check
}
// Rule: use unknown instead of any whenever possible
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 3 : Arrays, Tuples & Objects
---------------------------------------------------------------------------------------------------------

@@ Arrays
```typescript
// Two syntaxes — both are the same
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["Dev", "Jigo", "Raju"];   // generic syntax

let mixed: (string | number)[] = ["Dev", 23, "Ahmedabad", 100];   // union array

// Array methods — TypeScript knows the type inside
numbers.push(6);        // Runs number — fine
numbers.push("seven");  //  Error: Argument of type 'string' is not assignable to 'number'

// Readonly array — cannot be modified
const readonlyArr: readonly number[] = [1, 2, 3];
readonlyArr.push(4);   //  Error: Property 'push' does not exist on type 'readonly number[]'
```

@@ Tuples — Fixed-length array where each position has a specific type
```typescript
// Regular array — all same type, any length
let arr: number[] = [1, 2, 3, 100];

// Tuple — fixed positions, each can have different type
let person: [string, number] = ["Dev", 23];   // position 0 = string, position 1 = number
person[0] = "Jigo";     // Runs
person[0] = 100;        //  Error: Type 'number' is not assignable to type 'string'
person[2] = "extra";    //  Error: Tuple has no element at index 2

// Named tuples (TypeScript 4.0+) — readable labels
let employee: [name: string, age: number, active: boolean] = ["Dev", 23, true];

// Common use case — useState return type is a Tuple!
// const [count, setCount] = useState(0);
// useState returns [number, React.Dispatch<number>] — a tuple!

// Tuple with optional element
let data: [string, number?] = ["Dev"];   // second element optional
```

@@ Object Types
```typescript
// Basic object type annotation
let user: { name: string; age: number; email: string } = {
    name: "Dev",
    age: 23,
    email: "dev@example.com"
};

// Optional property with ?
let product: { name: string; price: number; description?: string } = {
    name: "Laptop",
    price: 50000
    // description is optional — OK to skip
};

// Readonly property — cannot be changed after initialization
let config: { readonly apiUrl: string; timeout: number } = {
    apiUrl: "https://api.example.com",
    timeout: 5000
};
config.apiUrl = "https://other.com";  //  Error: Cannot assign to 'apiUrl' — it is read-only
config.timeout = 3000;               // Runs not readonly — fine

// Nested objects
let company: {
    name: string;
    address: {
        city: string;
        state: string;
    };
} = {
    name: "Tech Corp",
    address: {
        city: "Ahmedabad",
        state: "Gujarat"
    }
};
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 4 : Union Types, Intersection Types & Literal Types
---------------------------------------------------------------------------------------------------------

@@ Union Types — value can be ONE OF multiple types (OR)
```typescript
// Union with |
let id: string | number = "ABC123";
id = 101;        // Runs also fine

// Union in function
function printId(id: string | number): void {
    // TypeScript forces you to handle both cases
    if (typeof id === "string") {
        console.log(id.toUpperCase());   // TS knows it's string here
    } else {
        console.log(id.toFixed(2));      // TS knows it's number here
    }
}

// Union with null — very common (value might not exist yet)
let username: string | null = null;
username = "Dev";   // Runs

// Union array — array of strings OR numbers
let data: (string | number)[] = ["Dev", 23, "Ahmedabad", 100];
```

@@ Intersection Types — combines MULTIPLE types into ONE (AND)
```typescript
// Intersection with &
type Person = { name: string; age: number };
type Employee = { company: string; role: string };

// IntersectionType = ALL properties from ALL types combined
type EmployeeProfile = Person & Employee;

let emp: EmployeeProfile = {
    name: "Dev",
    age: 23,
    company: "Tech Corp",
    role: "Developer"
    // ALL four properties required — it's Person AND Employee combined
};
```

@@ Literal Types — exact specific values, not just a type
```typescript
// Without literal types — accepts ANY string
let direction: string = "north";
direction = "anything";  // Runs accepts any string

// With literal types — ONLY these exact values allowed
let direction: "north" | "south" | "east" | "west" = "north";
direction = "south";    // Runs
direction = "up";       //  Error: Type '"up"' is not assignable to this type

// Number literals
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 3;
diceRoll = 7;   //  Error

// Boolean literal (rarely needed but valid)
let alwaysTrue: true = true;

// Literal types are very powerful with function parameters
function setAlignment(align: "left" | "center" | "right"): void {
    console.log(`Aligning to: ${align}`);
}
setAlignment("left");     // Runs
setAlignment("justify");  //  Error — not in the allowed literals
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 5 : Type Aliases vs Interfaces
---------------------------------------------------------------------------------------------------------

@@ type (Type Alias)
- Creates a NEW NAME for any type — primitives, unions, tuples, objects, functions
- Use `type` keyword
```typescript
// Type alias for primitive (rarely needed but valid)
type ID = string | number;
type Age = number;

// Type alias for object
type User = {
    id: ID;
    name: string;
    age: Age;
    email?: string;   // optional
};

// Type alias for union
type Status = "active" | "inactive" | "pending";

// Type alias for function
type GreetFunction = (name: string) => string;
const greet: GreetFunction = (name) => `Hello, ${name}!`;

// Type alias for tuple
type Coordinate = [number, number];
let point: Coordinate = [23.5, 72.3];

// Type alias with intersection
type AdminUser = User & { permissions: string[] };

// Usage
const user: User = {
    id: 101,
    name: "Dev",
    age: 23
};
```

@@ interface
- Defines the SHAPE (structure) of an object or class
- Use `interface` keyword
- ONLY for objects and classes (cannot describe primitives or unions directly)
```typescript
// Interface for object shape
interface User {
    id: number;
    name: string;
    age: number;
    email?: string;   // optional property
    readonly createdAt: Date;   // readonly
}

// Interface for function shape
interface GreetFunction {
    (name: string): string;   // call signature
}

// Extending interface (inheritance)
interface Animal {
    name: string;
    age: number;
}

interface Dog extends Animal {
    breed: string;
    bark(): void;   // method
}

const myDog: Dog = {
    name: "Bruno",
    age: 3,
    breed: "Labrador",
    bark() { console.log("Woof!"); }
};

// Interface Declaration Merging — UNIQUE to interfaces (type cannot do this!)
// You can declare the same interface multiple times — they merge automatically
interface Window {
    title: string;
}
interface Window {
    theme: string;
}
// Now Window has BOTH title AND theme — merged!
const win: Window = { title: "App", theme: "dark" };
```

@@ type vs interface — Key Differences
```typescript
// ============================================
// SIMILARITIES — both can describe objects
// ============================================
type UserType = { name: string; age: number };
interface UserInterface { name: string; age: number }
// Both work the same for basic object shapes

// ============================================
// DIFFERENCES
// ============================================

// 1. Unions & Primitives — ONLY type can do this
type ID = string | number;        // Runs type — fine
interface ID = string | number;   //  interface — cannot represent union

// 2. Tuples — ONLY type is clean for this
type Pair = [string, number];     // Runs type — clean
interface Pair { 0: string; 1: number; }  // interface is ugly/impractical

// 3. Declaration Merging — ONLY interface can do this
interface Car { brand: string; }
interface Car { speed: number; }
// Car now has both brand AND speed — useful for extending library types

// 4. Extends vs Intersection
// Interface — use extends keyword
interface A { x: number; }
interface B extends A { y: number; }   // B has x AND y

// Type — use & intersection
type A = { x: number };
type B = A & { y: number };            // B has x AND y — same result

// ============================================
// WHEN TO USE WHICH (Best Practice in 2024)
// ============================================
// Use interface for: object shapes, class contracts, public APIs
// Use type for    : unions, intersections, tuples, mapped types, conditional types
// When in doubt   : use interface — TypeScript docs recommend it for objects
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 6 : Functions in TypeScript
---------------------------------------------------------------------------------------------------------

@@ Function Type Annotations
```typescript
// ===== TYPED FUNCTION PARAMETERS AND RETURN =====

// Basic typed function
function add(a: number, b: number): number {
    return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Void return — no return value
function logUser(name: string): void {
    console.log(`User: ${name}`);
}

// ===== OPTIONAL PARAMETERS — must come AFTER required params =====
function greet(firstName: string, lastName?: string): string {
    if (lastName) {
        return `Hello, ${firstName} ${lastName}`;
    }
    return `Hello, ${firstName}`;
}
greet("Dev");             // Runs lastName is optional
greet("Dev", "Patel");   // Runs both provided

// ===== DEFAULT PARAMETERS =====
function createUser(name: string, role: string = "user"): string {
    return `${name} (${role})`;
}
createUser("Dev");           // "Dev (user)"
createUser("Dev", "admin");  // "Dev (admin)"

// ===== REST PARAMETERS — typed as array =====
function sumAll(...numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0);
}
sumAll(1, 2, 3, 4, 5);   // 15

// ===== FUNCTION OVERLOADING — multiple signatures for same function =====
// You define multiple type signatures, then ONE implementation
function format(value: string): string;         // signature 1
function format(value: number): string;         // signature 2
function format(value: string | number): string {  // implementation (must cover all)
    if (typeof value === "string") {
        return value.trim().toLowerCase();
    }
    return value.toFixed(2);
}
format("  HELLO  ");   // "hello"
format(3.14159);       // "3.14"

// ===== TYPING CALLBACK FUNCTIONS =====
// Parameter type for functions that accept callbacks
function fetchData(url: string, callback: (data: string, error: string | null) => void): void {
    // simulate API call
    callback("result data", null);
}

fetchData("/api/users", (data, error) => {
    if (error) console.error(error);
    else console.log(data);
});
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 7 : Enums
---------------------------------------------------------------------------------------------------------

@@ Enums — Named constants grouped together
- Enums give meaningful names to a set of related numeric or string values
- Think of them as a collection of named constants

```typescript
// ===== NUMERIC ENUM (default) =====
// Values are auto-assigned as 0, 1, 2, 3...
enum Direction {
    North,    // 0
    South,    // 1
    East,     // 2
    West      // 3
}

let dir: Direction = Direction.North;
console.log(dir);               // 0
console.log(Direction[0]);      // "North" — reverse lookup works!
console.log(Direction.South);   // 1

// Custom starting number
enum StatusCode {
    OK = 200,
    NotFound = 404,
    InternalError = 500
}
console.log(StatusCode.OK);   // 200

// ===== STRING ENUM — most used in real projects =====
// Each member must have a string value — no auto-assignment
enum Role {
    Admin = "ADMIN",
    User = "USER",
    Guest = "GUEST"
}

let userRole: Role = Role.Admin;
console.log(userRole);   // "ADMIN"

function checkAccess(role: Role): boolean {
    return role === Role.Admin;
}
checkAccess(Role.Admin);   // true
checkAccess(Role.Guest);   // false

// ===== const enum — compile-time optimization =====
// const enum is completely removed during compilation — inline values only
// Faster but NO reverse lookup
const enum Color {
    Red = "RED",
    Blue = "BLUE",
    Green = "GREEN"
}
let myColor: Color = Color.Red;   // compiled to: let myColor = "RED"

// ===== Enum vs Union Type Literals =====
// In 2024, many TypeScript developers prefer union types over enums:

// Enum approach
enum ThemeEnum { Light = "light", Dark = "dark" }

// Union type approach (simpler, more modern)
type Theme = "light" | "dark";

// For simple string constants — prefer union types (less code, no runtime overhead)
// For numeric constants or when you need reverse lookup — use enum
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 8 : Generics
---------------------------------------------------------------------------------------------------------

@@ Generics — Write REUSABLE code that works with MULTIPLE types
- Without generics: write separate functions for each type (duplicate code)
- With generics: write ONE function that works with ANY type while keeping type safety
- Think of generics as a TYPE VARIABLE — a placeholder for the actual type

```typescript
// ===== PROBLEM without generics =====
function getFirstString(arr: string[]): string { return arr[0]; }
function getFirstNumber(arr: number[]): number { return arr[0]; }
// Duplicate code for each type — not scalable

// ===== SOLUTION with generics =====
// <T> is the type variable (T = Type, but can be any name)
function getFirst<T>(arr: T[]): T {
    return arr[0];
}
// TypeScript INFERS the type from what you pass
getFirst(["Dev", "Jigo"]);    // TypeScript infers T = string, returns string
getFirst([1, 2, 3]);          // TypeScript infers T = number, returns number
getFirst([true, false]);       // TypeScript infers T = boolean, returns boolean

// You can also EXPLICITLY pass the type
getFirst<string>(["Dev", "Jigo"]);  // explicitly string

// ===== MULTIPLE TYPE VARIABLES =====
function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}
const result = pair("Dev", 23);     // [string, number]
const result2 = pair(true, "yes");  // [boolean, string]

// ===== GENERIC INTERFACE =====
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
    success: boolean;
}

// Usage with different data types
const userResponse: ApiResponse<{ name: string; age: number }> = {
    data: { name: "Dev", age: 23 },
    status: 200,
    message: "OK",
    success: true
};

const usersResponse: ApiResponse<string[]> = {
    data: ["Dev", "Jigo", "Raju"],
    status: 200,
    message: "OK",
    success: true
};

// ===== GENERIC CONSTRAINTS — limit what types T can be =====
// T extends something — means T must have at least those properties

// Without constraint — T could be anything, length might not exist
function getLength<T>(item: T): number {
    return item.length;   //  Error: Property 'length' does not exist on type 'T'
}

// With constraint — T must have length property
function getLength<T extends { length: number }>(item: T): number {
    return item.length;   // Runs TypeScript knows T has length
}
getLength("Dev");         // Runs string has length
getLength([1, 2, 3]);     // Runs array has length
getLength(123);           //  Error: number doesn't have length

// ===== keyof constraint — T must be a key of another type =====
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: "Dev", age: 23, city: "Ahmedabad" };
getProperty(user, "name");   // Runs returns "Dev" — TypeScript knows it's string
getProperty(user, "age");    // Runs returns 23 — TypeScript knows it's number
getProperty(user, "salary"); //  Error: "salary" is not a key of user

// ===== GENERIC FUNCTION for API calls (very common in React) =====
async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    const data: T = await response.json();
    return data;
}

// Usage — TypeScript knows what the API returns
interface User { id: number; name: string; email: string }
const user = await fetchData<User>("/api/user/1");
user.name;   // Runs TypeScript knows this is string
user.xyz;    //  Error: 'xyz' does not exist on type 'User'
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 9 : Type Narrowing & Type Guards
---------------------------------------------------------------------------------------------------------

@@ Type Narrowing
- TypeScript narrows (reduces) the type from a broad type to a more specific one inside a conditional block
- You check type → TypeScript understands the narrowed type inside that block

```typescript
// ===== typeof Type Guard — for primitive types =====
function processInput(input: string | number): string {
    if (typeof input === "string") {
        // TypeScript KNOWS input is string here
        return input.toUpperCase();     // Runs string method
    } else {
        // TypeScript KNOWS input is number here
        return input.toFixed(2);        // Runs number method
    }
}

// ===== instanceof Type Guard — for class instances =====
class Dog { bark() { return "Woof!"; } }
class Cat { meow() { return "Meow!"; } }

function makeSound(animal: Dog | Cat): string {
    if (animal instanceof Dog) {
        return animal.bark();   // TypeScript knows it's Dog here
    } else {
        return animal.meow();   // TypeScript knows it's Cat here
    }
}

// ===== in operator — check if property exists in object =====
interface Bird { fly(): void; feathers: number; }
interface Fish { swim(): void; scales: number; }

function move(animal: Bird | Fish): void {
    if ("fly" in animal) {
        animal.fly();    // TypeScript knows it's Bird
    } else {
        animal.swim();   // TypeScript knows it's Fish
    }
}

// ===== Custom Type Guard — function with 'is' keyword =====
// When built-in narrowing isn't enough, write your own type guard function
// Return type format: paramName is TypeName

interface Admin { role: "admin"; permissions: string[] }
interface RegularUser { role: "user"; }

function isAdmin(user: Admin | RegularUser): user is Admin {
    return user.role === "admin";   // runtime check
}

function handleUser(user: Admin | RegularUser): void {
    if (isAdmin(user)) {
        // TypeScript knows user is Admin here
        console.log(user.permissions);   // Runs Admin has permissions
    } else {
        // TypeScript knows user is RegularUser here
        console.log("Regular user");
    }
}

// ===== Discriminated Union — most powerful narrowing pattern =====
// Add a common 'type' or 'kind' property to all union members
// TypeScript narrows based on that literal property

type Circle    = { shape: "circle";    radius: number };
type Rectangle = { shape: "rectangle"; width: number; height: number };
type Triangle  = { shape: "triangle";  base: number;  height: number };

type Shape = Circle | Rectangle | Triangle;

function calculateArea(shape: Shape): number {
    switch (shape.shape) {   // discriminant property
        case "circle":
            return Math.PI * shape.radius ** 2;    // TypeScript knows: Circle
        case "rectangle":
            return shape.width * shape.height;     // TypeScript knows: Rectangle
        case "triangle":
            return 0.5 * shape.base * shape.height; // TypeScript knows: Triangle
    }
}

calculateArea({ shape: "circle", radius: 5 });              // 78.54
calculateArea({ shape: "rectangle", width: 10, height: 5 }); // 50
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 10 : Classes in TypeScript
---------------------------------------------------------------------------------------------------------

@@ TypeScript Classes — Access Modifiers + Extra Features
```typescript
// ===== ACCESS MODIFIERS =====
// public    — accessible everywhere (default if not specified)
// private   — accessible ONLY inside the class
// protected — accessible inside class AND subclasses (not outside)
// readonly  — can only be set during initialization

class BankAccount {
    public accountNumber: string;      // accessible everywhere
    private balance: number;           // only inside BankAccount
    protected owner: string;           // inside BankAccount and subclasses
    readonly bankName: string;         // cannot change after creation

    constructor(accountNumber: string, owner: string, initialBalance: number) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.owner = owner;
        this.bankName = "Dev Bank";
    }

    public deposit(amount: number): void {
        this.balance += amount;
        console.log(`Deposited ${amount}. New balance: ${this.balance}`);
    }

    public getBalance(): number {
        return this.balance;   // expose private balance via public method
    }

    private validate(): boolean {
        return this.balance >= 0;   // only called internally
    }
}

const account = new BankAccount("ACC001", "Dev", 1000);
account.deposit(500);                  // Runs public method
console.log(account.getBalance());     // Runs public method
console.log(account.balance);          //  Error: 'balance' is private
console.log(account.bankName);         // Runs readonly — can READ
account.bankName = "Other Bank";       //  Error: 'bankName' is read-only

// ===== CONSTRUCTOR SHORTHAND — declare + assign in one step =====
// Instead of declaring properties separately AND assigning in constructor:
class UserLong {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

// Constructor shorthand — add access modifier directly in parameters
class User {
    constructor(
        public name: string,        // auto-declares AND assigns
        private age: number,        // private property
        readonly email: string      // readonly property
    ) {}
    // No need for this.name = name etc. — TypeScript does it automatically!
}
const user = new User("Dev", 23, "dev@example.com");
console.log(user.name);    // Runs "Dev"
console.log(user.age);     //  private
console.log(user.email);   // Runs "dev@example.com"

// ===== IMPLEMENTS — class must follow interface contract =====
interface Printable {
    print(): void;
    getInfo(): string;
}

class Document implements Printable {
    constructor(private title: string, private content: string) {}

    print(): void {   // MUST implement — required by interface
        console.log(`${this.title}: ${this.content}`);
    }

    getInfo(): string {   // MUST implement — required by interface
        return `Document: ${this.title}`;
    }
}

// ===== ABSTRACT CLASS — blueprint that cannot be instantiated directly =====
// Use abstract when you want base behavior but force subclasses to implement specifics
abstract class Vehicle {
    constructor(protected brand: string, protected speed: number) {}

    // Regular method — shared by all subclasses
    describe(): string {
        return `${this.brand} going at ${this.speed} km/h`;
    }

    // Abstract method — MUST be implemented by subclass
    abstract fuelType(): string;
}

class Car extends Vehicle {
    fuelType(): string { return "Petrol"; }   // MUST implement
}

class ElectricCar extends Vehicle {
    fuelType(): string { return "Electric"; }  // MUST implement
}

// new Vehicle("Tesla", 100);   //  Error: Cannot create instance of abstract class
const car = new Car("Toyota", 120);
car.describe();    // "Toyota going at 120 km/h"
car.fuelType();    // "Petrol"
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 11 : Utility Types
---------------------------------------------------------------------------------------------------------

@@ Utility Types — Built-in TypeScript helpers to TRANSFORM existing types
- These are pre-built generic types that create new types from existing ones
- Used constantly in React+TypeScript development

```typescript
// ===== BASE TYPE for examples =====
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    password: string;
}

// ===== Partial<T> — makes ALL properties optional =====
// Use case: update functions where you send only changed fields
type PartialUser = Partial<User>;
// Same as: { id?: number; name?: string; email?: string; age?: number; password?: string }

function updateUser(id: number, changes: Partial<User>): void {
    // changes can have any subset of User properties
    console.log("Updating user", id, "with:", changes);
}
updateUser(1, { name: "New Name" });             // Runs only name
updateUser(1, { email: "new@email.com", age: 25 }); // Runs email + age

// ===== Required<T> — makes ALL properties required (opposite of Partial) =====
interface Config {
    host?: string;
    port?: number;
    timeout?: number;
}
type RequiredConfig = Required<Config>;
// Same as: { host: string; port: number; timeout: number } — all required!

// ===== Readonly<T> — makes ALL properties readonly =====
type ReadonlyUser = Readonly<User>;
const frozenUser: ReadonlyUser = { id: 1, name: "Dev", email: "dev@test.com", age: 23, password: "1234" };
frozenUser.name = "Other";   //  Error: Cannot assign to 'name' — it is read-only

// ===== Pick<T, K> — pick ONLY specific properties =====
// Use case: create a public profile from full user (hide password)
type PublicProfile = Pick<User, "id" | "name" | "email">;
// Same as: { id: number; name: string; email: string }

const profile: PublicProfile = { id: 1, name: "Dev", email: "dev@test.com" };
// profile.password —  doesn't exist on PublicProfile

// ===== Omit<T, K> — remove specific properties (opposite of Pick) =====
type SafeUser = Omit<User, "password">;
// Same as: { id: number; name: string; email: string; age: number }
// password is excluded — safe to send to frontend

// ===== Record<K, V> — create object type with specific key and value types =====
// Use case: dictionaries, maps, lookup tables

type Roles = "admin" | "user" | "guest";
type RolePermissions = Record<Roles, string[]>;
// Same as: { admin: string[]; user: string[]; guest: string[] }

const permissions: RolePermissions = {
    admin: ["read", "write", "delete"],
    user: ["read", "write"],
    guest: ["read"]
};

// Record with string keys
type CachStore = Record<string, unknown>;
const cache: CachStore = {};
cache["user_1"] = { name: "Dev" };
cache["product_5"] = { price: 1000 };

// ===== Exclude<T, U> — exclude specific types from a union =====
type AllStatus = "active" | "inactive" | "pending" | "deleted";
type ActiveStatus = Exclude<AllStatus, "deleted" | "inactive">;
// Result: "active" | "pending"

// ===== Extract<T, U> — keep ONLY matching types from a union =====
type StringOrNumber = string | number | boolean | null;
type OnlyPrimitive = Extract<StringOrNumber, string | number>;
// Result: string | number

// ===== NonNullable<T> — removes null and undefined from type =====
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// Result: string

// ===== ReturnType<T> — get the return type of a function =====
function getUser(): { id: number; name: string } {
    return { id: 1, name: "Dev" };
}
type UserReturnType = ReturnType<typeof getUser>;
// Result: { id: number; name: string }

// ===== Parameters<T> — get parameter types of a function as a tuple =====
function createUser(name: string, age: number, email: string): void {}
type CreateUserParams = Parameters<typeof createUser>;
// Result: [name: string, age: number, email: string]
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 12 : TypeScript with React
---------------------------------------------------------------------------------------------------------

@@ TypeScript + React Setup
```bash
# New project with Vite
npm create vite@latest my-app --template react-ts

# Add TypeScript to existing React project
npm install --save-dev typescript @types/react @types/react-dom
```

@@ Typing Props
```tsx
// ===== Basic typed props using interface (recommended) =====
interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;          // optional
    variant?: "primary" | "secondary" | "danger";  // literal union
    children?: React.ReactNode;  // anything React can render
}

function Button({ label, onClick, disabled = false, variant = "primary" }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant}`}
        >
            {label}
        </button>
    );
}

// Usage — TypeScript checks props automatically
<Button label="Click Me" onClick={() => console.log("clicked")} />  // Runs
<Button label="Click Me" />  //  Error: onClick is required

// ===== Typing children props =====
interface CardProps {
    title: string;
    children: React.ReactNode;   // any valid React content
}
function Card({ title, children }: CardProps) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <div>{children}</div>
        </div>
    );
}

// ===== React.FC type (optional, less recommended now) =====
// React.FC automatically includes children — but this is now considered legacy
const MyComponent: React.FC<ButtonProps> = ({ label }) => <button>{label}</button>;
// Modern approach: just type props directly (like examples above) — preferred in 2024
```

@@ Typing useState
```tsx
// TypeScript INFERS type from initial value (usually no annotation needed)
const [count, setCount] = useState(0);        // inferred: number
const [name, setName] = useState("");         // inferred: string
const [active, setActive] = useState(false);  // inferred: boolean

// Explicit type annotation — needed when initial value is null or complex
const [user, setUser] = useState<User | null>(null);  // starts null, later User
const [items, setItems] = useState<string[]>([]);     // empty array — needs type

// Setting state — TypeScript enforces correct type
setCount(10);         // Runs
setCount("hello");    //  Error: string not assignable to number

setUser({ id: 1, name: "Dev", email: "dev@test.com", age: 23, password: "1234" });  // Runs
setUser("Dev");       //  Error: string not assignable to User | null
```

@@ Typing useRef
```tsx
// useRef for DOM elements — type is the HTML element type
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
const buttonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
    if (inputRef.current) {
        inputRef.current.focus();  // TypeScript knows: HTMLInputElement methods
    }
}, []);

return <input ref={inputRef} type="text" />;

// useRef for mutable values (not DOM) — no initial null needed
const countRef = useRef<number>(0);
countRef.current += 1;   // TypeScript knows it's number
```

@@ Typing Events
```tsx
// ===== onChange — input change event =====
function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    console.log(e.target.value);    // TypeScript knows: string
}

// For textarea
function handleTextArea(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    console.log(e.target.value);
}

// For select
function handleSelect(e: React.ChangeEvent<HTMLSelectElement>): void {
    console.log(e.target.value);
}

// ===== onClick — button click event =====
function handleClick(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    console.log("Button clicked");
}

// ===== onSubmit — form submit event =====
function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // process form
}

// ===== Inline in JSX (TypeScript infers automatically) =====
<input onChange={(e) => console.log(e.target.value)} />   // e inferred automatically
<button onClick={(e) => e.preventDefault()}>Click</button>
<form onSubmit={(e) => { e.preventDefault(); }}>

// ===== Keyboard events =====
function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
        console.log("Enter pressed!");
    }
}
```

@@ Typing useEffect
```tsx
// useEffect itself doesn't need extra typing — TypeScript handles it
// Just type what's INSIDE the effect

useEffect(() => {
    const fetchUser = async (): Promise<void> => {
        const res = await fetch("/api/user");
        const data: User = await res.json();  // type the API response
        setUser(data);
    };
    fetchUser();
}, []);
```

@@ Typing Custom Hooks
```tsx
// Custom hook — type input parameters and return value
function useFetch<T>(url: string): {
    data: T | null;
    loading: boolean;
    error: string | null;
} {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then((result: T) => {
                setData(result);
                setLoading(false);
            })
            .catch((err: Error) => {
                setError(err.message);
                setLoading(false);
            });
    }, [url]);

    return { data, loading, error };
}

// Usage — TypeScript knows exactly what data type comes back
interface Product { id: number; name: string; price: number }
const { data: products, loading, error } = useFetch<Product[]>("/api/products");
// products is Product[] | null — fully typed!
if (products) {
    products[0].name;    // Runs TypeScript knows this is string
    products[0].price;   // Runs TypeScript knows this is number
}
```

@@ Typing API Responses with Axios
```tsx
import axios from 'axios';

interface User { id: number; name: string; email: string }
interface ApiResponse<T> { data: T; status: number; message: string }

// Axios generic — specify expected response type
const getUser = async (id: number): Promise<User> => {
    const response = await axios.get<User>(`/api/users/${id}`);
    return response.data;   // TypeScript knows response.data is User
};

// With wrapper type
const getUsers = async (): Promise<ApiResponse<User[]>> => {
    const response = await axios.get<ApiResponse<User[]>>("/api/users");
    return response.data;
};
```

@@ Typing Redux Toolkit with TypeScript
```tsx
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

const store = configureStore({
    reducer: { counter: counterReducer }
});

// Export types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
// RootState = { counter: { value: number } }

export type AppDispatch = typeof store.dispatch;
export default store;

// counterSlice.ts — fully typed slice
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState { value: number; name: string }
const initialState: CounterState = { value: 0, name: "Dev" };

const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => { state.value += 1; },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            // PayloadAction<number> — action.payload is typed as number
            state.value += action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;  // payload is string
        }
    }
});

export const { increment, incrementByAmount, setName } = counterSlice.actions;
export default counterSlice.reducer;

// In Component — typed hooks
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Create typed versions of hooks (do this once, use everywhere)
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector = <T>(selector: (state: RootState) => T): T =>
    useSelector(selector);

function Counter() {
    const count = useAppSelector(state => state.counter.value);  // number Runs
    const name = useAppSelector(state => state.counter.name);    // string Runs
    const dispatch = useAppDispatch();

    return (
        <div>
            <h2>{name}: {count}</h2>
            <button onClick={() => dispatch(increment())}>+</button>
            <button onClick={() => dispatch(incrementByAmount(10))}>+10</button>
        </div>
    );
}
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 13 : Advanced TypeScript
---------------------------------------------------------------------------------------------------------

@@ keyof — get all keys of a type as a union
```typescript
interface User { id: number; name: string; age: number; email: string }

type UserKeys = keyof User;
// Result: "id" | "name" | "age" | "email"   — union of all keys!

// Practical use — safe property access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];   // TypeScript knows the return type matches the key!
}
const user: User = { id: 1, name: "Dev", age: 23, email: "dev@test.com" };
const name = getProperty(user, "name");   // TypeScript knows: string
const age  = getProperty(user, "age");    // TypeScript knows: number
getProperty(user, "salary");              //  Error: "salary" not in User
```

@@ typeof (in TypeScript context — different from JS typeof!)
```typescript
const config = { host: "localhost", port: 3000, debug: true };

// typeof in TypeScript — get the TYPE of an existing value
type ConfigType = typeof config;
// Result: { host: string; port: number; debug: boolean }

// Common use: get type from a function
function createUser(name: string, age: number) {
    return { name, age, createdAt: new Date() };
}
type UserType = ReturnType<typeof createUser>;
// Result: { name: string; age: number; createdAt: Date }
```

@@ Mapped Types — transform every property of an existing type
```typescript
// Manually making all properties optional is tedious:
// { id?: number; name?: string; age?: number }

// Mapped type — transform all properties automatically
// [K in keyof T] — iterate over every key K in type T
type Optional<T> = {
    [K in keyof T]?: T[K];   // ? makes each property optional
};
// Optional<User> = same as Partial<User>

// Make all properties nullable
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};
type NullableUser = Nullable<User>;
// { id: number | null; name: string | null; ... }

// Readonly mapped type
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};
// This is how TypeScript's built-in Readonly<T> works!
```

@@ Conditional Types — types that behave like ternary operators
```typescript
// Syntax: T extends Condition ? TrueType : FalseType

type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;   // "yes"
type B = IsString<number>;   // "no"
type C = IsString<"hello">;  // "yes" — "hello" extends string

// Practical use — NonNullable (built into TypeScript, this is how it works)
type MyNonNullable<T> = T extends null | undefined ? never : T;
type Result = MyNonNullable<string | null | undefined>;  // string
```

@@ Template Literal Types (TypeScript 4.1+)
```typescript
// Combine string literals like template literals
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// Result: "onClick" | "onFocus" | "onBlur"

type CSSUnit = "px" | "em" | "rem" | "%";
type CSSValue = `${number}${CSSUnit}`;
// Result: allows "16px", "1.5em", "100%" etc.

function setCSSValue(value: CSSValue): void {
    document.body.style.fontSize = value;
}
setCSSValue("16px");    // Runs
setCSSValue("1.5em");   // Runs
setCSSValue("16");      //  Error: no unit
setCSSValue("hello");   //  Error: not a CSS value format
```

@@ Decorators (TypeScript 5.0 — Stage 3)
```typescript
// Decorators = special syntax to add metadata or modify classes/methods
// Must enable in tsconfig.json (or use "experimentalDecorators": true for legacy)

// ===== Method Decorator — logs when method is called =====
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyKey} with`, args);
        const result = originalMethod.apply(this, args);
        console.log(`Result:`, result);
        return result;
    };
    return descriptor;
}

class Calculator {
    @log   // decorator — applies the log function to this method
    add(a: number, b: number): number {
        return a + b;
    }
}

const calc = new Calculator();
calc.add(5, 3);
// Logs: "Calling add with [5, 3]"
// Logs: "Result: 8"

// ===== Class Decorator =====
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
    // Prevents adding new properties to the class
}

@sealed
class PersonClass {
    constructor(public name: string) {}
}

// Decorators are heavily used in:
// - Angular (Component, Injectable, NgModule)
// - NestJS (Controller, Get, Post, Injectable)
// For React + basic TypeScript: decorators are less common
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 14 : TypeScript with Node.js / Express (MERN Backend)
---------------------------------------------------------------------------------------------------------

```typescript
// Install types for Node and Express
// npm install --save-dev @types/node @types/express

import express, { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

// ===== Typed Request and Response =====
interface CreateUserBody {
    name: string;
    email: string;
    password: string;
}

interface UserParams {
    id: string;
}

// Route with typed req body
app.post("/users", (req: Request<{}, {}, CreateUserBody>, res: Response) => {
    const { name, email, password } = req.body;  // fully typed!
    // name is string, email is string, password is string
    res.status(201).json({ message: "User created", name });
});

// Route with typed URL params
app.get("/users/:id", (req: Request<UserParams>, res: Response) => {
    const { id } = req.params;   // id is string (URL params are always strings)
    res.json({ id, user: "found" });
});

// ===== Custom Request type (add user to req) =====
interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    req.user = { id: "123", role: "admin" };   // attach user to request
    next();
};
```

---------------------------------------------------------------------------------------------------------
@@ TOPIC 15 : Type Assertions & Non-Null Assertion
---------------------------------------------------------------------------------------------------------

```typescript
// ===== Type Assertion — "trust me, I know the type" (as keyword) =====
// Use when YOU know the type but TypeScript doesn't
// Does NOT actually convert the value — only tells TypeScript what type to use

const input = document.getElementById("myInput");
// TypeScript infers: HTMLElement | null (generic element, could be anything)

// Assert to specific type (you know it's an input)
const inputEl = document.getElementById("myInput") as HTMLInputElement;
inputEl.value;   //  TypeScript knows it has .value (HTMLInputElement property)

// Another syntax (angle brackets) — NOT usable in .tsx files (conflicts with JSX)
const inputEl2 = <HTMLInputElement>document.getElementById("myInput");

// ===== Double assertion — when assertion seems too far =====
const value = "hello" as unknown as number;   // rarely needed, usually a bad sign

// ===== Non-Null Assertion Operator ! =====
// Tells TypeScript: "this value is NOT null or undefined — trust me"
const inputEl3 = document.getElementById("myInput")!;  // ! removes null from type
// Use carefully — if the element doesn't exist, you'll get a runtime error

const user: User | null = getUser();
console.log(user!.name);  // ! asserts user is not null — dangerous if wrong

// ===== Optional Chaining ?. (safer alternative to !) =====
const user2: User | null = getUser();
console.log(user2?.name);    //  safe — if user2 is null, returns undefined instead of error
console.log(user2?.address?.city);   // chaining multiple optional accesses
```

---------------------------------------------------------------------------------------------------------
@@ Quick Reference — TypeScript Syntax Cheat Sheet
---------------------------------------------------------------------------------------------------------

```typescript
// TYPE ANNOTATIONS
let name: string = "Dev";
let age: number = 23;
let active: boolean = true;
let nothing: null = null;
let unset: undefined = undefined;
let anything: any = "anything";      // avoid!
let safe: unknown = "safe";          // use instead of any
function fn(): void {}               // no return
function fail(): never { throw new Error(); }  // never returns

// ARRAYS
let arr: number[] = [1, 2, 3];
let arr2: Array<string> = ["a", "b"];
let mixed: (string | number)[] = ["Dev", 23];
let readonly: readonly number[] = [1, 2, 3];

// TUPLE
let pair: [string, number] = ["Dev", 23];

// UNION
let id: string | number = "ABC";

// INTERSECTION
type AB = A & B;

// LITERAL
let dir: "north" | "south" = "north";

// TYPE ALIAS
type ID = string | number;
type User = { name: string; age: number };

// INTERFACE
interface Animal { name: string; speak(): void }
interface Dog extends Animal { breed: string }

// FUNCTION
function add(a: number, b: number): number { return a + b; }
const multiply = (a: number, b: number): number => a * b;
function greet(name: string, title?: string): string { return `${title} ${name}` }

// GENERICS
function identity<T>(value: T): T { return value; }
interface Box<T> { content: T }

// UTILITY TYPES
Partial<User>          // all optional
Required<User>         // all required
Readonly<User>         // all readonly
Pick<User, "name">     // only name
Omit<User, "password"> // everything except password
Record<string, number> // { [key: string]: number }
NonNullable<T>         // removes null and undefined
ReturnType<typeof fn>  // return type of function
Parameters<typeof fn>  // parameter types of function

// TYPE GUARDS
typeof x === "string"          // primitive check
x instanceof MyClass           // class instance check
"prop" in obj                  // property existence check
function isUser(x): x is User  // custom type guard

// ASSERTION
const el = document.getElementById("id") as HTMLInputElement;
const el2 = document.getElementById("id")!;   // non-null assertion

// ACCESS MODIFIERS (Classes)
public    // everywhere (default)
private   // class only
protected // class + subclasses
readonly  // read only — set once

// REACT + TYPESCRIPT
interface Props { name: string; onClick: () => void; children?: React.ReactNode }
const [user, setUser] = useState<User | null>(null);
const ref = useRef<HTMLInputElement>(null);
function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {}
function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {}
type RootState = ReturnType<typeof store.getState>;
action: PayloadAction<number>
```

---------------------------------------------------------------------------------------------------------
@@ Topics Covered Summary
---------------------------------------------------------------------------------------------------------

Topic  1  : What is TypeScript, JS vs TS, Superset, Compile-time errors
Topic  2  : Installation, tsc, tsconfig.json, Vite + React + TS setup
Topic  3  : Type Annotations — string, number, boolean, null, undefined, any, unknown, void, never
Topic  4  : Arrays, Tuples, Object Types, Optional, Readonly
Topic  5  : Union Types, Intersection Types, Literal Types
Topic  6  : Type Aliases (type) vs Interfaces (interface) — differences & when to use
Topic  7  : Functions — typed params, return, optional, default, rest, overloading
Topic  8  : Enums — numeric, string, const enum, vs union types
Topic  9  : Generics — generic functions, interfaces, constraints, keyof, fetchData<T>
Topic 10  : Type Narrowing — typeof, instanceof, in, custom type guards, discriminated unions
Topic 11  : Classes — public/private/protected/readonly, constructor shorthand, implements, abstract
Topic 12  : Utility Types — Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType, Parameters
Topic 13  : TypeScript with React — typed Props, useState, useRef, Events, Custom Hooks, Axios, Redux Toolkit
Topic 14  : TypeScript with Express/Node.js — typed Request, Response, body, params
Topic 15  : Advanced — keyof, typeof, Mapped Types, Conditional Types, Template Literal Types, Decorators
Topic 16  : Type Assertions (as), Non-Null Assertion (!), Optional Chaining (?.)
Topic 17  : Quick Reference Cheat Sheet

---------------------------------------------------------------------------------------------------------
@@ What's Next
---------------------------------------------------------------------------------------------------------
=> Next Step 1 : Focused Questions File  (most-asked TypeScript interview questions)
=> Next Step 2 : Full Coverage File      (all topics + tricky output questions)
=> Format      : Same as JavaScript.md and JavascriptExtra.md files
*/