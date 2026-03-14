## Topic 1 : JavaScript Engine & V8 (Deep Dive)

---

**71. What is Abstract Syntax Tree (AST)?**

Answer:
AST is a tree representation of the source code structure. When JavaScript engine receives code it first goes through **parsing** which converts the code into an AST. The AST breaks down every statement, expression, variable, and operator into nodes of a tree. Then the compiler uses this AST to generate machine code.

```javascript
// Code:
let name = "Deep";

// AST representation (simplified):
// Program
//   └── VariableDeclaration (kind: "let")
//        └── VariableDeclarator
//             ├── Identifier (name: "name")
//             └── Literal (value: "Deep")
```

You can see AST of any code at **astexplorer.net**

Note:
- Key Point: Code → Parser → AST → Compiler → Machine Code. AST is used by tools like Babel (transpiler), ESLint (linter), Prettier (formatter), Webpack (bundler). They all read and manipulate AST.
- Why Interviewer Asks: Advanced question. Shows you understand compilation pipeline. Mentioning Babel and ESLint use AST is a bonus point.

---

**72. What is Garbage Collection in JavaScript? How does V8 handle it?**

Answer:
Garbage Collection is automatic memory management. JavaScript automatically finds objects that are no longer reachable (no reference pointing to them) and frees that memory. Developers do not manually allocate or free memory.

V8 uses **Mark-and-Sweep** algorithm:
1. **Mark Phase** — Start from root (global object), traverse all reachable objects, mark them as "alive"
2. **Sweep Phase** — Any object NOT marked is considered garbage and its memory is freed

V8 divides heap into two spaces:
- **Young Generation (New Space)** — Short-lived objects. Uses **Scavenger** (minor GC) — fast and frequent
- **Old Generation (Old Space)** — Long-lived objects that survived multiple GC cycles. Uses **Mark-Sweep-Compact** (major GC) — slower but less frequent

```javascript
let user = { name: "Deep" };  // object created in heap
user = null;                    // reference removed
// Now {name:"Deep"} is unreachable — garbage collector will free this memory

// Memory leak example — object stays reachable forever
let cache = [];
function addToCache(data) {
    cache.push(data);  // cache keeps growing, objects never freed
}
```

Note:
- Key Point: JS uses automatic garbage collection with Mark-and-Sweep. Memory leaks happen when objects remain reachable unintentionally (global variables, forgotten timers, closures holding references, event listeners not removed). Setting reference to null makes object eligible for GC.
- Why Interviewer Asks: Shows understanding of memory management. Common follow-up: "What causes memory leaks?" Answer: global variables, forgotten setInterval, detached DOM nodes, closures holding large data.

---

**73. What is the difference between V8 and other JavaScript engines?**

Answer:

| Engine | Used In | Developer | Key Feature |
|--------|---------|-----------|-------------|
| **V8** | Chrome, Node.js, Edge | Google | JIT compilation, fastest, TurboFan optimizer |
| **SpiderMonkey** | Firefox | Mozilla | First ever JS engine, IonMonkey optimizer |
| **JavaScriptCore (Nitro)** | Safari | Apple | FTL JIT compiler |
| **Chakra** | Old Edge (pre-2020) | Microsoft | Deprecated, Edge now uses V8 |

All modern engines use JIT compilation but V8 is considered fastest because of its advanced optimization pipeline: **Ignition** (interpreter for quick start) → **TurboFan** (optimizing compiler for hot code).

Note:
- Key Point: V8 is the most popular engine — used in both Chrome and Node.js. All engines follow ECMAScript specification so JS behavior is same across engines, only performance differs.
- Why Interviewer Asks: Rare but shows broad knowledge. Main takeaway is V8 is used in Node.js which is why we can run JS on server.

---

## Topic 2 : Hoisting (Tricky Output Questions)

---

**74. Predict the output — Function hoisting vs Variable hoisting.**

```javascript
console.log(foo);
console.log(foo());

var foo = function() {
    return "Expression";
};

function foo() {
    return "Declaration";
}

console.log(foo());
```

Answer:
```
[Function: foo]
"Declaration"
"Expression"
```

**Explanation:**
During creation phase:
1. `var foo` is hoisted as `undefined`
2. `function foo()` is hoisted completely with its body
3. Function declaration **overrides** the var hoisting because function declarations have higher priority
4. So initially `foo` = function declaration
5. First `console.log(foo)` prints the function itself
6. `foo()` returns "Declaration"
7. During execution phase, `foo = function() { return "Expression" }` reassigns foo
8. Now `foo()` returns "Expression"

Note:
- Key Point: When var and function declaration have the same name, function declaration takes priority during hoisting. But during execution, var assignment overwrites it. This is why avoiding var and using let/const prevents such confusing behavior.
- Why Interviewer Asks: Tricky hoisting question that tests deep understanding of creation phase priority.

---

**75. Predict the output — let and const hoisting.**

```javascript
let a = 10;
{
    console.log(a);
    let a = 20;
}
```

Answer:
```
ReferenceError: Cannot access 'a' before initialization
```

**Explanation:**
Even though there is a global `a = 10`, inside the block a new `let a = 20` is declared. During the creation phase of this block, the local `a` is hoisted and placed in TDZ. When `console.log(a)` runs, it finds the local `a` (not the global one) but it is still in TDZ so it throws ReferenceError.

The local `let a` shadows the outer `a` and the TDZ prevents access before declaration.

Note:
- Key Point: let/const create a new binding in each block scope. Even if same name exists in outer scope, inner declaration creates TDZ in that block. The engine sees the local declaration and does not look outward.
- Why Interviewer Asks: Tests understanding of block scoping, TDZ, and variable shadowing. Very common trick question.

---

## Topic 3 : Scope (Advanced)

---

**76. What is Variable Shadowing?**

Answer:
Variable Shadowing happens when a variable declared in an inner scope has the same name as a variable in an outer scope. The inner variable "shadows" (hides) the outer one within that scope.

```javascript
let name = "Global Deep";

function greet() {
    let name = "Function Deep";  // shadows global 'name'
    console.log(name);            // "Function Deep"
    
    if (true) {
        let name = "Block Deep";  // shadows function 'name'
        console.log(name);        // "Block Deep"
    }
    
    console.log(name);            // "Function Deep" (block scope ended)
}

greet();
console.log(name);                // "Global Deep" (function scope ended)
```

**Illegal Shadowing:** You cannot shadow a `let` variable with `var` in the same scope because var leaks out of blocks:

```javascript
let x = 10;
{
    var x = 20;  // SyntaxError! var leaks out and tries to redeclare let
}

// But this is fine:
var y = 10;
{
    let y = 20;  // OK — let stays in block, does not conflict
}
```

Note:
- Key Point: Inner scope variable hides outer scope variable with same name. let can shadow var, but var cannot shadow let (illegal shadowing). Each scope has its own copy of the shadowed variable.
- Why Interviewer Asks: Tests deep scope understanding. Illegal shadowing is a tricky follow-up that most candidates do not know.

---

**77. What is Lexical Scoping vs Dynamic Scoping?**

Answer:
**Lexical Scoping (Static Scoping)** — JavaScript uses this. Scope is determined by WHERE the function is WRITTEN in the code, not where it is called. Inner functions can access outer function variables based on their position in source code.

**Dynamic Scoping** — Scope is determined by WHERE the function is CALLED. JavaScript does NOT use this (some languages like Bash do).

```javascript
let language = "JavaScript";

function outer() {
    let language = "Python";
    inner();  // called from outer, but inner was DEFINED in global scope
}

function inner() {
    console.log(language);  // "JavaScript" — NOT "Python"
    // Because JS uses lexical scoping — inner was WRITTEN in global scope
    // so it accesses global 'language', not outer's 'language'
}

outer();
```

Note:
- Key Point: JavaScript is lexically scoped. Closures work because of lexical scoping — function remembers scope where it was defined. If JS used dynamic scoping, closures would not work as they do.
- Why Interviewer Asks: Theoretical but important. Understanding lexical scoping explains why closures work and how scope chain is built.

---

## Topic 4 : `this` Keyword (Tricky Scenarios)

---

**78. What is `this` inside an arrow function vs regular function?**

Answer:

```javascript
const obj = {
    name: "Deep",
    
    // Regular function — 'this' = object that calls it
    regularMethod: function() {
        console.log(this.name);  // "Deep" — this = obj
        
        // Regular function inside method — 'this' = window/undefined
        function innerRegular() {
            console.log(this.name);  // undefined — this = window (not obj!)
        }
        innerRegular();
        
        // Arrow function inside method — 'this' = inherited from parent
        const innerArrow = () => {
            console.log(this.name);  // "Deep" — this = obj (inherited)
        };
        innerArrow();
    },
    
    // Arrow method — 'this' = inherited from where obj was DEFINED (global)
    arrowMethod: () => {
        console.log(this.name);  // undefined — this = global/window
    }
};

obj.regularMethod();
obj.arrowMethod();
```

**Summary Table:**

| Context | Regular Function | Arrow Function |
|---------|-----------------|----------------|
| Object method | `this` = the object | `this` = global (parent scope) |
| Nested inside method | `this` = global/undefined | `this` = the object (inherited) |
| Event handler | `this` = element | `this` = global (inherited) |
| Constructor | `this` = new instance | Cannot use as constructor |

Note:
- Key Point: Arrow functions do NOT have their own `this`. They inherit from parent lexical scope. Regular functions get `this` from whoever calls them. This is why arrow functions are perfect for callbacks inside methods but BAD as object methods.
- Why Interviewer Asks: One of the trickiest JS concepts. They will give code with mixed regular and arrow functions and ask what `this` refers to in each.

---

**79. What happens when you use `this` in strict mode?**

Answer:
In **strict mode** (`"use strict"`), the behavior of `this` changes for regular functions:

- **Non-strict mode:** `this` in a regular function (not called as method) defaults to `window` (browser) or `global` (Node.js)
- **Strict mode:** `this` in a regular function is `undefined` instead of global object

```javascript
"use strict";

function showThis() {
    console.log(this);  // undefined (strict mode)
}
showThis();

// Without strict mode:
function showThisNonStrict() {
    console.log(this);  // Window object (browser) or global (Node.js)
}

// Object method — same in both modes
const obj = {
    name: "Deep",
    greet() {
        console.log(this);  // obj — same behavior in strict and non-strict
    }
};
obj.greet();
```

Note:
- Key Point: Strict mode prevents accidental global variable creation and makes `this` = undefined in standalone functions. ES6 modules are in strict mode by default. React class components use strict mode.
- Why Interviewer Asks: Tests if you know about strict mode and its effects on `this`. Common in code output questions.

---

## Topic 5 : Pass by Value vs Pass by Reference

---

**80. What is the difference between Pass by Value and Pass by Reference?**

Answer:
**Pass by Value (Primitives)** — When you pass a primitive variable to a function, a COPY of the value is passed. Changes inside the function do NOT affect the original variable.

**Pass by Reference (Objects/Arrays)** — When you pass an object or array to a function, a copy of the REFERENCE (memory address) is passed. Changes inside the function AFFECT the original because both point to the same object in heap.

```javascript
// Pass by Value — primitives
let a = 10;
function changeValue(x) {
    x = 20;  // changes only local copy
    console.log(x);  // 20
}
changeValue(a);
console.log(a);  // 10 — original unchanged

// Pass by Reference — objects
let user = { name: "Deep", age: 23 };
function changeName(obj) {
    obj.name = "Dev";  // modifies original object!
}
changeName(user);
console.log(user.name);  // "Dev" — original changed!

// BUT reassigning the parameter does not affect original
function replaceObject(obj) {
    obj = { name: "New Person" };  // local reassignment
    console.log(obj.name);  // "New Person"
}
replaceObject(user);
console.log(user.name);  // "Dev" — original not affected by reassignment
```

Note:
- Key Point: Technically JS is always "pass by value" but for objects the "value" being passed IS the reference (memory address). So modifying properties through the reference affects original, but reassigning the parameter itself does not. This distinction matters.
- Why Interviewer Asks: Fundamental question. The reassignment example is the tricky part — most candidates think reassigning inside function changes original. It does not.

---

## Topic 6 : Closures (Advanced)

---

**81. What are practical uses of Closures?**

Answer:

**1. Data Privacy / Encapsulation**
```javascript
function createCounter() {
    let count = 0;  // private variable
    return {
        increment() { count++; },
        decrement() { count--; },
        getCount() { return count; }
    };
}
const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getCount());  // 2
console.log(counter.count);       // undefined — truly private
```

**2. Function Factory**
```javascript
function createMultiplier(multiplier) {
    return function(number) {
        return number * multiplier;
    };
}
const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(5));   // 10
console.log(triple(5));   // 15
```

**3. Memoization (Caching)**
```javascript
function memoize(fn) {
    const cache = {};  // closure keeps cache alive
    return function(n) {
        if (cache[n] !== undefined) {
            console.log("From cache");
            return cache[n];
        }
        cache[n] = fn(n);
        return cache[n];
    };
}
const factorial = memoize(function(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
});
console.log(factorial(5));  // calculates
console.log(factorial(5));  // from cache
```

**4. Maintaining State in Async Operations**
```javascript
function fetchUser(userId) {
    const requestTime = Date.now();  // closure captures this
    fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
            console.log(`User: ${data.name}, took ${Date.now() - requestTime}ms`);
        });
}
```

Note:
- Key Point: Closures are used for data privacy, function factories, memoization, currying, and maintaining state. React hooks (useState, useEffect) internally use closures to maintain state between renders.
- Why Interviewer Asks: They want practical understanding not just definition. Showing multiple real-world use cases proves you actually use closures in code.

---

**82. What is a Memory Leak caused by Closures?**

Answer:
Closures can cause memory leaks when they hold references to large objects or DOM elements that should have been garbage collected. Since the closure keeps the reference alive, the garbage collector cannot free that memory.

```javascript
// Memory Leak Example
function createHandler() {
    const largeData = new Array(1000000).fill("data");  // large array
    
    return function handler() {
        // Even if handler only uses one variable,
        // the entire closure scope (including largeData) stays in memory
        console.log(largeData.length);
    };
}

const handler = createHandler();
// largeData stays in memory as long as 'handler' exists
// Even if we never call handler(), largeData cannot be garbage collected

// Fix: set reference to null when done
// handler = null;  // now largeData can be garbage collected

// Another common leak — event listeners not removed
function setup() {
    const element = document.getElementById("button");
    const data = loadHugeData();
    
    element.addEventListener("click", () => {
        console.log(data);  // closure holds 'data' in memory
    });
    // Even if element is removed from DOM, the listener keeps 'data' alive
}

// Fix: remove event listener when component unmounts
```

Note:
- Key Point: Closures hold entire scope in memory not just variables they use. Always clean up event listeners. In React, return cleanup function from useEffect to prevent leaks. Set large references to null when no longer needed.
- Why Interviewer Asks: Shows understanding of performance implications. "What are the disadvantages of closures?" is a common follow-up.

---

## Topic 7 : Currying

---

**83. What is Currying in JavaScript?**

Answer:
Currying is a technique of transforming a function that takes multiple arguments into a sequence of functions that each take a single argument. Instead of `f(a, b, c)` you call `f(a)(b)(c)`.

```javascript
// Normal function
function add(a, b, c) {
    return a + b + c;
}
console.log(add(1, 2, 3));  // 6

// Curried version
function curriedAdd(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        };
    };
}
console.log(curriedAdd(1)(2)(3));  // 6

// Arrow function currying (shorter)
const curriedAddArrow = a => b => c => a + b + c;
console.log(curriedAddArrow(1)(2)(3));  // 6

// Partial Application — pre-fill some arguments
const addOne = curriedAdd(1);     // a = 1 fixed
const addOneAndTwo = addOne(2);    // b = 2 fixed
console.log(addOneAndTwo(3));      // 6 — only c = 3 needed

// Practical Example: Configurable logger
const logger = level => module => message => {
    console.log(`[${level}] [${module}]: ${message}`);
};

const errorLogger = logger("ERROR");
const authError = errorLogger("AUTH");
authError("Invalid token");        // [ERROR] [AUTH]: Invalid token
authError("Session expired");      // [ERROR] [AUTH]: Session expired
```

Note:
- Key Point: Currying uses closures — each function remembers the previous argument. Useful for creating reusable specialized functions (partial application). Used in functional programming, Redux middleware, and event handlers.
- Why Interviewer Asks: Shows functional programming knowledge. They may ask you to convert a normal function to curried form or implement a generic curry utility.

---

**84. Implement a generic curry function.**

Answer:

```javascript
function curry(fn) {
    return function curried(...args) {
        // If enough arguments provided, call original function
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        // Otherwise return a function that collects more arguments
        return function(...nextArgs) {
            return curried.apply(this, args.concat(nextArgs));
        };
    };
}

// Usage
function multiply(a, b, c) {
    return a * b * c;
}

const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4));     // 24
console.log(curriedMultiply(2, 3)(4));     // 24
console.log(curriedMultiply(2)(3, 4));     // 24
console.log(curriedMultiply(2, 3, 4));     // 24 — all at once also works
```

Note:
- Key Point: fn.length gives the number of parameters a function expects. The curry function checks if enough arguments are collected. If yes it calls the original function. If not it returns another function to collect more. This is a very common coding question.
- Why Interviewer Asks: Tests understanding of closures, recursion, fn.length, and apply. If you can implement this live, it is very impressive.

---

## Topic 8 : Memoization

---

**85. What is Memoization? Implement it.**

Answer:
Memoization is an optimization technique that caches the results of expensive function calls. When the same inputs occur again, it returns the cached result instead of recalculating. It trades memory for speed.

```javascript
function memoize(fn) {
    const cache = {};
    
    return function(...args) {
        const key = JSON.stringify(args);  // create unique key from arguments
        
        if (cache[key] !== undefined) {
            console.log("Cache hit!");
            return cache[key];
        }
        
        console.log("Computing...");
        const result = fn.apply(this, args);
        cache[key] = result;
        return result;
    };
}

// Expensive function
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoFib = memoize(fibonacci);
console.log(memoFib(35));  // Computing... (takes time first time)
console.log(memoFib(35));  // Cache hit! (instant)

// Practical: API call caching
const fetchUser = memoize(async function(userId) {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
});

await fetchUser(1);  // API call made
await fetchUser(1);  // returns cached result, no API call
```

Note:
- Key Point: Memoization works best for pure functions (same input always gives same output). Uses closures to maintain cache. JSON.stringify creates unique cache key. In React, useMemo and useCallback are built-in memoization hooks. Lodash has _.memoize().
- Why Interviewer Asks: Tests optimization knowledge and closure understanding. They may ask to implement memoize from scratch or optimize fibonacci with memoization.

---

## Topic 9 : Prototypes & Prototypal Inheritance

---

**86. What is Prototype in JavaScript?**

Answer:
Every JavaScript object has a hidden internal property called `[[Prototype]]` (accessible via `__proto__` or `Object.getPrototypeOf()`). This prototype is a reference to another object from which the current object inherits properties and methods.

When you access a property on an object and it does not exist on that object, JavaScript looks up the **prototype chain** until it finds the property or reaches `null`.

```javascript
const person = {
    greet() {
        return `Hello, I am ${this.name}`;
    }
};

const dev = {
    name: "Deep",
    age: 23
};

// Set person as prototype of dev
Object.setPrototypeOf(dev, person);
// Or: dev.__proto__ = person;

console.log(dev.name);     // "Deep" — found on dev itself
console.log(dev.greet());  // "Hello, I am Deep" — found on prototype (person)

// Prototype chain: dev → person → Object.prototype → null
console.log(dev.toString());  // "[object Object]" — found on Object.prototype
```

Note:
- Key Point: Prototype chain is how JS implements inheritance. Every object ultimately inherits from Object.prototype. Arrays inherit from Array.prototype, functions from Function.prototype. `__proto__` is the getter/setter for [[Prototype]] but Object.getPrototypeOf() is the recommended way.
- Why Interviewer Asks: Core JS concept. Understanding prototype is essential for understanding how methods like .toString(), .hasOwnProperty() are available on all objects.

---

**87. What is the difference between `__proto__` and `prototype`?**

Answer:

**`prototype`** — A property that exists ONLY on **functions** (specifically constructor functions). It is the object that will become the `__proto__` of instances created with `new`.

**`__proto__`** — A property that exists on EVERY **object**. It points to the object's prototype (the object it inherits from). It is the actual link in the prototype chain.

```javascript
function Person(name) {
    this.name = name;
}

// 'prototype' exists on the constructor function
Person.prototype.greet = function() {
    return `Hello, ${this.name}`;
};

const deep = new Person("Deep");

// 'deep.__proto__' points to 'Person.prototype'
console.log(deep.__proto__ === Person.prototype);  // true

// deep does not have 'prototype' property (it is not a function)
console.log(deep.prototype);  // undefined

// Chain:
// deep.__proto__ → Person.prototype
// Person.prototype.__proto__ → Object.prototype
// Object.prototype.__proto__ → null
```

Note:
- Key Point: `prototype` is a property of constructor functions used to define shared methods. `__proto__` is the actual prototype link on every object. `deep.__proto__ === Person.prototype` is always true for instances. Use `Object.getPrototypeOf()` instead of `__proto__` in production code.
- Why Interviewer Asks: Very commonly confused. Clear explanation of this shows deep understanding of JS object model.

---

**88. What is Prototypal Inheritance?**

Answer:
Prototypal Inheritance is the mechanism by which objects inherit properties and methods from other objects through the prototype chain. Unlike classical inheritance (classes in Java/C++), JS uses objects inheriting from objects.

```javascript
// Parent
function Animal(name) {
    this.name = name;
}
Animal.prototype.speak = function() {
    return `${this.name} makes a sound`;
};

// Child
function Dog(name, breed) {
    Animal.call(this, name);  // call parent constructor
    this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);  // Dog inherits from Animal
Dog.prototype.constructor = Dog;  // fix constructor reference

Dog.prototype.bark = function() {
    return `${this.name} barks!`;
};

const myDog = new Dog("Bruno", "Labrador");
console.log(myDog.speak());  // "Bruno makes a sound" — inherited from Animal
console.log(myDog.bark());   // "Bruno barks!" — own method

// Chain: myDog → Dog.prototype → Animal.prototype → Object.prototype → null
```

Note:
- Key Point: Object.create(proto) creates new object with given prototype. Animal.call(this, name) calls parent constructor with child's `this`. ES6 classes are syntactic sugar over this prototypal inheritance pattern. Understanding this helps understand how classes work internally.
- Why Interviewer Asks: Shows deep understanding of JS inheritance model. Common follow-up: "How do ES6 classes relate to prototypes?" Answer: classes are sugar over prototype-based inheritance.

---

## Topic 10 : Classes (ES6)

---

**89. What are ES6 Classes? How do they work?**

Answer:
ES6 Classes are syntactic sugar over prototypal inheritance. They provide a cleaner syntax for creating constructor functions and setting up prototype chains. Under the hood they still use prototypes.

```javascript
class Animal {
    // Constructor — called when 'new Animal()' is used
    constructor(name) {
        this.name = name;  // instance property
    }
    
    // Method — added to Animal.prototype
    speak() {
        return `${this.name} makes a sound`;
    }
    
    // Static method — called on class itself, not instances
    static isAnimal(obj) {
        return obj instanceof Animal;
    }
    
    // Getter
    get info() {
        return `Animal: ${this.name}`;
    }
}

// Inheritance with 'extends'
class Dog extends Animal {
    constructor(name, breed) {
        super(name);  // calls parent constructor (must be first line)
        this.breed = breed;
    }
    
    // Override parent method
    speak() {
        return `${this.name} barks!`;
    }
    
    // Access parent method
    parentSpeak() {
        return super.speak();  // calls Animal's speak()
    }
}

const dog = new Dog("Bruno", "Labrador");
console.log(dog.speak());          // "Bruno barks!" — overridden
console.log(dog.parentSpeak());    // "Bruno makes a sound" — parent method
console.log(dog.info);             // "Animal: Bruno" — inherited getter
console.log(Animal.isAnimal(dog)); // true — static method
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
```

Note:
- Key Point: Classes are NOT hoisted (unlike function declarations). `super()` must be called in child constructor before using `this`. Static methods belong to class not instances. Classes use strict mode by default. Under the hood it is still prototypal inheritance.
- Why Interviewer Asks: Used in React class components (legacy), TypeScript, and OOP patterns. They want to see if you understand constructor, inheritance, super, and static.

---

**90. What is the difference between Class and Function Constructor?**

Answer:

| Feature | Function Constructor | ES6 Class |
|---------|---------------------|-----------|
| Syntax | `function Person(){}` | `class Person{}` |
| Hoisting | Hoisted (can use before declaration) | NOT hoisted (TDZ) |
| Method definition | `Person.prototype.method = fn` | `method() {}` inside class |
| Strict mode | Not by default | Always strict mode |
| `new` keyword | Works without `new` (buggy behavior) | Must use `new` (throws error otherwise) |
| Inheritance | `Object.create` + `call` | `extends` + `super` |

```javascript
// Function Constructor
function PersonFn(name) {
    this.name = name;
}
PersonFn.prototype.greet = function() { return this.name; };

const p1 = new PersonFn("Deep");
const p2 = PersonFn("Deep");  // No error! But 'this' = window (bug)

// Class
class PersonClass {
    constructor(name) {
        this.name = name;
    }
    greet() { return this.name; }
}

const p3 = new PersonClass("Deep");
// const p4 = PersonClass("Deep");  // TypeError: Cannot call class as function
```

Note:
- Key Point: Classes enforce `new` keyword (safer). Classes are always in strict mode. Classes have cleaner syntax for inheritance. But functionally they do the same thing — create objects with prototype chain.
- Why Interviewer Asks: Shows you understand both old and new patterns. Understanding function constructors helps debug legacy code.

---

## Topic 11 : Modules

---

**91. What is the difference between CommonJS and ES Modules?**

Answer:

| Feature | CommonJS (CJS) | ES Modules (ESM) |
|---------|----------------|-------------------|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | **Synchronous** (blocking) | **Asynchronous** (non-blocking) |
| Where | Node.js (default) | Browser + Node.js (with config) |
| Tree Shaking | No (imports entire module) | Yes (imports only what you need) |
| Execution | Runtime (dynamic) | Parse time (static) |
| File extension | `.js` (default in Node) | `.mjs` or `"type": "module"` in package.json |

```javascript
// ========== CommonJS ==========
// math.js (exporting)
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
module.exports = { add, subtract };

// app.js (importing)
const { add, subtract } = require('./math');
console.log(add(2, 3));

// ========== ES Modules ==========
// math.js (exporting)
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export default function multiply(a, b) { return a * b; }

// app.js (importing)
import multiply, { add, subtract } from './math.js';
console.log(add(2, 3));
console.log(multiply(2, 3));
```

Note:
- Key Point: CommonJS loads synchronously (fine for server), ESM loads asynchronously (better for browser). ESM supports tree shaking (bundlers remove unused exports). React uses ESM (import/export). Node.js traditionally uses CommonJS but now supports ESM. You can have one `export default` per file and multiple named `export`.
- Why Interviewer Asks: You will use both in MERN stack — CommonJS in Node.js backend, ESM in React frontend. Understanding the difference is essential.

---

**92. What is the difference between Named Export and Default Export?**

Answer:

**Named Export** — You can have multiple named exports per file. Must import with exact same name (or use `as` to rename). Uses curly braces `{}` when importing.

**Default Export** — Only ONE default export per file. Can import with any name you want. No curly braces when importing.

```javascript
// ---- file: utils.js ----

// Named exports (multiple allowed)
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// Default export (only one allowed)
export default function multiply(a, b) { return a * b; }

// ---- file: app.js ----

// Import default — any name works, no braces
import myMultiply from './utils.js';

// Import named — exact name required, with braces
import { add, subtract, PI } from './utils.js';

// Import named with rename
import { add as sum } from './utils.js';

// Import all named as object
import * as utils from './utils.js';
console.log(utils.add(2, 3));
console.log(utils.default(2, 3));  // default export

// Import both default and named
import multiply, { add, subtract } from './utils.js';
```

Note:
- Key Point: Default export = one per file, import with any name. Named export = multiple per file, import with exact name. In React components are usually default exports. Utility functions are usually named exports.
- Why Interviewer Asks: Practical question for React development. Wrong import syntax is a common bug for beginners.

---

## Topic 12 : Error Handling

---

**93. How does try...catch...finally work?**

Answer:
`try...catch...finally` is used to handle runtime errors gracefully without crashing the program.

- **try** — Code that might throw an error
- **catch** — Runs only if an error occurs in try block. Receives the error object.
- **finally** — Always runs regardless of error or not. Used for cleanup.

```javascript
try {
    console.log("Try block starts");
    let result = JSON.parse("invalid json");  // throws SyntaxError
    console.log("This won't run");
    
} catch (error) {
    console.log(`Error caught: ${error.message}`);
    console.log(`Error type: ${error.name}`);     // SyntaxError
    console.log(`Stack trace: ${error.stack}`);
    
} finally {
    console.log("Finally always runs");
    // cleanup: close connections, hide loading spinner
}

console.log("Program continues normally");

// Output:
// Try block starts
// Error caught: Unexpected token i in JSON at position 0
// Error type: SyntaxError
// Finally always runs
// Program continues normally
```

**Error Types in JS:**
```
Error            — generic error
SyntaxError      — invalid syntax
ReferenceError   — undeclared variable accessed
TypeError        — wrong type operation (null.property)
RangeError       — number out of range (stack overflow)
URIError         — invalid URI
EvalError        — eval() related
```

Note:
- Key Point: catch block prevents program crash. finally always runs even if there is a return in try or catch. try...catch only catches runtime errors not syntax errors (parse-time errors). In async code use try...catch with await inside async functions.
- Why Interviewer Asks: Error handling is crucial in production code. They want to see you handle errors properly especially with API calls.

---

**94. How to create Custom Errors?**

Answer:

```javascript
// Custom Error Class
class ValidationError extends Error {
    constructor(message, field) {
        super(message);              // call parent constructor
        this.name = "ValidationError"; // custom error name
        this.field = field;           // custom property
    }
}

class NotFoundError extends Error {
    constructor(resource) {
        super(`${resource} not found`);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

// Usage
function validateAge(age) {
    if (typeof age !== "number") {
        throw new ValidationError("Age must be a number", "age");
    }
    if (age < 0 || age > 150) {
        throw new ValidationError("Age must be between 0 and 150", "age");
    }
    return true;
}

try {
    validateAge("twenty");
} catch (error) {
    if (error instanceof ValidationError) {
        console.log(`Validation failed on field: ${error.field}`);
        console.log(`Message: ${error.message}`);
    } else {
        throw error;  // re-throw unknown errors
    }
}
```

Note:
- Key Point: Extend Error class for custom errors. Use `instanceof` to handle different error types differently. Custom errors are common in Express.js for API error responses (404, 400, 401 errors). Always call super(message) first in constructor.
- Why Interviewer Asks: Shows you write production-quality code with proper error handling. Very relevant for building Express.js APIs.

---

## Topic 13 : Recursion & Generator Functions

---

**95. What is Recursion? What is the base case?**

Answer:
Recursion is when a function calls itself to solve a problem by breaking it into smaller sub-problems. Every recursive function MUST have a **base case** (stopping condition) otherwise it will cause infinite recursion and stack overflow.

```javascript
// Factorial: n! = n * (n-1)!
function factorial(n) {
    if (n === 0 || n === 1) return 1;   // Base case — stops recursion
    return n * factorial(n - 1);         // Recursive case
}
console.log(factorial(5));  // 120 (5 * 4 * 3 * 2 * 1)

// Call Stack visualization:
// factorial(5) → 5 * factorial(4)
//                    4 * factorial(3)
//                        3 * factorial(2)
//                            2 * factorial(1)
//                                1  ← base case, starts returning
//                            2 * 1 = 2
//                        3 * 2 = 6
//                    4 * 6 = 24
// 5 * 24 = 120

// Fibonacci
function fibonacci(n) {
    if (n <= 1) return n;                // Base case
    return fibonacci(n-1) + fibonacci(n-2);  // Two recursive calls
}

// Flatten nested array (any depth)
function flattenArray(arr) {
    let result = [];
    for (let item of arr) {
        if (Array.isArray(item)) {
            result = result.concat(flattenArray(item));  // recurse for nested
        } else {
            result.push(item);
        }
    }
    return result;
}
console.log(flattenArray([1, [2, [3, [4]]]]));  // [1, 2, 3, 4]
```

Note:
- Key Point: Every recursion must have a base case. Each recursive call adds a frame to call stack. Too deep recursion causes stack overflow. Recursion can always be converted to iteration (loop) and vice versa. Recursion is natural for tree traversal, nested structures, and divide-and-conquer problems.
- Why Interviewer Asks: Tests problem-solving ability. Common questions: factorial, fibonacci, flatten array, deep clone object. The base case concept is crucial.

---

**96. What are Generator Functions?**

Answer:
Generator functions are special functions that can be paused and resumed. They use `function*` syntax and `yield` keyword to produce a sequence of values one at a time (lazy evaluation). Each call to `.next()` runs the function until the next `yield` and returns `{value, done}`.

```javascript
function* numberGenerator() {
    console.log("Start");
    yield 1;                    // pause here, return 1
    console.log("After first yield");
    yield 2;                    // pause here, return 2
    console.log("After second yield");
    yield 3;                    // pause here, return 3
    console.log("End");
    return "Done";              // final value, done: true
}

const gen = numberGenerator();

console.log(gen.next());  // "Start" → { value: 1, done: false }
console.log(gen.next());  // "After first yield" → { value: 2, done: false }
console.log(gen.next());  // "After second yield" → { value: 3, done: false }
console.log(gen.next());  // "End" → { value: "Done", done: true }
console.log(gen.next());  // { value: undefined, done: true }

// Infinite sequence
function* infiniteCounter() {
    let count = 0;
    while (true) {
        yield count++;
    }
}
const counter = infiniteCounter();
console.log(counter.next().value);  // 0
console.log(counter.next().value);  // 1
console.log(counter.next().value);  // 2
// Can go on forever — generates values on demand

// Iterating with for...of
function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}
for (let num of range(1, 5)) {
    console.log(num);  // 1, 2, 3, 4, 5
}
```

Note:
- Key Point: yield pauses function, next() resumes it. Generators are lazy — values are computed on demand not all at once (memory efficient for large/infinite sequences). Used in Redux-Saga for managing side effects. return statement sets done: true, yield keeps done: false.
- Why Interviewer Asks: Advanced topic but shows you know beyond basics. Practical use in Redux-Saga is relevant for MERN developers.

---

## Topic 14 : ES6+ Features

---

**97. What is Optional Chaining (?.) and Nullish Coalescing (??)?**

Answer:
**Optional Chaining (`?.`)** — Safely access deeply nested properties. If any part is null or undefined, it returns `undefined` instead of throwing an error.

**Nullish Coalescing (`??`)** — Returns right-hand operand when left-hand is `null` or `undefined` (NOT for other falsy values like 0 or "").

```javascript
const user = {
    name: "Deep",
    address: {
        city: "Surat"
    }
};

// Without optional chaining — CRASHES
// console.log(user.company.name);  // TypeError: Cannot read property 'name' of undefined

// With optional chaining — SAFE
console.log(user.company?.name);        // undefined (no error)
console.log(user.address?.city);        // "Surat"
console.log(user.getAge?.());           // undefined (method does not exist)
console.log(user.hobbies?.[0]);         // undefined (array does not exist)

// ---- Nullish Coalescing (??) ----
let count = 0;

// Problem with || (OR operator) — treats 0, "", false as falsy
console.log(count || 10);     // 10 — WRONG! We wanted 0 but || treats 0 as falsy

// Solution with ?? — only null/undefined trigger default
console.log(count ?? 10);     // 0 — CORRECT! 0 is not null/undefined
console.log(null ?? "default");    // "default"
console.log(undefined ?? "default"); // "default"
console.log("" ?? "default");      // "" — empty string is not null/undefined
console.log(false ?? "default");   // false — false is not null/undefined

// Combining both
const userCity = user?.address?.city ?? "Unknown City";
console.log(userCity);  // "Surat"
```

Note:
- Key Point: `?.` prevents "Cannot read property of undefined" errors. `??` is better than `||` for defaults because it only catches null and undefined, not 0 or "". Used heavily in React when API response data might be incomplete.
- Why Interviewer Asks: Modern JS features used daily in React. Shows you write safe code that handles missing data gracefully.

---

**98. What is Short Circuit Evaluation?**

Answer:
Short Circuit Evaluation is when logical operators (`&&`, `||`) stop evaluating as soon as the result is determined.

**`||` (OR)** — Returns the FIRST truthy value. If all falsy returns the last value.
**`&&` (AND)** — Returns the FIRST falsy value. If all truthy returns the last value.

```javascript
// || (OR) — returns first truthy
console.log(null || "Deep" || undefined);    // "Deep" (first truthy)
console.log(0 || "" || false || "found");    // "found" (first truthy)
console.log(null || undefined || 0);         // 0 (all falsy, returns last)

// Used for default values (before ?? existed)
let name = userInput || "Default Name";

// && (AND) — returns first falsy
console.log(1 && 2 && 3);                   // 3 (all truthy, returns last)
console.log(1 && 0 && 3);                   // 0 (first falsy)
console.log(null && "Deep");                 // null (first falsy)

// Used for conditional execution (common in React JSX)
const isLoggedIn = true;
isLoggedIn && console.log("Welcome!");       // prints "Welcome!"
// In React: {isLoggedIn && <Dashboard />}

// Practical examples
const user = null;
const userName = user && user.name;          // null (safe access before ?. existed)
const port = process.env.PORT || 3000;       // default port
```

Note:
- Key Point: `||` finds first truthy (default values). `&&` finds first falsy (conditional execution). In React JSX, `condition && <Component />` is very common pattern for conditional rendering. `??` is preferred over `||` for defaults now because `||` treats 0 and "" as falsy.
- Why Interviewer Asks: Used in React conditional rendering. They may ask output of expressions with mixed && and ||.

---

**99. What is Template Literal and Tagged Template?**

Answer:
**Template Literals** — Strings with backticks that support interpolation `${}` and multi-line text.

**Tagged Templates** — A function that processes template literal. The function receives the string parts and values separately.

```javascript
// Template Literal — basic interpolation
const name = "Deep";
const age = 23;
console.log(`My name is ${name} and I am ${age} years old`);

// Multi-line
const html = `
    <div>
        <h1>${name}</h1>
        <p>Age: ${age}</p>
    </div>
`;

// Expression inside
console.log(`Sum: ${2 + 3}`);          // "Sum: 5"
console.log(`Adult: ${age >= 18}`);     // "Adult: true"

// ---- Tagged Template ----
function highlight(strings, ...values) {
    // strings = ["Hello ", ", you are ", " years old"]
    // values = ["Deep", 23]
    let result = "";
    strings.forEach((str, i) => {
        result += str;
        if (values[i] !== undefined) {
            result += `**${values[i]}**`;  // wrap values in bold
        }
    });
    return result;
}

const output = highlight`Hello ${name}, you are ${age} years old`;
console.log(output);  // "Hello **Deep**, you are **23** years old"

// Real-world: styled-components in React uses tagged templates
// const Button = styled.button`
//     background: ${props => props.primary ? 'blue' : 'gray'};
//     color: white;
// `;
```

Note:
- Key Point: Template literals use backticks not quotes. Can embed any expression inside ${}. Tagged templates are used by libraries like styled-components (CSS-in-JS for React) and GraphQL (gql tag). Understanding tagged templates helps understand how styled-components work.
- Why Interviewer Asks: Template literals are basic but tagged templates are advanced. Mentioning styled-components shows practical knowledge.

---

**100. What is Symbol in JavaScript?**

Answer:
Symbol is a primitive data type introduced in ES6. Every Symbol value is **unique and immutable**. Used to create unique property keys that will never conflict with other property names.

```javascript
// Creating symbols
const id = Symbol("id");
const anotherId = Symbol("id");

console.log(id === anotherId);  // false — every Symbol is unique
console.log(typeof id);         // "symbol"

// Using Symbol as object property key
const user = {
    name: "Deep",
    [id]: 123            // Symbol as key — unique, won't conflict
};

console.log(user[id]);   // 123
console.log(user.id);    // undefined — cannot access with dot notation

// Symbols are NOT included in normal iteration
console.log(Object.keys(user));                // ["name"] — no Symbol
console.log(JSON.stringify(user));             // '{"name":"Deep"}' — no Symbol
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(id)] — special method

// Well-known Symbols (built-in)
// Symbol.iterator — defines how object is iterated
// Symbol.toPrimitive — defines type conversion
// Symbol.hasInstance — defines instanceof behavior
```

Note:
- Key Point: Every Symbol is guaranteed unique. Used for creating "hidden" or "private-like" properties that won't conflict or show in normal iteration. Well-known Symbols customize built-in behaviors. Not commonly asked in entry-level but good to know.
- Why Interviewer Asks: Shows you know ES6 deeply beyond the commonly used features. Rarely asked at entry level but knowing it is a bonus.

---

**101. What is `for...in` vs `for...of`?**

Answer:

**`for...in`** — Iterates over **enumerable property KEYS** (including inherited ones). Used for **objects**.

**`for...of`** — Iterates over **iterable VALUES**. Used for **arrays, strings, Maps, Sets**. Cannot be used on plain objects.

```javascript
const arr = ["a", "b", "c"];
const obj = { name: "Deep", age: 23 };

// for...in — gets KEYS (indexes for arrays, property names for objects)
for (let key in arr) {
    console.log(key);        // "0", "1", "2" (indexes as strings!)
}
for (let key in obj) {
    console.log(key);        // "name", "age"
}

// for...of — gets VALUES (for iterables only)
for (let value of arr) {
    console.log(value);      // "a", "b", "c"
}
for (let char of "Deep") {
    console.log(char);       // "D", "e", "e", "p"
}

// for...of on plain object — ERROR
// for (let value of obj) {}  // TypeError: obj is not iterable

// To iterate object values with for...of:
for (let value of Object.values(obj)) {
    console.log(value);      // "Deep", 23
}
for (let [key, value] of Object.entries(obj)) {
    console.log(key, value); // "name" "Deep", "age" 23
}
```

Note:
- Key Point: for...in = keys (objects). for...of = values (arrays, strings, iterables). for...in on arrays gives string indexes and can include prototype properties (dangerous). Use for...of or forEach for arrays, for...in for objects. Object.entries() makes objects work with for...of.
- Why Interviewer Asks: Very common confusion. They give code with for...in on array and ask output. The string indexes trap catches many candidates.

---

**102. What is Map and Set? How are they different from Object and Array?**

Answer:
**Map** — Key-value pairs where keys can be ANY type (objects, functions, primitives). Maintains insertion order. Has `.size` property.

**Set** — Collection of UNIQUE values. No duplicates allowed. Maintains insertion order.

```javascript
// ===== MAP =====
const map = new Map();

// Any type as key (unlike Object which only allows string/symbol keys)
map.set("name", "Deep");
map.set(42, "number key");
map.set(true, "boolean key");
const objKey = { id: 1 };
map.set(objKey, "object key");

console.log(map.get("name"));      // "Deep"
console.log(map.get(42));          // "number key"
console.log(map.has("name"));     // true
console.log(map.size);             // 4
map.delete(42);
map.forEach((value, key) => console.log(key, value));

// Map vs Object
// Map: any key type, ordered, .size, better for frequent add/delete
// Object: only string/symbol keys, has prototype, JSON serializable

// ===== SET =====
const set = new Set();
set.add(1);
set.add(2);
set.add(3);
set.add(2);  // duplicate — ignored!
set.add(1);  // duplicate — ignored!

console.log(set);       // Set {1, 2, 3}
console.log(set.size);  // 3
console.log(set.has(2)); // true

// Remove duplicates from array — most common use case
const arr = [1, 2, 3, 2, 4, 1, 5, 3];
const unique = [...new Set(arr)];
console.log(unique);  // [1, 2, 3, 4, 5]

// Set vs Array
// Set: no duplicates, has() is O(1), no index access
// Array: allows duplicates, includes() is O(n), index access
```

Note:
- Key Point: Map allows any type as key and is ordered. Set stores only unique values. `[...new Set(array)]` is the easiest way to remove duplicates. Map and Set are iterable with for...of. WeakMap and WeakSet allow garbage collection of their keys.
- Why Interviewer Asks: "How do you remove duplicates from an array?" → `[...new Set(arr)]`. This is one of the most asked practical questions.

---

**103. What is WeakMap and WeakSet?**

Answer:
**WeakMap** — Like Map but keys MUST be objects (not primitives). Keys are held "weakly" meaning if no other reference to the key object exists, it can be garbage collected even though it is in the WeakMap.

**WeakSet** — Like Set but values MUST be objects. Values are held weakly.

```javascript
// ===== WeakMap =====
const weakMap = new WeakMap();
let user = { name: "Deep" };

weakMap.set(user, "user data");
console.log(weakMap.get(user));  // "user data"

user = null;  // remove only reference to the object
// Now the {name:"Deep"} object AND its WeakMap entry can be garbage collected

// WeakMap limitations:
// - No .size property
// - Not iterable (no forEach, no for...of)
// - No .keys(), .values(), .entries()
// - Only .get(), .set(), .has(), .delete()

// Practical use: Store private data for objects
const privateData = new WeakMap();

class Person {
    constructor(name, age) {
        privateData.set(this, { name, age });
    }
    getName() {
        return privateData.get(this).name;
    }
}

// ===== WeakSet =====
const weakSet = new WeakSet();
let obj = { id: 1 };
weakSet.add(obj);
console.log(weakSet.has(obj));  // true

obj = null;  // object can be garbage collected
```

Note:
- Key Point: WeakMap/WeakSet prevent memory leaks by allowing garbage collection of key/value objects. Not iterable and no size. Use when you want to associate data with objects that should be garbage collected when no longer needed. Practical for caching, storing metadata, and tracking visited objects.
- Why Interviewer Asks: Advanced question. Shows you understand garbage collection and memory management. Practical use in private data pattern is a strong answer.

---

## Topic 15 : Promises (Deep Dive)

---

**104. How to convert a callback-based function to a Promise?**

Answer:
Wrapping a callback function inside a `new Promise()` is called **Promisification**.

```javascript
// Old callback-based function
const fs = require('fs');

fs.readFile('file.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

// Promisified version
function readFilePromise(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

// Now you can use with async/await
async function main() {
    try {
        const data = await readFilePromise('file.txt');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

// Node.js built-in promisify utility
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

// Or use fs.promises (modern Node.js)
const fsPromises = require('fs').promises;
const data = await fsPromises.readFile('file.txt', 'utf-8');
```

Note:
- Key Point: Wrap callback in new Promise — resolve on success, reject on error. Node.js has util.promisify() built-in. Modern Node.js has promise-based versions of most APIs (fs.promises, dns.promises). In MERN projects always prefer promise/async versions.
- Why Interviewer Asks: Practical Node.js question. Shows you can work with both callback and promise patterns and convert between them.

---

**105. What happens if you forget to handle a rejected Promise?**

Answer:
If a promise is rejected and there is no `.catch()` or try/catch to handle it, you get an **Unhandled Promise Rejection**. In Node.js (version 15+), this will **crash the process** by default.

```javascript
// No catch — unhandled rejection!
const promise = new Promise((resolve, reject) => {
    reject("Something failed!");
});
// No .catch() — UnhandledPromiseRejectionWarning

// Even in a chain — if catch is missing
fetch('/api/data')
    .then(res => res.json())
    .then(data => {
        throw new Error("Processing failed");
    });
// No .catch() at the end — unhandled rejection

// Node.js global handler for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection:', reason);
    // Log error, send alert, gracefully shutdown
    process.exit(1);
});

// Browser global handler
window.addEventListener('unhandledrejection', (event) => {
    console.log('Unhandled Rejection:', event.reason);
    event.preventDefault();
});
```

Note:
- Key Point: Always add .catch() at the end of promise chains or use try/catch with await. In Node.js 15+ unhandled rejections crash the process. Add a global handler as safety net but do not rely on it. ESLint rule `no-floating-promises` can catch these at development time.
- Why Interviewer Asks: Tests if you write production-safe code. Unhandled rejections are a common source of crashes in Node.js servers.

---

**106. What is the difference between Promise.resolve() and new Promise(resolve => resolve())?**

Answer:
**`Promise.resolve(value)`** — Immediately creates a resolved promise with the given value. Shorthand for creating already resolved promises.

**`new Promise(resolve => resolve(value))`** — Creates a new promise and resolves it inside the executor. More verbose but same end result for simple cases.

```javascript
// These are essentially the same:
const p1 = Promise.resolve("Hello");
const p2 = new Promise(resolve => resolve("Hello"));

// Both:
p1.then(val => console.log(val));  // "Hello"
p2.then(val => console.log(val));  // "Hello"

// Promise.resolve with a thenable (auto-unwraps)
const thenable = {
    then(resolve) {
        resolve("From thenable");
    }
};
const p3 = Promise.resolve(thenable);
p3.then(val => console.log(val));  // "From thenable"

// Promise.resolve with another promise (returns same promise)
const original = new Promise(resolve => resolve("Original"));
const p4 = Promise.resolve(original);
console.log(p4 === original);  // true! Same reference

// Promise.reject shorthand
const rejected = Promise.reject("Error!");
rejected.catch(err => console.log(err));  // "Error!"
```

Note:
- Key Point: Promise.resolve() is a shorthand. If you pass a promise to Promise.resolve(), it returns the same promise (no wrapping). If you pass a thenable, it unwraps it. Promise.reject() is the shorthand for rejections. Use these for testing, returning immediate values, or starting promise chains.
- Why Interviewer Asks: Tests understanding of promise internals. The "same reference" behavior when passing a promise to Promise.resolve is a subtle but important detail.

---

## Topic 16 : Async/Await (Advanced)

---

**107. How to run multiple async operations in parallel with async/await?**

Answer:

```javascript
// SEQUENTIAL — slow (waits for each one before starting next)
async function sequential() {
    const user = await fetchUser(1);       // waits 2 sec
    const posts = await fetchPosts(1);     // then waits 2 sec
    const comments = await fetchComments(1); // then waits 2 sec
    // Total: ~6 seconds
}

// PARALLEL — fast (all start at the same time)
async function parallel() {
    // Start all at once
    const userPromise = fetchUser(1);
    const postsPromise = fetchPosts(1);
    const commentsPromise = fetchComments(1);
    
    // Wait for all to complete
    const [user, posts, comments] = await Promise.all([
        userPromise,
        postsPromise,
        commentsPromise
    ]);
    // Total: ~2 seconds (longest single operation)
}

// PARALLEL with error handling
async function parallelSafe() {
    try {
        const results = await Promise.all([
            fetchUser(1),
            fetchPosts(1),
            fetchComments(1)
        ]);
        const [user, posts, comments] = results;
    } catch (error) {
        console.log("One of the operations failed:", error);
    }
}

// PARALLEL but get all results (even if some fail)
async function parallelAllSettled() {
    const results = await Promise.allSettled([
        fetchUser(1),
        fetchPosts(1),
        fetchComments(1)
    ]);
    
    results.forEach(result => {
        if (result.status === 'fulfilled') {
            console.log("Success:", result.value);
        } else {
            console.log("Failed:", result.reason);
        }
    });
}
```

Note:
- Key Point: `await` one after another = sequential (slow). Start all promises first then `await Promise.all()` = parallel (fast). Use `Promise.allSettled` when you want results even if some fail. In real APIs, fetching unrelated data should always be parallel.
- Why Interviewer Asks: Very practical question. Shows you optimize API calls. Most beginners write sequential code when parallel would be much faster.

---

**108. What is the difference between `return` and `return await` in async functions?**

Answer:

```javascript
// Scenario 1: Without try/catch — NO difference
async function noTryCatch() {
    return fetchData();        // same as return await fetchData()
}

// Scenario 2: WITH try/catch — IMPORTANT difference
async function withReturn() {
    try {
        return fetchData();  // returns promise directly — catch won't catch rejection!
    } catch (error) {
        console.log("This will NOT catch fetchData errors");
    }
}

async function withReturnAwait() {
    try {
        return await fetchData();  // awaits the promise — catch WILL catch rejection!
    } catch (error) {
        console.log("This WILL catch fetchData errors");
    }
}

// Example:
async function fetchData() {
    throw new Error("API Failed");
}

// withReturn() — error is NOT caught, propagates to caller
// withReturnAwait() — error IS caught by catch block
```

Note:
- Key Point: Inside try/catch always use `return await` not just `return`. Without await the promise is returned directly and the catch block cannot intercept rejections. Without try/catch there is no difference. ESLint rule `no-return-await` can help catch this.
- Why Interviewer Asks: Subtle but important difference that shows advanced async understanding. Most developers get this wrong.

---

## Topic 17 : Event Loop (More Output Questions)

---

**109. Predict the output — Complex Event Loop question.**

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

new Promise((resolve) => {
    console.log("3");
    resolve();
    console.log("4");
}).then(() => {
    console.log("5");
}).then(() => {
    console.log("6");
});

console.log("7");
```

Answer:
```
1
3
4
7
5
6
2
```

**Explanation:**
1. `console.log("1")` — sync → prints **1**
2. `setTimeout` → macrotask queue
3. `new Promise(executor)` — executor runs SYNCHRONOUSLY
4. `console.log("3")` — sync inside executor → prints **3**
5. `resolve()` — promise resolved, .then callback goes to microtask queue
6. `console.log("4")` — sync inside executor (resolve does NOT stop execution) → prints **4**
7. `.then(() => console.log("5"))` — microtask queue
8. `console.log("7")` — sync → prints **7**
9. Call Stack empty → microtask queue → prints **5**
10. `.then(() => console.log("6"))` — chained microtask → prints **6**
11. Microtask queue empty → macrotask queue → prints **2**

Note:
- Key Point: Promise executor function runs SYNCHRONOUSLY. resolve() does not stop execution — code after resolve still runs. .then() callbacks go to microtask queue. All microtasks run before any macrotask.
- Why Interviewer Asks: This exact pattern is very commonly asked. The "code after resolve still runs" is the main trap.

---

**110. Predict the output — async/await Event Loop.**

```javascript
async function foo() {
    console.log("foo start");
    await bar();
    console.log("foo end");
}

async function bar() {
    console.log("bar");
}

console.log("script start");
foo();
console.log("script end");
```

Answer:
```
script start
foo start
bar
script end
foo end
```

**Explanation:**
1. `console.log("script start")` — sync → prints **script start**
2. `foo()` called
3. Inside foo: `console.log("foo start")` — sync → prints **foo start**
4. `await bar()` — bar() is called synchronously
5. Inside bar: `console.log("bar")` — sync → prints **bar**
6. bar() returns resolved promise → `await` pauses foo → everything after await goes to microtask queue
7. Control returns to global → `console.log("script end")` → prints **script end**
8. Call Stack empty → microtask queue → `console.log("foo end")` → prints **foo end**

Note:
- Key Point: `await` splits the function into two parts — before await (sync) and after await (microtask). The code after await is like a .then() callback. This is why "script end" prints before "foo end".
- Why Interviewer Asks: Tests understanding of how await interacts with event loop. The "await splits the function" mental model is key.

---

**111. Predict the output — setTimeout vs Promise vs process.nextTick.**

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => {
    console.log("3");
    process.nextTick(() => console.log("4"));
});

process.nextTick(() => {
    console.log("5");
    Promise.resolve().then(() => console.log("6"));
});

console.log("7");
```

Answer (Node.js):
```
1
7
5
6
3
4
2
```

**Explanation:**
1. `console.log("1")` — sync → **1**
2. `setTimeout` → macrotask queue
3. `Promise.then(3)` → microtask queue
4. `process.nextTick(5)` → nextTick queue (highest priority)
5. `console.log("7")` — sync → **7**
6. Call Stack empty → nextTick queue first → prints **5**
7. Inside nextTick: Promise.then(6) → microtask queue
8. nextTick queue empty → microtask queue → prints **6**
9. microtask queue → prints **3**
10. Inside .then(3): process.nextTick(4) → nextTick queue
11. nextTick queue (runs between phases) → prints **4**
12. macrotask queue → prints **2**

Note:
- Key Point: Priority order: sync > nextTick > Promise.then > setTimeout. Microtasks created inside nextTick run before existing microtasks from the original queue complete their phase. This is Node.js specific — browsers do not have process.nextTick.
- Why Interviewer Asks: Advanced Node.js event loop question. If you get this right you demonstrate expert-level understanding.

---

## Topic 18 : Node.js (Deep Dive)

---

**112. What are the core modules of Node.js?**

Answer:
Node.js comes with built-in modules that do not need installation:

```javascript
// 1. http — Create HTTP server
const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World');
}).listen(3000);

// 2. fs — File System operations
const fs = require('fs');
// Async
fs.readFile('file.txt', 'utf-8', (err, data) => console.log(data));
// Sync (blocks main thread)
const data = fs.readFileSync('file.txt', 'utf-8');
// Promise-based
const fsPromises = require('fs').promises;
const content = await fsPromises.readFile('file.txt', 'utf-8');

// 3. path — File path utilities
const path = require('path');
path.join(__dirname, 'folder', 'file.txt');   // joins path parts
path.resolve('./folder', 'file.txt');          // absolute path
path.extname('file.txt');                       // '.txt'
path.basename('/path/to/file.txt');             // 'file.txt'

// 4. os — Operating system info
const os = require('os');
os.cpus();        // CPU info
os.totalmem();    // total memory
os.freemem();     // free memory
os.platform();    // 'linux', 'win32', 'darwin'

// 5. url — URL parsing
const url = require('url');
const myUrl = new URL('https://example.com/path?name=Deep&age=23');
console.log(myUrl.hostname);     // 'example.com'
console.log(myUrl.searchParams); // URLSearchParams { 'name' => 'Deep', 'age' => '23' }

// 6. events — Event emitter
const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.on('greet', (name) => console.log(`Hello ${name}`));
emitter.emit('greet', 'Deep');

// 7. crypto — Cryptographic functions
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update('password').digest('hex');

// 8. util — Utility functions (promisify, format, inspect)
// 9. stream — Handle streaming data
// 10. buffer — Handle binary data
// 11. child_process — Spawn child processes
// 12. cluster — Multi-process for scaling
```

Note:
- Key Point: Core modules do not need npm install. Most important for MERN: http (Express uses internally), fs (file operations), path (file paths), events (EventEmitter pattern). Always use async versions of fs to avoid blocking main thread.
- Why Interviewer Asks: Practical Node.js question. They want to know if you have used core modules beyond Express.

---

**113. What is EventEmitter in Node.js?**

Answer:
EventEmitter is a Node.js core class that implements the **Observer/Pub-Sub pattern**. It allows objects to emit named events and register listener functions for those events. Many Node.js core modules (http, fs, stream) are built on EventEmitter.

```javascript
const EventEmitter = require('events');

// Create emitter
const emitter = new EventEmitter();

// Register listener (subscriber)
emitter.on('userSignup', (user) => {
    console.log(`Welcome email sent to ${user.email}`);
});

emitter.on('userSignup', (user) => {
    console.log(`Analytics tracked for ${user.name}`);
});

// One-time listener
emitter.once('serverStart', (port) => {
    console.log(`Server started on port ${port}`);
});

// Emit event (publisher)
emitter.emit('userSignup', { name: 'Deep', email: 'deep@test.com' });
// Output:
// Welcome email sent to deep@test.com
// Analytics tracked for Deep

emitter.emit('serverStart', 3000);  // prints once
emitter.emit('serverStart', 3000);  // nothing — once listener removed

// Remove listener
const handler = () => console.log('handler');
emitter.on('event', handler);
emitter.removeListener('event', handler);

// Error handling
emitter.on('error', (err) => {
    console.error('Error:', err.message);
});
emitter.emit('error', new Error('Something failed'));
```

Note:
- Key Point: on() registers listener, emit() triggers event, once() runs only first time. Events are synchronous — listeners execute in order they were registered. Always add 'error' event handler or unhandled errors crash the process. Express request/response objects are EventEmitters.
- Why Interviewer Asks: Core Node.js pattern. Used in streams, HTTP server, and many real-world scenarios like notification systems, logging, and microservices communication.

---

**114. What is the difference between readFileSync and readFile in Node.js?**

Answer:

**`fs.readFileSync()`** — **Synchronous** (blocking). Stops execution until file is completely read. Returns the file content directly. Main thread is blocked during reading.

**`fs.readFile()`** — **Asynchronous** (non-blocking). Does not stop execution. Takes a callback that runs when file reading is complete. Main thread continues processing other requests.

```javascript
const fs = require('fs');

// ===== Synchronous — BLOCKING =====
console.log("Before sync read");
const data = fs.readFileSync('file.txt', 'utf-8');  // BLOCKS here
console.log(data);
console.log("After sync read");
// Output: Before → data → After (sequential)

// ===== Asynchronous — NON-BLOCKING =====
console.log("Before async read");
fs.readFile('file.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);  // runs later
});
console.log("After async read");
// Output: Before → After → data (non-blocking)

// ===== Promise-based (BEST) =====
const fsPromises = require('fs').promises;

async function readFile() {
    try {
        const data = await fsPromises.readFile('file.txt', 'utf-8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
```

Note:
- Key Point: Never use sync methods in production server — they block the entire event loop, preventing other requests from being processed. Sync is only acceptable in CLI scripts or during server startup (reading config files). Always use async (callback or promise) in web servers.
- Why Interviewer Asks: Tests if you understand blocking vs non-blocking. Using sync in a server is a common mistake that shows lack of Node.js understanding.

---

**115. What are Streams in Node.js?**

Answer:
Streams are objects that let you read or write data **piece by piece (chunk by chunk)** instead of loading everything into memory at once. This is essential for handling large files, video streaming, or network data.

There are 4 types of streams:
1. **Readable** — source of data (fs.createReadStream, HTTP request)
2. **Writable** — destination for data (fs.createWriteStream, HTTP response)
3. **Duplex** — both readable and writable (TCP socket)
4. **Transform** — modify data while reading/writing (compression, encryption)

```javascript
const fs = require('fs');

// Without streams — loads ENTIRE file into memory (bad for large files)
fs.readFile('large-file.txt', (err, data) => {
    // entire 2GB file loaded in memory — can crash!
    fs.writeFile('copy.txt', data, () => {});
});

// With streams — processes chunk by chunk (memory efficient)
const readStream = fs.createReadStream('large-file.txt');
const writeStream = fs.createWriteStream('copy.txt');

readStream.pipe(writeStream);  // pipe connects readable to writable

// Events on readable stream
readStream.on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes`);
});
readStream.on('end', () => {
    console.log('Reading complete');
});
readStream.on('error', (err) => {
    console.error('Error:', err);
});

// Express streaming response
app.get('/video', (req, res) => {
    const stream = fs.createReadStream('./video.mp4');
    stream.pipe(res);  // stream video to client
});
```

Note:
- Key Point: Streams process data in chunks — memory efficient for large data. pipe() is the easiest way to connect streams. HTTP request is a readable stream, HTTP response is a writable stream. Express can stream file downloads using pipe. Streams use EventEmitter internally.
- Why Interviewer Asks: Important for handling file uploads, downloads, and large data in Node.js. Shows you build scalable applications.

---

**116. What is Buffer in Node.js?**

Answer:
Buffer is a class that stores raw binary data in Node.js. It is like an array of integers but corresponds to a fixed-size raw memory allocation outside the V8 heap. Buffers are used when working with binary data like files, network streams, or images.

```javascript
// Creating buffers
const buf1 = Buffer.alloc(10);           // 10 bytes, filled with zeros
const buf2 = Buffer.from("Deep");        // from string
const buf3 = Buffer.from([68, 101, 101, 112]); // from byte array

console.log(buf2);             // <Buffer 44 65 65 70>
console.log(buf2.toString());  // "Deep"
console.log(buf2.length);      // 4 bytes
console.log(buf2[0]);          // 68 (ASCII of 'D')
console.log(buf2.toJSON());    // { type: 'Buffer', data: [68, 101, 101, 112] }

// Buffer comparison
const a = Buffer.from("abc");
const b = Buffer.from("abc");
console.log(a.equals(b));     // true

// Buffer concatenation
const combined = Buffer.concat([buf2, Buffer.from(" Patel")]);
console.log(combined.toString());  // "Deep Patel"

// Buffers and streams
const readStream = fs.createReadStream('file.txt');
readStream.on('data', (chunk) => {
    console.log(typeof chunk);      // 'object' — it is a Buffer
    console.log(chunk.toString());  // convert buffer to readable string
});
```

Note:
- Key Point: Buffers store raw binary data outside V8 heap. Stream chunks are Buffers by default. Use toString() to convert Buffer to string. Buffer.alloc() is safer than Buffer.allocUnsafe() (allocUnsafe is faster but may contain old memory data). Important for file I/O, network protocols, and image processing.
- Why Interviewer Asks: Shows understanding of how Node.js handles binary data. Connected to streams and file operations.

---

**117. What is the difference between process.nextTick() and setImmediate()?**

Answer:

| Feature | `process.nextTick()` | `setImmediate()` |
|---------|---------------------|------------------|
| Queue | nextTick queue (microtask) | Check phase of event loop (macrotask) |
| Priority | Higher — runs before anything else async | Lower — runs in check phase after poll |
| When it runs | After current operation, before event loop continues | After current poll phase completes |
| Recursive risk | Can starve I/O if used recursively | Does not starve I/O |

```javascript
console.log("Start");

setImmediate(() => {
    console.log("setImmediate");
});

process.nextTick(() => {
    console.log("nextTick");
});

console.log("End");

// Output:
// Start
// End
// nextTick      ← runs first (highest async priority)
// setImmediate  ← runs in check phase
```

```javascript
// Recursive nextTick can starve I/O — BAD
process.nextTick(function recursive() {
    process.nextTick(recursive);  // nextTick queue never empties!
    // I/O callbacks, setTimeout, setImmediate will NEVER run
});

// Recursive setImmediate is safe
setImmediate(function recursive() {
    setImmediate(recursive);  // runs once per event loop cycle
    // Other callbacks still get to run between iterations
});
```

Note:
- Key Point: nextTick = highest async priority but can starve event loop. setImmediate = runs in check phase, safer for recursive async. Use nextTick when you need something to run immediately after current operation. Use setImmediate for deferring work to next event loop cycle.
- Why Interviewer Asks: Node.js specific advanced question. Shows deep understanding of event loop phases and timing. The "starving I/O" concept is important.

---

## Topic 19 : Fetch API & CORS

---

**118. How does the Fetch API work?**

Answer:
`fetch()` is a modern built-in API for making HTTP requests. It returns a Promise that resolves to a Response object. The response body needs to be parsed using `.json()`, `.text()`, `.blob()`, etc.

```javascript
// Basic GET request
const response = await fetch('https://api.example.com/users');
const data = await response.json();  // parse JSON body

// POST request with data
const newUser = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
    },
    body: JSON.stringify({
        name: 'Deep',
        age: 23
    })
});
const result = await newUser.json();

// PUT request
await fetch('https://api.example.com/users/123', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Deep Updated', age: 24 })
});

// DELETE request
await fetch('https://api.example.com/users/123', {
    method: 'DELETE'
});

// Important: fetch does NOT throw error for 404 or 500 status codes!
const res = await fetch('https://api.example.com/not-found');
console.log(res.ok);       // false (status is 404)
console.log(res.status);   // 404

// You must manually check:
if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status}`);
}
```

Note:
- Key Point: fetch returns a Promise. Response.json() also returns a Promise (need two awaits). fetch does NOT throw on HTTP errors (404, 500) — only on network failures. Always check response.ok or response.status. In Node.js, fetch is available from version 18+. For older Node.js use `node-fetch` or `axios`.
- Why Interviewer Asks: You use fetch every day in React. The "fetch does not throw on 404" is a common trap. Knowing how to send POST requests with headers and body is essential.

---

**119. What is CORS? Why does it happen?**

Answer:
**CORS (Cross-Origin Resource Sharing)** is a security mechanism enforced by browsers that blocks requests from a different origin (domain, port, or protocol) than the server. It prevents malicious websites from making unauthorized API calls.

**Same Origin:** `http://localhost:3000` → `http://localhost:3000/api` (allowed)
**Cross Origin:** `http://localhost:3000` → `http://localhost:5000/api` (blocked by CORS)

```
React (localhost:3000) → Express API (localhost:5000)
Browser blocks this unless server explicitly allows it!

Error: "Access to fetch at 'http://localhost:5000/api' from origin 
'http://localhost:3000' has been blocked by CORS policy"
```

**Solution in Express:**

```javascript
// Method 1: Using cors npm package (recommended)
const cors = require('cors');

// Allow all origins
app.use(cors());

// Allow specific origin
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  // allow cookies
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Method 2: Manual headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
```

Note:
- Key Point: CORS is a browser-only restriction — server-to-server requests are not affected. The SERVER must send CORS headers to allow the browser to accept the response. In MERN development, React runs on port 3000 and Express on 5000 — CORS is always needed. Use the `cors` npm package.
- Why Interviewer Asks: Every MERN developer encounters CORS. If you have built full-stack projects you must have solved this. They want to know you understand WHY it happens and HOW to fix it.

---

## Topic 20 : Storage (localStorage, sessionStorage, Cookies)

---

**120. What is the difference between localStorage, sessionStorage and Cookies?**

Answer:

| Feature | localStorage | sessionStorage | Cookies |
|---------|-------------|----------------|---------|
| Capacity | ~5-10 MB | ~5-10 MB | ~4 KB |
| Lifetime | Until manually deleted | Until tab/window closes | Has expiry date |
| Scope | Shared across all tabs (same origin) | Only current tab | Shared across tabs |
| Sent to Server | No | No | Yes (with every HTTP request) |
| Access | Client-side JS only | Client-side JS only | Client + Server |

```javascript
// ===== localStorage =====
localStorage.setItem("name", "Deep");
localStorage.setItem("user", JSON.stringify({name:"Deep", age:23}));

const name = localStorage.getItem("name");        // "Deep"
const user = JSON.parse(localStorage.getItem("user")); // {name:"Deep",age:23}

localStorage.removeItem("name");
localStorage.clear();  // remove all

// ===== sessionStorage =====
sessionStorage.setItem("token", "abc123");
const token = sessionStorage.getItem("token");
// Gone when tab closes

// ===== Cookies =====
document.cookie = "name=Deep; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/";
document.cookie = "age=23; max-age=86400";  // expires in 24 hours

console.log(document.cookie);  // "name=Deep; age=23"

// In Express (server-side cookies)
res.cookie('token', 'abc123', {
    httpOnly: true,     // cannot access from JS (XSS protection)
    secure: true,       // only sent over HTTPS
    maxAge: 86400000,   // 24 hours in milliseconds
    sameSite: 'strict'  // CSRF protection
});
```

Note:
- Key Point: localStorage for persistent client data (theme, language preference). sessionStorage for temporary data (form progress). Cookies for authentication tokens (sent to server automatically). For auth tokens use httpOnly cookies (not accessible by JS = XSS safe) instead of localStorage. JWT tokens in localStorage is a common but less secure practice.
- Why Interviewer Asks: Practical question about where to store auth tokens. The "httpOnly cookie is more secure than localStorage for tokens" is an important security point.

---

## Topic 21 : Miscellaneous Important Questions

---

**121. What is the difference between `setTimeout(fn, 0)` and `setImmediate(fn)` in Node.js?**

Answer:
Both execute "as soon as possible" but their order depends on the context:

**Inside I/O callback (fs.readFile, etc.):** `setImmediate` always runs FIRST because it is in the Check phase which comes right after Poll phase.

**Outside I/O (in main module):** Order is NOT guaranteed — depends on system performance and event loop timing.

```javascript
// Inside I/O callback — setImmediate first (guaranteed)
const fs = require('fs');
fs.readFile('file.txt', () => {
    setTimeout(() => console.log("setTimeout"), 0);
    setImmediate(() => console.log("setImmediate"));
});
// Output: setImmediate → setTimeout (always in this order)

// Outside I/O — order NOT guaranteed
setTimeout(() => console.log("setTimeout"), 0);
setImmediate(() => console.log("setImmediate"));
// Could be either order depending on system performance
```

Note:
- Key Point: Inside I/O callbacks setImmediate always runs first. Outside I/O the order is non-deterministic. setImmediate is Node.js specific (not available in browsers). setTimeout(fn, 0) minimum delay is actually ~1ms in Node.js.
- Why Interviewer Asks: Advanced Node.js event loop question. Tests understanding of event loop phases (Poll → Check → Timers).

---

**122. What is Event Delegation?**

Answer:
Event Delegation is a pattern where you attach a single event listener to a parent element instead of attaching listeners to each child element individually. It works because of **event bubbling** — events on child elements bubble up to the parent.

```html
<ul id="todo-list">
    <li>Task 1</li>
    <li>Task 2</li>
    <li>Task 3</li>
    <!-- More items can be added dynamically -->
</ul>
```

```javascript
// BAD — attaching listener to each item
document.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
        console.log(li.textContent);
    });
});
// Problem: new dynamically added <li> won't have the listener!

// GOOD — Event Delegation (one listener on parent)
document.getElementById('todo-list').addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        console.log(event.target.textContent);
    }
});
// Works for existing AND future dynamically added <li> elements!
```

**Benefits:**
1. Better performance — one listener instead of N listeners
2. Works for dynamically added elements
3. Less memory usage

Note:
- Key Point: Uses event bubbling. event.target gives the actual clicked element. event.currentTarget gives the element the listener is attached to. React uses event delegation internally — it attaches one listener at the root and delegates to components.
- Why Interviewer Asks: Practical DOM optimization technique. Understanding this helps understand React's synthetic event system.

---

**123. What is Debouncing? Implement it from scratch.**

Answer:

```javascript
function debounce(func, delay) {
    let timeoutId;
    
    return function(...args) {
        // Clear previous timer (reset the wait)
        clearTimeout(timeoutId);
        
        // Set new timer
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Usage — search bar
const searchAPI = (query) => {
    console.log(`API call for: ${query}`);
};

const debouncedSearch = debounce(searchAPI, 500);

// User types: D → De → Dee → Deep
// Without debounce: 4 API calls
// With debounce (500ms): Only 1 API call after user stops typing for 500ms
debouncedSearch("D");     // timer starts
debouncedSearch("De");    // timer reset
debouncedSearch("Dee");   // timer reset
debouncedSearch("Deep");  // timer reset → after 500ms → API call for "Deep"
```

Note:
- Key Point: clearTimeout resets the timer on every call. func.apply(this, args) preserves context and passes arguments. Uses closures to persist timeoutId between calls. 500ms is common delay for search inputs.
- Why Interviewer Asks: One of the most asked coding questions. Implement debounce from scratch tests closures, setTimeout, and practical optimization knowledge.

---

**124. What is Throttling? Implement it from scratch.**

Answer:

```javascript
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

// Usage — scroll handler
const handleScroll = () => {
    console.log(`Scroll position: ${window.scrollY}`);
};

window.addEventListener('scroll', throttle(handleScroll, 200));
// Without throttle: 100+ calls while scrolling
// With throttle: max 1 call per 200ms

// Alternative: Throttle with trailing call (ensures last call executes)
function throttleWithTrailing(func, limit) {
    let inThrottle = false;
    let lastArgs = null;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            
            setTimeout(() => {
                inThrottle = false;
                if (lastArgs) {
                    func.apply(this, lastArgs);
                    lastArgs = null;
                }
            }, limit);
        } else {
            lastArgs = args;  // save latest args for trailing call
        }
    };
}
```

Note:
- Key Point: Throttle uses a flag (inThrottle) to prevent execution more than once per interval. Closures persist the flag between calls. Debounce vs Throttle: Debounce waits for silence, Throttle limits frequency.
- Why Interviewer Asks: Often asked alongside debounce. Implementing from scratch tests closures and setTimeout understanding.

---

**125. What is `use strict`?**

Answer:
`"use strict"` is a directive that enables strict mode in JavaScript. It was introduced in ES5 to catch common coding mistakes and prevent unsafe actions.

```javascript
"use strict";  // must be first line (of file or function)

// 1. Cannot use undeclared variables
x = 10;  // ReferenceError: x is not defined (without strict: creates global)

// 2. Cannot delete variables or functions
let a = 10;
delete a;  // SyntaxError

// 3. Cannot have duplicate parameter names
function sum(x, x) {}  // SyntaxError: Duplicate parameter name

// 4. Cannot use octal literals
let num = 010;  // SyntaxError

// 5. Cannot write to read-only properties
const obj = {};
Object.defineProperty(obj, "name", { value: "Deep", writable: false });
obj.name = "Dev";  // TypeError

// 6. 'this' in standalone function is undefined (not window)
function showThis() {
    console.log(this);  // undefined (not window)
}

// 7. Cannot use 'with' statement
// with(obj) {}  // SyntaxError

// Function-level strict mode
function strictFunction() {
    "use strict";
    // strict rules only inside this function
}
```

Note:
- Key Point: ES6 modules and classes are in strict mode by default. React components also run in strict mode. Main benefits: catches silent errors, prevents global variable leaks, makes `this` safer (undefined instead of window). Always use strict mode or ES6 modules.
- Why Interviewer Asks: Shows awareness of code quality and safety. The "this is undefined in strict mode" point is especially important.

---

**126. What is NaN? How do you check for NaN?**

Answer:
`NaN` (Not a Number) is a special numeric value that represents an invalid number result. Paradoxically `typeof NaN` returns "number".

```javascript
console.log(typeof NaN);           // "number" (ironic!)
console.log(NaN === NaN);          // false (NaN is not equal to itself!)
console.log(NaN == NaN);           // false

// Operations that produce NaN:
console.log(0 / 0);               // NaN
console.log(parseInt("abc"));     // NaN
console.log(Math.sqrt(-1));       // NaN
console.log(undefined + 1);       // NaN
console.log("hello" * 3);         // NaN
console.log(Number("hello"));     // NaN

// Checking for NaN:
// Method 1: Number.isNaN() — RECOMMENDED (strict check)
console.log(Number.isNaN(NaN));        // true
console.log(Number.isNaN("hello"));    // false (not NaN, it is a string)

// Method 2: isNaN() — global function (AVOID — does type coercion)
console.log(isNaN(NaN));              // true
console.log(isNaN("hello"));          // true (coerces "hello" to NaN first — misleading!)

// Method 3: Self-comparison (NaN !== NaN is always true)
const value = NaN;
console.log(value !== value);          // true (only NaN has this property)

// Method 4: Object.is()
console.log(Object.is(NaN, NaN));      // true
```

Note:
- Key Point: NaN is the only value in JS that is not equal to itself. Always use Number.isNaN() not global isNaN() because global isNaN coerces type first. typeof NaN is "number" which is counterintuitive. NaN is produced by failed numeric operations.
- Why Interviewer Asks: Tests understanding of JS quirks. The NaN !== NaN and typeof NaN tricks are classic interview questions.

---

**127. What is the difference between `Object.freeze()` and `const`?**

Answer:

**`const`** — Prevents **reassignment** of the variable. But you CAN still modify the object's properties (add, delete, change).

**`Object.freeze()`** — Prevents **modification** of the object's properties. But it is SHALLOW — nested objects are NOT frozen.

```javascript
// const — cannot reassign, CAN modify
const user = { name: "Deep", age: 23 };
user.age = 24;              // Works! Can modify property
user.email = "d@test.com";  // Works! Can add property
delete user.age;             // Works! Can delete property
// user = {};                // TypeError! Cannot reassign

// Object.freeze — cannot modify, CAN reassign (if not const)
const frozen = Object.freeze({ name: "Deep", age: 23 });
frozen.age = 24;              // Silently fails (error in strict mode)
frozen.email = "d@test.com";  // Silently fails
delete frozen.age;             // Silently fails

// SHALLOW freeze — nested objects NOT frozen
const nested = Object.freeze({
    name: "Deep",
    address: { city: "Surat" }
});
nested.name = "Dev";           // Fails — frozen
nested.address.city = "Mumbai"; // WORKS! Nested object not frozen
console.log(nested.address.city); // "Mumbai"

// Deep freeze (recursive)
function deepFreeze(obj) {
    Object.freeze(obj);
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            deepFreeze(obj[key]);
        }
    });
    return obj;
}
```

Note:
- Key Point: const = variable level immutability (cannot reassign). Object.freeze = object level immutability (cannot modify properties). Both together give maximum immutability. Object.freeze is shallow — implement deepFreeze for nested objects. Object.seal() is middle ground — can modify existing properties but cannot add or delete.
- Why Interviewer Asks: Tests understanding of immutability in JS. const + freeze difference is a common confusion. The shallow freeze trap is a bonus point.

---

**128. What is the difference between `Object.freeze()`, `Object.seal()`, and `Object.preventExtensions()`?**

Answer:

| Feature | `preventExtensions()` | `seal()` | `freeze()` |
|---------|:---:|:---:|:---:|
| Add new properties | No | No | No |
| Delete properties | Yes | No | No |
| Modify existing properties | Yes | Yes | No |
| Reconfigure properties | Yes | No | No |

```javascript
// Object.preventExtensions — cannot ADD, can modify and delete
const obj1 = { name: "Deep" };
Object.preventExtensions(obj1);
obj1.name = "Dev";       // Works
obj1.age = 23;           // Fails silently (cannot add)
delete obj1.name;        // Works

// Object.seal — cannot ADD or DELETE, CAN modify
const obj2 = { name: "Deep" };
Object.seal(obj2);
obj2.name = "Dev";       // Works (can modify)
obj2.age = 23;           // Fails (cannot add)
delete obj2.name;        // Fails (cannot delete)

// Object.freeze — cannot ADD, DELETE, or MODIFY
const obj3 = { name: "Deep" };
Object.freeze(obj3);
obj3.name = "Dev";       // Fails (cannot modify)
obj3.age = 23;           // Fails (cannot add)
delete obj3.name;        // Fails (cannot delete)
```

Note:
- Key Point: preventExtensions < seal < freeze (increasing restriction). All three are shallow. Use Object.isFrozen(), Object.isSealed(), Object.isExtensible() to check status.
- Why Interviewer Asks: Shows you know the complete spectrum of object immutability. Not all interviewers ask this but it is a strong point if mentioned.

---

**129. What is the difference between `undefined` and `not defined`?**

Answer:

**`undefined`** — Variable is declared but has no value assigned yet. It EXISTS in memory.

**`not defined` (ReferenceError)** — Variable has NOT been declared at all. It does NOT exist in memory.

```javascript
// undefined — declared but no value
let a;
console.log(a);           // undefined
console.log(typeof a);    // "undefined"

// not defined — never declared
console.log(b);           // ReferenceError: b is not defined
console.log(typeof b);    // "undefined" ← typeof does NOT throw error!

// Important: typeof undeclared variable returns "undefined" (no error)
// This is the only safe way to check if a variable exists
if (typeof someVar !== "undefined") {
    console.log("someVar exists");
}
```

Note:
- Key Point: undefined = exists but empty. not defined = does not exist (ReferenceError). typeof is the only operator that does not throw error on undeclared variables — returns "undefined" string. This is a very common trick question.
- Why Interviewer Asks: Tests precise understanding of JS variable states. The typeof on undeclared variable returning "undefined" without error is the tricky part.

---

**130. What is the output of `[] + []`, `[] + {}`, `{} + []`?**

Answer:

```javascript
console.log([] + []);    // "" (empty string)
// [] converts to "" (empty string), "" + "" = ""

console.log([] + {});    // "[object Object]"
// [] converts to "", {} converts to "[object Object]"
// "" + "[object Object]" = "[object Object]"

console.log({} + []);    // depends on context!
// In console: 0 (browser treats {} as empty block, then +[] = 0)
// Assigned to variable: "[object Object]" (same as [] + {})
let result = {} + [];
console.log(result);     // "[object Object]"

console.log([] == false);  // true
// [] → "" → 0, false → 0, 0 == 0 = true

console.log([] == ![]);   // true (mind-blowing!)
// ![] = false ([] is truthy, !truthy = false)
// [] == false → "" == false → 0 == 0 → true
```

Note:
- Key Point: These are JavaScript's weird type coercion quirks. `+` operator tries to convert operands to primitives using valueOf() and toString(). Empty array converts to empty string. Object converts to "[object Object]". These questions test coercion knowledge but are rarely practical.
- Why Interviewer Asks: Fun trick questions to test how deep your coercion understanding goes. You do not need to memorize all of these but understanding the conversion rules helps.

---

**131. What are Pure Functions?**

Answer:
A Pure Function is a function that:
1. **Same input always gives same output** (deterministic)
2. **No side effects** — does not modify external variables, does not make API calls, does not modify input arguments

```javascript
// PURE function — same input = same output, no side effects
function add(a, b) {
    return a + b;  // depends only on inputs
}
console.log(add(2, 3));  // always 5

function toUpperCase(str) {
    return str.toUpperCase();  // does not modify original
}

// IMPURE function — has side effects or unpredictable output
let count = 0;
function increment() {
    count++;          // modifies external variable (side effect)
    return count;     // output depends on external state
}

function getRandomNumber() {
    return Math.random();  // different output each time
}

function addToArray(arr, item) {
    arr.push(item);   // modifies input argument (side effect)
    return arr;
}

// PURE version of addToArray
function addToArrayPure(arr, item) {
    return [...arr, item];  // returns new array, original unchanged
}
```

Note:
- Key Point: Pure functions are predictable and easy to test. React functional components should be pure (same props = same output). Redux reducers must be pure functions. Array methods like map, filter, slice are pure (return new array). push, splice, sort are impure (modify original).
- Why Interviewer Asks: Important for React and Redux. If you understand pure functions you understand why React rerenders and why Redux requires immutable state updates.

---

**132. What is the difference between `==` null check patterns?**

Answer:

```javascript
// Checking for null or undefined:

// Verbose way
if (value === null || value === undefined) {}

// Short way using == null (only exception where == is useful)
if (value == null) {}
// This is TRUE for null AND undefined only, nothing else

// Proof:
console.log(null == null);       // true
console.log(undefined == null);  // true
console.log(0 == null);          // false
console.log("" == null);         // false
console.log(false == null);      // false
console.log(NaN == null);        // false

// Modern alternative: Nullish coalescing
const result = value ?? "default";  // default only if null or undefined

// Optional chaining
const city = user?.address?.city;   // undefined if any part is null/undefined
```

Note:
- Key Point: `value == null` is the ONE exception where using `==` instead of `===` is actually recommended. It cleanly checks for both null and undefined without catching other falsy values. ESLint has a rule that allows `== null` specifically.
- Why Interviewer Asks: Shows nuanced understanding of when `==` is actually useful instead of just saying "always use ===."

---

## Topic 22 : Node.js Architecture (Remaining)

---

**133. What is Middleware in Express.js context (brief)?**

Answer:
Middleware is a function that has access to the request object (req), response object (res), and the next middleware function (next). It can execute code, modify req/res, end the request-response cycle, or call next middleware.

```javascript
// Middleware function signature
function middleware(req, res, next) {
    // Do something
    next();  // pass control to next middleware
}

// Types of middleware:
// 1. Application-level: app.use(middleware)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} at ${Date.now()}`);
    next();
});

// 2. Route-level: specific to a route
app.get('/api/users', authMiddleware, (req, res) => {
    res.json(users);
});

// 3. Error-handling: has 4 parameters
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// 4. Built-in: express.json(), express.static()
app.use(express.json());              // parse JSON body
app.use(express.static('public'));     // serve static files

// 5. Third-party: cors, helmet, morgan
app.use(cors());
app.use(morgan('dev'));
```

Note:
- Key Point: Middleware executes in ORDER they are defined. Always call next() or the request hangs. Error middleware has 4 params (err, req, res, next). Common middleware: auth check, logging, body parsing, CORS, validation.
- Why Interviewer Asks: Fundamental Express.js concept. Even though this is more Express than pure JS/Node, it is asked in every MERN interview.

---

**134. What is the difference between `require()` and `import`?**

Answer:

| Feature | `require()` (CommonJS) | `import` (ES Module) |
|---------|----------------------|---------------------|
| Loading | Synchronous | Asynchronous |
| When parsed | Runtime (dynamic) | Compile/Parse time (static) |
| Conditional import | Yes | No (use dynamic import) |
| Tree Shaking | No | Yes |
| Caching | Yes (cached after first load) | Yes |
| Default in | Node.js | Browser, React |
| Syntax | `const x = require('x')` | `import x from 'x'` |

```javascript
// CommonJS (require)
const express = require('express');
const { readFile } = require('fs');

// Conditional require — works!
if (process.env.NODE_ENV === 'development') {
    const debug = require('debug');
}

// ES Module (import)
import express from 'express';
import { readFile } from 'fs';

// Conditional import — does NOT work at top level
// if (condition) { import x from 'x'; }  // SyntaxError

// Dynamic import (works conditionally) — returns Promise
if (condition) {
    const module = await import('./module.js');
}

// To use ES modules in Node.js:
// Option 1: Use .mjs file extension
// Option 2: Add "type": "module" in package.json
```

Note:
- Key Point: require is synchronous and can be used anywhere (conditionally). import is static and must be at top level (except dynamic import()). React uses import. Node.js traditionally uses require but supports import with configuration. Dynamic import() is useful for code splitting in React (lazy loading).
- Why Interviewer Asks: You use both daily — import in React, require in Node.js backend. Understanding the difference shows you know why they behave differently.

---

**135. How does Node.js handle environment variables?**

Answer:
Environment variables are key-value pairs stored outside the code that configure the application based on the environment (development, production, testing).

```javascript
// Access environment variables
console.log(process.env.NODE_ENV);      // "development" or "production"
console.log(process.env.PORT);          // "3000"
console.log(process.env.DATABASE_URL);  // "mongodb://localhost:27017/mydb"

// Using dotenv package (most common approach)
// 1. npm install dotenv
// 2. Create .env file in root:
//    PORT=5000
//    DB_URL=mongodb://localhost:27017/mydb
//    JWT_SECRET=mysecretkey123
//    NODE_ENV=development

// 3. In your code (at the very top of entry file):
require('dotenv').config();
// or: import 'dotenv/config';

console.log(process.env.PORT);        // "5000"
console.log(process.env.DB_URL);      // "mongodb://localhost:27017/mydb"
console.log(process.env.JWT_SECRET);  // "mysecretkey123"

// Setting env vars from command line:
// PORT=3000 node app.js
// NODE_ENV=production node app.js

// Common usage pattern:
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/defaultdb";

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Note:
- Key Point: Never hardcode sensitive data (API keys, database URLs, secrets) in code. Use .env file + dotenv package. ALWAYS add .env to .gitignore (never commit secrets to git). process.env values are always STRINGS — convert with Number() if needed. Different .env files for different environments (.env.development, .env.production).
- Why Interviewer Asks: Security best practice question. Every real project uses environment variables. Not using them for secrets is a red flag.

---

## Topic 23 : Coding Questions (Common Interview Problems)

---

**136. Reverse a string without using built-in reverse().**

```javascript
// Method 1: Loop
function reverseString(str) {
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}

// Method 2: Split, reverse, join
function reverseString2(str) {
    return str.split("").reverse().join("");
}

// Method 3: Spread + reverse
function reverseString3(str) {
    return [...str].reverse().join("");
}

// Method 4: Reduce
function reverseString4(str) {
    return str.split("").reduce((rev, char) => char + rev, "");
}

console.log(reverseString("Deep Patel"));  // "letaP peeD"
```

Note:
- Key Point: Multiple approaches show versatility. Method 2 is most common answer. Method 4 with reduce shows advanced knowledge. For Unicode characters use spread [...str] instead of split("").
- Why Interviewer Asks: Classic warm-up coding question. Tests basic string manipulation skills.

---

**137. Check if a string is a Palindrome.**

```javascript
function isPalindrome(str) {
    // Clean string — remove non-alphanumeric, convert to lowercase
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const reversed = cleaned.split("").reverse().join("");
    return cleaned === reversed;
}

// Two-pointer approach (more efficient)
function isPalindrome2(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    let left = 0;
    let right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) return false;
        left++;
        right--;
    }
    return true;
}

console.log(isPalindrome("racecar"));           // true
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("hello"));             // false
```

Note:
- Key Point: Always clean input (lowercase, remove spaces/special chars). Two-pointer approach is O(n/2) and does not create extra strings. Shows algorithmic thinking.
- Why Interviewer Asks: Common string manipulation question. Cleaning input and using two pointers shows practical problem-solving.

---

**138. Remove duplicates from an array.**

```javascript
const arr = [1, 2, 3, 2, 4, 1, 5, 3, 6];

// Method 1: Set (easiest and fastest)
const unique1 = [...new Set(arr)];
// [1, 2, 3, 4, 5, 6]

// Method 2: filter + indexOf
const unique2 = arr.filter((item, index) => arr.indexOf(item) === index);
// [1, 2, 3, 4, 5, 6]

// Method 3: reduce
const unique3 = arr.reduce((acc, item) => {
    if (!acc.includes(item)) acc.push(item);
    return acc;
}, []);

// Remove duplicate objects by property
const users = [
    { id: 1, name: "Deep" },
    { id: 2, name: "Neel" },
    { id: 1, name: "Deep" },
    { id: 3, name: "Ketul" },
];

const uniqueUsers = users.filter((user, index, self) =>
    index === self.findIndex(u => u.id === user.id)
);
// [{id:1,name:"Deep"}, {id:2,name:"Neel"}, {id:3,name:"Ketul"}]
```

Note:
- Key Point: Set is the fastest and cleanest approach. For objects you need findIndex because Set compares by reference not value. filter + indexOf approach: first occurrence's index matches current index = unique.
- Why Interviewer Asks: Very commonly asked. Set answer is expected. Object deduplication is the bonus/follow-up.

---

**139. Flatten a nested array without using flat().**

```javascript
const nested = [1, [2, 3], [4, [5, [6, 7]]]];

// Method 1: Recursion
function flatten(arr) {
    let result = [];
    for (let item of arr) {
        if (Array.isArray(item)) {
            result = result.concat(flatten(item));
        } else {
            result.push(item);
        }
    }
    return result;
}

// Method 2: reduce + recursion
function flattenReduce(arr) {
    return arr.reduce((acc, item) => {
        return acc.concat(Array.isArray(item) ? flattenReduce(item) : item);
    }, []);
}

// Method 3: Stack (iterative)
function flattenIterative(arr) {
    const stack = [...arr];
    const result = [];
    while (stack.length) {
        const item = stack.pop();
        if (Array.isArray(item)) {
            stack.push(...item);
        } else {
            result.unshift(item);
        }
    }
    return result;
}

// Method 4: toString (only for numbers/strings)
const flat = nested.toString().split(",").map(Number);

console.log(flatten(nested));  // [1, 2, 3, 4, 5, 6, 7]
```

Note:
- Key Point: Recursion is the most natural approach. Check if element is array — if yes recurse, if no add to result. Reduce version is more concise. Stack approach avoids recursion (no stack overflow risk). Built-in arr.flat(Infinity) does this in one line.
- Why Interviewer Asks: Tests recursion skills and array manipulation. Common follow-up: "What if the array is very deeply nested?" Answer: iterative approach avoids stack overflow.

---

**140. Implement a polyfill for Array.prototype.map().**

Answer:
A polyfill is code that implements a feature in environments that do not natively support it.

```javascript
// Polyfill for map
Array.prototype.myMap = function(callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (i in this) {  // handle sparse arrays
            result.push(callback.call(thisArg, this[i], i, this));
        }
    }
    return result;
};

// Test
const numbers = [1, 2, 3, 4];
const doubled = numbers.myMap(n => n * 2);
console.log(doubled);  // [2, 4, 6, 8]

// With thisArg
const multiplier = { factor: 3 };
const tripled = numbers.myMap(function(n) {
    return n * this.factor;
}, multiplier);
console.log(tripled);  // [3, 6, 9, 12]
```

Note:
- Key Point: `this` inside the polyfill refers to the array being mapped (because it is called as array.myMap()). callback.call(thisArg, item, index, array) matches the native map signature. Handle edge cases: type check callback, sparse arrays with `i in this`.
- Why Interviewer Asks: Very common interview coding question. Tests understanding of how array methods work internally, `this` context, and function.call().

---

**141. Implement a polyfill for Array.prototype.filter().**

```javascript
Array.prototype.myFilter = function(callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    
    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (i in this) {
            if (callback.call(thisArg, this[i], i, this)) {
                result.push(this[i]);
            }
        }
    }
    return result;
};

// Test
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.myFilter(n => n % 2 === 0);
console.log(evens);  // [2, 4, 6]
```

Note:
- Key Point: Same structure as map polyfill but only push to result if callback returns truthy. The callback should return a boolean. Both map and filter polyfills follow same pattern — the difference is how they use the callback's return value.
- Why Interviewer Asks: Often asked alongside map polyfill. Shows you can implement core JS methods from scratch.

---

**142. Implement a polyfill for Array.prototype.reduce().**

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    
    let accumulator;
    let startIndex;
    
    if (initialValue !== undefined) {
        accumulator = initialValue;
        startIndex = 0;
    } else {
        if (this.length === 0) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        accumulator = this[0];
        startIndex = 1;
    }
    
    for (let i = startIndex; i < this.length; i++) {
        if (i in this) {
            accumulator = callback(accumulator, this[i], i, this);
        }
    }
    
    return accumulator;
};

// Test
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.myReduce((acc, n) => acc + n, 0);
console.log(sum);  // 15

const max = numbers.myReduce((acc, n) => Math.max(acc, n));
console.log(max);  // 5

// Without initial value — first element is accumulator
const product = [2, 3, 4].myReduce((acc, n) => acc * n);
console.log(product);  // 24 (2 * 3 * 4)
```

Note:
- Key Point: If initialValue is not provided, first element becomes accumulator and loop starts from index 1. If array is empty and no initialValue then throw TypeError. This matches native reduce behavior exactly.
- Why Interviewer Asks: Reduce polyfill is the hardest of the three (map, filter, reduce). The initialValue handling is the tricky part.

---

**143. Implement a polyfill for Function.prototype.bind().**

```javascript
Function.prototype.myBind = function(context, ...boundArgs) {
    if (typeof this !== 'function') {
        throw new TypeError('Bind must be called on a function');
    }
    
    const fn = this;  // the function being bound
    
    return function(...callArgs) {
        return fn.apply(context, [...boundArgs, ...callArgs]);
    };
};

// Test
const user = { name: "Deep" };

function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
}

const boundGreet = greet.myBind(user, "Hello");
console.log(boundGreet("!"));     // "Hello, Deep!"
console.log(boundGreet("?"));     // "Hello, Deep?"

// Partial application
const helloDeep = greet.myBind(user, "Hello", "!");
console.log(helloDeep());          // "Hello, Deep!"
```

Note:
- Key Point: bind returns a NEW function (does not call immediately). Uses closures to remember context and initial args. fn.apply(context, args) sets this and passes arguments. Supports partial application — some args can be pre-filled.
- Why Interviewer Asks: One of the most asked polyfill questions. Tests understanding of this, closures, apply, and rest/spread operators.

---

## Topic 24 : Tricky Output Questions

---

**144. What is the output?**

```javascript
console.log(1 + "2" + "2");    // ?
console.log(1 + +"2" + "2");   // ?
console.log(1 + -"1" + "2");   // ?
console.log(+"1" + "1" + "2"); // ?
console.log("A" - "B" + "2");  // ?
console.log("A" - "B" + 2);    // ?
```

Answer:
```
"122"
"32"
"02"
"112"
"NaN2"
NaN
```

**Explanations:**
1. `1 + "2"` = `"12"` then `"12" + "2"` = `"122"` (string concatenation)
2. `+"2"` = `2` (unary +), `1 + 2` = `3`, `3 + "2"` = `"32"`
3. `-"1"` = `-1` (unary -), `1 + (-1)` = `0`, `0 + "2"` = `"02"`
4. `+"1"` = `1`, `1 + "1"` = `"11"`, `"11" + "2"` = `"112"`
5. `"A" - "B"` = `NaN` (can't subtract strings), `NaN + "2"` = `"NaN2"` (string)
6. `"A" - "B"` = `NaN`, `NaN + 2` = `NaN` (NaN + number = NaN)

Note:
- Key Point: `+` with string does concatenation. `-` always does math (converts to number). Unary `+` and `-` convert string to number. NaN + string = "NaN" (string). NaN + number = NaN.
- Why Interviewer Asks: Classic type coercion trick questions. Understanding unary operators and operator precedence is key.

---

**145. What is the output?**

```javascript
var a = 1;
var b = 2;

(function() {
    var a = b = 3;
    console.log(a);  // ?
    console.log(b);  // ?
})();

console.log(a);  // ?
console.log(b);  // ?
```

Answer:
```
3
3
1
3
```

**Explanation:**
`var a = b = 3` is equivalent to:
```javascript
b = 3;       // NO var! This creates/modifies GLOBAL b
var a = 3;   // local a inside IIFE
```

Inside IIFE: local `a = 3`, global `b = 3` → both print 3
Outside IIFE: global `a = 1` (unchanged), global `b = 3` (modified by IIFE)

Note:
- Key Point: `var a = b = 3` does NOT declare both with var. Only `a` is declared with var. `b = 3` is an assignment without declaration which creates a global variable (or throws error in strict mode). This is a common bug in JavaScript.
- Why Interviewer Asks: Tests understanding of variable declaration vs assignment and scope. Very tricky and commonly asked.

---

**146. What is the output?**

```javascript
console.log(typeof typeof 1);
```

Answer:
```
"string"
```

**Explanation:**
1. `typeof 1` → `"number"` (returns a string)
2. `typeof "number"` → `"string"` (typeof of any string is "string")

Note:
- Key Point: typeof always returns a string. So typeof of any typeof result is always "string".
- Why Interviewer Asks: Quick trick question that tests if you know typeof returns a string.

---

**147. What is the output?**

```javascript
const arr = [1, 2, 3, 4, 5];
arr.length = 0;
console.log(arr);    // ?
console.log(arr[0]); // ?
```

Answer:
```
[]
undefined
```

**Explanation:**
Setting `arr.length = 0` empties the array. All elements are removed. This is actually one of the fastest ways to empty an array.

```javascript
// Ways to empty an array:
arr.length = 0;     // Method 1: set length to 0
arr.splice(0);      // Method 2: splice all
arr = [];           // Method 3: reassign (won't affect references)
```

Note:
- Key Point: Setting length = 0 mutates the original array (references to it see the change). Reassigning `arr = []` creates a new empty array but other references to the original still see old data. This difference matters when passing arrays to functions.
- Why Interviewer Asks: Tests understanding of array mutation and the length property being writable.

---

**148. What is the output?**

```javascript
const obj = { a: 1 };
const obj2 = obj;
obj2.a = 2;

console.log(obj.a);   // ?
console.log(obj2.a);  // ?
console.log(obj === obj2); // ?
```

Answer:
```
2
2
true
```

**Explanation:**
`obj2 = obj` copies the reference, not the object. Both variables point to the same object in memory (Heap). Changing `obj2.a` changes the same object that `obj` points to.

```javascript
// To create independent copy:
const obj3 = { ...obj };        // shallow copy
const obj4 = structuredClone(obj); // deep copy
```

Note:
- Key Point: Objects are assigned by reference not by value. Multiple variables can point to the same object. This is the core of pass-by-reference concept. Use spread or structuredClone for independent copies.
- Why Interviewer Asks: Tests reference vs value understanding. Foundation for understanding React state updates (why you create new objects instead of mutating).

---

## Final Quick Reference — Additional Methods Cheat Sheet

---

**149. Array Methods Quick Reference**

```javascript
// --- MUTATING (changes original) ---
arr.push(val)          // add to end, returns new length
arr.pop()              // remove from end, returns removed
arr.unshift(val)       // add to beginning, returns new length
arr.shift()            // remove from beginning, returns removed
arr.splice(i, n, ...items) // remove/replace/add at index
arr.sort((a,b) => a-b) // sort in place
arr.reverse()          // reverse in place
arr.fill(val, start, end) // fill with value

// --- NON-MUTATING (returns new) ---
arr.slice(start, end)  // extract portion
arr.concat(arr2)       // merge arrays
arr.flat(depth)        // flatten nested
arr.map(fn)            // transform each
arr.filter(fn)         // keep matching
arr.reduce(fn, init)   // single value
arr.find(fn)           // first match
arr.findIndex(fn)      // first match index
arr.some(fn)           // any match? boolean
arr.every(fn)          // all match? boolean
arr.includes(val)      // contains? boolean
arr.indexOf(val)       // first index of value
arr.join(sep)          // array to string
arr.from(iterable)     // create from iterable
arr.keys()             // iterator of indexes
arr.values()           // iterator of values
arr.entries()          // iterator of [index, value]
```

---

**150. String Methods Quick Reference**

```javascript
str.length             // character count
str.at(index)          // char at index (supports negative)
str.charAt(index)      // char at index
str.charCodeAt(index)  // ASCII code
String.fromCharCode(n) // char from ASCII

str.toUpperCase()      // all uppercase
str.toLowerCase()      // all lowercase

str.indexOf(sub, from) // first occurrence index (-1 if not found)
str.lastIndexOf(sub)   // last occurrence index
str.includes(sub)      // contains? boolean
str.startsWith(sub)    // starts with? boolean
str.endsWith(sub)      // ends with? boolean
str.search(regex)      // search with regex

str.slice(start, end)  // extract portion
str.substring(start, end) // similar to slice
str.substr(start, len) // extract by length (deprecated)

str.trim()             // remove whitespace both ends
str.trimStart()        // remove whitespace start
str.trimEnd()          // remove whitespace end

str.replace(find, rep) // replace first match
str.replaceAll(find, rep) // replace all matches

str.split(sep)         // string to array
str.repeat(n)          // repeat n times
str.padStart(len, pad) // pad beginning
str.padEnd(len, pad)   // pad end

str.match(regex)       // find matches
str.matchAll(regex)    // all matches iterator

str.concat(str2)       // join strings
str.localeCompare(str2) // compare strings (-1, 0, 1)
```

---

## Summary Table — All 150 Questions by Topic

| Topic | Questions | Count |
|-------|-----------|:-----:|
| JS Engine, V8, JIT | 1-3, 71-73 | 6 |
| Execution Context, Call Stack | 4-7 | 4 |
| Hoisting & TDZ | 8-10, 74-75 | 5 |
| Scope, Lexical, Shadowing | 11-12, 76-77 | 4 |
| `this` Keyword | 13-14, 78-79 | 4 |
| Variables, Data Types | 15-17 | 3 |
| Type Conversion, Coercion | 18-20, 130 | 4 |
| Strings | 21, 136-137 | 3 |
| Arrays & Methods | 22-27, 138-139, 149 | 9 |
| Objects & Methods | 28-29, 127-128 | 4 |
| Functions (Declaration, Expression, Arrow, IIFE) | 30-32 | 3 |
| Callbacks & Callback Hell | 33-34 | 2 |
| Closures | 35-36, 81-82 | 4 |
| Currying & Memoization | 83-85 | 3 |
| Rest, Spread, Destructuring | 37-38 | 2 |
| Pass by Value vs Reference | 80, 148 | 2 |
| Shallow vs Deep Copy | 39 | 1 |
| Prototypes & Classes | 86-90 | 5 |
| Modules (CJS vs ESM) | 91-92, 134 | 3 |
| Error Handling | 93-94 | 2 |
| Recursion & Generators | 95-96 | 2 |
| ES6+ Features | 97-103 | 7 |
| Promises (Deep) | 40-42, 104-106 | 6 |
| Async/Await (Advanced) | 43-44, 107-108 | 4 |
| Event Loop (Output Questions) | 45-48, 109-111 | 7 |
| setTimeout, setInterval | 49-50, 121 | 3 |
| Node.js Architecture | 51-55, 112-117, 133-135 | 14 |
| npm, yarn, nvm | 56-58 | 3 |
| Console Methods | 59 | 1 |
| API, REST, HTTP | 60-65, 118-119 | 8 |
| DOM & Events | 66-67, 69, 122 | 4 |
| Debouncing & Throttling | 70, 123-124 | 3 |
| Storage (localStorage etc.) | 120 | 1 |
| Miscellaneous (strict, NaN, pure fn) | 125-126, 129, 131-132 | 5 |
| Polyfills (map, filter, reduce, bind) | 140-143 | 4 |
| Tricky Output Questions | 144-148 | 5 |
| Quick Reference Cheat Sheets | 149-150 | 2 |
| **Total** | | **150** |

---
