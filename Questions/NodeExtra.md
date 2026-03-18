## Topic 1 : Node.js Deep Dive

---

**51. Why is Node.js so fast despite being single-threaded?**

Answer:
Node.js is fast because of its **non-blocking I/O model**. Instead of waiting for operations (file read, DB query, API call) to finish, it delegates them to the operating system or thread pool and continues processing other requests. When the operation completes, a callback is placed in the Event Queue and the Event Loop picks it up.

```
Traditional Server (PHP, Java — Multi-threaded):
Request 1 → Thread 1 → DB query → WAITS → response → Thread free
Request 2 → Thread 2 → DB query → WAITS → response → Thread free
Request 3 → NO THREAD AVAILABLE → WAITS in queue
(Each request blocks a thread)

Node.js (Single-threaded — Event-driven):
Request 1 → Start DB query → DON'T WAIT → handle Request 2
Request 2 → Start DB query → DON'T WAIT → handle Request 3
Request 3 → Start DB query → DON'T WAIT → ready for more
DB query 1 done → callback → send response 1
DB query 2 done → callback → send response 2
(Never blocks, handles thousands concurrently)
```

Note:
- Key Point: Node.js does not wait for I/O — it uses callbacks/promises. While one request waits for DB, Node.js handles other requests. This event-driven model is why Node.js handles 10,000+ concurrent connections with one thread while traditional servers struggle at a few hundred.
- Why Interviewer Asks: Tests understanding of WHY Node.js is chosen over other technologies. The comparison with multi-threaded servers is what they want to hear.

---

**52. What are the advantages and disadvantages of Node.js?**

Answer:

```
Advantages:
1. Fast execution (V8 + non-blocking I/O)
2. Single language for frontend + backend (JavaScript)
3. Huge npm ecosystem (2M+ packages)
4. Great for real-time apps (chat, streaming, gaming)
5. Scalable (event-driven, handles many connections)
6. Active community and corporate support
7. Easy to learn for frontend developers
8. Efficient for I/O-heavy applications

Disadvantages:
1. Not suitable for CPU-intensive tasks (blocks main thread)
2. Callback hell (solved with Promises/async-await)
3. Single-threaded — one unhandled error can crash entire server
4. Frequent API changes / package instability
5. Immature for heavy computation (compared to Java, C++)
6. Relational DB support weaker than Java/.NET ecosystem
7. No built-in type safety (solved with TypeScript)
```

```javascript
// CPU-intensive BAD example — blocks entire server
app.get('/heavy', (req, res) => {
    let sum = 0;
    for (let i = 0; i < 10000000000; i++) sum += i; // BLOCKS!
    res.json({ sum });
});

// Solution: Use worker_threads
const { Worker } = require('worker_threads');
app.get('/heavy', (req, res) => {
    const worker = new Worker('./heavy-computation.js');
    worker.on('message', result => res.json({ result }));
    worker.on('error', err => res.status(500).json({ error: err.message }));
});
```

Note:
- Key Point: Node.js is best for I/O-heavy apps (APIs, real-time), worst for CPU-heavy tasks (video processing, ML). CPU tasks block the main thread — use worker_threads. One uncaught error crashes entire server — always handle errors.
- Why Interviewer Asks: Shows balanced understanding. Knowing limitations is as important as knowing strengths.

---

**53. When should you NOT use Node.js?**

Answer:

```
DON'T use Node.js for:
1. CPU-intensive tasks — Image/video processing, machine learning, scientific computation
   → Use: Python, Java, C++, Go

2. Heavy relational database operations — Complex JOINs across many tables
   → Use: Java/Spring, .NET, PHP/Laravel

3. Multithreaded computation — Parallel processing of large datasets
   → Use: Java, Go, Rust

USE Node.js for:
1. REST APIs and GraphQL APIs
2. Real-time apps (chat, notifications, live scores)
3. Microservices architecture
4. Server-side rendering (Next.js)
5. Streaming applications
6. IoT backends
7. Single-page application backends
8. Proxy servers and load balancers
```

Note:
- Key Point: Node.js excels at I/O-bound tasks, struggles with CPU-bound tasks. If you need to process a 2GB video or run ML model, Node.js is wrong choice. If you need to handle 50,000 chat messages per second, Node.js is perfect.
- Why Interviewer Asks: Tests if you can choose the right technology for the right problem. Shows maturity.

---

**54. What is the difference between Node.js and Express.js?**

Answer:

| Feature | Node.js | Express.js |
|---------|---------|-----------|
| Type | Runtime environment | Web framework |
| Built on | V8 + libuv | Built on Node.js HTTP module |
| Routing | Manual (`if url === '/users'`) | Built-in (`app.get('/users')`) |
| Middleware | None | Full middleware support |
| Features | Core modules (fs, http, path) | Routing, middleware, templating |
| Can work alone | Yes | No (needs Node.js) |

```javascript
// Pure Node.js server (no Express)
const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/users' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ users: [] }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
server.listen(3000);

// Same with Express (much simpler)
const express = require('express');
const app = express();
app.get('/users', (req, res) => res.json({ users: [] }));
app.listen(3000);
```

Note:
- Key Point: Node.js provides the platform, Express.js provides the framework. Node.js can run without Express, Express cannot run without Node.js. Express simplifies routing, middleware, and request/response handling. Express is to Node.js what jQuery was to JavaScript — makes it easier.
- Why Interviewer Asks: Basic but important distinction. Many beginners confuse the two.

---

## Topic 2 : Event Loop Deep Dive

---

**55. Explain all 6 phases of the Event Loop in detail.**

Answer:

```
Phase 1: TIMERS
- Executes callbacks for expired setTimeout() and setInterval()
- If timer set to 100ms, callback runs at earliest after 100ms (not exactly)
- Timer accuracy depends on system load

Phase 2: PENDING CALLBACKS
- Executes callbacks for certain system-level operations
- TCP errors, some I/O callbacks postponed from previous loop
- Example: ECONNREFUSED error callbacks

Phase 3: IDLE / PREPARE
- Internal phase used by libuv only
- Idle: runs low-priority tasks (garbage collection hints, memory cleanup)
- Prepare: gets ready for Poll phase
- Developers cannot directly interact with this phase

Phase 4: POLL (Heart of Event Loop)
- Two main tasks:
  1. Retrieves new I/O events and adds to queue
  2. Executes I/O callbacks (file read complete, API response received)
- If poll queue NOT empty: iterates through callbacks synchronously
- If poll queue IS empty:
  → If setImmediate() exists: moves to Check phase
  → If no setImmediate(): waits for callbacks to arrive, then executes

Phase 5: CHECK
- Executes setImmediate() callbacks
- setImmediate is designed to execute after Poll phase completes
- Inside I/O callback, setImmediate always runs before setTimeout(0)

Phase 6: CLOSE CALLBACKS
- Executes close event callbacks
- socket.on('close'), stream.on('close')
- Cleanup for abruptly closed handles (.destroy())

BETWEEN EVERY PHASE:
- process.nextTick() queue drains completely (highest priority)
- Then microtask queue (Promises) drains completely
- Only then next phase begins
```

Note:
- Key Point: Poll is the heart — where most work happens. Microtasks (nextTick + Promises) run between EVERY phase. Timer callbacks may not execute at exact time — they run at earliest possible time after delay. setImmediate is guaranteed after poll in I/O context.
- Why Interviewer Asks: The most detailed Node.js question possible. If you can explain all 6 phases with microtask behavior, you demonstrate expert understanding.

---

**56. Predict the output — Advanced Event Loop.**

```javascript
const fs = require('fs');

console.log("1");

setTimeout(() => console.log("2"), 0);

setImmediate(() => console.log("3"));

fs.readFile(__filename, () => {
    console.log("4");
    setTimeout(() => console.log("5"), 0);
    setImmediate(() => console.log("6"));
    process.nextTick(() => console.log("7"));
    Promise.resolve().then(() => console.log("8"));
});

Promise.resolve().then(() => console.log("9"));

process.nextTick(() => console.log("10"));

console.log("11");
```

Answer:
```
1
11
10
9
2 (or 3 — non-deterministic outside I/O)
3 (or 2)
4
7
8
6
5
```

**Explanation:**
1. `1` and `11` — synchronous, run first
2. `10` — nextTick (highest async priority)
3. `9` — Promise (microtask, after nextTick)
4. `2` and `3` — setTimeout(0) vs setImmediate outside I/O — order not guaranteed
5. `4` — fs.readFile callback runs in Poll phase
6. Inside I/O callback:
   - `7` — nextTick (highest priority)
   - `8` — Promise (after nextTick)
   - `6` — setImmediate (Check phase — guaranteed before setTimeout inside I/O)
   - `5` — setTimeout (Timers phase — next loop iteration)

Note:
- Key Point: Inside I/O callback: nextTick > Promise > setImmediate > setTimeout (guaranteed order). Outside I/O: setTimeout(0) vs setImmediate order is non-deterministic. This is the ultimate event loop test question.
- Why Interviewer Asks: The hardest event loop question. Getting this right proves mastery.

---

**57. What happens if the Event Loop is blocked?**

Answer:
If the main thread is blocked (long-running synchronous operation), the entire Event Loop freezes. No other requests, callbacks, timers, or I/O operations can execute until the blocking operation finishes.

```javascript
// BLOCKING — entire server freezes
app.get('/block', (req, res) => {
    const start = Date.now();
    while (Date.now() - start < 5000) {} // blocks for 5 seconds
    res.send('Done');
    // During these 5 seconds, ALL other requests wait
    // setTimeout callbacks delayed
    // I/O operations delayed
    // Other API endpoints unresponsive
});

// Solutions:
// 1. Break into smaller chunks with setImmediate
function processLargeArray(array, callback) {
    let index = 0;
    function processChunk() {
        const chunkEnd = Math.min(index + 100, array.length);
        while (index < chunkEnd) {
            // process array[index]
            index++;
        }
        if (index < array.length) {
            setImmediate(processChunk); // yield to event loop
        } else {
            callback();
        }
    }
    processChunk();
}

// 2. Use Worker Threads
const { Worker } = require('worker_threads');

// 3. Use child_process
const { fork } = require('child_process');
```

Note:
- Key Point: Blocking the event loop = blocking the entire server. Never use synchronous operations in request handlers (no readFileSync, no heavy loops). Use setImmediate to break long tasks into chunks. Use worker_threads for CPU-intensive work.
- Why Interviewer Asks: Critical understanding for building performant servers. Knowing the solutions shows practical experience.

---

**58. Why does setTimeout(fn, 0) not execute immediately?**

Answer:
`setTimeout(fn, 0)` does NOT execute immediately because:

1. The callback goes to the **Macrotask Queue** (Timers phase)
2. Event Loop processes it only AFTER:
   - All synchronous code finishes
   - All process.nextTick callbacks run
   - All Promise microtask callbacks run
3. Minimum delay is actually ~1ms in Node.js (not truly 0ms)
4. System timer resolution adds additional delay

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
process.nextTick(() => console.log("D"));
console.log("E");

// Output: A → E → D → C → B
// setTimeout(0) runs LAST among async operations
```

Note:
- Key Point: setTimeout(0) = "run as soon as possible after everything else." Not instant. Minimum 1ms delay in Node.js, 4ms in browsers (spec). nextTick and Promises always run before setTimeout(0).
- Why Interviewer Asks: Classic trick question. Tests event loop priority understanding.

---

## Topic 3 : Core Modules (fs, path, crypto, process)

---

**59. Explain the fs module with important methods.**

Answer:

```javascript
const fs = require('fs');
const fsPromises = require('fs').promises;

// ===== READING FILES =====

// Async (callback) — NON-BLOCKING ✅
fs.readFile('file.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Sync — BLOCKING ❌ (never in production server)
const data = fs.readFileSync('file.txt', 'utf-8');

// Promise-based — BEST ✅
const data = await fsPromises.readFile('file.txt', 'utf-8');


// ===== WRITING FILES =====

// Overwrite file
fs.writeFile('output.txt', 'Hello World', (err) => {
    if (err) throw err;
    console.log('File written');
});

// Append to file
fs.appendFile('log.txt', 'New log entry\n', (err) => {});

// Promise-based
await fsPromises.writeFile('output.txt', 'Hello');
await fsPromises.appendFile('log.txt', 'Log entry\n');


// ===== DIRECTORY OPERATIONS =====

// Create directory
fs.mkdir('newFolder', { recursive: true }, (err) => {});
// recursive: true creates parent folders if needed

// Read directory contents
fs.readdir('./src', (err, files) => {
    console.log(files); // ['app.js', 'routes', 'models']
});

// Check if file/folder exists
fs.existsSync('./file.txt'); // true or false (sync is OK for startup checks)
// Modern way:
try {
    await fsPromises.access('./file.txt');
    console.log('File exists');
} catch {
    console.log('File does not exist');
}


// ===== DELETE =====

// Delete file
fs.unlink('temp.txt', (err) => {});
await fsPromises.unlink('temp.txt');

// Delete directory
fs.rmdir('oldFolder', (err) => {});
// Delete directory with contents
fs.rm('oldFolder', { recursive: true, force: true }, (err) => {});


// ===== FILE INFO =====

fs.stat('file.txt', (err, stats) => {
    console.log(stats.isFile());       // true
    console.log(stats.isDirectory());  // false
    console.log(stats.size);           // size in bytes
    console.log(stats.birthtime);      // creation time
    console.log(stats.mtime);          // last modified
});


// ===== RENAME / COPY =====

fs.rename('old.txt', 'new.txt', (err) => {});
fs.copyFile('source.txt', 'dest.txt', (err) => {});


// ===== WATCH FILE CHANGES =====

fs.watch('./src', { recursive: true }, (eventType, filename) => {
    console.log(`${filename} was ${eventType}`);
});
```

Note:
- Key Point: Always use async methods (callback or promise) in production server — never sync. fs.promises provides modern async/await API. readFile reads entire file into memory — use streams for large files. fs.existsSync is OK for startup checks only. recursive: true for nested directory operations.
- Why Interviewer Asks: fs is the most used core module. They test if you know async vs sync and when to use each. "Why not use readFileSync in Express?" is a common follow-up.

---

**60. Explain the path module with important methods.**

Answer:

```javascript
const path = require('path');

// ===== JOINING PATHS =====
path.join('/users', 'deep', 'documents', 'file.txt');
// Output: '/users/deep/documents/file.txt' (Unix)
// Output: '\\users\\deep\\documents\\file.txt' (Windows)
// Handles / and \ automatically across OS

// ===== RESOLVE (absolute path) =====
path.resolve('src', 'models', 'user.js');
// Output: '/home/deep/project/src/models/user.js'
// Resolves from current working directory

path.resolve(__dirname, 'uploads', 'images');
// Output: '/home/deep/project/uploads/images'
// __dirname = directory of current file

// ===== EXTRACT PARTS =====
const filePath = '/home/deep/project/app.js';

path.basename(filePath);           // 'app.js'         (filename with ext)
path.basename(filePath, '.js');    // 'app'             (filename without ext)
path.dirname(filePath);            // '/home/deep/project' (directory)
path.extname(filePath);            // '.js'             (extension)

// ===== PARSE PATH =====
path.parse('/home/deep/file.txt');
// {
//   root: '/',
//   dir: '/home/deep',
//   base: 'file.txt',
//   name: 'file',
//   ext: '.txt'
// }

// ===== IS ABSOLUTE =====
path.isAbsolute('/home/deep');     // true
path.isAbsolute('./src');          // false

// ===== NORMALIZE =====
path.normalize('/users//deep/../deep/./file.txt');
// Output: '/users/deep/file.txt' (cleans up messy paths)

// ===== COMMON USE IN EXPRESS =====
// Serve static files with absolute path
app.use(express.static(path.join(__dirname, 'public')));

// File upload destination
const uploadDir = path.join(__dirname, '..', 'uploads');

// Send file as response
res.sendFile(path.resolve(__dirname, 'views', 'index.html'));
```

Note:
- Key Point: path.join concatenates with correct separator for OS. path.resolve gives absolute path. __dirname is current file's directory. Always use path.join instead of string concatenation for cross-OS compatibility. extname gives file extension for validation.
- Why Interviewer Asks: Used in every Node.js project for file paths. Cross-OS compatibility is the main reason to use path instead of string concatenation.

---

**61. Explain the crypto module with important methods.**

Answer:

```javascript
const crypto = require('crypto');

// ===== HASHING (one-way, irreversible) =====

// Simple hash
const hash = crypto.createHash('sha256')
    .update('password123')
    .digest('hex');
// Output: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'

// MD5 (not secure — for checksums only)
const md5 = crypto.createHash('md5').update('data').digest('hex');

// HMAC (hash with secret key — for API signatures)
const hmac = crypto.createHmac('sha256', 'mySecretKey')
    .update('message')
    .digest('hex');


// ===== RANDOM VALUES =====

// Random bytes (for tokens, secrets)
const token = crypto.randomBytes(32).toString('hex');
// Output: 'a1b2c3d4e5f6...' (64 char hex string)

// Random UUID
const uuid = crypto.randomUUID();
// Output: '550e8400-e29b-41d4-a716-446655440000'

// Random integer in range
const randomInt = crypto.randomInt(1, 100);
// Output: random number between 1-99


// ===== ENCRYPTION / DECRYPTION (two-way, reversible) =====

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);  // initialization vector

// Encrypt
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Decrypt
function decrypt(encryptedObj) {
    const decipher = crypto.createDecipheriv(algorithm, key,
        Buffer.from(encryptedObj.iv, 'hex'));
    let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const encrypted = encrypt('Hello World');
const decrypted = decrypt(encrypted); // 'Hello World'


// ===== PRACTICAL USES IN EXPRESS =====

// Password reset token
const resetToken = crypto.randomBytes(32).toString('hex');
const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
// Store hashedToken in DB, send resetToken to user email
// When user clicks link, hash their token and compare with DB

// Email verification token
const verifyToken = crypto.randomBytes(20).toString('hex');

// API key generation
const apiKey = crypto.randomBytes(48).toString('base64url');
```

Note:
- Key Point: Hashing is one-way (password verification, checksums). Encryption is two-way (data protection). Use crypto.randomBytes for secure random tokens (not Math.random). SHA-256 for hashing, AES-256-CBC for encryption. Password reset flow: generate token → hash → store hash in DB → send plain token to email → user submits token → hash and compare.
- Why Interviewer Asks: Security topic. Password reset token generation is the most asked practical use. Understanding hash vs encryption difference is important.

---

**62. Explain the process object with important properties and methods.**

Answer:

```javascript
// ===== INFORMATION =====

process.pid;          // Process ID (e.g., 12345)
process.ppid;         // Parent process ID
process.title;        // Process name
process.version;      // Node.js version (e.g., 'v20.11.0')
process.versions;     // V8, OpenSSL versions etc.
process.platform;     // 'linux', 'darwin' (macOS), 'win32'
process.arch;         // 'x64', 'arm64'
process.cwd();        // Current working directory
process.uptime();     // Seconds since process started


// ===== ENVIRONMENT VARIABLES =====

process.env.NODE_ENV;     // 'development' or 'production'
process.env.PORT;         // '5000' (always string!)
process.env.DB_URL;       // database connection string


// ===== COMMAND LINE ARGUMENTS =====

// node app.js arg1 arg2
process.argv;
// ['/usr/bin/node', '/home/deep/app.js', 'arg1', 'arg2']
process.argv[2]; // 'arg1'
process.argv[3]; // 'arg2'


// ===== MEMORY USAGE =====

process.memoryUsage();
// {
//   rss: 30000000,        // Resident Set Size (total memory allocated)
//   heapTotal: 10000000,  // V8 heap total
//   heapUsed: 8000000,    // V8 heap actually used
//   external: 1000000,    // C++ objects bound to JS
//   arrayBuffers: 500000  // ArrayBuffer memory
// }


// ===== EXIT =====

process.exit(0);     // exit successfully
process.exit(1);     // exit with error

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        mongoose.connection.close();
        process.exit(0);
    });
});


// ===== EVENT HANDLERS =====

// Uncaught exception (synchronous errors)
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1); // must exit — process is in unstable state
});

// Unhandled promise rejection (async errors)
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});

// Before exit
process.on('beforeExit', (code) => {
    console.log(`Process about to exit with code: ${code}`);
});

// Exit
process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}`);
    // Only synchronous code runs here
});


// ===== STANDARD I/O =====

process.stdout.write('Hello\n');  // same as console.log
process.stderr.write('Error\n');  // error output
process.stdin.on('data', (data) => {
    console.log(`Input: ${data}`);
});


// ===== NEXT TICK =====

process.nextTick(() => {
    console.log('Runs before any I/O or timer callback');
});


// ===== PRACTICAL USE IN EXPRESS =====

// server.js
const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION:', err);
    server.close(() => process.exit(1));
});

// Graceful shutdown for Docker/PM2
process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
});
```

Note:
- Key Point: process.env for environment variables (always strings). process.exit(0) = success, process.exit(1) = failure. Always handle uncaughtException and unhandledRejection in production — prevents silent crashes. SIGTERM handler for graceful shutdown in Docker/PM2. process.nextTick has highest async priority.
- Why Interviewer Asks: Shows production-level knowledge. Graceful shutdown and global error handlers are essential for production servers.

---

**63. What are __dirname and __filename? Do they work in ES Modules?**

Answer:

```javascript
// ===== CommonJS (require) — available by default =====
console.log(__dirname);   // '/home/deep/project/src'
console.log(__filename);  // '/home/deep/project/src/app.js'

// Usage
const filePath = path.join(__dirname, 'uploads', 'image.jpg');
app.use(express.static(path.join(__dirname, 'public')));


// ===== ES Modules (import) — NOT available! =====
// import.meta.url is the alternative

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Now use normally
const filePath = path.join(__dirname, 'uploads');


// ===== Other Global Objects =====
console;              // logging
setTimeout / setInterval / setImmediate; // timers
Buffer;               // binary data handling
global;               // global object (like window in browser)
globalThis;           // universal (works in browser and Node.js)
module;               // current module info (CommonJS)
exports;              // shorthand for module.exports (CommonJS)
require;              // import modules (CommonJS)
```

Note:
- Key Point: __dirname and __filename are CommonJS globals — NOT available in ES Modules. Use import.meta.url + fileURLToPath for ESM. global is Node.js version of browser's window. globalThis works in both environments.
- Why Interviewer Asks: Tests if you know the difference between CJS and ESM environments. Common gotcha when migrating to ES Modules.

---

## Topic 4 : npm/yarn Advanced

---

**64. What is the difference between `^`, `~`, and exact versions in package.json?**

Answer:

```json
{
    "dependencies": {
        "exact":   "4.18.2",    // exactly 4.18.2 only
        "tilde":   "~4.18.2",   // >=4.18.2 but <4.19.0 (patch updates only)
        "caret":   "^4.18.2",   // >=4.18.2 but <5.0.0 (minor + patch updates)
        "any":     "*",          // any version (dangerous!)
        "range":   ">=4.0.0 <5.0.0",
        "latest":  "latest"     // always latest (dangerous!)
    }
}
```

```
Version format: MAJOR.MINOR.PATCH (Semantic Versioning)

MAJOR (4.x.x) — Breaking changes (not backward compatible)
MINOR (x.18.x) — New features (backward compatible)
PATCH (x.x.2) — Bug fixes (backward compatible)

^4.18.2 — allows 4.18.3, 4.19.0, 4.99.0 but NOT 5.0.0
~4.18.2 — allows 4.18.3, 4.18.99 but NOT 4.19.0
4.18.2  — allows ONLY 4.18.2

Default: npm install uses ^ (caret)
```

Note:
- Key Point: ^ (caret) is default — allows minor and patch updates. ~ (tilde) is safer — allows patch updates only. Exact version is safest but misses bug fixes. package-lock.json locks exact versions regardless of ^/~. Semantic versioning: major.minor.patch.
- Why Interviewer Asks: Shows you understand package versioning and can prevent breaking updates. A common source of bugs in production.

---

**65. What is the difference between `npm install` and `npm ci`?**

Answer:

| Feature | `npm install` | `npm ci` |
|---------|--------------|----------|
| Reads | package.json | package-lock.json |
| Speed | Slower | Faster |
| node_modules | Updates existing | Deletes and reinstalls |
| Lock file | May update package-lock.json | Never modifies lock file |
| Use case | Development (adding packages) | CI/CD, production deployment |
| Version matching | Resolves ^/~ ranges | Uses exact locked versions |

```bash
# Development — use npm install
npm install                # install all from package.json
npm install express        # add new package

# CI/CD Pipeline & Production — use npm ci
npm ci                     # clean install from lock file
# Deletes node_modules, installs exact versions from lock file
# Fails if lock file is out of sync with package.json
```

Note:
- Key Point: npm ci is for automated environments (CI/CD, Docker). It is faster, deterministic, and ensures exact versions. npm install is for development when adding/updating packages. Always use npm ci in deployment pipelines.
- Why Interviewer Asks: Shows deployment knowledge. Using npm install in production is not ideal.

---

## Topic 5 : Middleware Deep Dive

---

**66. How does middleware execution order work? Show the flow.**

Answer:

```javascript
// Middleware executes TOP to BOTTOM in order defined

app.use((req, res, next) => { console.log("1: Global"); next(); });

app.use('/api', (req, res, next) => { console.log("2: /api prefix"); next(); });

app.get('/api/users', 
    (req, res, next) => { console.log("3: Route middleware 1"); next(); },
    (req, res, next) => { console.log("4: Route middleware 2"); next(); },
    (req, res) => { 
        console.log("5: Controller");
        res.json({ users: [] }); 
    }
);

app.use((err, req, res, next) => { console.log("6: Error handler"); });

// Request: GET /api/users
// Output: 1 → 2 → 3 → 4 → 5

// If error thrown in step 3:
// Output: 1 → 2 → 3 → 6 (skips to error handler)
```

```
Request Flow:
                    Request
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   Global MW 1    Global MW 2    Global MW 3
        │              │              │
        └──────────────┼──────────────┘
                       │
                  Path Match?
                   /api/users
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   Route MW 1     Route MW 2     Controller
        │              │              │
        └──────────────┼──────────────┘
                       │
                   Response
                       │
               (If error anywhere)
                       │
                 Error Handler
```

Note:
- Key Point: Global middleware runs for ALL requests. Path-specific middleware runs for matching paths. Route middleware runs in order for that specific route. If error thrown, all remaining middleware skipped, jumps to error handler. If next() not called, request hangs.
- Why Interviewer Asks: Understanding middleware flow is essential. They may give code with multiple middleware and ask execution order.

---

**67. How do you create reusable middleware?**

Answer:

```javascript
// ===== Middleware Factory (returns middleware function) =====

// Logger middleware with options
const logger = (options = {}) => {
    return (req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
        });
        next();
    };
};
app.use(logger());

// Role authorization middleware factory
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        next();
    };
};
app.delete('/users/:id', authMiddleware, authorize('admin'), deleteUser);
app.get('/reports', authMiddleware, authorize('admin', 'manager'), getReports);

// Validation middleware factory
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        next();
    };
};
app.post('/users', validateBody(userSchema), createUser);

// Rate limiter per route
const limitRoute = (max, windowMs) => {
    return rateLimit({ max, windowMs, message: 'Rate limit exceeded' });
};
app.post('/login', limitRoute(5, 15*60*1000), loginController);
```

Note:
- Key Point: Middleware factories are functions that return middleware functions. They accept configuration parameters. authorize(...roles) is the most common pattern — used in every project. This pattern makes middleware reusable and configurable.
- Why Interviewer Asks: Shows you write clean, reusable code. The authorize factory pattern is used in every MERN project.

---

## Topic 6 : JWT Advanced

---

**68. Explain the Refresh Token flow in detail.**

Answer:

```
Problem: Access tokens expire (15min-1hr) → User must re-login frequently
Solution: Refresh Token flow — silently get new access token

Access Token: Short-lived (15min), sent in Authorization header
Refresh Token: Long-lived (7-30 days), stored in httpOnly cookie

Flow:
1. User logs in → Server generates Access Token + Refresh Token
2. Access Token sent in response body (stored in memory/state)
3. Refresh Token sent as httpOnly cookie (browser stores automatically)
4. Client uses Access Token for API calls
5. Access Token expires → API returns 401
6. Client sends request to /refresh endpoint (cookie sent automatically)
7. Server verifies Refresh Token → generates new Access Token
8. Client uses new Access Token
9. If Refresh Token also expired → User must re-login
```

```javascript
// Login — generate both tokens
const login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    // ... verify password ...

    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    // Store refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken, user: { id: user._id, name: user.name } });
};

// Refresh endpoint
const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        res.json({ accessToken: newAccessToken });
    } catch {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

// Logout — clear cookie
const logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
};

// Routes
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
```

Note:
- Key Point: Access token = short-lived, in memory. Refresh token = long-lived, in httpOnly cookie. httpOnly prevents XSS attacks (JS cannot read the cookie). sameSite: strict prevents CSRF. On access token expiry, hit /refresh endpoint to get new one silently. On refresh token expiry, user must re-login.
- Why Interviewer Asks: Advanced auth question. Shows you understand token security beyond basic JWT. Most production apps use this pattern.

---

**69. How do you revoke/invalidate a JWT token?**

Answer:
JWTs are stateless — once issued they are valid until expiry. You cannot "revoke" them directly. But here are strategies:

```javascript
// Strategy 1: Token Blacklist (most common)
// Store invalidated tokens in Redis/DB until they expire
const blacklist = new Set(); // Use Redis in production

const logout = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    blacklist.add(token);
    res.json({ message: 'Logged out' });
};

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (blacklist.has(token)) {
        return res.status(401).json({ message: 'Token revoked' });
    }
    // ... verify token ...
    next();
};


// Strategy 2: Token Version in DB
// Store tokenVersion in user document
// Increment on logout/password change
// Include version in JWT payload
// Verify version matches DB on each request

const userSchema = new Schema({
    tokenVersion: { type: Number, default: 0 }
});

// Login: include version
jwt.sign({ id: user._id, version: user.tokenVersion }, secret);

// Auth middleware: check version
const decoded = jwt.verify(token, secret);
const user = await User.findById(decoded.id);
if (decoded.version !== user.tokenVersion) {
    return res.status(401).json({ message: 'Token invalidated' });
}

// Logout: increment version (invalidates all existing tokens)
user.tokenVersion += 1;
await user.save();


// Strategy 3: Short-lived Access Tokens + Refresh Tokens
// Access token expires in 15 minutes
// Refresh token can be revoked from DB
// Most practical approach for production
```

Note:
- Key Point: JWTs cannot be truly revoked (stateless nature). Token blacklist with Redis is most common solution. Short-lived access tokens + revocable refresh tokens is the best production approach. On password change, invalidate all existing tokens.
- Why Interviewer Asks: Advanced security question. "How do you logout with JWT?" is a trick question since JWTs are stateless. Knowing blacklist and refresh token patterns shows deep understanding.

---

## Topic 7 : Error Handling Deep Dive

---

**70. What is the difference between operational and programming errors?**

Answer:

```
Operational Errors (expected, handle gracefully):
- Invalid user input (validation error)
- Database connection lost
- File not found
- API timeout
- Rate limit exceeded
- Duplicate email (unique constraint)
→ Handle with try-catch, send proper error response

Programming Errors (bugs, should not happen):
- Accessing property of undefined
- Passing wrong argument type to function
- Syntax error
- Using undefined variable
- Memory leak
→ Fix the code. These should crash the process (in production, PM2 restarts)
```

```javascript
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // flag for operational error
    }
}

// Global error handler
app.use((err, req, res, next) => {
    if (err.isOperational) {
        // Operational: send error to client
        res.status(err.statusCode).json({
            status: 'fail',
            message: err.message
        });
    } else {
        // Programming: log and send generic message
        console.error('PROGRAMMING ERROR:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
});

// Usage
throw new AppError('User not found', 404);          // operational
throw new AppError('Invalid email format', 400);     // operational
// undefined.property                                 // programming (crash)
```

Note:
- Key Point: Operational errors are expected — handle gracefully with proper status codes. Programming errors are bugs — should crash and be fixed. isOperational flag distinguishes them. In production, PM2 auto-restarts on crash.
- Why Interviewer Asks: Shows mature error handling approach. Separating error types is a production best practice.

---

**71. How do you handle uncaught exceptions and unhandled rejections?**

Answer:

```javascript
// Uncaught Exception — synchronous error not caught anywhere
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err.name, err.message);
    console.error(err.stack);
    // Process is in unstable state — MUST exit
    process.exit(1);
});

// Unhandled Rejection — async/promise error not caught
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
    // Graceful shutdown
    server.close(() => {
        process.exit(1);
    });
});

// server.js — proper setup
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION:', err.message);
    server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Graceful shutdown');
    server.close(() => process.exit(0));
});

// Why exit?
// uncaughtException: process is in unknown state, cannot be trusted
// unhandledRejection: indicates missing error handling
// In production, PM2 or Docker will restart the process automatically
```

Note:
- Key Point: Always add these handlers in production. uncaughtException must exit (process unstable). unhandledRejection should gracefully close server then exit. PM2/Docker restarts process after crash. These are safety nets — proper error handling should prevent reaching these handlers.
- Why Interviewer Asks: Production readiness. Without these handlers, errors silently crash the server with no logging.

---

## Topic 8 : Security Deep Dive

---

**72. What is XSS? How to prevent it?**

Answer:
**XSS (Cross-Site Scripting)** is when an attacker injects malicious JavaScript into your website that runs in other users' browsers.

```
Attack: User submits comment: <script>document.cookie</script>
If rendered without sanitization, script runs in every user's browser
→ Steals cookies, sessions, redirects to phishing sites

Types:
1. Stored XSS — malicious script stored in DB (comments, profiles)
2. Reflected XSS — script in URL query params reflected in page
3. DOM-based XSS — client-side JS manipulates DOM unsafely
```

```javascript
// Prevention:

// 1. Helmet — sets security headers
app.use(helmet());
// Sets Content-Security-Policy, X-XSS-Protection, etc.

// 2. Sanitize input
const xss = require('xss-clean');
app.use(xss());
// Converts <script> to &lt;script&gt;

// 3. express-validator escape()
body('comment').escape();
// "<script>alert('xss')</script>" → "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"

// 4. httpOnly cookies (JS cannot access)
res.cookie('token', jwt, { httpOnly: true });

// 5. Content-Security-Policy header
// Only allow scripts from your own domain
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"]
    }
}));

// 6. In React — JSX auto-escapes by default
// <div>{userInput}</div> — safe, React escapes HTML
// dangerouslySetInnerHTML — DANGEROUS, avoid if possible
```

Note:
- Key Point: Never trust user input. Use helmet for security headers. Sanitize with xss-clean or escape(). httpOnly cookies prevent token theft via XSS. React JSX auto-escapes — but dangerouslySetInnerHTML is dangerous.
- Why Interviewer Asks: Critical web security topic. Shows you build secure applications.

---

**73. What is CSRF? How to prevent it?**

Answer:
**CSRF (Cross-Site Request Forgery)** tricks a logged-in user's browser into making an unwanted request to your server. The browser automatically sends cookies with every request to your domain.

```
Attack scenario:
1. User logs into bank.com (session cookie set)
2. User visits evil.com
3. evil.com has: <img src="https://bank.com/transfer?to=hacker&amount=10000">
4. Browser sends request to bank.com WITH the session cookie
5. Bank processes the transfer because cookie is valid
```

```javascript
// Prevention:

// 1. SameSite cookies (most effective)
res.cookie('token', jwt, {
    httpOnly: true,
    sameSite: 'strict'  // cookie NOT sent from external sites
    // 'strict' — never sent cross-site
    // 'lax' — sent on top-level GET navigations only
    // 'none' — always sent (requires secure: true)
});

// 2. CSRF tokens (traditional approach)
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

// Server generates token, client must include it in requests
app.get('/form', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// 3. Check Origin/Referer headers
app.use((req, res, next) => {
    const origin = req.headers.origin || req.headers.referer;
    if (origin && !origin.startsWith('https://myapp.com')) {
        return res.status(403).json({ error: 'CSRF detected' });
    }
    next();
});

// 4. Use Authorization header instead of cookies for API
// Bearer tokens in Authorization header are NOT sent automatically
// Only cookies are sent automatically — this is why XHR/fetch with
// Authorization header is immune to CSRF
```

Note:
- Key Point: CSRF exploits automatic cookie sending. sameSite: 'strict' is the modern solution. CSRF tokens are the traditional solution. Using Authorization header (Bearer token) instead of cookies makes CSRF impossible. APIs typically use Bearer tokens so CSRF is less of a concern.
- Why Interviewer Asks: Security awareness. Understanding why sameSite cookies and Bearer tokens prevent CSRF shows practical security knowledge.

---

**74. What is SQL Injection and NoSQL Injection? How to prevent both?**

Answer:

```javascript
// ===== SQL INJECTION =====
// BAD — string concatenation
const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;
// If email = "' OR '1'='1" → bypasses authentication!

// GOOD — parameterized queries
connection.query('SELECT * FROM users WHERE email = ?', [req.body.email]);

// Sequelize — auto-parameterized
await User.findOne({ where: { email: req.body.email } });


// ===== NoSQL INJECTION =====
// BAD — passing user input directly to MongoDB
// POST body: { "email": "admin@test.com", "password": { "$ne": "" } }
await User.findOne({ email: req.body.email, password: req.body.password });
// Becomes: findOne({ email: "admin@test.com", password: { $ne: "" } })
// Matches ANY non-empty password!

// GOOD — sanitize input
// 1. express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); // strips $ and . from req.body/query/params

// 2. Type casting
const email = String(req.body.email);
const password = String(req.body.password);

// 3. Mongoose schema validation (type enforcement)
const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});
// Rejects non-string values automatically
```

Note:
- Key Point: SQL injection = parameterized queries. NoSQL injection = express-mongo-sanitize + type casting. ORMs (Sequelize, Mongoose) help but are not foolproof. Always validate and sanitize ALL user input.
- Why Interviewer Asks: Top web security vulnerability. Every developer must know how to prevent both types.

---

## Topic 9 : Socket.IO Deep Dive

---

**75. Explain Socket.IO rooms, namespaces, and broadcasting.**

Answer:

```javascript
const io = require('socket.io')(server);

// ===== ROOMS =====
// Rooms are subgroups of connections — used for group messaging

io.on('connection', (socket) => {
    // Join a room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
    });

    // Leave a room
    socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
    });

    // Send to specific room
    socket.on('roomMessage', ({ roomId, message }) => {
        io.to(roomId).emit('message', message);       // everyone in room INCLUDING sender
        socket.to(roomId).emit('message', message);    // everyone in room EXCLUDING sender
    });
});


// ===== BROADCASTING =====

io.on('connection', (socket) => {
    // Send to ALL connected clients
    io.emit('announcement', 'Server message to everyone');

    // Send to ALL except sender
    socket.broadcast.emit('userJoined', `${socket.id} joined`);

    // Send to specific socket
    io.to(socketId).emit('privateMessage', 'Hello');

    // Send to sender only
    socket.emit('welcome', 'Welcome to the server');
});


// ===== NAMESPACES =====
// Namespaces separate different communication channels

const chatNamespace = io.of('/chat');
const notifNamespace = io.of('/notifications');

chatNamespace.on('connection', (socket) => {
    console.log('User connected to /chat');
    socket.on('message', (data) => {
        chatNamespace.emit('message', data);
    });
});

notifNamespace.on('connection', (socket) => {
    console.log('User connected to /notifications');
    socket.on('notify', (data) => {
        notifNamespace.emit('notification', data);
    });
});

// Client connects to specific namespace
// const chatSocket = io('/chat');
// const notifSocket = io('/notifications');
```

Note:
- Key Point: Rooms = group messaging (chat groups, game lobbies). Namespaces = separate communication channels (/chat, /notifications). io.emit = all clients. socket.emit = sender only. socket.broadcast.emit = all except sender. io.to(room).emit = everyone in room. socket.to(room).emit = room except sender.
- Why Interviewer Asks: If you built a chat feature, they will test room and broadcasting knowledge. Understanding emit variations is essential.

---

## Topic 10 : Caching & Performance Deep Dive

---

**76. What is Redis? When should you use it vs in-memory cache?**

Answer:

```
In-Memory Cache (node-cache):
- Stored in Node.js process memory
- Lost when server restarts
- Not shared between multiple server instances
- Good for: single server, simple caching
- Limit: constrained by server RAM

Redis:
- Separate server process (external)
- Persists across restarts (optional persistence)
- Shared across multiple server instances
- Good for: production, microservices, sessions, rate limiting
- Features: pub/sub, queues, sorted sets, TTL
```

```javascript
// When to use node-cache:
// ✅ Small application, single server
// ✅ Cache that can be lost on restart
// ✅ Simple key-value caching

// When to use Redis:
// ✅ Multiple server instances (load balanced)
// ✅ Session storage (shared across servers)
// ✅ Rate limiting (shared counter)
// ✅ Job queues (Bull, BullMQ)
// ✅ Pub/Sub messaging
// ✅ Leaderboards (sorted sets)
// ✅ Real-time analytics

// Redis usage:
// npm install redis
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });
await client.connect();

// Set with TTL
await client.set('user:123', JSON.stringify(userData), { EX: 600 }); // 10 min

// Get
const cached = await client.get('user:123');
if (cached) return JSON.parse(cached);

// Delete
await client.del('user:123');

// Middleware pattern
const cacheMiddleware = (ttl = 300) => async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await client.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const originalJson = res.json.bind(res);
    res.json = async (data) => {
        await client.set(key, JSON.stringify(data), { EX: ttl });
        originalJson(data);
    };
    next();
};

app.get('/api/products', cacheMiddleware(600), getProducts);
```

Note:
- Key Point: node-cache for simple single-server apps. Redis for production multi-server deployments. Redis can store sessions, rate limits, queues, and more. Always set TTL to prevent stale data. Cache invalidation is the hardest problem — invalidate on data change.
- Why Interviewer Asks: Performance optimization for production. Shows you think about scalability beyond single server.

---

## Topic 11 : Practical Building Patterns

---

**77. How do you implement a complete CRUD API with all best practices?**

Answer:

```javascript
// ===== MODEL =====
const productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ['electronics', 'clothing', 'food'] },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// ===== CONTROLLER =====
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/products?category=electronics&sort=-price&page=2&limit=10
exports.getProducts = asyncHandler(async (req, res) => {
    const { category, sort, page = 1, limit = 10, fields } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    filter.isActive = true;
    
    const query = Product.find(filter)
        .sort(sort || '-createdAt')
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select(fields ? fields.split(',').join(' ') : '-__v');
    
    const [products, total] = await Promise.all([
        query.lean(),
        Product.countDocuments(filter)
    ]);
    
    res.json({
        status: 'success',
        results: products.length,
        data: { products },
        pagination: {
            page: Number(page), limit: Number(limit),
            total, pages: Math.ceil(total / limit)
        }
    });
});

// GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new AppError('Product not found', 404);
    res.json({ status: 'success', data: { product } });
});

// POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({ status: 'success', data: { product } });
});

// PATCH /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
    );
    if (!product) throw new AppError('Product not found', 404);
    res.json({ status: 'success', data: { product } });
});

// DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new AppError('Product not found', 404);
    res.status(204).json({ status: 'success', data: null });
});

// ===== ROUTES =====
router.route('/')
    .get(getProducts)
    .post(authMiddleware, authorize('admin'), validateProduct, createProduct);

router.route('/:id')
    .get(getProduct)
    .patch(authMiddleware, authorize('admin'), updateProduct)
    .delete(authMiddleware, authorize('admin'), deleteProduct);
```

Note:
- Key Point: asyncHandler for clean error handling. Consistent response format. Pagination with Promise.all for count + data. findByIdAndUpdate with { new: true, runValidators: true }. 204 for successful delete. Protected routes with auth + authorize. This pattern is used in every production API.
- Why Interviewer Asks: Shows complete practical ability. This is what real MERN APIs look like.

---

**78. How do you implement search in an API?**

Answer:

```javascript
// GET /api/products?search=wireless+headphones&category=electronics&minPrice=50

exports.searchProducts = asyncHandler(async (req, res) => {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
    
    const filter = { isActive: true };
    
    // Text search (requires text index)
    if (search) {
        filter.$text = { $search: search };
    }
    
    // OR regex search (no index needed, slower)
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    
    // Filters
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    const [products, total] = await Promise.all([
        Product.find(filter)
            .sort(sort || '-createdAt')
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean(),
        Product.countDocuments(filter)
    ]);
    
    res.json({
        status: 'success',
        results: products.length,
        data: { products },
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
});
```

Note:
- Key Point: Build filter object dynamically from query params. $text requires text index (faster, relevance scoring). $regex works without index (slower, case-insensitive with 'i'). Combine search with filters for powerful API. Always return pagination metadata.
- Why Interviewer Asks: Every real app has search. Building dynamic filters from query params is a practical skill.

---

## Topic 12 : Advanced Express Questions

---

**79. What is the difference between app.listen() and http.createServer()?**

Answer:

```javascript
// app.listen() — shorthand (Express creates HTTP server internally)
const app = express();
app.listen(3000, () => console.log('Server running'));
// Internally does: http.createServer(app).listen(3000)

// http.createServer() — explicit (needed for Socket.IO, HTTPS)
const http = require('http');
const app = express();
const server = http.createServer(app);

// Socket.IO needs the HTTP server
const io = require('socket.io')(server);

server.listen(3000, () => console.log('Server running'));

// HTTPS server
const https = require('https');
const fs = require('fs');
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
https.createServer(options, app).listen(443);
```

Note:
- Key Point: app.listen() is shorthand for http.createServer(app).listen(). Use http.createServer() explicitly when you need the server object (Socket.IO, HTTPS, manual control). For basic REST APIs, app.listen() is sufficient.
- Why Interviewer Asks: Shows you understand what Express does under the hood. Needed when integrating Socket.IO.

---

**80. How do you handle file downloads in Express?**

Answer:

```javascript
// Method 1: res.download() — prompts save dialog
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, 'custom-name.pdf', (err) => {
        if (err) res.status(404).json({ error: 'File not found' });
    });
});

// Method 2: res.sendFile() — displays in browser (images, PDFs)
app.get('/view/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) res.status(404).json({ error: 'File not found' });
    });
});

// Method 3: Streaming (large files — memory efficient)
app.get('/stream/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    const stat = fs.statSync(filePath);
    
    res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename="${req.params.filename}"`
    });
    
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
});
```

Note:
- Key Point: res.download prompts save dialog. res.sendFile displays in browser. Streaming with pipe is best for large files (does not load entire file into memory). Always validate filename to prevent directory traversal attacks.
- Why Interviewer Asks: Practical feature. File download is common in business applications.

---

**81. How do you implement API versioning?**

Answer:

```javascript
// Method 1: URL path versioning (most common)
const v1Router = require('./routes/v1');
const v2Router = require('./routes/v2');

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// v1/users.js
router.get('/users', (req, res) => {
    res.json({ version: 1, users: [] }); // old format
});

// v2/users.js
router.get('/users', (req, res) => {
    res.json({ version: 2, data: { users: [] }, meta: {} }); // new format
});


// Method 2: Header versioning
app.use('/api/users', (req, res, next) => {
    const version = req.headers['api-version'] || '1';
    req.apiVersion = version;
    next();
});


// Method 3: Query parameter
// GET /api/users?version=2
```

Note:
- Key Point: URL path versioning (/api/v1/) is most common and RESTful. Keep old versions working while releasing new ones. Deprecate old versions with timeline. Document API changes clearly.
- Why Interviewer Asks: Shows you think about backward compatibility and long-term API maintenance.

---

**82. What is the difference between express.json() and body-parser?**

Answer:

```javascript
// Before Express 4.16:
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// After Express 4.16+ (built-in):
app.use(express.json());                           // same as bodyParser.json()
app.use(express.urlencoded({ extended: true }));   // same as bodyParser.urlencoded()

// express.json() IS body-parser under the hood
// Express bundled body-parser into itself
// No need to install body-parser separately anymore

// Options:
app.use(express.json({
    limit: '10kb',        // max body size
    strict: true,         // only accept arrays and objects
    type: 'application/json'
}));

app.use(express.urlencoded({
    extended: true,       // true = qs library (nested objects)
                          // false = querystring library (simple)
    limit: '10kb'
}));
```

Note:
- Key Point: express.json() IS body-parser built into Express since v4.16. No need to install body-parser separately. Use express.json() for JSON bodies, express.urlencoded() for form data. Set limit to prevent large payload attacks.
- Why Interviewer Asks: Common question about Express evolution. Shows you are up-to-date.

---

## Topic 13 : Remaining Output Questions

---

**83. Predict the output.**

```javascript
const fs = require('fs');

setImmediate(() => console.log("1"));
setTimeout(() => console.log("2"), 0);

fs.readFile(__filename, () => {
    setImmediate(() => console.log("3"));
    setTimeout(() => console.log("4"), 0);
    process.nextTick(() => console.log("5"));
});

process.nextTick(() => console.log("6"));
console.log("7");
```

Answer:
```
7
6
1 (or 2)
2 (or 1)
5
3
4
```

**Explanation:**
1. `7` — synchronous
2. `6` — nextTick (highest async priority)
3. `1` and `2` — setImmediate vs setTimeout(0) outside I/O — non-deterministic
4. File read completes → callback enters poll phase
5. `5` — nextTick inside I/O (highest priority)
6. `3` — setImmediate inside I/O (guaranteed before setTimeout)
7. `4` — setTimeout inside I/O (next timer phase)

Note:
- Key Point: Inside I/O: nextTick > setImmediate > setTimeout (guaranteed). Outside I/O: setTimeout(0) vs setImmediate is non-deterministic.
- Why Interviewer Asks: Tests complete event loop understanding with all async types.

---

**84. Predict the output.**

```javascript
async function test() {
    console.log("1");
    
    const p = new Promise((resolve) => {
        console.log("2");
        resolve("3");
        console.log("4");
    });
    
    console.log("5");
    const result = await p;
    console.log(result);
    console.log("6");
}

console.log("7");
test();
console.log("8");
```

Answer:
```
7
1
2
4
5
8
3
6
```

**Explanation:**
1. `7` — sync
2. test() called → `1` — sync
3. Promise executor runs synchronously → `2`
4. resolve("3") — resolves but does NOT stop executor
5. `4` — sync (after resolve, code still runs)
6. `5` — sync
7. `await p` — pauses test(), control returns to caller
8. `8` — sync (after test() call)
9. Call stack empty → microtask → `3` (resolved value)
10. `6` — continues after await

Note:
- Key Point: Promise executor runs synchronously. resolve() does NOT stop execution. await pauses only the async function, returns control to caller. Code after await is like .then() callback.
- Why Interviewer Asks: Combines Promise executor behavior with async/await. The "resolve doesn't stop execution" and "await returns control" are key traps.

---

## Quick Revision — Complete Topic Coverage

| # | Topic | Questions Covered |
|---|-------|:-:|
| 1 | Node.js Basics | 1, 2, 51, 52, 53, 54 |
| 2 | V8 Engine | 3 |
| 3 | libuv | 4 |
| 4 | Single-threaded | 5, 11, 57 |
| 5 | Event Loop (6 phases) | 6, 55, 56, 57, 58 |
| 6 | Microtask vs Macrotask | 7, 8, 9, 83, 84 |
| 7 | npm/yarn/nvm | 12, 13, 64, 65 |
| 8 | CommonJS vs ESM | 14, 63 |
| 9 | Express.js Setup | 15, 54, 79, 82 |
| 10 | Middleware | 16, 45, 47, 66, 67 |
| 11 | Routing | 17, 18 |
| 12 | CORS | 19 |
| 13 | JWT Auth | 21, 22, 23, 68, 69 |
| 14 | bcrypt Password | 24 |
| 15 | Multer File Upload | 25, 80 |
| 16 | Input Validation | 26 |
| 17 | Error Handling | 27, 48, 70, 71 |
| 18 | REST Best Practices | 28, 29, 81 |
| 19 | Sessions vs JWT | 20, 23 |
| 20 | Status Codes | 37 |
| 21 | MVC Structure | 30, 43 |
| 22 | Rate Limiting | 33 |
| 23 | Caching | 34, 76 |
| 24 | Socket.IO | 31, 75 |
| 25 | Environment Config | 32 |
| 26 | fs module | 59 |
| 27 | path module | 60 |
| 28 | crypto module | 61 |
| 29 | process object | 62, 63 |
| 30 | Security (XSS, CSRF, Injection) | 36, 72, 73, 74 |
| 31 | Complete CRUD Pattern | 42, 44, 77, 78 |
| 32 | Request/Response | 38, 39, 40, 46 |
| 33 | Dependencies | 41, 50 |
| 34 | Output Questions | 9, 56, 83, 84 |

---
