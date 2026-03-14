

# JavaScript & Node.js Interview Q&A — Entry Level MERN Stack

---

## Topic 1 : JavaScript Engine & V8

---

**1. What is JavaScript Engine and how does it work?**

Answer:
JavaScript Engine is a program that converts JavaScript code into machine code so the computer can understand and execute it. Every browser has its own JS engine — Chrome and Node.js use **V8** (written in C++), Firefox uses **SpiderMonkey**, Safari uses **JavaScriptCore**. The engine has two main components — **Call Stack** where code actually executes and **Heap Memory** where objects, arrays and functions are stored in memory. When we write JS code the engine first parses it into AST (Abstract Syntax Tree), then compiles it using JIT compilation into machine code, and then executes it.

```
JS Code → Parser → AST → JIT Compiler → Machine Code → Execution
```

Note:
- Key Point: V8 is written in C++, uses JIT compilation (not pure interpretation), has two components Call Stack and Heap Memory. Node.js also uses V8 that is why JS runs outside browser.
- Why Interviewer Asks: They want to know if you understand what happens behind the scenes when JavaScript runs. This shows you are not just a syntax-level developer.

---

**2. What is JIT Compilation? Is JavaScript interpreted or compiled?**

Answer:
JavaScript is neither purely interpreted nor purely compiled — it uses **JIT (Just-In-Time) Compilation** which is a mix of both. In old days JS was purely interpreted means it reads code line by line and executes but that was slow. Modern engines like V8 use JIT where the code is first quickly compiled into machine code right before execution and the engine also optimizes frequently used code (hot code) for better performance. So first time it compiles quickly and as code runs repeatedly the engine recompiles it with optimizations.

Note:
- Key Point: JIT = Interpretation + Compilation combined. V8 has two compilers — **Ignition** (quick bytecode) and **TurboFan** (optimized machine code for hot functions).
- Why Interviewer Asks: Common trick question. Many candidates say "JS is interpreted" which is outdated. Saying JIT shows updated knowledge.

---

**3. What is the difference between Call Stack and Heap Memory?**

Answer:
**Call Stack** is a data structure that keeps track of function calls and execution. It works on LIFO (Last In First Out) principle. When a function is called its execution context is pushed to the top of stack and when function finishes it is popped off. Call Stack stores **primitive values** (numbers, strings, booleans) and **references** to objects.

**Heap Memory** is an unstructured memory pool where **objects, arrays and functions** are stored. When we create an object in JS it is stored in heap and the variable in call stack holds only the reference (memory address) pointing to that object in heap.

```javascript
let name = "Deep";     // "Deep" stored in Call Stack (primitive)
let user = {age: 23};  // {age:23} stored in Heap, reference in Call Stack
```

Note:
- Key Point: Call Stack = ordered, LIFO, primitives and references. Heap = unordered, objects and arrays. This is why when you copy an object you get reference not actual copy (shallow copy concept).
- Why Interviewer Asks: This connects to shallow vs deep copy, pass by value vs reference, and memory management — all important topics.

---

## Topic 2 : Execution Context & Call Stack

---

**4. What is Execution Context? Explain its types.**

Answer:
Execution Context is the environment where JavaScript code is evaluated and executed. Think of it as a box that holds all the information needed to run a piece of code — variables, functions, scope and `this` value.

There are two types:

**Global Execution Context (GEC)** — Created only once when script loads. All code that is not inside any function runs here. It creates the global object (`window` in browser, `global` in Node.js) and sets `this` to that global object.

**Function Execution Context (FEC)** — Created every time a function is called. Each function gets its own execution context with its own variables and scope. When function finishes its context is destroyed.

Note:
- Key Point: GEC is created once, FEC is created every time function is called. There is also Eval Execution Context but it is rarely used and not asked.
- Why Interviewer Asks: This is the foundation for understanding hoisting, scope chain, closures. If you explain this well everything else becomes easier to explain.

---

**5. What are the two phases of Execution Context?**

Answer:
Every Execution Context goes through two phases:

**1. Creation Phase (Memory Phase):**
- All variables declared with `var` are stored in memory with value `undefined` (this is hoisting)
- `let` and `const` are stored but in **Temporal Dead Zone** — they exist but cannot be accessed
- All function declarations are stored completely in memory (that is why we can call functions before declaration)
- Lexical environment and scope chain are created
- `this` keyword value is determined

**2. Execution Phase (Code Phase):**
- Code runs line by line from top to bottom
- Variables get their actual assigned values
- Function calls create new Function Execution Contexts
- Expressions are evaluated

```javascript
console.log(name);    // undefined (Creation Phase stored it as undefined)
console.log(greet()); // "Hello" (function stored completely in creation phase)

var name = "Deep";    // Execution Phase: name = "Deep"
function greet() {    // Already stored in creation phase
    return "Hello";
}
```

Note:
- Key Point: Creation Phase = memory allocation + hoisting happens here. Execution Phase = actual code runs line by line. This two-phase concept explains why hoisting works.
- Why Interviewer Asks: Directly leads to hoisting questions. If you explain phases first then hoisting answer becomes very strong.

---

**6. How does Call Stack work? Explain with example.**

Answer:
Call Stack is a data structure that uses LIFO (Last In First Out) to manage execution contexts. When JS script starts the **Global Execution Context** is pushed onto the stack first. When a function is called a new **Function Execution Context** is created and pushed on top. When that function finishes it is popped off. If there is a function inside a function then another context is pushed on top. The stack keeps growing and shrinking like this until all code is done and GEC is also popped off.

```javascript
function first() {
    console.log("First");
    second();
    console.log("First End");
}
function second() {
    console.log("Second");
}
first();

// Call Stack Flow:
// 1. [GEC] pushed
// 2. [first() FEC] pushed on top of GEC
// 3. "First" printed
// 4. [second() FEC] pushed on top of first()
// 5. "Second" printed
// 6. second() finished → popped off
// 7. "First End" printed
// 8. first() finished → popped off
// 9. GEC finished → popped off → Stack Empty
```

Note:
- Key Point: LIFO principle. GEC always at bottom. Inner function finishes first then outer. This is why JS is single-threaded — only one thing executes at a time in one call stack.
- Why Interviewer Asks: Call Stack is core of JS execution. It directly connects to recursion (stack overflow), event loop, and async behavior.

---

**7. What is Stack Overflow in JavaScript?**

Answer:
Stack Overflow happens when Call Stack exceeds its maximum size limit. This usually happens with **infinite recursion** — when a function keeps calling itself without any stopping condition (base case). Each call creates a new execution context and pushes it to the stack. Since stack has limited memory it eventually runs out and throws `RangeError: Maximum call stack size exceeded`.

```javascript
function infinite() {
    infinite(); // keeps calling itself, no base case
}
infinite(); // RangeError: Maximum call stack size exceeded
```

Note:
- Key Point: Always have a base case in recursion. Stack has limited size (around 10,000-15,000 frames depending on browser/environment).
- Why Interviewer Asks: Tests if you understand recursion properly and the consequences of bad code.

---

## Topic 3 : Hoisting & Temporal Dead Zone

---

**8. What is Hoisting in JavaScript?**

Answer:
Hoisting is JavaScript's default behavior of moving declarations to the top of their scope during the **Creation Phase** of execution context. It does not physically move code — it means during creation phase the engine allocates memory for variables and functions before code executes.

**`var`** — hoisted and initialized with `undefined`
**`let` and `const`** — hoisted but NOT initialized (they go into Temporal Dead Zone)
**Function declarations** — hoisted completely with their body
**Function expressions and arrow functions** — treated as variables so they follow var/let/const hoisting rules

```javascript
console.log(a);       // undefined (var is hoisted with undefined)
console.log(b);       // ReferenceError (let is in TDZ)
console.log(greet()); // "Hello" (function declaration fully hoisted)
console.log(add(2,3));// TypeError: add is not a function (var hoisted as undefined)

var a = 10;
let b = 20;
function greet() { return "Hello"; }
var add = function(x,y) { return x+y; }
```

Note:
- Key Point: var = undefined, let/const = TDZ error, function declaration = fully hoisted, function expression = follows variable rule. Hoisting happens in Creation Phase.
- Why Interviewer Asks: One of the most asked JS questions. They will give you code and ask "what is the output?" — 90% of the time it is a hoisting question.

---

**9. What is Temporal Dead Zone (TDZ)?**

Answer:
Temporal Dead Zone is the time between when a `let` or `const` variable is hoisted and when it is actually declared with a value in the code. During this zone the variable exists in memory but you cannot access it. If you try to access it you get `ReferenceError: Cannot access 'variable' before initialization`.

TDZ starts from the beginning of the block scope and ends when the variable declaration line is reached during execution.

```javascript
{
    // TDZ for 'name' starts here
    console.log(name); // ReferenceError: Cannot access 'name' before initialization
    let name = "Deep"; // TDZ ends here
    console.log(name); // "Deep" — works fine now
}
```

Note:
- Key Point: TDZ exists only for let and const, not for var. TDZ is per-block scope. It was introduced in ES6 to catch bugs — using variables before declaration should be an error not silently return undefined.
- Why Interviewer Asks: Follow-up to hoisting question. Shows you understand the difference between var and let/const deeply.

---

**10. Predict the output — Hoisting question.**

```javascript
var x = 10;
function test() {
    console.log(x);  // ?
    var x = 20;
    console.log(x);  // ?
}
test();
```

Answer:
Output is `undefined` then `20`.

Inside the function `test()`, `var x = 20` is hoisted locally. So during creation phase of the function execution context, a local `x` is created with value `undefined`. When `console.log(x)` runs it finds local `x` (which is `undefined`) and does not go to global `x = 10`. Then `x = 20` is assigned and second console.log prints `20`.

```
// How engine sees it:
function test() {
    var x;            // hoisted locally, x = undefined
    console.log(x);   // undefined (local x, not global)
    x = 20;           // now x = 20
    console.log(x);   // 20
}
```

Note:
- Key Point: var hoisting creates a local copy inside function. The function has its own scope so it does not look at global x until local x is not found.
- Why Interviewer Asks: Classic trick question. Most candidates say 10 for first log. This tests your understanding of function scope + hoisting together.

---

## Topic 4 : Scope Chain & Lexical Environment

---

**11. What is Scope in JavaScript? What are the types?**

Answer:
Scope determines where variables and functions are accessible in the code. JavaScript has three types of scope:

**1. Global Scope** — Variables declared outside any function or block. Accessible everywhere in the code.

**2. Function Scope** — Variables declared inside a function using `var`, `let` or `const`. Accessible only inside that function.

**3. Block Scope** — Variables declared inside a block `{}` (if, for, while) using `let` or `const`. Accessible only inside that block. Note: `var` does NOT have block scope — it leaks out of blocks.

```javascript
var globalVar = "Global";          // Global Scope

function test() {
    var functionVar = "Function";  // Function Scope
    if (true) {
        let blockVar = "Block";    // Block Scope
        var notBlock = "I leak";   // NOT block scoped (var)
        console.log(globalVar);    // accessible
        console.log(functionVar);  // accessible
        console.log(blockVar);     // accessible
    }
    console.log(notBlock);         // accessible (var leaked)
    console.log(blockVar);         // ReferenceError (block scoped)
}
console.log(functionVar);          // ReferenceError (function scoped)
```

Note:
- Key Point: var = function scoped (leaks from blocks), let/const = block scoped. Global scope variables become properties of window object in browser.
- Why Interviewer Asks: Scope is fundamental. Every closure, callback, and async question depends on scope understanding.

---

**12. What is Lexical Environment and Scope Chain?**

Answer:
**Lexical Environment** is created for every execution context. It has two parts — (1) Environment Record that stores all local variables and function declarations, and (2) Reference to Outer Lexical Environment (parent scope).

**Scope Chain** is the chain of lexical environments. When JavaScript needs to find a variable it first looks in the current scope. If not found it goes to the outer scope, then outer's outer scope, and so on until it reaches the Global scope. If variable is not found even in Global scope it throws `ReferenceError`. This chain of looking outward is called Scope Chain.

```javascript
let a = "Global";

function outer() {
    let b = "Outer";
    
    function inner() {
        let c = "Inner";
        console.log(c);  // Found in current scope
        console.log(b);  // Not in current → found in outer scope
        console.log(a);  // Not in current → not in outer → found in global
    }
    inner();
}
outer();
// Scope Chain: inner → outer → global
```

Note:
- Key Point: Lexical means "where the code is written" not "where it is called". Scope chain always goes outward never inward. Inner function can access outer variables but outer cannot access inner variables.
- Why Interviewer Asks: Scope chain directly explains closures. If you understand this, closure explanation becomes easy.

---

## Topic 5 : `this` Keyword

---

**13. What is `this` keyword in JavaScript?**

Answer:
`this` keyword refers to the object that is currently executing the code. Its value depends on **how and where** the function is called, not where it is written.

- **In Global scope** — `this` refers to `window` object (browser) or `global` object (Node.js)
- **Inside a regular function** — `this` refers to `window` in non-strict mode, `undefined` in strict mode
- **Inside an object method** — `this` refers to the object that owns the method
- **Inside an arrow function** — `this` is inherited from the outer (parent) scope (lexical this)
- **With `new` keyword** — `this` refers to the newly created object
- **With `call/apply/bind`** — `this` is explicitly set to whatever object you pass

```javascript
const user = {
    name: "Deep",
    greet: function() {
        console.log(this.name);   // "Deep" — this = user object
    },
    greetArrow: () => {
        console.log(this.name);   // undefined — arrow inherits from global
    }
};
user.greet();
user.greetArrow();
```

Note:
- Key Point: Regular function `this` depends on who calls it. Arrow function `this` depends on where it is written (lexical). This is the most important difference.
- Why Interviewer Asks: `this` is one of the most confusing and most asked topics. They will give tricky code and ask what `this` refers to.

---

**14. Explain call(), apply() and bind() with example.**

Answer:
All three are used to explicitly set the value of `this` when calling a function.

**`call(object, arg1, arg2, ...)`** — Calls the function immediately with given `this` value and arguments passed one by one.

**`apply(object, [argsArray])`** — Same as call but arguments are passed as an array.

**`bind(object, arg1, arg2, ...)`** — Does NOT call the function immediately. Returns a new function with `this` permanently bound. You call it later.

```javascript
const dev = { name: "Deep", age: 23 };

function introduce(company, role) {
    console.log(`${this.name}, ${this.age}, works at ${company} as ${role}`);
}

// call — immediate, args one by one
introduce.call(dev, "Netclues", "MERN Developer");

// apply — immediate, args as array
introduce.apply(dev, ["Netclues", "MERN Developer"]);

// bind — returns new function, call later
const boundFn = introduce.bind(dev, "Netclues", "MERN Developer");
boundFn(); // called later
```

Note:
- Key Point: call = immediate + individual args. apply = immediate + array args. bind = not immediate + returns new function. Remember: **C**all = **C**omma separated, **A**pply = **A**rray.
- Why Interviewer Asks: Very frequently asked. They want to see if you know how to control `this`. Also tests understanding of function borrowing pattern.

---

## Topic 6 : Variables & Data Types

---

**15. What is the difference between var, let and const?**

Answer:

| Feature | `var` | `let` | `const` |
|---------|-------|-------|---------|
| Scope | Function scoped | Block scoped | Block scoped |
| Hoisting | Hoisted with `undefined` | Hoisted but in TDZ | Hoisted but in TDZ |
| Re-declaration | Allowed | Not allowed in same scope | Not allowed |
| Re-assignment | Allowed | Allowed | Not allowed |
| Global object | Becomes `window` property | Does not | Does not |

```javascript
var a = 10;   // function scoped, can redeclare and reassign
let b = 20;   // block scoped, can reassign, cannot redeclare
const c = 30; // block scoped, cannot reassign or redeclare

const obj = { name: "Deep" };
obj.name = "Dev"; // This works! const prevents reassignment of variable, not mutation of object
```

Note:
- Key Point: const does not mean immutable — you can change properties of const object/array, you just cannot reassign the variable itself. Use const by default, let when you need to reassign, avoid var.
- Why Interviewer Asks: Basic but very commonly asked first question. They want to check if you know scope and hoisting differences. The const object mutation point is a bonus.

---

**16. What are Data Types in JavaScript?**

Answer:
JavaScript has two categories of data types:

**Primitive (7 types)** — stored in Call Stack, immutable, passed by value:
1. `String` — textual data `"Deep"`
2. `Number` — integers and floats `23, 3.14`
3. `BigInt` — large integers `900719925124740n`
4. `Boolean` — `true` or `false`
5. `undefined` — declared but not assigned
6. `null` — intentional empty value
7. `Symbol` — unique identifier (ES6)

**Non-Primitive (Reference types)** — stored in Heap, passed by reference:
1. `Object` — key-value pairs `{name: "Deep"}`
2. `Array` — ordered list `[1, 2, 3]`
3. `Function` — block of reusable code

```javascript
console.log(typeof "Deep");      // "string"
console.log(typeof 23);          // "number"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" ← JS bug since day 1
console.log(typeof [1,2]);       // "object" ← use Array.isArray()
console.log(typeof function(){}); // "function"
```

Note:
- Key Point: typeof null returns "object" — this is a known bug in JS since 1995 and cannot be fixed for backward compatibility. To check array use Array.isArray(). Primitives are immutable and passed by value, objects are mutable and passed by reference.
- Why Interviewer Asks: Fundamental question. The typeof null trap and pass by value vs reference are bonus points.

---

**17. What is the difference between null and undefined?**

Answer:
**`undefined`** means a variable has been declared but has not been assigned any value yet. JavaScript automatically assigns undefined. It is the default value.

**`null`** means intentional absence of any value. The developer explicitly assigns null to indicate "this variable has no value on purpose".

```javascript
let a;
console.log(a);          // undefined — JS assigned it
let b = null;
console.log(b);          // null — developer assigned it

console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" (JS bug)

console.log(null == undefined);  // true (loose equality)
console.log(null === undefined); // false (strict equality, different types)
```

Note:
- Key Point: undefined = JS assigns automatically, null = developer assigns intentionally. Both are falsy values. null == undefined is true but null === undefined is false.
- Why Interviewer Asks: Very common question. They want to hear "automatic vs intentional" and the typeof null bug.

---

## Topic 7 : Type Conversion & Coercion

---

**18. What is the difference between Type Conversion and Type Coercion?**

Answer:
**Type Conversion (Explicit)** — When the developer manually converts one data type to another using built-in functions like `String()`, `Number()`, `Boolean()`, `parseInt()`, `toString()`.

**Type Coercion (Implicit)** — When JavaScript automatically converts data types behind the scenes during operations. This happens with operators like `+`, `-`, `==`, etc.

```javascript
// Explicit Conversion (developer does it)
let num = Number("23");       // string to number → 23
let str = String(23);         // number to string → "23"
let bool = Boolean(0);        // number to boolean → false

// Implicit Coercion (JS does it automatically)
console.log("5" + 3);         // "53" — number coerced to string (+ concatenates)
console.log("5" - 3);         // 2 — string coerced to number (- is math only)
console.log(true + 1);        // 2 — true coerced to 1
console.log("5" == 5);        // true — string coerced to number for comparison
```

Note:
- Key Point: `+` with string does concatenation, `-` `*` `/` always do math. This is the most confusing part of coercion. parseInt("26abc") gives 26 but Number("26abc") gives NaN.
- Why Interviewer Asks: They give tricky expressions like `"5" + 3` or `[] + {}` and ask output. Understanding coercion rules helps answer these.

---

**19. What are Falsy and Truthy values in JavaScript?**

Answer:
When a value is used in a boolean context (like if condition), JavaScript converts it to true or false.

**Falsy values (only 8):** These convert to `false`:
`false`, `0`, `-0`, `0n` (BigInt zero), `""` (empty string), `null`, `undefined`, `NaN`

**Truthy values:** Everything else is truthy including:
`"0"` (string zero), `" "` (space string), `[]` (empty array), `{}` (empty object), `function(){}`

```javascript
if ("") console.log("truthy");    // won't print — empty string is falsy
if ("0") console.log("truthy");   // prints — "0" is a non-empty string, truthy
if ([]) console.log("truthy");    // prints — empty array is truthy
if (0) console.log("truthy");     // won't print — 0 is falsy
```

Note:
- Key Point: Memorize all 8 falsy values. Common trap: empty array `[]` and empty object `{}` are TRUTHY not falsy. `"0"` and `" "` are also truthy because they are non-empty strings.
- Why Interviewer Asks: They ask "is empty array truthy or falsy?" — most candidates get it wrong. Also important for writing clean if conditions.

---

## Topic 8 : == vs === & Comparisons

---

**20. What is the difference between == and ===?**

Answer:
**`==` (Loose Equality / Abstract Equality)** — Compares only values. If types are different it performs **type coercion** first and then compares.

**`=== `(Strict Equality)** — Compares both value AND type. No type coercion happens. If types are different it immediately returns false.

```javascript
console.log(5 == "5");     // true — string "5" coerced to number 5, then compared
console.log(5 === "5");    // false — number vs string, different types

console.log(null == undefined);   // true — special rule in JS
console.log(null === undefined);  // false — null is object, undefined is undefined

console.log(0 == false);   // true — false coerced to 0
console.log(0 === false);  // false — number vs boolean

console.log("" == false);  // true — both coerce to 0
console.log("" === false); // false — string vs boolean
```

Note:
- Key Point: Always use `===` in your code. `==` causes unexpected bugs due to coercion. Only exception: `value == null` checks for both null and undefined which is sometimes useful.
- Why Interviewer Asks: Extremely common question. They want to hear "type coercion" for == and "no coercion" for ===. Follow-up will be tricky comparison outputs.

---

## Topic 9 : Strings & String Methods

---

**21. What are the most important String methods in JavaScript?**

Answer:
Strings are immutable in JS — no method changes the original string, they always return a new string.

```javascript
let str = "  Hello World Deep  ";

// Length
str.length;                    // 20

// Access character
str.at(7);                     // "o"
str.charAt(7);                 // "o"
str[7];                        // "o"

// Case
str.toUpperCase();             // "  HELLO WORLD DEEP  "
str.toLowerCase();             // "  hello world deep  "

// Search
str.indexOf("World");          // 8 (first occurrence index)
str.includes("Deep");          // true (boolean)

// Extract
str.slice(8, 13);              // "World" (start, end — end not included)
str.substring(8, 13);          // "World" (similar but no negative index)

// Modify
str.trim();                    // "Hello World Deep" (removes whitespace)
str.replace("World", "JS");   // "  Hello JS Deep  " (first match only)
str.replaceAll("l", "L");     // replaces all occurrences

// Split & Join
str.trim().split(" ");         // ["Hello", "World", "Deep"]
["a","b","c"].join("-");       // "a-b-c"

// ASCII
"A".charCodeAt(0);             // 65
String.fromCharCode(65);       // "A"
```

Note:
- Key Point: Strings are immutable — methods return new string, original stays same. slice vs substring — slice supports negative indexes, substring swaps arguments if start > end. split converts string to array, join converts array to string.
- Why Interviewer Asks: Practical question to check if you have worked with strings. They may ask you to reverse a string, check palindrome, or count characters.

---

## Topic 10 : Arrays & Array Methods

---

**22. What is the difference between map(), filter() and reduce()?**

Answer:
All three are Higher Order Functions that iterate over an array but they do different things:

**`map()`** — Transforms each element and returns a **new array of same length**. Used when you want to modify every element.

**`filter()`** — Tests each element with a condition and returns a **new array with only elements that pass**. Array length may be shorter.

**`reduce()`** — Reduces entire array into a **single value** (sum, count, object, etc.) using an accumulator.

```javascript
const numbers = [1, 2, 3, 4, 5];

// map — transform each element
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10] — same length, each element doubled

// filter — keep only matching elements
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4] — shorter array, only even numbers

// reduce — single final value
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15 — one value, sum of all

// Chaining them together
const result = numbers
    .filter(n => n > 2)        // [3, 4, 5]
    .map(n => n * 10)          // [30, 40, 50]
    .reduce((acc, n) => acc + n, 0); // 120
```

Note:
- Key Point: map = same length new array, filter = shorter or same length new array, reduce = single value. None of them modify original array. You can chain them together. reduce is most powerful — can do what map and filter do.
- Why Interviewer Asks: Most asked array question. They want to see if you know when to use which. Bonus if you show chaining.

---

**23. What is the difference between find() and filter()?**

Answer:
**`filter()`** — Returns an **array of ALL elements** that match the condition. Even if only one matches it returns an array with one element. If none match it returns empty array `[]`.

**`find()`** — Returns only the **FIRST element** that matches the condition. Returns the element itself not an array. If none match it returns `undefined`.

```javascript
const devs = [
    { name: "Deep", age: 20 },
    { name: "Ketul", age: 27 },
    { name: "Neel", age: 22 },
];

// filter — returns array of ALL matches
const adults = devs.filter(d => d.age > 21);
// [{name:"Ketul",age:27}, {name:"Neel",age:22}]

// find — returns FIRST match only
const firstAdult = devs.find(d => d.age > 21);
// {name:"Ketul",age:27}
```

Note:
- Key Point: filter = array of all matches (or empty array). find = first match only (or undefined). Use find when you need just one result (like finding user by ID). Use filter when you need all matching results.
- Why Interviewer Asks: They want to check if you know the return type difference and when to use which practically.

---

**24. What is the difference between slice() and splice()?**

Answer:
**`slice(start, end)`** — Returns a new array from start to end (end not included). **Does NOT modify** original array. Used for copying parts of array.

**`splice(start, deleteCount, item1, item2, ...)`** — **Modifies original array**. Can remove, replace, or add elements. Returns array of removed elements.

```javascript
const arr = [1, 2, 3, 4, 5];

// slice — does NOT change original
const sliced = arr.slice(1, 4);    // [2, 3, 4]
console.log(arr);                   // [1, 2, 3, 4, 5] — unchanged

// splice — CHANGES original
const removed = arr.splice(1, 2, 20, 30); // start at 1, remove 2, add 20,30
console.log(removed);               // [2, 3] — removed elements
console.log(arr);                    // [1, 20, 30, 4, 5] — modified!
```

Note:
- Key Point: slice = non-destructive (safe), splice = destructive (modifies original). Remember: sli**c**e = **c**opy, spli**c**e = **c**hange.
- Why Interviewer Asks: Very common confusion. They want to hear "slice does not mutate, splice mutates" and understand the parameters.

---

**25. What is the difference between forEach() and map()?**

Answer:
**`forEach()`** — Iterates over each element and executes a callback. Returns `undefined`. Used when you want to perform side effects (like logging, updating DOM, making API calls) and do NOT need a new array.

**`map()`** — Iterates over each element, applies callback, and returns a **new array** with transformed elements. Used when you need a transformed copy.

```javascript
const numbers = [1, 2, 3];

// forEach — returns undefined, used for side effects
const result1 = numbers.forEach(n => console.log(n * 2)); // prints 2, 4, 6
console.log(result1); // undefined

// map — returns new array
const result2 = numbers.map(n => n * 2);
console.log(result2); // [2, 4, 6]
```

Note:
- Key Point: forEach returns undefined so you cannot chain. map returns new array so you can chain with filter, reduce etc. If you need a new array use map, if you just want to loop use forEach.
- Why Interviewer Asks: Tests practical understanding. Many beginners use map everywhere even when they do not need the returned array.

---

**26. How does sort() work in JavaScript?**

Answer:
`sort()` **modifies the original array** and sorts elements. By default it converts elements to strings and sorts by Unicode/alphabetical order — which gives wrong results for numbers.

To sort numbers correctly you must pass a comparison function:
- Return negative → `a` comes first
- Return 0 → no change
- Return positive → `b` comes first

```javascript
// Default sort — alphabetical (wrong for numbers)
[40, 100, 1, 5, 25].sort();          // [1, 100, 25, 40, 5] — WRONG!

// Ascending — a - b
[40, 100, 1, 5, 25].sort((a,b) => a - b);  // [1, 5, 25, 40, 100]

// Descending — b - a
[40, 100, 1, 5, 25].sort((a,b) => b - a);  // [100, 40, 25, 5, 1]

// Sort objects by property
const devs = [
    { name: "Deep", age: 20 },
    { name: "Ketul", age: 27 },
    { name: "Neel", age: 22 },
];
devs.sort((a, b) => a.age - b.age); // sorts by age ascending
```

Note:
- Key Point: sort() mutates original array. Default sort is alphabetical not numerical. Always pass comparison function for numbers. a-b = ascending, b-a = descending.
- Why Interviewer Asks: Common trap — "sort [40,100,1,5,25] what is output?" Most say [1,5,25,40,100] but default sort gives wrong result.

---

**27. What are push, pop, shift, unshift? What is flat()?**

Answer:

| Method | What it does | Modifies Original | Returns |
|--------|-------------|:-:|---------|
| `push(val)` | Adds to **end** | Yes | New length |
| `pop()` | Removes from **end** | Yes | Removed element |
| `unshift(val)` | Adds to **beginning** | Yes | New length |
| `shift()` | Removes from **beginning** | Yes | Removed element |

**`flat(depth)`** — Flattens a multi-dimensional array into a single array. Default depth is 1. Use `Infinity` to flatten all levels.

```javascript
let arr = [1, 2, 3];
arr.push(4);      // [1,2,3,4] — added at end
arr.pop();        // [1,2,3] — removed from end, returns 4
arr.unshift(0);   // [0,1,2,3] — added at beginning
arr.shift();      // [1,2,3] — removed from beginning, returns 0

// flat
let multi = [[1,2], [3,[4,5]]];
multi.flat();          // [1, 2, 3, [4, 5]] — depth 1
multi.flat(Infinity);  // [1, 2, 3, 4, 5] — all levels
```

Note:
- Key Point: push/pop work on end (faster), shift/unshift work on beginning (slower because all indexes need to shift). flat() creates a new array does not modify original.
- Why Interviewer Asks: Basic but they check if you know the return values and which end they operate on.

---

## Topic 11 : Objects & Object Methods

---

**28. What are the important Object methods in JavaScript?**

Answer:

```javascript
const dev = { name: "Deep", age: 23, role: "MERN Developer" };

// Object.keys() — array of keys
Object.keys(dev);      // ["name", "age", "role"]

// Object.values() — array of values
Object.values(dev);    // ["Deep", 23, "MERN Developer"]

// Object.entries() — array of [key, value] pairs
Object.entries(dev);   // [["name","Deep"], ["age",23], ["role","MERN Developer"]]

// Object.assign(target, source) — merge objects (shallow copy)
const copy = Object.assign({}, dev);

// Object.hasOwn(obj, prop) — check if property exists
Object.hasOwn(dev, "name");  // true

// Object.freeze(obj) — cannot add, delete, or modify properties
Object.freeze(dev);
dev.age = 25; // silently fails (or error in strict mode)

// Object.is(val1, val2) — strict comparison
Object.is(NaN, NaN);   // true (unlike ===)

// JSON.stringify(obj) — object to JSON string
JSON.stringify(dev);    // '{"name":"Deep","age":23,"role":"MERN Developer"}'

// JSON.parse(string) — JSON string to object
JSON.parse('{"name":"Deep"}');  // {name: "Deep"}
```

Note:
- Key Point: Object.freeze makes object immutable (shallow only). Object.assign does shallow copy not deep copy. JSON.stringify + JSON.parse is one way to deep clone (but loses functions and dates).
- Why Interviewer Asks: Practical knowledge question. Object.freeze vs const is a common follow-up — const prevents reassignment, freeze prevents mutation.

---

**29. What are Getters and Setters in JavaScript?**

Answer:
Getters and Setters are special methods that allow you to define how a property is accessed (get) and modified (set). They look like properties from outside but internally they run a function.

**`get`** — runs when you read the property (no parentheses needed)
**`set`** — runs when you assign a value to the property

```javascript
const dev = {
    firstName: "Deep",
    lastName: "Patel",
    startYear: 2000,
    endYear: 2010,
    
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    },
    
    get experience() {
        return this.endYear - this.startYear;
    },
    
    set experience(years) {
        this.endYear = this.startYear + years;
    }
};

// Using getter — looks like property access
console.log(dev.fullName);     // "Deep Patel"
console.log(dev.experience);   // 10

// Using setter — looks like assignment
dev.experience = 15;
console.log(dev.endYear);      // 2015
```

Note:
- Key Point: Getters allow computed properties without calling function with parentheses. Setters add validation logic when setting values. They make code cleaner and more readable.
- Why Interviewer Asks: Tests OOP understanding in JS. Shows you know more than basic object syntax.

---

## Topic 12 : Functions

---

**30. What is the difference between Function Declaration, Expression and Arrow Function?**

Answer:

**Function Declaration** — defined with `function` keyword followed by name. **Hoisted** completely so you can call it before declaration.

**Function Expression** — function assigned to a variable. **Not hoisted** (variable is hoisted but as undefined).

**Arrow Function** — shorter syntax with `=>`. **Not hoisted**. Does NOT have its own `this` (inherits from parent). Cannot be used as constructor.

```javascript
// Function Declaration — HOISTED
console.log(greet());  // "Hello" — works before declaration
function greet() { return "Hello"; }

// Function Expression — NOT hoisted
console.log(add(2,3)); // TypeError: add is not a function
var add = function(a, b) { return a + b; };

// Arrow Function — NOT hoisted
const multiply = (a, b) => a * b;
// Single param: no parens needed
const square = n => n * n;
// Multi-line: need curly braces and return
const calculate = (a, b) => {
    let sum = a + b;
    return sum;
};
```

Note:
- Key Point: Declaration = hoisted. Expression = not hoisted. Arrow = not hoisted + no own `this` + no `arguments` object + cannot use as constructor with `new`. Arrow functions are best for callbacks and short functions.
- Why Interviewer Asks: Very common question. The `this` binding difference between regular and arrow function is the most important point.

---

**31. What is IIFE (Immediately Invoked Function Expression)?**

Answer:
IIFE is a function that runs immediately after it is defined. It is wrapped in parentheses and called immediately with `()`. It creates its own scope so variables inside do not pollute the global scope.

```javascript
// IIFE syntax
(function() {
    let secret = "hidden";
    console.log("IIFE runs immediately!");
    console.log(secret); // "hidden"
})();

console.log(secret); // ReferenceError — not accessible outside

// Arrow function IIFE
(() => {
    console.log("Arrow IIFE!");
})();

// IIFE with parameters
(function(name) {
    console.log(`Hello ${name}`);
})("Deep");
```

Note:
- Key Point: IIFE avoids global scope pollution. Was heavily used before ES6 modules. Still useful for one-time initialization code. The wrapping parentheses tell JS parser this is an expression not a declaration.
- Why Interviewer Asks: Tests advanced function knowledge. Sometimes follow-up: "why were IIFEs used?" Answer: before let/const and modules, IIFE was the only way to create private scope.

---

**32. What are Higher Order Functions?**

Answer:
A Higher Order Function is a function that either (1) takes one or more functions as arguments, or (2) returns a function as its result, or both.

In JavaScript `map`, `filter`, `reduce`, `forEach`, `sort`, `find` are all higher order functions because they take a callback function as argument.

```javascript
// Takes function as argument
function greet(formatFn, name) {
    console.log(formatFn(name));
}
greet(name => name.toUpperCase(), "Deep"); // "DEEP"

// Returns a function
function multiplier(factor) {
    return function(number) {
        return number * factor;
    };
}
const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5));  // 10
console.log(triple(5));  // 15

// Built-in HOFs
[1,2,3].map(n => n * 2);      // map takes callback
[1,2,3].filter(n => n > 1);   // filter takes callback
```

Note:
- Key Point: HOFs enable functional programming in JS. map, filter, reduce are the most used HOFs. The multiplier example above also demonstrates closures — inner function remembers `factor` from outer function.
- Why Interviewer Asks: Tests understanding of functional programming concepts. Good segue into closures question.

---

## Topic 13 : Callbacks & Callback Hell

---

**33. What is a Callback Function?**

Answer:
A callback function is a function that is passed as an argument to another function and is executed inside that function at some point. Callbacks are the foundation of asynchronous JavaScript — they let us say "when this task is done, then run this function."

```javascript
// Synchronous callback
function processUser(name, callback) {
    console.log(`Processing ${name}`);
    callback(name);
}
processUser("Deep", function(name) {
    console.log(`${name} processed successfully`);
});

// Asynchronous callback
console.log("Start");
setTimeout(function() {
    console.log("Timer done");  // runs after 2 seconds
}, 2000);
console.log("End");
// Output: Start → End → Timer done
```

Note:
- Key Point: Callbacks can be synchronous (forEach, map) or asynchronous (setTimeout, API calls). The callback is not executed immediately — it is called when the operation completes.
- Why Interviewer Asks: Foundation for understanding async JS, promises, and async/await. They want to see if you understand the concept before moving to promises.

---

**34. What is Callback Hell? How do you solve it?**

Answer:
Callback Hell (also called Pyramid of Doom) happens when you have multiple nested callbacks inside each other. The code goes deeper and deeper to the right forming a pyramid shape. It is hard to read, debug, and maintain.

```javascript
// Callback Hell — nested and ugly
getData(function(a) {
    getMoreData(a, function(b) {
        getEvenMoreData(b, function(c) {
            getFinalData(c, function(d) {
                console.log(d);
                // keeps nesting deeper...
            });
        });
    });
});
```

**Solutions:**
1. **Promises** — chain with `.then()` instead of nesting
2. **Async/Await** — write async code that looks synchronous
3. **Modularization** — break callbacks into named functions

```javascript
// Solution 1: Promises
getData()
    .then(a => getMoreData(a))
    .then(b => getEvenMoreData(b))
    .then(c => console.log(c))
    .catch(err => console.log(err));

// Solution 2: Async/Await (best)
async function fetchAll() {
    try {
        const a = await getData();
        const b = await getMoreData(a);
        const c = await getEvenMoreData(b);
        console.log(c);
    } catch(err) {
        console.log(err);
    }
}
```

Note:
- Key Point: Callback hell makes code unreadable and hard to debug. Promises flatten the nesting with chaining. Async/await makes it look like synchronous code which is cleanest. In real projects always use async/await.
- Why Interviewer Asks: They want to know if you understand WHY promises and async/await were introduced. This shows evolution of async JS.

---

## Topic 14 : Closures

---

**35. What is a Closure in JavaScript?**

Answer:
A Closure is when an inner function remembers and has access to the variables of its outer function even after the outer function has finished executing. The inner function "closes over" the outer function's variables.

This works because of **lexical scoping** — functions remember the scope where they were created, not where they are called.

```javascript
function outer() {
    let count = 0;  // outer function variable
    
    function inner() {
        count++;
        console.log(count);
    }
    
    return inner;  // return the inner function
}

const counter = outer();  // outer() finished executing
counter(); // 1 — inner still remembers count!
counter(); // 2 — count persists because of closure
counter(); // 3

// Practical Example: Private variable (data hiding)
function createBankAccount(initialBalance) {
    let balance = initialBalance; // private — cannot access directly
    
    return {
        deposit(amount) { balance += amount; },
        withdraw(amount) { balance -= amount; },
        getBalance() { return balance; }
    };
}

const account = createBankAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
console.log(account.balance);      // undefined — truly private!
```

Note:
- Key Point: Closure = function + its lexical environment. Used for data privacy/encapsulation, function factories, and maintaining state. The variable is not copied — the inner function keeps a reference to the actual variable.
- Why Interviewer Asks: One of the top 3 most asked JS questions. They may ask definition, then a tricky code output, then practical uses. The bank account example shows real-world use.

---

**36. Classic Closure trap — setTimeout in loop.**

```javascript
// What is the output?
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
```

Answer:
Output is `3, 3, 3` — NOT `0, 1, 2`.

Because `var` is function scoped not block scoped, there is only ONE `i` variable shared by all three setTimeout callbacks. By the time setTimeout callbacks execute (after 1 second), the for loop has already finished and `i` is 3.

**Fix 1: Use `let`** (creates new block scoped variable for each iteration)
```javascript
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 1000);
}
// Output: 0, 1, 2
```

**Fix 2: Use IIFE** (creates closure with current value)
```javascript
for (var i = 0; i < 3; i++) {
    (function(j) {
        setTimeout(() => console.log(j), 1000);
    })(i);
}
// Output: 0, 1, 2
```

Note:
- Key Point: var has no block scope so all callbacks share same `i`. let creates new variable per iteration. This question tests closures + var vs let + setTimeout understanding all at once.
- Why Interviewer Asks: One of the most famous JS interview questions. If you answer this correctly and explain why, interviewer knows you understand closures deeply.

---

## Topic 15 : Rest, Spread & Destructuring

---

**37. What is Rest Parameter and Spread Syntax?**

Answer:
They both use `...` syntax but do opposite things:

**Rest Parameter (`...args` in function parameter)** — Collects multiple arguments into a single array. Used in function definition. Must be the last parameter.

**Spread Syntax (`...array` in function call or array/object literal)** — Expands an array or object into individual elements. Used when calling functions or creating new arrays/objects.

```javascript
// REST — collects into array (in function parameter)
function sum(...numbers) {  // numbers = [1, 2, 3, 4, 5]
    return numbers.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// Rest with other params (must be last)
function info(name, ...courses) {
    console.log(`${name} studies: ${courses.join(", ")}`);
}
info("Deep", "JS", "React", "Node"); // Deep studies: JS, React, Node

// SPREAD — expands from array (in function call)
const nums = [3, 7, 1, 9, 4];
console.log(Math.max(...nums));  // 9 — spreads array as individual args

// Spread to merge arrays
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4]

// Spread to copy/merge objects
const obj1 = { name: "Deep" };
const obj2 = { age: 23 };
const combined = { ...obj1, ...obj2 }; // { name: "Deep", age: 23 }
```

Note:
- Key Point: Rest = gathering (many → one array). Spread = spreading (one array → many). Rest is in function parameters, Spread is in function calls and literals. Easy way to remember: Rest **r**eceives, Spread **s**ends.
- Why Interviewer Asks: ES6 feature commonly used in React (props spreading). They want to see if you know the difference and can use both.

---

**38. What is Destructuring in JavaScript?**

Answer:
Destructuring is a way to extract values from arrays or properties from objects and assign them to variables in a clean, short syntax.

```javascript
// Object Destructuring
const dev = { name: "Deep", age: 23, role: "MERN Developer" };

const { name, age, role } = dev;
console.log(name); // "Deep"

// Rename while destructuring
const { name: devName, age: devAge } = dev;
console.log(devName); // "Deep"

// Default values
const { salary = 5000 } = dev;
console.log(salary); // 5000 (dev has no salary, so default is used)

// Array Destructuring
const colors = ["red", "green", "blue"];
const [first, second, third] = colors;
console.log(first); // "red"

// Skip elements
const [, , last] = colors;
console.log(last); // "blue"

// Destructuring in function parameters
function greet({ name, age }) {
    console.log(`${name} is ${age}`);
}
greet(dev); // "Deep is 23"

// Nested Destructuring
const company = { info: { companyName: "Netclues", city: "Surat" } };
const { info: { companyName } } = company;
console.log(companyName); // "Netclues"
```

Note:
- Key Point: Object destructuring uses `{}` and matches by property name. Array destructuring uses `[]` and matches by position. Very heavily used in React (props destructuring, useState). You can set defaults, rename, skip, and nest.
- Why Interviewer Asks: Used everywhere in modern JS and React. They may ask you to destructure something on the spot or ask what output destructured code gives.

---

## Topic 16 : Shallow Copy vs Deep Copy

---

**39. What is the difference between Shallow Copy and Deep Copy?**

Answer:
When you copy an object or array:

**Shallow Copy** — Creates a new object but nested objects inside are still **references** to the original. Changing nested properties in copy affects the original.

**Deep Copy** — Creates a completely independent copy including all nested objects. Changing anything in copy does NOT affect original.

```javascript
const original = {
    name: "Deep",
    address: { city: "Surat", state: "Gujarat" }
};

// ---- SHALLOW COPY ----
const shallow = { ...original };        // or Object.assign({}, original)
shallow.name = "Dev";                    // does NOT affect original ✅
shallow.address.city = "Ahmedabad";      // AFFECTS original! ❌

console.log(original.address.city);      // "Ahmedabad" — changed!

// ---- DEEP COPY ----
// Method 1: JSON (simple but loses functions, dates, undefined)
const deep1 = JSON.parse(JSON.stringify(original));

// Method 2: structuredClone (modern, best approach)
const deep2 = structuredClone(original);

deep2.address.city = "Mumbai";
console.log(original.address.city);      // "Ahmedabad" — NOT affected ✅
```

**Shallow Copy Methods:** `Object.assign()`, Spread `{...obj}`, `Array.slice()`, `Array.from()`
**Deep Copy Methods:** `JSON.parse(JSON.stringify())`, `structuredClone()`, Lodash `_.cloneDeep()`

Note:
- Key Point: Shallow copy only copies first level. Nested objects are still references. Spread operator does SHALLOW copy not deep. JSON method loses functions, undefined, Dates, RegExp. structuredClone is the modern best way.
- Why Interviewer Asks: Very commonly asked. Many candidates think spread operator does deep copy — it does NOT. This question tests understanding of references in JS.

---

## Topic 17 : Promises

---

**40. What is a Promise in JavaScript?**

Answer:
A Promise is an object that represents the eventual completion or failure of an asynchronous operation. Instead of passing callbacks, you attach handlers using `.then()`, `.catch()`, and `.finally()`.

A Promise has three states:
1. **Pending** — initial state, operation not completed yet
2. **Fulfilled (Resolved)** — operation completed successfully, has a result value
3. **Rejected** — operation failed, has an error/reason

Once a promise is fulfilled or rejected it is **settled** — it cannot change state again.

```javascript
const myPromise = new Promise((resolve, reject) => {
    let success = true;
    
    if (success) {
        resolve("Operation successful!");  // → Fulfilled
    } else {
        reject("Something went wrong!");   // → Rejected
    }
});

myPromise
    .then(result => console.log(result))    // handles resolve
    .catch(error => console.log(error))     // handles reject
    .finally(() => console.log("Done"));    // always runs
```

Note:
- Key Point: Promise states — Pending → Fulfilled or Rejected (settled). resolve() changes state to fulfilled, reject() changes to rejected. then() handles success, catch() handles error, finally() always runs regardless of outcome.
- Why Interviewer Asks: Foundation of async JS. They want clear understanding of states and the then/catch/finally chain.

---

**41. What is Promise Chaining?**

Answer:
Promise chaining is when you connect multiple `.then()` calls one after another. Each `.then()` returns a new promise so you can chain another `.then()` to it. This avoids callback hell and makes async code flat and readable.

The value returned from one `.then()` becomes the input for the next `.then()`.

```javascript
fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(response => response.json())   // returns promise
    .then(data => {
        console.log(data.title);          // use the data
        return data.userId;               // pass to next then
    })
    .then(userId => {
        console.log(`User ID: ${userId}`);
        return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    })
    .then(response => response.json())
    .then(user => console.log(user.name))
    .catch(error => console.log(`Error: ${error}`))  // catches ANY error in chain
    .finally(() => console.log("All done"));
```

Note:
- Key Point: Each .then() returns a new promise enabling chaining. If any promise in the chain rejects, it skips all following .then() and goes directly to .catch(). One catch at the end handles all errors in the chain.
- Why Interviewer Asks: Tests if you understand how promises flow and how error handling works across the chain.

---

**42. Explain Promise.all(), Promise.allSettled(), Promise.race() and Promise.any().**

Answer:
All four take an array of promises and return a single promise:

**`Promise.all([p1, p2, p3])`**
- Waits for ALL promises to resolve
- Returns array of all resolved values
- If ANY ONE rejects — immediately rejects with that error (fail-fast)
- Use case: when ALL results are needed (load all data before rendering)

**`Promise.allSettled([p1, p2, p3])`**
- Waits for ALL promises to settle (resolve or reject)
- Returns array of objects `{status: "fulfilled/rejected", value/reason}`
- Never short-circuits, always gives all results
- Use case: when you want results of ALL regardless of failure

**`Promise.race([p1, p2, p3])`**
- Returns the FIRST promise that settles (fastest one — either resolved or rejected)
- Use case: timeout mechanism, fastest response wins

**`Promise.any([p1, p2, p3])`**
- Returns the FIRST promise that RESOLVES successfully
- Ignores rejections unless ALL reject
- If all reject: throws AggregateError
- Use case: fastest successful response (try multiple servers)

```javascript
const p1 = new Promise(resolve => setTimeout(() => resolve("P1"), 3000));
const p2 = new Promise(resolve => setTimeout(() => resolve("P2"), 1000));
const p3 = new Promise((_, reject) => setTimeout(() => reject("P3 Error"), 500));

// all — fails because p3 rejects
Promise.all([p1, p2, p3]).catch(e => console.log(e));        // "P3 Error"

// allSettled — gives all results
Promise.allSettled([p1, p2, p3]).then(r => console.log(r));
// [{status:"fulfilled",value:"P1"}, {status:"fulfilled",value:"P2"}, {status:"rejected",reason:"P3 Error"}]

// race — fastest (p3 at 500ms, even though rejected)
Promise.race([p1, p2, p3]).catch(e => console.log(e));       // "P3 Error"

// any — fastest SUCCESSFUL (p2 at 1000ms, skips rejected p3)
Promise.any([p1, p2, p3]).then(r => console.log(r));          // "P2"
```

Note:
- Key Point: all = all must succeed. allSettled = get all results regardless. race = fastest (success or failure). any = fastest success only. Remember: all is strict, allSettled is forgiving, race does not care about success/failure, any only wants success.
- Why Interviewer Asks: Very frequently asked. They want you to explain differences clearly. The "when to use which" practical answer is the bonus point.

---

## Topic 18 : Async/Await

---

**43. What is async/await? How is it different from Promises?**

Answer:
`async/await` is syntactic sugar built on top of Promises. It makes asynchronous code look and behave like synchronous code — easier to read and write.

**`async`** — written before function keyword. Makes the function return a promise automatically. Even if you return a plain value it wraps it in a resolved promise.

**`await`** — written before a promise. Pauses the execution of the async function until that promise resolves. Can ONLY be used inside an async function.

```javascript
// Using Promises (then chain)
function fetchDataPromise() {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
}

// Using async/await (cleaner and readable)
async function fetchDataAsync() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

fetchDataAsync();
```

| Feature | Promise (.then) | async/await |
|---------|----------------|-------------|
| Readability | Chain can get long | Looks synchronous, cleaner |
| Error Handling | .catch() | try...catch block |
| Debugging | Harder to step through | Easier, line by line |
| Underlying | Promise itself | Built on Promise |

Note:
- Key Point: async/await does NOT replace promises — it is built on top of them. await pauses only the async function, not the entire program. Error handling uses try/catch instead of .catch(). In real projects async/await is preferred over .then() chains.
- Why Interviewer Asks: Practical question. In MERN stack you use async/await daily for API calls, database queries, file operations. They want to know you can use it properly.

---

**44. How do you handle errors in async/await?**

Answer:
In async/await we use **try...catch...finally** block for error handling. The `try` block contains the code that might throw an error. If any `await` inside try rejects, execution jumps to `catch` block. `finally` runs regardless of success or failure.

```javascript
async function fetchUser(userId) {
    try {
        const response = await fetch(`https://api.example.com/users/${userId}`);
        
        // Check if response is ok (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        return data;
        
    } catch (error) {
        console.log(`Error caught: ${error.message}`);
        // You can also rethrow: throw error;
        
    } finally {
        console.log("Fetch attempt completed");
        // cleanup code — runs always
    }
}

fetchUser(1);
```

Note:
- Key Point: Always wrap await in try/catch in production code. Without try/catch a rejected promise in async function will cause an unhandled promise rejection. finally is good for cleanup (hide loading spinner, close connections).
- Why Interviewer Asks: Error handling is crucial in real applications. They want to know you do not just write happy-path code but handle failures too.

---

## Topic 19 : Event Loop, Microtask & Macrotask

---

**45. What is the Event Loop in JavaScript?**

Answer:
Event Loop is the mechanism that allows JavaScript to perform non-blocking asynchronous operations even though it is single-threaded. It continuously checks if the Call Stack is empty. If empty it picks tasks from the queues and pushes them to the Call Stack for execution.

**How it works:**

1. All synchronous code runs first in the Call Stack
2. Async operations (setTimeout, fetch, etc.) are sent to Web APIs / Node APIs
3. When async operation completes, its callback goes to a queue
4. Event Loop checks: "Is Call Stack empty?"
5. If yes → picks from **Microtask Queue** first (Promises, process.nextTick)
6. Then picks from **Macrotask Queue** (setTimeout, setInterval, I/O)
7. This cycle repeats forever

```
┌──────────────────────────────────────┐
│           Call Stack                  │
│   (Executes synchronous code)        │
└──────────────┬───────────────────────┘
               │ Empty?
               ▼
┌──────────────────────────────────────┐
│         Event Loop                    │
│   (Checks queues when stack empty)   │
└──────┬───────────────┬───────────────┘
       │               │
       ▼               ▼
┌─────────────┐ ┌──────────────┐
│ Microtask Q │ │ Macrotask Q  │
│ (Priority)  │ │ (After micro)│
│ - Promises  │ │ - setTimeout │
│ - nextTick  │ │ - setInterval│
│ - queueMicro│ │ - I/O, DOM   │
└─────────────┘ └──────────────┘
```

Note:
- Key Point: Call Stack must be completely empty before Event Loop picks anything from queues. Microtasks have priority over Macrotasks. Between each macrotask ALL microtasks are executed first. This is why a Promise.then() runs before setTimeout even if setTimeout has 0ms delay.
- Why Interviewer Asks: This is THE most important advanced JS question. If you can explain event loop clearly with microtask/macrotask priority, interviewer will be very impressed. Akshay Saini's Namaste JS has a famous video on this.

---

**46. What is the difference between Microtask and Macrotask?**

Answer:

**Microtasks (Higher Priority — run first):**
- `Promise.then()`, `.catch()`, `.finally()`
- `process.nextTick()` (Node.js — highest priority even among microtasks)
- `queueMicrotask()`
- `MutationObserver`
- `await` expression continuation

**Macrotasks (Lower Priority — run after all microtasks):**
- `setTimeout()`, `setInterval()`
- `setImmediate()` (Node.js)
- I/O operations (file read/write)
- DOM rendering
- `addEventListener` callbacks

**Key Rule:** After each macrotask, the engine executes ALL microtasks in the microtask queue before moving to the next macrotask.

```javascript
console.log("1");                           // Sync

setTimeout(() => console.log("2"), 0);       // Macrotask

Promise.resolve().then(() => console.log("3")); // Microtask

console.log("4");                           // Sync

// Output: 1 → 4 → 3 → 2
// Why: Sync first (1,4), then microtask (3), then macrotask (2)
```

Note:
- Key Point: Microtask queue is completely emptied before any macrotask runs. process.nextTick has higher priority than Promise.then in Node.js. This priority order is crucial for predicting output.
- Why Interviewer Asks: Follow-up to event loop question. They give code with mix of sync, promises, and setTimeout and ask output order. This is a top interview question.

---

**47. Predict the output — Event Loop question.**

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timeout 1");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise 1");
}).then(() => {
    console.log("Promise 2");
});

setTimeout(() => {
    console.log("Timeout 2");
}, 0);

console.log("End");
```

Answer:
```
Start
End
Promise 1
Promise 2
Timeout 1
Timeout 2
```

**Explanation step by step:**

1. `console.log("Start")` — synchronous → prints **Start**
2. `setTimeout Timeout 1` — macrotask → goes to Macrotask Queue
3. `Promise.resolve().then(Promise 1)` — microtask → goes to Microtask Queue
4. `.then(Promise 2)` — will be queued as microtask after Promise 1 resolves
5. `setTimeout Timeout 2` — macrotask → goes to Macrotask Queue
6. `console.log("End")` — synchronous → prints **End**
7. Call Stack empty → Event Loop checks Microtask Queue first
8. Prints **Promise 1** → .then(Promise 2) now queued as microtask
9. Prints **Promise 2** → Microtask Queue empty
10. Event Loop picks from Macrotask Queue → Prints **Timeout 1**
11. Prints **Timeout 2**

Note:
- Key Point: Synchronous code always first. Then all microtasks (Promises). Then macrotasks (setTimeout). Even setTimeout with 0ms delay runs AFTER promises because of priority.
- Why Interviewer Asks: Classic event loop question. Almost every MERN interview has some version of this. Practice predicting output of such code.

---

**48. What is process.nextTick() in Node.js?**

Answer:
`process.nextTick()` schedules a callback to run before any other I/O events or timers in the next iteration of the Event Loop. It has the **highest priority** among all async operations — even higher than Promises.

```javascript
console.log("Start");

setTimeout(() => console.log("setTimeout"), 0);

Promise.resolve().then(() => console.log("Promise"));

process.nextTick(() => console.log("nextTick"));

console.log("End");

// Output:
// Start
// End
// nextTick     ← highest async priority
// Promise      ← microtask, after nextTick
// setTimeout   ← macrotask, lowest priority
```

**Priority Order in Node.js:**
1. Synchronous code
2. `process.nextTick()` (nextTick queue)
3. `Promise.then()` (microtask queue)
4. `setTimeout/setInterval` (macrotask queue)
5. `setImmediate()` (check phase)

Note:
- Key Point: nextTick runs before everything else async. Be careful — too many nextTick calls can starve the event loop (block I/O operations from executing). In most cases use Promise.resolve().then() instead.
- Why Interviewer Asks: Node.js specific question. Shows deep understanding of Node.js event loop internals and priority system.

---

## Topic 20 : setTimeout & setInterval

---

**49. What is setTimeout and setInterval?**

Answer:
**`setTimeout(callback, delay)`** — Executes the callback function ONCE after the specified delay (in milliseconds).

**`setInterval(callback, delay)`** — Executes the callback function REPEATEDLY at every specified interval until cleared.

Both return an ID that can be used to cancel them.

```javascript
// setTimeout — runs once after 2 seconds
const timerId = setTimeout(() => {
    console.log("Runs after 2 seconds");
}, 2000);
clearTimeout(timerId); // cancel before it runs

// setInterval — runs every 1 second
let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log(`Count: ${count}`);
    if (count === 5) {
        clearInterval(intervalId); // stop after 5 times
    }
}, 1000);
```

Note:
- Key Point: setTimeout delay is not guaranteed exact — it is the MINIMUM delay. The callback goes to macrotask queue and waits until call stack is empty. clearTimeout and clearInterval are used to cancel. setInterval can cause issues if callback takes longer than interval.
- Why Interviewer Asks: Basic async concept. The "delay is minimum not exact" point is important. Follow-up question is usually "what does setTimeout with 0ms do?"

---

**50. What happens with setTimeout 0ms delay?**

Answer:
`setTimeout(() => {...}, 0)` does NOT execute immediately even though delay is 0. The callback is placed in the **Macrotask Queue** and will only execute after (1) all synchronous code finishes and (2) all microtasks (Promises) are completed.

It is used to defer execution to the next event loop cycle — basically saying "run this after everything currently queued is done."

```javascript
console.log("A");

setTimeout(() => console.log("B"), 0);  // 0ms but still deferred

Promise.resolve().then(() => console.log("C"));

console.log("D");

// Output: A → D → C → B
// Not: A → B → D → C
```

Note:
- Key Point: 0ms does not mean instant. It means "as soon as possible after current execution and microtasks." Minimum delay is actually around 4ms in browsers due to spec. This question directly tests event loop understanding.
- Why Interviewer Asks: Very popular trick question. Tests if you understand that setTimeout is macrotask and goes through event loop even with 0 delay.

---

## Topic 21 : Node.js Basics & Architecture

---

**51. What is Node.js?**

Answer:
Node.js is a **JavaScript runtime environment** built on Chrome's **V8 JavaScript engine** that lets you run JavaScript outside the browser — mainly for server-side development. It is written in C++ and uses an **event-driven, non-blocking I/O model** which makes it lightweight and efficient for building scalable network applications.

Key characteristics:
- **Single-threaded** but handles concurrency through Event Loop
- **Non-blocking I/O** — does not wait for operations like file read, database query to finish
- **Cross-platform** — runs on Windows, Linux, macOS
- Uses **npm** (largest package ecosystem)

```javascript
// Simple Node.js HTTP Server
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from Node.js Server!');
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

Note:
- Key Point: Node.js is NOT a language and NOT a framework — it is a runtime environment. V8 engine (C++) + libuv (C library) = Node.js. Used in MERN stack for backend (Express.js runs on Node.js).
- Why Interviewer Asks: First Node.js question always. They want to hear "runtime environment, V8 engine, single-threaded, event-driven, non-blocking I/O." These keywords matter.

---

**52. Explain Node.js Architecture. How does it handle requests?**

Answer:
Node.js architecture consists of these components working together:

**1. V8 Engine** — Compiles and executes JavaScript code
**2. libuv** — C library that implements Event Loop and Thread Pool
**3. Event Queue** — Holds callbacks waiting to be executed
**4. Event Loop** — Picks callbacks from queue and pushes to Call Stack
**5. Thread Pool** — 4 worker threads (default) for heavy/blocking operations

**How a request is handled:**

```
Client Request
     │
     ▼
┌─────────────────────────────┐
│  Node.js Server (V8)         │
│  Single Thread               │
└──────────────┬───────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Event Queue                 │
│  (Request callbacks queue)   │
└──────────────┬───────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Event Loop                  │
│  - Is it blocking (I/O)?     │
│    YES → Send to Thread Pool │
│    NO → Execute immediately  │
└──────┬───────────────┬───────┘
       │               │
       ▼               ▼
┌─────────────┐ ┌──────────────┐
│Thread Pool  │ │ Execute &    │
│(fs, crypto, │ │ Send Response│
│ dns, zlib)  │ │ to Client    │
│ 4 workers   │ └──────────────┘
└──────┬──────┘
       │ Done
       ▼
  Callback → Event Queue → Event Loop → Call Stack → Response
```

Note:
- Key Point: Non-blocking operations (simple computation) run directly on main thread. Blocking operations (file I/O, crypto, DNS, compression) are offloaded to Thread Pool. After Thread Pool finishes, callback goes back to Event Queue and Event Loop pushes it to Call Stack. This is how Node.js handles thousands of concurrent connections with single thread.
- Why Interviewer Asks: Shows deep understanding of how Node.js works internally. Drawing this diagram mentally while explaining impresses interviewers.

---

**53. Is Node.js really single-threaded?**

Answer:
Yes and No — it depends on what part you are talking about.

**Yes — the main execution thread is single-threaded.** All JavaScript code, Event Loop, and callback execution happens on a single main thread. This is why we say Node.js is single-threaded.

**No — behind the scenes it uses multiple threads.** The **libuv Thread Pool** has 4 worker threads by default (can be extended up to 128 using `UV_THREADPOOL_SIZE` environment variable). Heavy operations like file system operations, cryptography, DNS lookups, and compression run on these worker threads in parallel.

```javascript
// Main thread — single threaded
console.log("This runs on main thread");

// This goes to thread pool (separate thread)
const fs = require('fs');
fs.readFile('file.txt', (err, data) => {
    console.log("File read done — callback runs on main thread");
    // But the actual reading happened on a worker thread
});

// Change thread pool size
process.env.UV_THREADPOOL_SIZE = 8; // increase to 8 threads
```

Note:
- Key Point: JavaScript execution is single-threaded. I/O operations use libuv's thread pool (multi-threaded). The result callback always comes back to the main thread. So Node.js is "single-threaded for JS execution but multi-threaded for I/O operations."
- Why Interviewer Asks: Trick question. If you just say "yes single-threaded" you are partially wrong. Explaining the thread pool shows deep knowledge.

---

**54. What is libuv and what role does it play in Node.js?**

Answer:
**libuv** is a multi-platform C library that provides the core infrastructure for Node.js. It implements the **Event Loop** and **Thread Pool** — the two things that make Node.js asynchronous and non-blocking.

**Key roles of libuv:**

1. **Event Loop** — The core mechanism that handles async callbacks and I/O events
2. **Thread Pool** — 4 default worker threads for blocking operations (fs, crypto, dns, zlib)
3. **Async I/O** — Non-blocking file system operations, network sockets
4. **Timers** — setTimeout, setInterval implementation
5. **Child Processes** — spawning and managing sub-processes
6. **Signal Handling** — OS signal management

**Event Loop Phases (managed by libuv):**
```
   ┌───────────────────────────┐
┌─>│         Timers             │ ← setTimeout, setInterval callbacks
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │     Pending Callbacks      │ ← System-level callbacks (TCP errors)
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │     Idle / Prepare         │ ← Internal use, garbage collection
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │         Poll (Heart)       │ ← Retrieve new I/O events, execute I/O callbacks
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │         Check              │ ← setImmediate() callbacks
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │     Close Callbacks        │ ← socket.on('close'), cleanup
│  └──────────┬────────────────┘
│             │
└─────────────┘ (loop back)

Note: Microtask Queue (process.nextTick, Promises) runs BETWEEN each phase
```

Note:
- Key Point: libuv is what makes Node.js async. Without libuv Node.js would be just V8 (synchronous JS execution). The 6 phases of event loop are managed by libuv. Poll phase is the "heart" where most I/O callbacks execute. Microtasks run between every phase.
- Why Interviewer Asks: Advanced Node.js question. If you can name the 6 phases and explain poll phase, you stand out from other candidates.

---

**55. What is the difference between Main Thread and Worker Threads?**

Answer:

| Feature | Main Thread | Worker Threads |
|---------|------------|----------------|
| Count | Only 1 | 4 default (up to 128) |
| Runs | JavaScript code, Event Loop | Heavy I/O operations |
| Managed by | V8 Engine | libuv Thread Pool |
| Handles | Request processing, callbacks | fs, crypto, dns, zlib |
| Blocking | Should NEVER block | Designed for blocking tasks |

**Main Thread** — The single thread where all JS code executes. Event Loop runs here. All callbacks eventually execute here. If you block this thread (heavy computation), the entire server freezes.

**Worker Threads** — Background threads managed by libuv. They handle CPU-intensive or blocking operations in parallel. When they finish, they send the result back to Event Queue as a callback which the Event Loop picks up and executes on the Main Thread.

```javascript
// This blocks main thread — BAD!
function heavyComputation() {
    let sum = 0;
    for (let i = 0; i < 10000000000; i++) {
        sum += i;
    }
    return sum;
}

// Instead use worker_threads module for CPU-intensive tasks
const { Worker } = require('worker_threads');
const worker = new Worker('./heavy-task.js');
worker.on('message', (result) => {
    console.log(`Result from worker: ${result}`);
});
```

Note:
- Key Point: Never block the main thread with heavy computation — it freezes the entire server. Offload heavy work to worker threads. Default thread pool size is 4, increase with UV_THREADPOOL_SIZE for applications with many I/O operations.
- Why Interviewer Asks: Tests if you understand why Node.js can handle thousands of connections and what happens if you accidentally block the main thread.

---

## Topic 22 : npm, yarn, nvm

---

**56. What is npm? What is package.json?**

Answer:
**npm (Node Package Manager)** is the default package manager for Node.js. It is a command-line tool that lets you install, update, and manage third-party packages (libraries/modules) for your project.

**package.json** is the manifest file in every Node.js project's root directory. It contains:
- Project metadata (name, version, description)
- Dependencies (packages your project needs in production)
- DevDependencies (packages needed only in development — testing, linting)
- Scripts (custom commands like start, build, test)

**package-lock.json** — Auto-generated file that locks exact versions of all installed packages and their sub-dependencies. Ensures consistent installs across different machines.

```bash
# Initialize project
npm init               # interactive setup
npm init -y            # skip questions, use defaults

# Install packages
npm install express           # install and add to dependencies
npm install nodemon --save-dev # add to devDependencies
npm install lodash@4.17.21    # specific version
npm install -g nodemon        # install globally

# Other commands
npm uninstall express         # remove package
npm update                    # update all packages
npm audit                     # check for vulnerabilities
npm audit fix                 # auto-fix vulnerabilities
npm list                      # show installed packages
```

Note:
- Key Point: dependencies = needed in production, devDependencies = needed only in development. package-lock.json should be committed to git for consistent installs. node_modules should be in .gitignore.
- Why Interviewer Asks: Practical question. They want to know you can set up a project, manage packages, and understand the difference between dependencies and devDependencies.

---

**57. What is the difference between npm and yarn?**

Answer:

| Feature | npm | yarn |
|---------|-----|------|
| Developed by | npm Inc (2010) | Facebook (2016) |
| Lock file | package-lock.json | yarn.lock |
| Speed | Slower (improved in recent versions) | Faster (parallel installation, caching) |
| Offline | Limited support | Better offline support (caches packages) |
| Security | npm audit (basic) | More secure by default (checksum verification) |
| CLI Output | Verbose, less clean | Cleaner, more user-friendly |
| Bundled with | Node.js (comes by default) | Must install separately |

```bash
# npm vs yarn commands comparison
npm init              →  yarn init
npm install           →  yarn install (or just: yarn)
npm install package   →  yarn add package
npm uninstall package →  yarn remove package
npm update package    →  yarn upgrade package
npm install -g pkg    →  yarn global add pkg
npm run start         →  yarn start
```

Note:
- Key Point: yarn was created because npm was slow and insecure in early days. npm has improved a lot since then. Both work fine for most projects. yarn is still faster for large projects due to parallel installation and better caching. Use whichever your team uses.
- Why Interviewer Asks: Shows you are aware of the ecosystem and can adapt to different project setups. Some companies use yarn, some use npm.

---

**58. What is nvm? Why is it used?**

Answer:
**nvm (Node Version Manager)** is a tool that lets you install and manage multiple versions of Node.js on the same machine. Different projects may require different Node.js versions — nvm lets you switch between them easily.

```bash
# Install specific Node version
nvm install 18.17.0
nvm install 20.11.0

# Switch between versions
nvm use 18.17.0
nvm use 20.11.0

# Check current version
nvm current            # or: node -v

# List installed versions
nvm list

# Set default version
nvm alias default 20.11.0
```

Note:
- Key Point: nvm is essential when working on multiple projects with different Node versions. It does not affect system Node installation. Install it separately — it is not bundled with Node.js.
- Why Interviewer Asks: Shows practical development environment knowledge. If you work on multiple projects this is a must-have tool.

---

## Topic 23 : Console Methods

---

**59. Explain different console methods in JavaScript.**

Answer:

```javascript
// 1. console.log() — General output
console.log("Hello", variable, object);

// 2. console.error() — Error messages (red in browser)
console.error("Something went wrong!");

// 3. console.warn() — Warning messages (yellow in browser)
console.warn("Deprecated function used");

// 4. console.info() — Informational messages
console.info("Server started on port 3000");

// 5. console.table() — Display arrays/objects as table
console.table([{name:"Deep",age:23}, {name:"Neel",age:22}]);

// 6. console.assert(condition, message) — Prints ONLY if condition is FALSE
console.assert(1 === 2, "1 is not equal to 2"); // prints message
console.assert(1 === 1, "This won't print");    // condition true, nothing printed

// 7. console.count(label) — Counts how many times called
console.count("loop");  // loop: 1
console.count("loop");  // loop: 2

// 8. console.time() / console.timeEnd() — Measure execution time
console.time("fetch");
// ... some code ...
console.timeEnd("fetch"); // fetch: 234.5ms

// 9. console.trace() — Shows call stack trace
function a() { function b() { console.trace("trace"); } b(); } a();

// 10. console.dir(object) — Display object properties as list
console.dir(document.body);

// 11. console.clear() — Clear console
console.clear();

// 12. console.group() / console.groupEnd() — Group logs
console.group("User Info");
console.log("Name: Deep");
console.log("Age: 23");
console.groupEnd();
```

Note:
- Key Point: console.table is very useful for debugging arrays of objects. console.time/timeEnd for performance measurement. console.assert for conditional logging. console.trace for debugging function call chains.
- Why Interviewer Asks: Shows you use proper debugging techniques not just console.log everywhere. console.table and console.time are impressive to mention.

---

## Topic 24 : API Concepts

---

**60. What is an API?**

Answer:
**API (Application Programming Interface)** is a set of rules and protocols that allows different software applications to communicate with each other. In web development, APIs allow the frontend (React) to communicate with the backend (Node.js/Express) to send and receive data.

**How it works in MERN Stack:**

```
React (Frontend)  ←→  Express/Node.js (API)  ←→  MongoDB (Database)

1. React sends HTTP request to API endpoint
2. Express receives request, validates it (auth, input validation)
3. Express queries MongoDB for data
4. MongoDB returns data to Express
5. Express sends JSON response back to React
6. React displays the data to user
```

Note:
- Key Point: API is the middleman between frontend and database. Frontend never talks to database directly — always through API. This provides security, validation, and separation of concerns.
- Why Interviewer Asks: Fundamental concept for any web developer. They want to know you understand the data flow in a full-stack application.

---

**61. What is REST API? What are the principles?**

Answer:
**REST (Representational State Transfer)** is an architectural style — a set of rules for building APIs. A REST API uses standard HTTP methods and URLs to perform CRUD operations on resources.

**REST Principles:**
1. **Client-Server** — Frontend and backend are separate
2. **Stateless** — Each request contains all info needed, server does not store client state
3. **Uniform Interface** — Consistent URL structure and HTTP methods
4. **Cacheable** — Responses can be cached for performance
5. **Layered System** — Can have multiple layers (load balancer, proxy)

```
Resource: Users

GET    /api/users          → Get all users      (Read)
GET    /api/users/123      → Get user with id 123 (Read)
POST   /api/users          → Create new user     (Create)
PUT    /api/users/123      → Replace user 123     (Update - Full)
PATCH  /api/users/123      → Partial update 123   (Update - Partial)
DELETE /api/users/123      → Delete user 123      (Delete)
```

Note:
- Key Point: REST is not a protocol or tool — it is an architectural style (set of rules). URLs should be nouns not verbs (/users not /getUsers). Stateless means server does not remember previous requests. Each request is independent.
- Why Interviewer Asks: Every MERN developer builds REST APIs daily. They want you to know HTTP methods, URL structure, and the stateless principle.

---

**62. What is the difference between PUT and PATCH?**

Answer:
Both are used to update resources but they work differently:

**`PUT`** — Replaces the **entire resource** with new data. You must send all fields even if only one changed. If you miss a field it will be removed/set to null.

**`PATCH`** — Updates only the **specific fields** you send. Other fields remain unchanged. More efficient for partial updates.

```javascript
// Original user in database
// { name: "Deep", age: 23, email: "deep@test.com", city: "Surat" }

// PUT /api/users/123 — must send ALL fields
// Body: { name: "Deep", age: 24, email: "deep@test.com", city: "Surat" }
// Result: entire object replaced with what you sent

// PATCH /api/users/123 — send only what changed
// Body: { age: 24 }
// Result: only age updated, name/email/city unchanged

// Real-world example:
// PUT = changing entire profile (re-submit full form)
// PATCH = changing just email or just password
```

Note:
- Key Point: PUT = full replacement (idempotent — same result every time). PATCH = partial update (more efficient). In practice most update operations use PATCH because you rarely need to replace entire resource.
- Why Interviewer Asks: Very common question. Many candidates cannot explain the difference clearly. Knowing this shows you understand RESTful API design properly.

---

**63. What are HTTP Status Codes?**

Answer:
HTTP Status Codes are 3-digit numbers that indicate the result of an HTTP request:

```
1xx — Informational (request received, processing)
    100 Continue

2xx — Success
    200 OK — request succeeded
    201 Created — new resource created (POST success)
    204 No Content — success but no body to return (DELETE success)

3xx — Redirection
    301 Moved Permanently — URL changed permanently
    304 Not Modified — cached version is still valid

4xx — Client Error (problem with request)
    400 Bad Request — invalid data sent
    401 Unauthorized — authentication required (not logged in)
    403 Forbidden — authenticated but not authorized (no permission)
    404 Not Found — resource does not exist
    409 Conflict — duplicate data (e.g., email already exists)
    422 Unprocessable Entity — validation failed

5xx — Server Error (problem with server)
    500 Internal Server Error — general server error
    502 Bad Gateway — upstream server error
    503 Service Unavailable — server overloaded/maintenance
```

Note:
- Key Point: 200 = OK, 201 = Created, 400 = Bad Request, 401 = Not Logged In, 403 = No Permission, 404 = Not Found, 500 = Server Error. These 7 are the most important to remember. 401 vs 403: 401 = who are you? (not authenticated), 403 = I know you but you cannot access this (not authorized).
- Why Interviewer Asks: Very practical question. When building APIs you must return correct status codes. 401 vs 403 difference is a common follow-up trick question.

---

**64. What is the difference between Authentication and Authorization?**

Answer:
**Authentication** — Verifying WHO you are. Confirming identity.
Examples: Login with email/password, OAuth (Google login), JWT token verification

**Authorization** — Verifying WHAT you can access. Confirming permissions.
Examples: Admin can delete users but normal user cannot, Role-based access control

```
Authentication: "Are you who you say you are?" (Login)
Authorization:  "Are you allowed to do this?" (Permissions)

Flow:
1. User sends login credentials (email/password)
2. Server verifies credentials → Authentication ✅
3. Server generates JWT token and sends to user
4. User sends JWT with every request
5. Server verifies JWT → still Authentication
6. Server checks user's role/permissions → Authorization
7. If authorized → process request
8. If not authorized → 403 Forbidden
```

Note:
- Key Point: Authentication comes BEFORE Authorization. First verify identity, then check permissions. JWT (JSON Web Token) is the most common way to handle auth in MERN stack. 401 = Authentication failed, 403 = Authorization failed.
- Why Interviewer Asks: Every application needs auth. They want to know you understand the difference and the flow. JWT follow-up question is very common.

---

**65. What are WebSockets? How are they different from REST API?**

Answer:
**REST API** — Uses request-response model. Client sends request, server responds, connection closes. Client must send a new request every time it wants new data (polling).

**WebSocket** — Creates a persistent two-way connection between client and server. Both can send data at any time without the other asking. Connection stays open until explicitly closed.

```
REST API (Half-duplex):
Client → "Any new messages?" → Server → "Yes, here" → Connection closes
Client → "Any new messages?" → Server → "No" → Connection closes
Client → "Any new messages?" → Server → "Yes, here" → Connection closes
(Client keeps asking — wasteful)

WebSocket (Full-duplex):
Client ←→ Server (connection stays open)
Server → "New message arrived!" (server pushes without client asking)
Client → "Send this message" (client sends anytime)
(Real-time, efficient)
```

**Use Cases:**
- REST: CRUD operations, form submissions, data fetching
- WebSocket: Chat apps, live notifications, stock tickers, gaming, live scores

**Socket.io** — Popular npm library for WebSocket communication in Node.js

```javascript
// Server (Node.js with Socket.io)
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // broadcast to all
    });
});

// Client
const socket = io();
socket.emit('chat message', 'Hello!');
socket.on('chat message', (msg) => {
    console.log('New message:', msg);
});
```

Note:
- Key Point: REST = request-response (one way at a time), WebSocket = persistent bidirectional connection. WebSocket is better for real-time features. Socket.io handles fallbacks and reconnection automatically. REST is still used for most CRUD operations.
- Why Interviewer Asks: If you are building a chat feature or real-time feature in your project, they will ask this. Shows you know when to use which protocol.

---

## Topic 25 : DOM Basics

---

**66. What is DOM?**

Answer:
**DOM (Document Object Model)** is a tree-like representation of an HTML document that the browser creates when a webpage loads. It represents every HTML element as an object (node) that JavaScript can access and manipulate to change content, structure, and styling dynamically.

```
HTML:
<html>
  <head><title>Page</title></head>
  <body>
    <h1 id="title">Hello</h1>
    <p class="text">World</p>
  </body>
</html>

DOM Tree:
Document
  └── html
       ├── head
       │    └── title → "Page"
       └── body
            ├── h1#title → "Hello"
            └── p.text → "World"
```

Note:
- Key Point: DOM is NOT the HTML file itself — it is the browser's object representation of HTML that JS can manipulate. When JS changes the DOM the page updates visually. In React we use Virtual DOM which is a lightweight copy of the real DOM for performance.
- Why Interviewer Asks: Foundation of frontend development. Even though React abstracts DOM manipulation, understanding it is essential. Virtual DOM follow-up question is very likely.

---

**67. What are the common DOM manipulation methods?**

Answer:

```javascript
// ---- SELECTING ELEMENTS ----
document.getElementById("title");              // by ID (single element)
document.getElementsByClassName("text");        // by class (HTMLCollection)
document.getElementsByTagName("p");             // by tag (HTMLCollection)
document.querySelector(".text");                // CSS selector (first match)
document.querySelectorAll(".text");             // CSS selector (all matches — NodeList)

// ---- CHANGING CONTENT ----
element.innerHTML = "<b>Bold Text</b>";         // HTML content (can inject HTML)
element.textContent = "Plain Text";             // text only (safer, no HTML parsing)
element.innerText = "Visible Text";             // only visible text

// ---- CHANGING ATTRIBUTES ----
element.setAttribute("class", "new-class");
element.getAttribute("id");
element.removeAttribute("class");

// ---- CHANGING STYLES ----
element.style.color = "red";
element.style.backgroundColor = "blue";
element.classList.add("active");
element.classList.remove("active");
element.classList.toggle("active");

// ---- CREATING & ADDING ELEMENTS ----
const newDiv = document.createElement("div");
newDiv.textContent = "New Element";
document.body.appendChild(newDiv);              // add at end
parent.insertBefore(newDiv, referenceChild);    // add before specific child
parent.removeChild(child);                      // remove element

// ---- EVENT LISTENERS ----
element.addEventListener("click", function(event) {
    console.log("Clicked!", event.target);
});
```

Note:
- Key Point: querySelector/querySelectorAll are most versatile (use CSS selectors). innerHTML is dangerous (XSS attacks) — prefer textContent. addEventListener is better than onclick because you can attach multiple handlers. In React you do not use these directly — React handles DOM through Virtual DOM.
- Why Interviewer Asks: Even as a React developer you should know vanilla DOM manipulation. Some interview questions test this. Also helps understand what React does behind the scenes.

---

## Topic 26 : Extra Important Questions

---

**68. What is the difference between `==` vs `===` vs `Object.is()`?**

Answer:

| Operator | Name | Compares | Type Coercion |
|----------|------|----------|:---:|
| `==` | Loose Equality | Values only | Yes |
| `===` | Strict Equality | Value + Type | No |
| `Object.is()` | Same Value | Value + Type + special cases | No |

The difference between `===` and `Object.is()` is in edge cases:

```javascript
// == (loose — coerces types)
5 == "5"          // true
null == undefined // true
0 == false        // true

// === (strict — no coercion)
5 === "5"          // false
null === undefined // false
0 === false        // false

// Object.is() — same as === BUT handles two special cases:
NaN === NaN        // false ❌ (strange JS behavior)
Object.is(NaN, NaN) // true ✅ (correct behavior)

+0 === -0          // true
Object.is(+0, -0)  // false (they are technically different)
```

Note:
- Key Point: Use `===` in daily code. `Object.is()` is needed only for NaN comparison or +0/-0 edge case. `==` should be avoided except `value == null` which checks both null and undefined.
- Why Interviewer Asks: Extends the basic == vs === question. Knowing Object.is() shows deeper knowledge.

---

**69. What is Event Bubbling and Event Capturing?**

Answer:
When an event occurs on a nested element, it does not just trigger on that element — it propagates through the DOM tree in two phases:

**Event Capturing (Trickling Down)** — Event travels from `document` DOWN to the target element. Rarely used.

**Event Bubbling (Default)** — Event travels from the target element UP to the `document`. This is the default behavior.

```html
<div id="grandparent">
    <div id="parent">
        <button id="child">Click Me</button>
    </div>
</div>
```

```javascript
// Event Bubbling (default — third param false or omitted)
document.getElementById("child").addEventListener("click", () => {
    console.log("Child clicked");
});
document.getElementById("parent").addEventListener("click", () => {
    console.log("Parent clicked");
});
document.getElementById("grandparent").addEventListener("click", () => {
    console.log("Grandparent clicked");
});

// Click on button → Output:
// Child clicked → Parent clicked → Grandparent clicked (bubbles UP)

// Event Capturing (third param = true)
document.getElementById("grandparent").addEventListener("click", () => {
    console.log("Grandparent captured");
}, true);  // ← true enables capturing

// To stop propagation:
event.stopPropagation(); // stops bubbling/capturing
```

Note:
- Key Point: Bubbling goes bottom to top (default). Capturing goes top to bottom. event.stopPropagation() stops the event from going further. In React, event delegation uses bubbling concept — React attaches one event listener at the root and uses bubbling to catch all events.
- Why Interviewer Asks: Important DOM concept. Understanding this helps with event delegation which React uses internally. Common in frontend interviews.

---

**70. What is Debouncing and Throttling?**

Answer:
Both are performance optimization techniques to limit how many times a function executes:

**Debouncing** — Function executes only after the user STOPS performing the action for a specified time. If user keeps acting, timer resets.
Use case: Search bar (wait until user stops typing to make API call)

**Throttling** — Function executes at most once every specified time interval, regardless of how many times the event fires.
Use case: Scroll event, window resize, button click (prevent multiple API calls)

```javascript
// DEBOUNCE — executes after user stops
function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);       // reset timer on every call
        timer = setTimeout(() => {
            func.apply(this, args); // execute after delay
        }, delay);
    };
}

// Usage: API call only after user stops typing for 500ms
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", debounce(function(e) {
    console.log("API Call:", e.target.value);
}, 500));

// THROTTLE — executes at most once per interval
function throttle(func, limit) {
    let inThrottle = false;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Usage: scroll handler runs at most once per 200ms
window.addEventListener("scroll", throttle(function() {
    console.log("Scroll position:", window.scrollY);
}, 200));
```

Note:
- Key Point: Debounce = delay until user stops (search, form validation). Throttle = limit frequency (scroll, resize, game input). Both improve performance by reducing unnecessary function calls. Lodash has built-in `_.debounce()` and `_.throttle()`.
- Why Interviewer Asks: Very practical and very commonly asked. Shows you think about performance. They may ask you to implement debounce from scratch — the code above is the answer.

---

## Quick Revision — Most Asked Questions Summary

| # | Question | One-Line Answer |
|---|----------|----------------|
| 1 | var vs let vs const | var = function scoped + hoisted as undefined, let = block scoped + TDZ, const = block scoped + cannot reassign |
| 2 | == vs === | == coerces types then compares, === compares type AND value |
| 3 | null vs undefined | null = intentional empty (developer), undefined = not assigned (JS default) |
| 4 | Hoisting | Declarations moved to top of scope in creation phase. var=undefined, let/const=TDZ, function=fully hoisted |
| 5 | Closure | Inner function remembering outer function's variables even after outer finishes |
| 6 | this keyword | Depends on how function is called. Arrow functions inherit this from parent |
| 7 | call vs apply vs bind | call = immediate + comma args, apply = immediate + array args, bind = returns new function |
| 8 | map vs filter vs reduce | map = transform all, filter = keep matching, reduce = single value |
| 9 | slice vs splice | slice = non-destructive copy, splice = destructive modify |
| 10 | Callback Hell | Nested callbacks. Solve with Promises or async/await |
| 11 | Promise states | Pending → Fulfilled (resolve) or Rejected (reject) |
| 12 | async/await | Syntactic sugar on promises. async returns promise, await pauses until resolved |
| 13 | Event Loop | Mechanism that checks if call stack is empty then picks from microtask queue (priority) then macrotask queue |
| 14 | Microtask vs Macrotask | Micro (Promise, nextTick) runs before Macro (setTimeout, I/O). All microtasks before next macrotask |
| 15 | Node.js | JS runtime built on V8 + libuv. Single-threaded, event-driven, non-blocking I/O |
| 16 | Shallow vs Deep Copy | Shallow = first level only (spread). Deep = all levels (structuredClone) |
| 17 | REST API | Architectural style using HTTP methods (GET/POST/PUT/PATCH/DELETE) on resource URLs |
| 18 | PUT vs PATCH | PUT = replace entire resource, PATCH = update specific fields |
| 19 | Debouncing vs Throttling | Debounce = wait until user stops. Throttle = max once per interval |
| 20 | DOM | Browser's object representation of HTML that JS can manipulate |

---

