#### **Q1: What is an API in the context of the MERN stack?**
**Answer:**
> "An API (Application Programming Interface) is the bridge that allows my **React frontend** to communicate with my **Node/Express backend**. The frontend sends a request (like asking for user data), the backend processes it, interacts with **MongoDB**, and sends a response back, usually in **JSON format**."

#### **Q2: What is a REST API?**
**Answer:**
> "REST stands for **Representational State Transfer**. It's an architectural style for building APIs. In a REST API, we use standard **HTTP methods** (GET, POST, PUT, DELETE) to perform operations on resources (like Users or Products), and the server is **stateless**, meaning it doesn't remember previous requests; every request contains all the info needed."

#### **Q3: What are the main HTTP methods and what do they do?**
**Answer:**
> "They map to CRUD operations:
> *   **GET:** Retrieve data (Read).
> *   **POST:** Create new data (Create).
> *   **PUT:** Update entire data (Update).
> *   **PATCH:** Update partial data.
> *   **DELETE:** Remove data (Delete)."

#### **Q4: What is the difference between PUT and PATCH?**
**Answer:**
> "**PUT** replaces the **entire** resource. If I send a PUT request with only a name, other fields might get wiped out. **PATCH** updates only the **specific fields** I send. In MERN, I usually use PATCH for updates to avoid accidentally overwriting data."

---

### 🟡 Category 2: HTTP Status Codes (Very Important!)

*Interviewers love asking this. Memorize these!*

#### **Q5: Can you name some common HTTP Status Codes?**
**Answer:**
> "Yes, here are the ones I use most:
> *   **200 OK:** Request succeeded.
> *   **201 Created:** Resource created successfully (usually after POST).
> *   **400 Bad Request:** The client sent invalid data.
> *   **401 Unauthorized:** User is not logged in (missing token).
> *   **403 Forbidden:** User is logged in but doesn't have permission.
> *   **404 Not Found:** Resource doesn't exist.
> *   **500 Internal Server Error:** Something crashed on the backend."

**💡 Pro Tip:** If they ask "What status code do you send when a user tries to delete a post they don't own?", answer **403 Forbidden**. This shows you understand security!

---

### 🔵 Category 3: MERN Specifics (Express & React)

#### **Q6: How do you handle data sent from React to your Express API?**
**Answer:**
> "In Express, I use middleware like `express.json()` to parse the incoming JSON body. In React, I use `fetch` or `axios` to send the data. For example:
> ```javascript
> await axios.post('/api/users', { name: 'John' });
> ```
> On the backend, I access that data using `req.body`."

#### **Q7: What is Middleware in Express?**
**Answer:**
> "Middleware are functions that run **between** the request and the response. They can modify the request, log data, or check authentication.
> *   Examples: `express.json()` to parse bodies, `cors` to allow cross-origin requests, or a custom `authMiddleware` to verify JWT tokens before allowing access to a route."

#### **Q8: What is CORS and why do we need it in MERN?**
**Answer:**
> "CORS stands for **Cross-Origin Resource Sharing**. Browsers block requests from one domain/port to another for security. Since React usually runs on `localhost:3000` and Node on `localhost:5000`, the browser blocks the request. I fix this by installing the `cors` package in Express and adding `app.use(cors())`."

#### **Q9: What is the difference between `req.params` and `req.query`?**
**Answer:**
> "*   **`req.params`** are part of the URL path, used for required identifiers. Example: `/users/:id` → `req.params.id`.
> *   **`req.query`** are optional filters added after a `?`. Example: `/users?role=admin` → `req.query.role`.
> I use params for getting a specific item and query for filtering or searching."

---

### 🔴 Category 4: Security & Authentication

#### **Q10: How do you handle Authentication in a MERN API?**
**Answer:**
> "I use **JWT (JSON Web Tokens)**.
> 1.  When a user logs in, the backend verifies credentials and sends back a signed JWT.
> 2.  The frontend stores this token (in LocalStorage or Cookies).
> 3.  For protected routes, the frontend sends the token in the `Authorization` header.
> 4.  The backend middleware verifies the token before allowing access."

#### **Q11: Should you store passwords in the database?**
**Answer:**
> "**Never.** I always hash passwords before saving them using a library like **bcryptjs**. When a user logs in, I compare the entered password with the hashed version using `bcrypt.compare()`."

---

### 🟣 Category 5: Practical / Scenario Questions

#### **Q12: How do you test your APIs?**
**Answer:**
> "I use **Postman** or **Insomnia** to test my endpoints before connecting them to React. I check if the status codes are correct, the JSON response is as expected, and error handling works. Once the API is stable, I integrate it with the frontend."

#### **Q13: How do you handle errors in your API?**
**Answer:**
> "I use `try-catch` blocks in my async controllers. If an error occurs, I catch it and send a proper status code and message, like `res.status(500).json({ message: 'Server Error' })`. I also use a global error-handling middleware in Express to catch any unhandled errors."

---

### 🚀 Bonus: Tips to Impress the Interviewer

1.  **Mention Environment Variables:**
    *   *Say:* "I never hardcode secrets like database URLs or JWT secrets. I store them in a `.env` file and access them using `process.env`."
2.  **Mention Async/Await:**
    *   *Say:* "I use `async/await` for handling API calls because it makes the code cleaner and easier to read than `.then()` chains."
3.  **Ask a Question Back:**
    *   At the end, ask: *"Does your team use REST or GraphQL for APIs?"* or *"How do you handle API versioning in your projects?"* This shows you are curious and engaged.

### 📝 Quick Cheat Sheet for Your Brain
*   **GET** → `req.query` / `req.params` → Returns **200**.
*   **POST** → `req.body` → Returns **201**.
*   **Error?** → `try/catch` → Returns **400/500**.
*   **React Port ≠ Node Port?** → Use **CORS**.
*   **Password?** → **Hash it** (bcrypt).
*   **Secrets?** → **.env file**.

Que : What is JSON?
- JSON (JavaScript Object Notation) is a lightweight data format used to send and receive data between frontend and backend.

Que : What is Endpoint ? 
- An endpoint is a specific URL where an API can be accessed.
    - /api/users  : get/create User  
    - /api/products  : Get/Create prodduct
    - /api/orders/123 : Update/delete/get Specific Info 

Que : What Is Authentication In API ?
- Authentication verifies the identity of the user. Methods Use like JWT (JSON Web Token), Sessions, OAuth(Continue With Google)

Que : What IS Authoriation In API?
- Authentication verifies the user identity But "Authorisation" determines what actions or resources the Authenticated user is allowed to access. Like Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC) etc..

Que : What IS JWT? 
- JWT (JSON Web Token) is used for secure authentication between client and server.
1. User logs in
2. Server generates token
3. Client stores token
4. Client sends token in future requests(req.user)


**1. What is Node.js? Is it a programming language?**

Answer:
Node.js is NOT a programming language and NOT a framework. It is a **JavaScript runtime environment** built on Chrome's **V8 JavaScript engine** and **libuv** C library. It allows you to run JavaScript outside the browser — mainly for server-side development. It uses single-threaded, event-driven, non-blocking I/O architecture which makes it lightweight and efficient for building scalable network applications.

```
Node.js = V8 Engine (executes JS) + libuv (event loop, thread pool, async I/O)

Used for:
- Web Servers & REST APIs
- Real-time applications (chat, live notifications)
- File system operations
- Database interactions
- CLI tools
- Microservices
```

Note:
- Key Point: Node.js is a runtime not a language not a framework. V8 compiles JS to machine code. libuv handles async I/O. Single-threaded but uses thread pool for heavy tasks. Non-blocking I/O model.
- Why Interviewer Asks: First Node.js question always. They want keywords: "runtime environment, V8, libuv, single-threaded, event-driven, non-blocking I/O."

---

**2. What is the difference between Node.js and Browser JavaScript?**

Answer:

| Feature | Browser JS | Node.js |
|---------|-----------|---------|
| Global Object | `window` | `global` / `globalThis` |
| DOM Access | Yes (`document`, `window`) | No DOM |
| File System | No access | Full access (`fs` module) |
| Modules | ES Modules (`import`) | CommonJS (`require`) + ES Modules |
| APIs | DOM, Fetch, Web APIs | fs, http, os, path, crypto |
| Environment Vars | No `process.env` | `process.env` available |
| Security | Sandboxed (limited) | Full system access |
| Package Manager | None built-in | npm / yarn |

Note:
- Key Point: Browser has DOM and window, Node.js has fs and process. Browser is sandboxed for security, Node.js has full system access. Both use V8 engine. Node.js added server capabilities to JS.
- Why Interviewer Asks: Tests if you understand what Node.js adds beyond browser JS. Shows you know the runtime differences.

---

**3. What is the V8 Engine?**

Answer:
V8 is Google's open-source JavaScript engine written in C++. It compiles JavaScript directly to machine code using **JIT (Just-In-Time) compilation** instead of interpreting it line by line. This makes it very fast.

V8 has two compilers:
- **Ignition** — Quick bytecode interpreter for fast startup
- **TurboFan** — Optimizing compiler for frequently used code (hot code)

Both Chrome browser and Node.js use V8 engine. V8 handles the Call Stack and Heap Memory. In Node.js, V8 is combined with libuv to provide async capabilities.

Note:
- Key Point: V8 uses JIT compilation not pure interpretation. It has two compilers for speed optimization. V8 only handles JS execution — libuv handles async I/O. V8 manages Call Stack (execution) and Heap (memory).
- Why Interviewer Asks: Shows understanding of how JS actually executes. Knowing Ignition and TurboFan shows deep knowledge.

---

**4. What is libuv? What role does it play?**

Answer:
libuv is a multi-platform C library that provides the core asynchronous infrastructure for Node.js. It implements the **Event Loop** and **Thread Pool** — the two things that make Node.js non-blocking.

```
libuv provides:
1. Event Loop         — manages async callbacks
2. Thread Pool        — 4 default worker threads for blocking operations
3. Async File I/O     — non-blocking file operations
4. Async TCP/UDP      — network operations
5. Child Processes    — spawn sub-processes
6. Timers             — setTimeout, setInterval
7. Signals & Polls    — OS signal handling

Without libuv, Node.js would be just V8 (synchronous JS execution only)
```

Note:
- Key Point: libuv is what makes Node.js async. V8 executes JS, libuv handles I/O. Thread pool has 4 workers by default (extendable to 128 with UV_THREADPOOL_SIZE). Heavy operations (fs, crypto, dns, zlib) go to thread pool.
- Why Interviewer Asks: Advanced Node.js question. Shows you understand the architecture beyond surface level.

---

**5. Is Node.js single-threaded? Explain.**

Answer:
Yes and No — depends on which part you are talking about.

**Yes** — The main execution thread is single-threaded. All JavaScript code, Event Loop, and callback execution happens on ONE main thread.

**No** — Behind the scenes libuv's Thread Pool has **4 worker threads** (extendable to 128). Heavy operations like file system, cryptography, DNS lookups, and compression run on these worker threads in parallel.

```
Main Thread (Single):
- Executes all JavaScript code
- Runs the Event Loop
- Executes all callbacks

Thread Pool (Multi — 4 default):
- fs operations (readFile, writeFile)
- crypto (hashing, encryption)
- DNS lookups
- zlib (compression)

Result from worker thread → callback → Event Queue → Event Loop → Call Stack
```

```javascript
// Change thread pool size
process.env.UV_THREADPOOL_SIZE = 8;
```

Note:
- Key Point: JS execution is single-threaded. I/O operations use thread pool (multi-threaded). Results always come back to main thread as callbacks. This is why Node.js can handle thousands of concurrent connections — it does not block on I/O.
- Why Interviewer Asks: Trick question. Saying "yes it is single-threaded" is partially wrong. Explaining the thread pool shows deep understanding.

---

## Topic 2 : Event Loop

---

**6. What is the Event Loop? How does it work?**

Answer:
Event Loop is the mechanism that allows Node.js to perform non-blocking asynchronous operations despite being single-threaded. It continuously checks if the Call Stack is empty and then picks tasks from queues.

```
How a Request is Handled:
1. Client sends HTTP request to Node.js server
2. Request callback added to Event Queue
3. Event Loop picks from queue when Call Stack is empty
4. If operation is blocking (fs, crypto) → offloaded to Thread Pool
5. Thread Pool completes → result callback goes to Event Queue
6. Event Loop picks callback → executes on main thread → sends response

Event Loop Phases (managed by libuv):
┌─────────────────────────────────────┐
│          Timers                      │ ← setTimeout, setInterval
├─────────────────────────────────────┤
│          Pending Callbacks           │ ← System-level callbacks
├─────────────────────────────────────┤
│          Idle / Prepare              │ ← Internal (GC, memory)
├─────────────────────────────────────┤
│          Poll (Heart)                │ ← I/O callbacks, new events
├─────────────────────────────────────┤
│          Check                       │ ← setImmediate()
├─────────────────────────────────────┤
│          Close Callbacks             │ ← socket.on('close')
└─────────────────────────────────────┘

Between EVERY phase: Microtask Queue runs
  → process.nextTick() (highest priority)
  → Promise.then() callbacks
```

Note:
- Key Point: 6 phases in order. Poll is the heart — where most I/O callbacks execute. Microtasks run BETWEEN every phase. process.nextTick has higher priority than Promises. Call Stack must be empty before Event Loop picks anything.
- Why Interviewer Asks: THE most important Node.js question. If you explain the 6 phases and microtask priority correctly, interviewer will be very impressed.

---

**7. What is the difference between Microtask and Macrotask?**

Answer:

**Microtasks (Higher Priority):**
- `process.nextTick()` (highest async priority in Node.js)
- `Promise.then()`, `.catch()`, `.finally()`
- `queueMicrotask()`
- `await` continuation

**Macrotasks (Lower Priority):**
- `setTimeout()`, `setInterval()`
- `setImmediate()`
- I/O operations (fs.readFile)
- Network operations

**Rule:** After each macrotask ALL microtasks are executed before next macrotask.

```javascript
console.log("1");                          // sync
setTimeout(() => console.log("2"), 0);      // macrotask
Promise.resolve().then(() => console.log("3")); // microtask
process.nextTick(() => console.log("4"));   // nextTick (highest async)
console.log("5");                          // sync

// Output: 1 → 5 → 4 → 3 → 2
// Priority: sync > nextTick > promise > setTimeout
```

Note:
- Key Point: Sync first, then nextTick, then Promises, then setTimeout/setInterval. All microtasks drain before any macrotask runs. process.nextTick is Node.js specific — highest async priority.
- Why Interviewer Asks: They give code with mixed async operations and ask output. Understanding priority order is essential.

---

**8. What is the difference between process.nextTick() and setImmediate()?**

Answer:

| Feature | `process.nextTick()` | `setImmediate()` |
|---------|---------------------|------------------|
| Queue | nextTick queue (microtask) | Check phase (macrotask) |
| Priority | Higher — runs before anything else async | Lower — runs in check phase |
| When | After current operation, before event loop continues | After current poll phase |
| Recursive risk | Can starve I/O if used recursively | Safe for recursive use |

```javascript
setImmediate(() => console.log("setImmediate"));
process.nextTick(() => console.log("nextTick"));

// Output: nextTick → setImmediate

// Inside I/O callback — setImmediate always first
const fs = require('fs');
fs.readFile('file.txt', () => {
    setTimeout(() => console.log("setTimeout"), 0);
    setImmediate(() => console.log("setImmediate"));
});
// Output: setImmediate → setTimeout (guaranteed inside I/O)
```

Note:
- Key Point: nextTick runs before everything async. setImmediate runs in check phase. Inside I/O callbacks setImmediate always runs before setTimeout. Too many nextTick calls can starve I/O operations.
- Why Interviewer Asks: Advanced event loop question. Tests deep understanding of phase ordering.

---

**9. Predict the output — Event Loop question.**

```javascript
console.log("Start");
setTimeout(() => console.log("Timeout"), 0);
setImmediate(() => console.log("Immediate"));
Promise.resolve().then(() => console.log("Promise"));
process.nextTick(() => console.log("NextTick"));
console.log("End");
```

Answer:
```
Start
End
NextTick
Promise
Timeout (or Immediate — order not guaranteed outside I/O)
Immediate (or Timeout)
```

**Explanation:**
1. `console.log("Start")` — sync → **Start**
2. `setTimeout` → macrotask queue (timers phase)
3. `setImmediate` → check phase queue
4. `Promise.then` → microtask queue
5. `process.nextTick` → nextTick queue (highest priority)
6. `console.log("End")` — sync → **End**
7. Call Stack empty → nextTick queue → **NextTick**
8. Microtask queue → **Promise**
9. Timeout vs Immediate — order depends on system performance when outside I/O

Note:
- Key Point: sync → nextTick → Promise → setTimeout/setImmediate. Outside I/O the order of setTimeout(0) and setImmediate is non-deterministic. Inside I/O callback setImmediate always first.
- Why Interviewer Asks: Classic Node.js output question. Tests event loop phase understanding.

---

## Topic 3 : Threads & Architecture

---

**10. Explain Node.js Architecture with diagram.**

Answer:

```
                    Client Requests
                         │
                         ▼
              ┌──────────────────────┐
              │   Node.js Server     │
              │   (V8 + libuv)       │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │    Event Queue       │
              │  (callbacks waiting) │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │    Event Loop        │
              │  (checks if stack    │
              │   is empty, picks    │
              │   from queue)        │
              └────┬─────────┬───────┘
                   │         │
          Non-blocking    Blocking
          (simple compute) (fs, crypto, dns)
                   │         │
                   ▼         ▼
           Execute &    ┌────────────┐
           Respond      │Thread Pool │
                        │ (4 workers)│
                        └─────┬──────┘
                              │ Done
                              ▼
                    Callback → Event Queue → Event Loop → Response
```

Note:
- Key Point: Request → Event Queue → Event Loop → (Non-blocking: execute directly) OR (Blocking: offload to thread pool) → Callback back to Event Queue → Event Loop executes → Response. This is how Node.js handles thousands of connections with one main thread.
- Why Interviewer Asks: Shows you understand the complete flow of how Node.js handles requests internally.

---

**11. What is the difference between Main Thread and Worker Threads?**

Answer:

| Feature | Main Thread | Worker Threads |
|---------|------------|----------------|
| Count | Only 1 | 4 default (up to 128) |
| Runs | JS code, Event Loop, callbacks | Heavy I/O (fs, crypto, dns, zlib) |
| Managed by | V8 Engine | libuv Thread Pool |
| Blocking | Should NEVER block | Designed for blocking tasks |

```javascript
// If you block main thread — entire server freezes!
// BAD:
app.get('/heavy', (req, res) => {
    let sum = 0;
    for (let i = 0; i < 10000000000; i++) { sum += i; }  // blocks main thread!
    res.json({ sum });
    // All other requests wait until this finishes
});

// GOOD: Use worker_threads for CPU-intensive tasks
const { Worker } = require('worker_threads');
app.get('/heavy', (req, res) => {
    const worker = new Worker('./heavy-task.js');
    worker.on('message', (result) => res.json({ result }));
});
```

Note:
- Key Point: Never block main thread with heavy computation — it freezes entire server. Offload CPU-intensive work to worker threads. Default 4 threads, increase with UV_THREADPOOL_SIZE. I/O automatically goes to thread pool, CPU tasks need manual worker_threads.
- Why Interviewer Asks: Tests if you understand why Node.js can handle many connections and what breaks it.

---

## Topic 4 : npm, yarn, nvm

---

**12. What is npm? What is package.json vs package-lock.json?**

Answer:
**npm** (Node Package Manager) is the default package manager for Node.js. It installs, updates, and manages third-party packages.

**package.json** — Manifest file containing project metadata, scripts, dependencies. You create/edit this.

**package-lock.json** — Auto-generated file that locks exact versions of ALL installed packages and sub-dependencies. Ensures consistent installs across machines.

```bash
npm init -y                        # create package.json
npm install express                # install + add to dependencies
npm install nodemon --save-dev     # add to devDependencies
npm install -g nodemon             # install globally
npm uninstall express              # remove
npm update                         # update all
npm audit                          # check vulnerabilities
npm audit fix                      # auto-fix vulnerabilities
```

```
dependencies     = needed in PRODUCTION (express, mongoose, jsonwebtoken)
devDependencies  = needed in DEVELOPMENT only (nodemon, jest, eslint)

package.json:     "express": "^4.18.0"  → ^4.18.0 means >= 4.18.0 but < 5.0.0
package-lock.json: "express": "4.18.2"  → exact version locked
```

Note:
- Key Point: package-lock.json ensures everyone installs exact same versions — always commit it to git. node_modules goes in .gitignore. dependencies vs devDependencies: --save-dev for dev only tools. ^ means compatible updates, ~ means patch updates only.
- Why Interviewer Asks: Practical setup question. The dependencies vs devDependencies and lock file purpose are commonly asked.

---

**13. What is the difference between npm and yarn?**

Answer:

| Feature | npm | yarn |
|---------|-----|------|
| By | npm Inc (2010) | Facebook (2016) |
| Lock file | package-lock.json | yarn.lock |
| Speed | Slower (improved recently) | Faster (parallel install, caching) |
| Offline | Limited | Better offline support |
| Security | npm audit | Checksum verification |
| CLI | Verbose | Cleaner output |
| Bundled with | Node.js (default) | Must install separately |

```bash
# Command comparison
npm install           →  yarn install / yarn
npm install pkg       →  yarn add pkg
npm uninstall pkg     →  yarn remove pkg
npm install -g pkg    →  yarn global add pkg
npm run start         →  yarn start
npm install --save-dev→  yarn add --dev
```

Note:
- Key Point: yarn was created because npm was slow and insecure early on. npm has improved significantly. Both work fine. Use whichever your team uses. nvm (Node Version Manager) manages multiple Node.js versions — `nvm use 18` to switch.
- Why Interviewer Asks: Shows ecosystem awareness. Quick answer — mention speed and lock file differences.

---

## Topic 5 : Modules

---

**14. What is the difference between CommonJS and ES Modules?**

Answer:

| Feature | CommonJS (CJS) | ES Modules (ESM) |
|---------|----------------|-------------------|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | Synchronous | Asynchronous |
| Default in | Node.js | Browser, React |
| Tree Shaking | No | Yes |
| Conditional import | Yes | No (use dynamic import) |
| File extension | `.js` (default) | `.mjs` or `"type":"module"` in package.json |

```javascript
// CommonJS
const express = require('express');
const { readFile } = require('fs');
module.exports = { myFunction };

// ES Modules
import express from 'express';
import { readFile } from 'fs';
export default myFunction;
export { helper1, helper2 };

// Enable ES Modules in Node.js:
// Option 1: "type": "module" in package.json
// Option 2: Use .mjs file extension
```

Note:
- Key Point: require is synchronous and can be used conditionally. import is static and must be at top level. React uses import, Node.js traditionally uses require. Use require for Node.js backend unless team prefers ESM.
- Why Interviewer Asks: You use both daily — import in React, require in Node.js. Understanding the difference is essential.

---

## Topic 6 : Express.js Basics

---

**15. What is Express.js? How do you set up a basic server?**

Answer:
Express.js is a minimal, flexible, unopinionated web application framework for Node.js. It provides routing, middleware support, HTTP utility methods, and template engine support. It sits on top of Node.js HTTP module and simplifies server creation.

```javascript
// Install
// npm install express

const express = require('express');
const app = express();

// Built-in Middleware
app.use(express.json());                    // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.static('public'));           // serve static files

// Route
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Note:
- Key Point: Express simplifies Node.js HTTP module. express.json() parses JSON body. express.urlencoded() parses form data. express.static() serves files. app.listen() starts the server.
- Why Interviewer Asks: Basic setup question. Shows you can create a server from scratch.

---

**16. What is Middleware? Explain all types.**

Answer:
Middleware is a function that has access to request (req), response (res), and next function. It can execute code, modify req/res, end the cycle, or call next middleware. Middleware executes in the order it is defined.

```javascript
// Middleware signature
function myMiddleware(req, res, next) {
    // do something
    next(); // pass to next middleware (MUST call or request hangs)
}

// ===== 5 TYPES =====

// 1. Application-Level — app.use() or app.METHOD()
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} at ${Date.now()}`);
    next();
});

// 2. Router-Level — router.use()
const router = express.Router();
router.use((req, res, next) => {
    console.log('Router middleware');
    next();
});

// 3. Error-Handling — 4 parameters (err, req, res, next)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// 4. Built-in
app.use(express.json());           // parse JSON
app.use(express.urlencoded({ extended: true })); // parse URL-encoded
app.use(express.static('public')); // serve static files

// 5. Third-Party
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
app.use(cors());                   // enable CORS
app.use(helmet());                 // security headers
app.use(morgan('dev'));            // request logging
```

**Execution Order:**
```javascript
// Middleware runs in ORDER defined
app.use(cors());           // 1st
app.use(express.json());   // 2nd
app.use(morgan('dev'));     // 3rd
app.use('/api', routes);   // 4th
app.use(errorHandler);     // 5th (error handler LAST)
```

Note:
- Key Point: 5 types: Application, Router, Error-handling, Built-in, Third-party. MUST call next() or request hangs. Error middleware has 4 params. Order matters — defined first runs first. Error handler must be LAST.
- Why Interviewer Asks: Core Express concept. They want to hear all 5 types and that next() is required. Order of middleware is important.

---

**17. What is Routing in Express? Explain Router.**

Answer:
Routing defines how the application responds to client requests at specific endpoints (URLs) with specific HTTP methods.

```javascript
// Basic routing
app.get('/users', (req, res) => { res.json(users); });
app.post('/users', (req, res) => { /* create */ });
app.put('/users/:id', (req, res) => { /* full update */ });
app.patch('/users/:id', (req, res) => { /* partial update */ });
app.delete('/users/:id', (req, res) => { /* delete */ });

// Route parameters
app.get('/users/:id', (req, res) => {
    console.log(req.params.id);  // "123" from /users/123
});

// Optional parameter
app.get('/users/:id/:name?', (req, res) => {
    const name = req.params.name || 'Unknown';
});

// Query parameters
// GET /users?page=2&limit=10&role=admin
app.get('/users', (req, res) => {
    console.log(req.query.page);   // "2"
    console.log(req.query.limit);  // "10"
    console.log(req.query.role);   // "admin"
});

// Router (mini-app for modular routes)
const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

app.use('/api/users', userRouter);
// Now: GET /api/users, GET /api/users/123, POST /api/users, etc.

// Route-specific middleware
router.get('/:id', authMiddleware, authorize('admin'), getUser);
```

Note:
- Key Point: Router creates modular route handlers (mini-app). req.params for URL params (:id). req.query for query string (?key=value). req.body for POST/PUT data. Route-specific middleware runs only for that route.
- Why Interviewer Asks: Fundamental Express question. Shows you can structure routes properly with Router.

---

**18. What is the difference between req.params, req.query, and req.body?**

Answer:

```javascript
// GET /api/users/123?role=admin&active=true
// Body: { "name": "Deep", "email": "deep@test.com" }

app.get('/api/users/:id', (req, res) => {
    req.params.id;       // "123"          — from URL path /:id
    req.query.role;      // "admin"        — from query string ?role=admin
    req.query.active;    // "true"         — from query string (always string!)
    req.body.name;       // "Deep"         — from request body (POST/PUT)
    req.body.email;      // "deep@test.com"
});
```

| Property | Source | Example | Used For |
|----------|--------|---------|----------|
| `req.params` | URL path | `/users/:id` → `req.params.id` | Identifying specific resource |
| `req.query` | Query string | `?page=2&limit=10` → `req.query.page` | Filtering, sorting, pagination |
| `req.body` | Request body | POST/PUT JSON data | Creating/updating data |

Note:
- Key Point: params from URL path (/:id). query from ? in URL. body from POST/PUT data (need express.json() middleware). query values are always strings — parse with parseInt() if needed.
- Why Interviewer Asks: Basic but essential. Many beginners confuse these three. Shows practical Express knowledge.

---

## Topic 7 : CORS

---

**19. What is CORS? Why does it happen? How to fix it?**

Answer:
**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that blocks requests from a different origin (domain, port, or protocol). It prevents malicious websites from making unauthorized API calls to your server.

```
Same Origin:    http://localhost:3000 → http://localhost:3000/api  ✅ Allowed
Cross Origin:   http://localhost:3000 → http://localhost:5000/api  ❌ Blocked!

MERN: React (port 3000) → Express API (port 5000) = Cross Origin = CORS error
```

```javascript
// Fix: Install and use cors middleware
// npm install cors

const cors = require('cors');

// Allow all origins (development)
app.use(cors());

// Allow specific origin (production)
app.use(cors({
    origin: 'http://localhost:3000',          // or array: ['url1', 'url2']
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,                        // allow cookies
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manual CORS headers (without cors package)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
```

Note:
- Key Point: CORS is browser-only restriction — server-to-server requests are NOT affected. The SERVER must send CORS headers. In MERN development CORS is always needed (React on 3000, Express on 5000). Use cors npm package.
- Why Interviewer Asks: Every MERN developer encounters CORS. They want to know WHY it happens and HOW to fix it.

---

## Topic 8 : Sessions & Cookies

---

**20. What is the difference between Sessions and Cookies?**

Answer:

| Feature | Cookies | Sessions |
|---------|---------|----------|
| Stored | Client-side (browser) | Server-side (memory/DB) |
| Size limit | ~4KB | No limit |
| Security | Less secure (client can read/modify) | More secure (server-side) |
| Sent to server | With every HTTP request automatically | Session ID sent as cookie |
| Expires | Has expiry date | Until browser closes or timeout |

```javascript
// ===== COOKIES =====
// npm install cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Set cookie
res.cookie('token', 'abc123', {
    maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    httpOnly: true,                 // JS cannot access (XSS protection)
    secure: true,                   // HTTPS only
    sameSite: 'strict'              // CSRF protection
});

// Read cookie
const token = req.cookies.token;

// Clear cookie
res.clearCookie('token');

// ===== SESSIONS =====
// npm install express-session
const session = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 }
}));

// Set session data
req.session.userId = user.id;
req.session.role = user.role;

// Read session data
console.log(req.session.userId);

// Destroy session (logout)
req.session.destroy((err) => {
    res.json({ message: 'Logged out' });
});
```

Note:
- Key Point: Sessions store data on server (secure), cookies store on client (less secure). Session uses a session ID cookie to link client to server data. httpOnly cookies cannot be accessed by JavaScript (prevents XSS). For JWT auth you typically use cookies (httpOnly) or Authorization header.
- Why Interviewer Asks: Authentication fundamentals. Understanding cookie options (httpOnly, secure, sameSite) is important for security.

---

## Topic 9 : JWT Authentication

---

**21. What is JWT? How does JWT authentication work?**

Answer:
JWT (JSON Web Token) is a standard for securely transmitting information between parties as a JSON object. It is used for **stateless authentication** — the server does not store session data, the client stores the token.

```
JWT Structure:  Header.Payload.Signature

Header:    { "alg": "HS256", "typ": "JWT" }
Payload:   { "id": "user123", "role": "admin", "iat": 1234, "exp": 5678 }
Signature: HMACSHA256(base64(header) + "." + base64(payload), SECRET_KEY)

Note: Payload is NOT encrypted — just Base64 encoded (anyone can decode)
      Signature ensures token is not tampered with
```

```
Authentication Flow:
1. Client sends login credentials (email/password)
2. Server verifies credentials → generates JWT → sends to client
3. Client stores JWT (localStorage or httpOnly cookie)
4. Client sends JWT with every request: Authorization: Bearer <token>
5. Server verifies JWT → extracts user info → processes request
6. If token invalid/expired → 401 Unauthorized
```

```javascript
const jwt = require('jsonwebtoken');

// Generate token (after successful login)
const token = jwt.sign(
    { id: user._id, role: user.role },  // payload
    process.env.JWT_SECRET,              // secret key
    { expiresIn: '7d' }                  // expiry
);

// Verify token (auth middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// decoded = { id: "user123", role: "admin", iat: ..., exp: ... }
```

Note:
- Key Point: JWT is stateless — server does not store sessions. Token has 3 parts separated by dots. Payload is NOT encrypted (do not put sensitive data). Signature prevents tampering. Always use httpOnly cookies for storing tokens (more secure than localStorage).
- Why Interviewer Asks: Most asked Express topic. Every MERN app uses JWT. They want full flow explanation.

---

**22. How do you implement JWT Auth Middleware?**

Answer:

```javascript
const jwt = require('jsonwebtoken');

// Auth Middleware — protects routes
const authMiddleware = async (req, res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1]; // "Bearer TOKEN" → "TOKEN"

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach user to request
        req.user = decoded; // { id, role, iat, exp }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Role-Based Authorization
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

// Usage
app.get('/api/profile', authMiddleware, getProfile);
app.delete('/api/users/:id', authMiddleware, authorize('admin'), deleteUser);
```

Note:
- Key Point: Auth middleware extracts token from Bearer header, verifies it, attaches user to req. 401 = not authenticated, 403 = not authorized. Role middleware checks req.user.role. This pattern is used in every MERN project.
- Why Interviewer Asks: Practical implementation question. Shows you can build a complete auth system.

---

**23. What is the difference between JWT and Sessions?**

Answer:

| Feature | JWT | Sessions |
|---------|-----|----------|
| Storage | Client (token) | Server (session store) |
| Stateless/Stateful | Stateless | Stateful |
| Scalability | Easy (no server memory) | Hard (needs shared session store) |
| DB lookup per request | No | Yes (to verify session) |
| Revocation | Difficult (token valid until expired) | Easy (delete from store) |
| Size | Larger (payload in every request) | Small (only session ID) |
| Best for | APIs, microservices, mobile | Traditional web apps |

Note:
- Key Point: JWT is stateless and scalable but hard to revoke. Sessions are stateful and easy to revoke but need server memory. JWT is standard for REST APIs and MERN stack. Refresh tokens solve JWT revocation problem.
- Why Interviewer Asks: Shows you understand trade-offs and can choose the right approach.

---

## Topic 10 : Password Hashing

---

**24. How do you hash passwords? Why not store plain text?**

Answer:
Never store passwords in plain text because if database is breached, all passwords are exposed. Use **bcrypt** to hash passwords — it is one-way (cannot reverse) and uses salt (random data) to make each hash unique even for same passwords.

```javascript
const bcrypt = require('bcryptjs');

// Hash (during registration)
const hashedPassword = await bcrypt.hash('myPassword123', 10);
// Output: "$2a$10$X7jZ5Kq..." (60 chars, different every time)

// Compare (during login)
const isMatch = await bcrypt.compare('myPassword123', hashedPassword);
// Returns: true or false

// In Mongoose pre-save middleware (best approach)
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
```

Note:
- Key Point: bcrypt hashes are one-way — cannot reverse. Salt makes same password produce different hashes. 10 salt rounds is standard (higher = slower but more secure). Always hash in pre-save middleware so it is automatic. Compare with bcrypt.compare not ===.
- Why Interviewer Asks: Security fundamentals. If you store plain text passwords, that is a red flag. Shows you handle sensitive data properly.

---

## Topic 11 : File Upload

---

**25. How do you handle file uploads in Express?**

Answer:

```javascript
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File filter (validation)
const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, GIF allowed'), false);
    }
};

// Initialize
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Single file: req.file
app.post('/upload', upload.single('avatar'), (req, res) => {
    res.json({ file: req.file });
    // req.file = { fieldname, originalname, mimetype, destination, filename, path, size }
});

// Multiple files: req.files
app.post('/upload-many', upload.array('photos', 5), (req, res) => {
    res.json({ files: req.files });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));
```

Note:
- Key Point: Multer handles multipart/form-data (file uploads). diskStorage saves to disk, memoryStorage saves to buffer (for cloud upload). Always validate file type and size. upload.single for one file, upload.array for multiple. Serve uploads with express.static.
- Why Interviewer Asks: Practical feature in most applications. Profile image upload, document upload are common requirements.

---

## Topic 12 : Input Validation

---

**26. How do you validate request data in Express?**

Answer:

```javascript
const { body, param, query, validationResult } = require('express-validator');

// Validation rules
const registerRules = [
    body('name').trim().notEmpty().withMessage('Name required')
        .isLength({ min: 2, max: 50 }),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Min 6 characters')
        .matches(/\d/).withMessage('Must contain number'),
    body('age').optional().isInt({ min: 18, max: 65 }),
];

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Usage
app.post('/register', registerRules, validate, registerController);

// Custom validator
body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
});

// Async validator (check DB)
body('email').custom(async (value) => {
    const user = await User.findOne({ email: value });
    if (user) throw new Error('Email already exists');
});
```

Note:
- Key Point: Always validate on server (never trust client). express-validator chains validators with custom messages. Validate before controller runs. Custom validators for complex logic. Async validators for DB checks.
- Why Interviewer Asks: Data validation is critical for API security. Shows you handle edge cases and prevent bad data.

---

## Topic 13 : Error Handling

---

**27. How do you implement centralized error handling in Express?**

Answer:

```javascript
// Custom Error Class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

// Async Handler (eliminates try-catch in every controller)
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Controller — clean, no try-catch
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    res.json(user);
});

// Global Error Handler (LAST middleware in app.js)
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    // Handle specific error types
    if (err.name === 'ValidationError') err = new AppError(err.message, 400);
    if (err.code === 11000) err = new AppError('Duplicate value', 409);
    if (err.name === 'CastError') err = new AppError('Invalid ID', 400);
    if (err.name === 'JsonWebTokenError') err = new AppError('Invalid token', 401);
    if (err.name === 'TokenExpiredError') err = new AppError('Token expired', 401);

    res.status(err.statusCode).json({
        status: err.statusCode < 500 ? 'fail' : 'error',
        message: err.message
    });
});

// 404 handler (before error handler)
app.all('*', (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Order: routes → 404 handler → error handler
```

Note:
- Key Point: asyncHandler wraps controllers — catches all errors automatically. Custom AppError class with statusCode. Global error handler has 4 params (err, req, res, next). Handle Mongoose errors (ValidationError, CastError, 11000). Error handler must be LAST middleware.
- Why Interviewer Asks: Separates junior from mid-level. Production apps need centralized error handling. asyncHandler pattern is industry standard.

---

## Topic 14 : RESTful API Design

---

**28. What are RESTful API best practices?**

Answer:

```
1. Use Nouns Not Verbs in URLs:
   GOOD: GET /api/users          BAD: GET /api/getUsers
   GOOD: POST /api/users         BAD: POST /api/createUser

2. Use Plural Nouns:
   GOOD: /api/users              BAD: /api/user

3. Use Proper HTTP Methods:
   GET    = Read       POST   = Create
   PUT    = Full Update   PATCH  = Partial Update
   DELETE = Delete

4. Use Proper Status Codes:
   200 = OK               201 = Created
   204 = No Content        400 = Bad Request
   401 = Unauthorized      403 = Forbidden
   404 = Not Found         409 = Conflict
   500 = Server Error

5. Nested Resources for Relationships:
   GET /api/users/123/orders

6. Query Params for Filtering/Sorting/Pagination:
   GET /api/users?role=admin&sort=-salary&page=2&limit=10

7. API Versioning:
   /api/v1/users    /api/v2/users

8. Standard Response Format:
   Success: { status: "success", data: { ... } }
   Error:   { status: "error", message: "..." }
```

Note:
- Key Point: Nouns for URLs, proper HTTP methods, correct status codes, versioning, consistent response format. PUT replaces entire resource, PATCH updates specific fields. 401 = who are you? 403 = I know you but no permission.
- Why Interviewer Asks: Tests API design skills. Naming conventions and status codes are frequently asked.

---

**29. What is the difference between PUT and PATCH?**

Answer:

| Feature | PUT | PATCH |
|---------|-----|-------|
| Update type | Full replacement | Partial modification |
| Sends | Entire resource | Only changed fields |
| Missing fields | Set to null/removed | Unchanged |
| Idempotent | Yes | Not necessarily |

```javascript
// PUT — replace entire user
// Must send ALL fields
app.put('/api/users/:id', async (req, res) => {
    // Body: { name: "Deep", age: 24, email: "deep@test.com", role: "admin" }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
});

// PATCH — update specific fields
// Send only what changed
app.patch('/api/users/:id', async (req, res) => {
    // Body: { age: 24 }  — only age updated, everything else unchanged
    const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(user);
});
```

Note:
- Key Point: PUT = full replacement (send everything). PATCH = partial update (send only changes). In practice most APIs use PATCH for updates. PUT is idempotent (same request = same result).
- Why Interviewer Asks: Very commonly asked REST question. Knowing the difference shows proper API design knowledge.

---

## Topic 15 : MVC Structure

---

**30. Explain MVC folder structure for Express project.**

Answer:

```
project/
├── src/
│   ├── config/
│   │   └── db.js                    # Database connection
│   ├── models/
│   │   ├── userModel.js             # Schema/Model definition
│   │   └── productModel.js
│   ├── controllers/
│   │   ├── userController.js        # Business logic
│   │   └── productController.js
│   ├── routes/
│   │   ├── index.js                 # Route aggregator
│   │   ├── userRoutes.js            # User endpoints
│   │   └── productRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── errorHandler.js          # Global error handler
│   │   └── validate.js              # Input validation
│   ├── utils/
│   │   ├── AppError.js              # Custom error class
│   │   └── asyncHandler.js          # Async wrapper
│   └── services/                    # Business logic (optional)
├── uploads/                          # Uploaded files
├── app.js                           # Express app setup
├── server.js                        # Server start
├── .env                             # Environment variables
├── .gitignore                       # Ignore node_modules, .env
└── package.json
```

```javascript
// Route aggregator (routes/index.js)
const router = require('express').Router();
router.use('/users', require('./userRoutes'));
router.use('/products', require('./productRoutes'));
module.exports = router;

// app.js
app.use('/api/v1', require('./routes'));
```

Note:
- Key Point: M = Model (data), V = View (not used in API — React is the view), C = Controller (logic). Separate concerns: routes define endpoints, controllers handle logic, models define data structure. Keep app.js clean — only middleware and route mounting.
- Why Interviewer Asks: Shows you can organize code properly. Clean project structure is expected for real applications.

---

## Topic 16 : Socket.IO

---

**31. What is Socket.IO? How is it different from REST?**

Answer:

| Feature | REST API | Socket.IO (WebSocket) |
|---------|---------|----------------------|
| Communication | Request-Response (one way at a time) | Bi-directional (two-way, real-time) |
| Connection | New connection per request | Persistent open connection |
| Initiated by | Client only | Both client and server |
| Use case | CRUD operations | Chat, live notifications, gaming |

```javascript
// Server
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: { origin: 'http://localhost:3000' }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    });

    socket.on('sendMessage', (data) => {
        io.to(data.roomId).emit('newMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Client (React)
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.emit('joinRoom', 'room123');
socket.on('newMessage', (msg) => console.log(msg));
```

Note:
- Key Point: Socket.IO enables real-time bidirectional communication. Server can push data to client without client asking. Uses rooms for group communication. Events: connection, disconnect, custom events. Use REST for CRUD, Socket.IO for real-time features.
- Why Interviewer Asks: If your project has chat or real-time features, they will ask this. Shows you know beyond basic REST APIs.

---

## Topic 17 : Environment Config

---

**32. How do you manage environment variables?**

Answer:

```bash
# .env file (root directory)
PORT=5000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/mydb
JWT_SECRET=mySuperSecret123
JWT_EXPIRES_IN=7d
```

```javascript
// Install: npm install dotenv

// Load at TOP of app.js (before anything else)
require('dotenv').config();

// Access
const PORT = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL;

// IMPORTANT:
// 1. process.env values are ALWAYS strings
// 2. Add .env to .gitignore (NEVER commit secrets)
// 3. Different .env for different environments
//    .env.development, .env.production, .env.test
```

Note:
- Key Point: Never hardcode sensitive data. Use dotenv to load .env file. Add .env to .gitignore. All values are strings — convert with Number() if needed. Different environments need different configs.
- Why Interviewer Asks: Security best practice. Not using .env for secrets is a red flag.

---

## Topic 18 : Rate Limiting & Caching

---

**33. What is Rate Limiting? How do you implement it?**

Answer:
Rate Limiting restricts the number of requests a client can make in a time window. Prevents brute force attacks, DDoS, and API abuse.

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 100,                     // max 100 requests per IP per window
    message: { error: 'Too many requests, try again later' }
});

app.use('/api', limiter);

// Stricter for auth routes
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use('/api/auth', authLimiter);
```

Note:
- Key Point: Prevents brute force login attempts and API abuse. Apply stricter limits on auth routes. In production use Redis-based rate limiter for multiple server instances.
- Why Interviewer Asks: Security question. Shows you protect your API from abuse.

---

**34. What is Caching? How do you implement it in Node.js?**

Answer:

```javascript
// In-Memory Cache (node-cache)
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 min default

const getUsers = async (req, res) => {
    const cached = cache.get('users');
    if (cached) return res.json({ source: 'cache', data: cached });

    const users = await User.find().lean();
    cache.set('users', users);
    res.json({ source: 'db', data: users });
};

// Invalidate on data change
const createUser = async (req, res) => {
    const user = await User.create(req.body);
    cache.del('users'); // clear cache
    res.status(201).json(user);
};

// Redis (production-level)
// Separate server, shared across instances, persistent
// npm install redis
```

Note:
- Key Point: Cache reduces DB queries and improves response time. node-cache for simple apps, Redis for production multi-server. Always invalidate cache when data changes. TTL (Time To Live) auto-expires cached data.
- Why Interviewer Asks: Performance optimization. Shows you think about scalability.

---

## Topic 19 : Pagination & Filtering

---

**35. How do you implement pagination, filtering, and sorting?**

Answer:

```javascript
// GET /api/users?page=2&limit=10&sort=-salary&department=MERN&salary[gte]=50000

const getUsers = async (req, res) => {
    // Filtering
    const queryObj = { ...req.query };
    ['page', 'limit', 'sort', 'fields'].forEach(f => delete queryObj[f]);

    // Advanced filtering: convert gte/gt/lte/lt to MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, m => `$${m}`);

    let query = User.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
        query = query.sort(req.query.sort.split(',').join(' '));
    } else {
        query = query.sort('-createdAt');
    }

    // Field selection
    if (req.query.fields) {
        query = query.select(req.query.fields.split(',').join(' '));
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    query = query.skip((page - 1) * limit).limit(limit);

    const [data, total] = await Promise.all([
        query.lean(),
        User.countDocuments(JSON.parse(queryStr))
    ]);

    res.json({
        status: 'success',
        results: data.length,
        data: { users: data },
        pagination: {
            page, limit, total,
            pages: Math.ceil(total / limit)
        }
    });
};
```

Note:
- Key Point: Use query params for filtering (?department=MERN), sorting (?sort=-salary), field selection (?fields=name,email), pagination (?page=2&limit=10). Run count and find in parallel with Promise.all. Return pagination metadata in response.
- Why Interviewer Asks: Every real API needs this. Shows you build production-ready endpoints.

---

## Topic 20 : Security

---

**36. What are Express security best practices?**

Answer:

```javascript
// 1. Helmet — security HTTP headers
const helmet = require('helmet');
app.use(helmet());

// 2. CORS — restrict allowed origins
app.use(cors({ origin: 'https://myapp.com' }));

// 3. Rate Limiting — prevent brute force
app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));

// 4. Input Validation — validate all input
app.post('/register', [body('email').isEmail()], validate, controller);

// 5. Sanitize Input — prevent NoSQL injection
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

// 6. Prevent XSS
const xss = require('xss-clean');
app.use(xss());

// 7. Password Hashing — bcrypt
const hash = await bcrypt.hash(password, 10);

// 8. Environment Variables — .env for secrets
// Never hardcode JWT_SECRET, DB_PASSWORD in code

// 9. HTTPS in production
// 10. httpOnly cookies for tokens
res.cookie('token', jwt, { httpOnly: true, secure: true, sameSite: 'strict' });

// 11. Parameter Pollution Protection
const hpp = require('hpp');
app.use(hpp());

// 12. Limit request body size
app.use(express.json({ limit: '10kb' }));
```

Note:
- Key Point: Helmet for HTTP headers. CORS for origin restriction. Rate limiting for brute force. Validation and sanitization for injection attacks. bcrypt for passwords. Environment variables for secrets. httpOnly cookies for tokens.
- Why Interviewer Asks: Security is critical. Knowing these packages and patterns shows production awareness.

---

## Topic 21 : HTTP Status Codes

---

**37. What are the important HTTP Status Codes?**

Answer:

```
1xx — Informational
    100 Continue

2xx — Success
    200 OK              — GET success
    201 Created          — POST success (new resource)
    204 No Content       — DELETE success (nothing to return)

3xx — Redirection
    301 Moved Permanently
    304 Not Modified     — cached version valid

4xx — Client Error
    400 Bad Request      — invalid input / validation error
    401 Unauthorized     — not logged in / invalid token
    403 Forbidden        — logged in but no permission
    404 Not Found        — resource doesn't exist
    409 Conflict         — duplicate (email already exists)
    422 Unprocessable    — validation failed
    429 Too Many Requests — rate limit exceeded

5xx — Server Error
    500 Internal Server Error — server crashed
    502 Bad Gateway          — upstream server error
    503 Service Unavailable  — maintenance / overloaded
```

Note:
- Key Point: 200=OK, 201=Created, 400=Bad Input, 401=Not Authenticated, 403=No Permission, 404=Not Found, 500=Server Error. 401 vs 403: 401="who are you?" 403="I know you but you can't do this." Always return correct status codes in your APIs.
- Why Interviewer Asks: Practical API knowledge. Wrong status codes show carelessness.

---

## Topic 22 : Request & Response

---

**38. What are the important Request and Response methods?**

Answer:

```javascript
// ===== REQUEST (req) =====
req.params          // URL params (/users/:id → req.params.id)
req.query           // Query string (?page=2 → req.query.page)
req.body            // POST/PUT body data (needs express.json())
req.headers         // HTTP headers (req.headers.authorization)
req.cookies         // Cookies (needs cookie-parser)
req.method          // "GET", "POST", "PUT", "DELETE"
req.url             // "/api/users?page=2"
req.path            // "/api/users"
req.ip              // Client IP address
req.hostname        // "localhost"
req.protocol        // "http" or "https"
req.session         // Session data (needs express-session)
req.file / req.files // Uploaded files (needs multer)

// ===== RESPONSE (res) =====
res.json(data)         // Send JSON response
res.send(data)         // Send various types (string, buffer, object)
res.status(201)        // Set status code (chainable)
res.status(201).json() // Set status + send JSON
res.redirect('/login') // Redirect to URL
res.cookie(name, val)  // Set cookie
res.clearCookie(name)  // Remove cookie
res.sendFile(path)     // Send a file
res.download(path)     // Prompt file download
res.render('view', {}) // Render template (EJS/Pug)
res.set(header, value) // Set response header
res.end()              // End response without data
```

Note:
- Key Point: req = incoming data from client. res = outgoing data to client. res.json() is most used in APIs. Always set proper status code before sending response. res.status(201).json() is standard for creation responses.
- Why Interviewer Asks: Tests practical Express knowledge. Knowing all the properties available on req and res shows experience.

---

## Topic 23 : Static Files

---

**39. How do you serve static files in Express?**

Answer:

```javascript
// Serve files from 'public' folder
app.use(express.static('public'));
// http://localhost:5000/images/logo.png → serves public/images/logo.png
// http://localhost:5000/css/style.css   → serves public/css/style.css

// Serve with URL prefix
app.use('/static', express.static('public'));
// http://localhost:5000/static/images/logo.png

// Serve uploaded files
app.use('/uploads', express.static('uploads'));
// http://localhost:5000/uploads/avatar-123.jpg

// Absolute path (recommended)
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
```

Note:
- Key Point: express.static serves files from a directory. No route handler needed — Express automatically maps URLs to files. Use path.join for reliable paths across OS. Common for serving uploaded images, CSS, JS files.
- Why Interviewer Asks: Basic but practical. Shows you know how to serve files beyond just JSON APIs.

---

## Topic 24 : Console Methods

---

**40. What are the different console methods in Node.js?**

Answer:

```javascript
console.log("General output");                    // general logging
console.error("Error message");                   // error (red in some terminals)
console.warn("Warning");                          // warning (yellow)
console.info("Info");                             // informational
console.table([{name:"Deep"},{name:"Neel"}]);     // tabular format
console.time("timer"); /* code */ console.timeEnd("timer"); // measure time
console.assert(1===2, "Assertion failed");        // prints only if false
console.count("label");                           // counts how many times called
console.trace("trace");                           // shows call stack
console.dir(object);                              // object properties as list
console.clear();                                  // clear console
console.group("Group"); console.log("inside"); console.groupEnd(); // grouping
```

Note:
- Key Point: console.table for debugging arrays/objects. console.time/timeEnd for performance measurement. console.assert for conditional logging. console.trace for debugging call chains.
- Why Interviewer Asks: Shows debugging skills beyond just console.log.

---

## Topic 25 : Dependencies

---

**41. What is the difference between dependencies and devDependencies?**

Answer:

| Feature | dependencies | devDependencies |
|---------|-------------|-----------------|
| Purpose | Needed in PRODUCTION | Needed in DEVELOPMENT only |
| Install | `npm install pkg` | `npm install pkg --save-dev` |
| Deployed | Yes, bundled with app | No, not deployed |
| Examples | express, mongoose, jsonwebtoken, bcrypt | nodemon, jest, eslint, prettier |

```json
{
    "dependencies": {
        "express": "^4.18.0",
        "mongoose": "^7.0.0",
        "jsonwebtoken": "^9.0.0",
        "bcryptjs": "^2.4.3"
    },
    "devDependencies": {
        "nodemon": "^3.0.0",
        "jest": "^29.0.0",
        "eslint": "^8.0.0"
    }
}
```

Note:
- Key Point: dependencies = app needs these to run. devDependencies = only for development (testing, linting, auto-restart). In production `npm install --production` skips devDependencies.
- Why Interviewer Asks: Shows you understand project configuration and deployment.

---

## Topic 26 : Practical Scenario Questions

---

**42. Build a complete Register + Login API. Show the flow.**

Answer:

```javascript
// ===== userModel.js =====
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ===== authController.js =====
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError('Email already exists', 409);

    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
        status: 'success',
        token,
        data: { user: { id: user._id, name: user.name, email: user.email } }
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new AppError('Invalid credentials', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
        status: 'success',
        token,
        data: { user: { id: user._id, name: user.name, email: user.email } }
    });
});

// ===== authRoutes.js =====
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/profile', authMiddleware, getProfile);
```

Note:
- Key Point: Register: validate → check duplicate → hash password (pre-save) → create user → generate JWT → return token. Login: validate → find user → compare password → generate JWT → return token. Always return token on both register and login. Never return password in response.
- Why Interviewer Asks: Most asked practical question. Shows you can build a complete auth system end-to-end.

---

**43. How do you structure app.js properly?**

Answer:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// 1. Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(mongoSanitize());

// 2. Rate Limiting
app.use('/api', rateLimit({ windowMs: 15*60*1000, max: 100 }));

// 3. Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Logging (development only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 5. Static Files
app.use('/uploads', express.static('uploads'));

// 6. Routes
app.use('/api/v1', routes);

// 7. 404 Handler
app.all('*', (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// 8. Global Error Handler (MUST be last)
app.use(globalErrorHandler);

module.exports = app;
```

Note:
- Key Point: Order matters — security first, then parsing, then logging, then routes, then error handling. Separate app.js (Express config) from server.js (start listening). This structure is industry standard.
- Why Interviewer Asks: Shows you organize code properly and understand middleware order.

---

**44. How do you connect Express with MongoDB using Mongoose?**

Answer:

```javascript
// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // exit with failure
    }
};

module.exports = connectDB;

// server.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    process.exit(1);
});
```

Note:
- Key Point: Separate DB connection into config file. Connect before starting server. Handle connection errors with process.exit(1). Catch unhandled rejections globally. Use environment variables for DB URL.
- Why Interviewer Asks: Practical setup question. Every MERN project starts with this.

---

## Topic 27 : Advanced Questions

---

**45. What is the difference between app.use() and app.all()?**

Answer:

```javascript
// app.use() — for middleware, matches path PREFIX
app.use('/api', middleware);
// Matches: /api, /api/users, /api/users/123, /api/anything

// app.all() — for route handlers, matches EXACT path
app.all('/api', handler);
// Matches only: /api (not /api/users)

// app.use can work WITHOUT path (applies to all routes)
app.use(express.json());  // applies to every request

// app.all requires path
app.all('*', notFoundHandler);  // catch-all for undefined routes
```

Note:
- Key Point: app.use matches path prefix and is for middleware. app.all matches exact path and handles all HTTP methods. app.use('/api') matches /api/anything. app.all('/api') matches only /api.
- Why Interviewer Asks: Subtle but important difference. Tests deep Express understanding.

---

**46. What is the difference between res.send() and res.json()?**

Answer:

```javascript
// res.json() — sends JSON with correct Content-Type header
res.json({ name: "Deep" });
// Content-Type: application/json
// Converts to JSON automatically
// null and undefined also sent as JSON

// res.send() — sends various types
res.send("Hello");           // Content-Type: text/html
res.send({ name: "Deep" }); // Content-Type: application/json (auto-detect)
res.send(Buffer.from('hi')); // Content-Type: application/octet-stream

// Difference:
// res.json() always sets Content-Type to application/json
// res.send() auto-detects Content-Type based on data type
// res.json() also converts non-object types (null, boolean) to JSON
// For APIs always use res.json() — explicit and predictable
```

Note:
- Key Point: Use res.json() for API responses — always sets correct JSON header. res.send() auto-detects type which can cause unexpected behavior. res.json(null) sends "null" as JSON. res.send(null) sends empty response.
- Why Interviewer Asks: Subtle difference that shows attention to detail.

---

**47. What happens if you don't call next() in middleware?**

Answer:
The request **hangs** — it stays in that middleware forever until the client times out. The next middleware or route handler never executes.

```javascript
// BAD — request hangs
app.use((req, res, next) => {
    console.log('Logged');
    // forgot next() — request stuck here forever!
});

// GOOD
app.use((req, res, next) => {
    console.log('Logged');
    next(); // pass control to next middleware/route
});

// Exception: If you send a response, you don't need next()
app.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'No token' }); // ends cycle
    }
    next(); // continue only if token exists
});

// WARNING: Don't call next() AND send response
app.use((req, res, next) => {
    res.json({ data: 'hello' });
    next(); // ERROR: "Cannot set headers after they are sent"
});
```

Note:
- Key Point: Always call next() unless you send a response. If you send response AND call next(), you get "headers already sent" error. Use return before res.json() to prevent code below from running.
- Why Interviewer Asks: Tests understanding of middleware flow. A common bug in Express applications.

---

**48. How do you handle 404 routes?**

Answer:

```javascript
// Define all your routes first
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Then catch-all 404 handler (AFTER all routes, BEFORE error handler)
app.all('*', (req, res, next) => {
    next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
});

// Or simple version:
app.use((req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Route ${req.originalUrl} not found`
    });
});

// Error handler (LAST)
app.use(globalErrorHandler);
```

Note:
- Key Point: 404 handler goes AFTER all routes but BEFORE error handler. Uses app.all('*') to catch any method on any undefined path. Pass to error handler with next(new AppError()) for consistent error format.
- Why Interviewer Asks: Shows you handle edge cases. Undefined routes should return proper 404 not crash.

---

**49. Explain the complete request lifecycle in Express.**

Answer:

```
1. Client sends HTTP request (e.g., POST /api/users)
         │
2. Express receives request
         │
3. Global middleware runs in order:
   ├── helmet() → sets security headers
   ├── cors() → checks origin
   ├── express.json() → parses body
   ├── morgan() → logs request
   ├── rateLimit() → checks rate
   └── mongoSanitize() → cleans input
         │
4. Route matching:
   app.use('/api/users', userRoutes)
   router.post('/', validationRules, validate, controller)
         │
5. Route-specific middleware:
   ├── authMiddleware → verify JWT
   ├── authorize('admin') → check role
   ├── validationRules → validate input
   └── validate → check errors
         │
6. Controller executes:
   ├── Business logic
   ├── Database query (Mongoose/Sequelize)
   └── Send response: res.status(201).json(data)
         │
7. If error at any step → next(error)
         │
8. Error handler middleware catches:
   └── Sends error response: res.status(err.statusCode).json(...)
         │
9. Response sent to client
```

Note:
- Key Point: Request flows through middleware in order defined. Any middleware can end the cycle by sending response. Errors skip remaining middleware and go to error handler. Response is sent only once.
- Why Interviewer Asks: Shows complete understanding of Express architecture. If you can explain this flow, it proves deep knowledge.

---

**50. What is Nodemon? Why do we use it?**

Answer:
Nodemon is a development tool that automatically restarts your Node.js application when file changes are detected. Without it you would need to manually stop and restart the server every time you change code.

```bash
# Install as dev dependency
npm install nodemon --save-dev

# package.json scripts
{
    "scripts": {
        "start": "node server.js",          # production
        "dev": "nodemon server.js"           # development
    }
}

# Run
npm run dev
```

Note:
- Key Point: Nodemon is devDependency only — not needed in production. Watches for file changes and auto-restarts. Alternative: node --watch (built-in from Node.js 18+). Always use nodemon in development for productivity.
- Why Interviewer Asks: Basic but shows you use proper development tools.

---

## Quick Revision Table

| # | Topic | One-Line Key Point |
|---|-------|-------------------|
| 1 | Node.js | Runtime environment = V8 + libuv, single-threaded, event-driven |
| 2 | V8 Engine | JIT compilation, Ignition + TurboFan, executes JS as machine code |
| 3 | libuv | Event Loop + Thread Pool, makes Node.js async |
| 4 | Single-threaded? | JS execution yes, I/O uses thread pool (4 workers) |
| 5 | Event Loop | 6 phases: Timers→Pending→Idle→Poll→Check→Close, microtasks between each |
| 6 | Microtask vs Macrotask | nextTick > Promise > setTimeout/setInterval |
| 7 | npm/yarn | Package managers, package.json for deps, lock file for exact versions |
| 8 | CommonJS vs ESM | require (sync, Node) vs import (async, browser/React) |
| 9 | Express.js | Web framework, routing + middleware, sits on Node HTTP |
| 10 | Middleware | 5 types, runs in order, must call next() |
| 11 | Routing | Router for modular routes, params/query/body for data |
| 12 | CORS | Browser security, fix with cors() middleware |
| 13 | JWT | Stateless auth, Header.Payload.Signature, Bearer token |
| 14 | bcrypt | One-way password hashing, salt rounds, compare() for login |
| 15 | Multer | File upload middleware, diskStorage/memoryStorage, file filter |
| 16 | Validation | express-validator or Joi, validate before controller |
| 17 | Error Handling | asyncHandler + AppError + global error middleware |
| 18 | REST Best Practices | Nouns not verbs, proper status codes, versioning |
| 19 | PUT vs PATCH | PUT = full replace, PATCH = partial update |
| 20 | Sessions vs JWT | Sessions = stateful/server, JWT = stateless/client |
| 21 | Status Codes | 200=OK, 201=Created, 401=Unauth, 403=Forbidden, 404=NotFound, 500=Error |
| 22 | MVC Structure | Models + Controllers + Routes + Middleware |
| 23 | Rate Limiting | Prevent brute force, express-rate-limit |
| 24 | Caching | node-cache (simple), Redis (production) |
| 25 | Socket.IO | Real-time bidirectional communication |

---
