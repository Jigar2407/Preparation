
/*
@Node.js
=> Node.js Is JS Runtime ENvironment, Executes Outside Of Browser Which ENables Server side development
=> Node.js (V8 JS engine + C++ ), Designed To Build Scaalable Applications. IT Uses Asynchronous Programming. you Can DO Web Servers, FileOperations, Databse Interactions, APIs ( ), Real-TIme Web Applications, CLI Tools
=> It uses single-Threaded, event-driven architecture 



---------------------------------------------------------------------

@ WTL
APIS : Node.js Prvides APIs FOr File System(fs), Networking(http, net, url,...), And Operating System(os);
Global Objects : Node.js Uses "Global" object.                    // browser Use "Window"
Modules : Node.js Uses CommonJS(require) and ES modules(import).
Event Loop : Node.js Have Additional APIs For Timer, Process ... Which makes It Differ
EnvironMent Variable : It Can Access(`process.env.DATABASE_URL`) Environment Variable which stored in `process.env`
security : Node.js HAve Full Access To FIle Syatem And Netwrok.                 //Browesr Have Limited
Package Manager: Node.js Uses "npm/yarn" package


------------------------------------------------------------------


@ Command Line
// to Run :
    `node file.js`

// to run WIth Additional Arguments :
    `node file.js arg1 arg2`
// to access arg which is stored in `progress.argv` array
    c.log(process.argv[2], process.argv[3])

// live server restrt when svaes 
    `node --watch file.js`

// debugging file (devubug i multiple way like break on first line, create custom port for debugging, and enabling remote debugging)
    `node --inspect file.js`



---------------------------------------------------------------

@npm (node package MAnager)
=> It's A Command Line Tool Can Install Node.js Dependencies of Project Through Package.json(Manifest file That PRovides Essntial Metadata & Configuration Information & Dependency Info about The Project & Located in Root Directory)
=> npm has larger community so its continuously improvinf and it bundles with node.js, pakage-lock.json
=> only checks basic security not secure as yarn but scan vulneraility using audit, slower,  
// to initialize a new Project
    `npm init`
// to install/update dependency(noode module)
    `npm install/update [-g] [package]@[versionNumber]`
// unistall ackage 
    `npm unistall package`
// view package
    `npm view package_name`
// check for vulnerabilities checks 
    `npm audit` (scans project) 
    `npm audit fix` (update package for secure version)

@ yarn
=> JS package MAnger used for Node.js projects alternate to "npm". it uses "yarn.lock" file. yarn cli and output clearer than npms. 
=> if you want speed, offline caching, user friendly cli Yarn is better than npm
// install yarn
    `npm install yarn --global`
// to install/update dependency(noode module)
    `yarn [global] add/upgrade [package]@[versionNumber]`
// unistall ackage 
    `yarn remove package`
// view package
    `yarn info package_name`


@ nvm (Node Version Manager)
=> To MAnage Multiple Node Versions.Provides Flexibility to Switch B/W Node Versions
// CHeck Current Version
    `nvm current`
// switch Node Versions
    `nvm use <version_number>`

    
------------------------------------------------------------------


@v8 engine provides the CORE JS execuion enviromnment 
// it allows Node.js to :
=> Executes JS code outside the Browser
=> Access os functionality(fs, http,..) 




----------------------------------------------------------------------

@ libuv
=> libuv is Nulti-platform C library that provides support for asynchronous Input/output based On EVent Loop. it is developed to handle EVent-Driven Architecture in Node.js.

=> Features (including all features Node.js Works as single Threaded, Non-blocking, EVent-driven Platform)
1. Event loop
2. Asynchronous file & file system Operations
3. Asynchronous TCP & UDP sockets
4. child Processes
5. Thread pool
6. Timers, Signals & Polls

=> Roles
1. Event Loop :-
2. Thread Pool :-
3. Enables Asynchronous I/O :-
    libuv provides non-blocking I/O operations, aloowing Node to handle Multiple task Concurrently without waiting for an operation to complete & it achives Through Callbacks, Event-Driven Programming & Worker Thread pool




----------------------------------------------------------------------


@ Node.js Architecture & Internal Working
=> FIrst V8 Engine (Exceutes JS) & LibUv(Implemets Event loop and Thread pool )
=> it contains Request, Node.js server(V8), EVent Queue, EVent Loop, Thread Pool 

// How Request Handled by Node.js
1 => Client Send and HTTP request to server(Node.js)

2 => this request are added to "Even (Task) Queue" Which holds Callback functions that are Waiting to Be Executed.
=> "Event Queue" only conatins callbacks or Tasks That are Ready to Execute After I/O or Timer complete

3=>Then "Event Loop" Stats Processiong "Event Queue" one by one
=> first It offloads Heavy Tasks or CPU intense task(fs,os, compression) to Thread pool and so they can run parrallal to main thread.
// Sequence to Run
I. Expired Timer Callbacks(setTimeout(),setInterval())
II. pending callbacks :- 
    it executes callbacks for certain system levekl operations postponed untill next loop iterations
III. Idle & Prepare Phase :- 
    it is Internal Phase Handled by "libuv". (1.)Idle :- time where Event loop have no immediate task to execute. so it executes low-priority tasks like initiating garbage collection process, manage memory resorce. (2.)Prepare :- get Ready for POll Phase
IV. Poll (heart):- 
    poll Two main tasks: 
    1. retriving I/O events :- checks for new I/O events and add to Event QUeue
    2. Executing callbacks :- Process events in poll QUeue which are the success callbacks(result from Thread pool tasks) Queued and runs . 
    if `poll queue is "not" empty` then it iterates thouth sucess callbacks end execute them synchronously. if `poll Queue is "empty" ` then two things happen (I.) if Script have setImmediate() "Event Loop" end Poll phase and executes setImmediate(). (II.) if Script not have setImmediate() then "Event Loop "will wait for calllback to be add to poll queue then execute them immediately
V. Check Phase :- executes setImmediates() callbacks.
VI. Close Callback Phase :- 
    executes socket.on("close"), stream.on("close") and cleanup logic for suddenly closed handles(destroy())

// Last But Not Least
Microtask Queue and nextTick Queue: The microtask queue contains microtasks, which are executed after each phase of the event loop. Promises and certain APIs, like process.nextTick(), are examples of microtasks. The nextTick queue, on the other hand, holds callback functions scheduled to be executed in the next iteration of the event loop.

---------------------------------------------------------------------

@ Thread
=> Node.js Thread is Separate Execution Context in single Process That Can run Parallel with other Ones(WT) within Same Process.
=> Node.js uses Libuv(C library) that Provides "Thread Pool for Handling tasks that can't be done non-blockingly"
=> Node.js uses Two Types of Thread 1. Main Thread 2. Worker Threads
1. Main Thread :- 
    Main Thread is Initial execution thread that starts When Node.js Starts. It's Responsible for Executing JS code and Handling Incoming Request.
2. Worker Thread :-
    Worker Thread is a Separate Execution Thread That runs Alongside Main Thread. Once blocking (Synchronous Task like CPU intensive(fs,cryto,os,compression..)) completes the Result sent to "Event Queue" as callback, Then "Event Loop " executes That Callback. By Default 4 Worker Thread But you can extend it upto 128 WT using "UV_THREADPOOL_SIZE".

-------------------------------------------------------------------


@ Micro-Task(Priority)
=> Promises,callbacks, process.nextTick(), queueMicrotask function(){}, Mutation Observer API, Await expression in async Functions

@ Macro-Task(after Micro-Task)
=> setTimeout & setInterval Callbacks, DOM Manipulation & Rendering, I/O operations(file read/write), Network (fetch HTTp), EVent Handlers (addEventListener)

-------------------------------------------------------------------


@ Thread Pool, Thread, Worker Thread
@ Async Envrionment & How Node.js Handles Async Environment
@ What Is NPM, Node, Yarn & all Version info / Upgrade & Manage
@ Differnce B/w Yarn & NPM
@ Event Loop , Event Driven in Node.js
@ Node.js Utills like Core Modules (http, fs, ....) and uses

 
-----------------------------------------------
// console
I)  LOG : used to printt string, numbers, Js Object & Variable in console
`console.log()` 

II) INFO : print Requreds info about debugging purpose
`console.info()`

III) DEBUG : same as above both but in color will be blue

IV) WARN : dislay warning Message to console which will be anything 
`console.warn(var, ob, anything)`

V) ASSERT : this is differnt from others this will print message to console if expression evaluates false so you need to pass boolean expressn as parmeter
`console.assert(expression, message)`

VI) COUNT : use for log counter.if declraed in loop it gives iterations number ther wise any time it calles
`console.count()`

VII) TRACE : exacly like log bur proved Stack Trace (show call path where console.trace put).
`console.trace()`

VIII) TABLE : table format used for arrays objevt nested object (better Understanding).
`console.table(array/object)`

IX) Clear : to clear the console
`console.clear()`

X) ERROR : display error message
`console.error(mesage)`

XI) DIR : display like list of properties of what you provide especially object
`console.dir(object)`

-------------------------------------------------------------------------
@ API(Application Programming Interface)

- React (Frontend) asks for data 
- Node.js + Express (The API) receives the request, checks if it's valid Authentication Authorization and Multiple VAlidation, and asks the database for the data.
- MySQL/MongoDB (Database) finds the data and gives it to Express.
- Express sends that data back to React in JSON.

==> Types Of APIS
1. REST API(Representational State Transfer)
- REST is a "set of rules" for building APIs.
- IT Uses WEB URL & HTTP Methods(GET, POST ...) To Perform CRUD Opearations
-> HTTP Methods
GET: Read data. (e.g., GET /api/users gets all users).
POST: Create new data. (e.g., POST /api/users creates a new user).
PUT/PATCH: Update data. (e.g., PUT /api/users/123 updates user id 123).
DELETE: Delete data. (e.g., DELETE /api/users/123 deletes user id 123).
-> Note : 
   - Put & Patch Diffence : 
        - Use PUT when you need to replace the entire resource with new data (Chaange Whole profile)
        - Use PATCH when you only need to update specific fields of a resource (Change only Email, password or Address)

2. WebSockets (Real-Time APIs)
- REST and GraphQL are "Request-Response" (React asks, Node answers). But what if you are building a Chat App or a Live Scoreboard? You don't want React to keep asking "Are there new messages?" every 2 seconds.
- WebSockets create a persistent, two-way open connection between React and Node.js. If a new message arrives in the database, the Node.js server can push it to React instantly without React having to ask for it.
- Socket.io It is Npm Library which is bidirectional(two Way communication), event-based communication between a web client and a server

3. GraphQL APIs
4. SOAP & gRPC 

// -----------------------------------------------------------------

@ Environment Config (dotenv)
=> dotenv is npm package that Loads Environment Variables from `.env` file into `process.env`
=> Used to Store Sensitive Data Like DB passwords, API Keys, JWT Secrets, Port Numbers
=> `.env` File Must Be In Root Directory & Must Be Added To `.gitignore` (Never Commit to Git)

// install
`npm install dotenv`

// create .env file in root
PORT=5000
DB_URL=mongodb://localhost:27017/mydb
JWT_SECRET=mySuperSecretKey123
JWT_EXPIRES_IN=7d
COOKIE_SECRET=cookieSecret123
NODE_ENV=development
CLOUDINARY_API_KEY=abc123xyz
EMAIL_PASSWORD=myEmailPass

// load in app.js (must be at very top before anything else)
require('dotenv').config();
// or ES6:
import 'dotenv/config';

// access anywhere in app
const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL;
const jwtSecret = process.env.JWT_SECRET;

// Note: process.env values are ALWAYS strings
// if PORT=5000 in .env then typeof process.env.PORT === "string"
// convert: const port = Number(process.env.PORT)

// Different .env files for different environments
// .env.development
// .env.production
// .env.test


// -----------------------------------------------------------------

@ Password Hashing (bcryptjs)
=> bcryptjs is npm Library Used to Hash Passwords Before Storing in Database
=> Plain Text Password Should NEVER Be Stored in DB — Always Hash It
=> bcrypt Uses "Salt Rounds" (cost factor) — Higher = More Secure But Slower (10-12 is standard)
=> Hashing is One-Way — Cannot Convert Hash Back to Password — Only Compare

// install
`npm install bcryptjs`

const bcrypt = require('bcryptjs');

// Hash Password (during Registration/Signup)
const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);   // generate salt with 10 rounds
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
    // or single line: 
    // return await bcrypt.hash(plainPassword, 10);
};
// Input:  "myPassword123"
// Output: "$2a$10$X7jZ5Kq..." (60 char hash — different every time even for same password because of salt)

// Compare Password (during Login)
const comparePassword = async (plainPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;  // true or false
};

// Usage in Controller
// Register
const register = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: "User Registered" });
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Password" });

    // password matched — generate JWT token
    res.json({ message: "Login Success" });
};

// In Mongoose — Hash in Pre-Save Middleware (Better Approach)
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


// -----------------------------------------------------------------

@ JWT Authentication (jsonwebtoken)
=> JWT (JSON Web Token) is Standard For Securely Transmitting Info Between Client & Server as JSON Object
=> Used for Stateless Authentication — Server Does Not Store Session, Client Stores Token
=> Token Sent With Every Request in Header: `Authorization: Bearer <token>`

=> JWT Has Three Parts Separated By Dots:
   Header.Payload.Signature
   1. Header    : Algorithm (HS256) & Token Type (JWT)
   2. Payload   : Data (userId, email, role) — Called "Claims" — NOT Encrypted Just Encoded (Base64)
   3. Signature  : HMACSHA256(header + payload + SECRET_KEY) — Verifies Token is Not Tampered

// install
`npm install jsonwebtoken`

const jwt = require('jsonwebtoken');

// Generate Token (during Login/Register — after password verified)
const generateToken = (userId) => {
    const token = jwt.sign(
        { id: userId, role: "user" },       // payload (data you want to store)
        process.env.JWT_SECRET,              // secret key from .env
        { expiresIn: "7d" }                  // options: expires in 7 days
        // expiresIn: "1h", "30m", "60s", "7d"
    );
    return token;
};

// Verify Token (in Auth Middleware — runs on every protected route)
const verifyToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
    // returns: { id: "userId123", role: "user", iat: 1234567890, exp: 1234567890 }
    // iat = issued at, exp = expires at
};

// Auth Middleware (protect routes)
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No Token Provided" });
        }

        const token = authHeader.split(' ')[1];  // "Bearer TOKEN" → "TOKEN"

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request object
        req.user = decoded;  // now req.user.id, req.user.role available in next handlers

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token Expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid Token" });
        }
        return res.status(500).json({ message: "Auth Failed" });
    }
};

// Role-Based Authorization Middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
        }
        next();
    };
};

// Usage in Routes
app.post('/api/auth/register', registerController);
app.post('/api/auth/login', loginController);
app.get('/api/profile', authMiddleware, getProfile);                         // protected
app.delete('/api/users/:id', authMiddleware, authorize('admin'), deleteUser); // admin only

// Refresh Token Flow (Optional — For Better Security)
// Access Token  : Short-lived (15min-1hr), sent in Header, used for API access
// Refresh Token : Long-lived (7d-30d), stored in httpOnly Cookie, used to get new Access Token
// When Access Token expires → Client sends Refresh Token → Server verifies → Issues New Access Token

const generateAccessToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
const generateRefreshToken = (userId) => jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

// Store Refresh Token in httpOnly cookie (safer than localStorage)
res.cookie('refreshToken', refreshToken, {
    httpOnly: true,     // JS cannot access (XSS protection)
    secure: true,       // only HTTPS
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});

// Complete Login Controller Example
const loginController = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
        message: "Login Successful",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
};

// JWT vs Sessions
// JWT: Stateless, stored on Client, Scalable(no server memory), No DB lookup per request
// Sessions: Stateful, stored on Server, uses server memory, DB lookup for session data


// -----------------------------------------------------------------

@ File Upload (Multer)
=> Multer is Express Middleware for Handling `multipart/form-data` Used For Uploading Files
=> It Adds `req.file` (single upload) or `req.files` (multiple upload) Object to Request

// install
`npm install multer`

const multer = require('multer');
const path = require('path');

// Configure Storage (Where & How To Save Files)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');              // folder where files saved
    },
    filename: function (req, file, cb) {
        // unique filename: timestamp-originalname
        const uniqueName = Date.now() + '-' + file.originalname;
        // or: Date.now() + path.extname(file.originalname)
        cb(null, uniqueName);
    }
});

// File Filter (Validation — which file types allowed)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);           // accept file
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF allowed'), false);  // reject
    }
};

// Initialize Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024    // 5MB max file size
    }
});

// Routes
// Single file upload (field name "avatar" in form)
app.post('/api/upload', upload.single('avatar'), (req, res) => {
    console.log(req.file);
    // req.file = {
    //   fieldname: 'avatar',
    //   originalname: 'photo.jpg',
    //   mimetype: 'image/jpeg',
    //   destination: 'uploads/',
    //   filename: '1234567890-photo.jpg',
    //   path: 'uploads/1234567890-photo.jpg',
    //   size: 234567
    // }
    res.json({ message: "File Uploaded", file: req.file });
});

// Multiple files upload (max 5 files, field name "photos")
app.post('/api/upload-multiple', upload.array('photos', 5), (req, res) => {
    console.log(req.files);  // array of file objects
    res.json({ message: "Files Uploaded", files: req.files });
});

// Multiple fields with different names
app.post('/api/upload-fields', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'documents', maxCount: 3 }
]), (req, res) => {
    console.log(req.files.avatar);      // array
    console.log(req.files.documents);   // array
});

// Memory Storage (store in buffer — for cloud upload like Cloudinary, S3)
const memoryUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});
// req.file.buffer contains the file data — upload to cloud from here

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));
// Access: http://localhost:5000/uploads/1234567890-photo.jpg

// Multer Error Handling
app.post('/api/upload', (req, res) => {
    upload.single('avatar')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: "File too large (max 5MB)" });
            return res.status(400).json({ error: err.message });
        }
        if (err) return res.status(400).json({ error: err.message });
        res.json({ file: req.file });
    });
});


// -----------------------------------------------------------------

@ Input Validation (express-validator)
=> express-validator is Middleware Library For Validating & Sanitizing Request Data (body, params, query)
=> Validates Before Controller Runs — If Invalid, Send Error Response Without Hitting DB

// install
`npm install express-validator`

const { body, param, query, validationResult } = require('express-validator');

// Validation Rules Array
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Name must contain only letters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[A-Z]/).withMessage('Password must contain uppercase letter'),

    body('age')
        .optional()
        .isInt({ min: 18, max: 65 }).withMessage('Age must be between 18-65'),

    body('role')
        .optional()
        .isIn(['user', 'admin', 'moderator']).withMessage('Invalid role'),

    body('phone')
        .optional()
        .isMobilePhone('any').withMessage('Invalid phone number'),

    body('website')
        .optional()
        .isURL().withMessage('Invalid URL'),
];

// Validation Middleware (checks for errors)
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array()
            // errors.array() returns:
            // [{ type: "field", msg: "Email is required", path: "email", location: "body" }]
        });
    }
    next();
};

// Usage in Routes
app.post('/api/auth/register', registerValidation, validate, registerController);
app.put('/api/users/:id',
    param('id').isMongoId().withMessage('Invalid User ID'),
    body('email').optional().isEmail(),
    validate,
    updateUserController
);
app.get('/api/users',
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    validate,
    getUsersController
);

// Common Validators
// .notEmpty()       : field is not empty
// .isEmail()        : valid email format
// .isLength({min,max}) : string length range
// .isInt({min,max}) : integer in range
// .isFloat()        : decimal number
// .isAlpha()        : only letters
// .isAlphanumeric() : letters and numbers
// .isBoolean()      : true/false
// .isDate()         : valid date
// .isURL()          : valid URL
// .isMongoId()      : valid MongoDB ObjectId
// .isIn([])         : value in array
// .matches(/regex/) : matches pattern
// .isMobilePhone()  : valid phone

// Common Sanitizers
// .trim()           : remove whitespace
// .escape()         : convert HTML chars (&, <, >) to entities (XSS prevention)
// .normalizeEmail() : lowercase email
// .toInt()          : convert to integer
// .toBoolean()      : convert to boolean

// Custom Validator
body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Passwords do not match');
    }
    return true;
}),

// Check if email already exists (async custom validator)
body('email').custom(async (value) => {
    const existingUser = await User.findOne({ email: value });
    if (existingUser) {
        throw new Error('Email already registered');
    }
    return true;
}),


// -----------------------------------------------------------------

// @ Joi Validation (Alternative to express-validator)
// => Joi is Schema-Based Validation Library — Define Schema Object Then Validate Against It
// `npm install joi`

const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).pattern(/\d/).required(),
    age: Joi.number().integer().min(18).max(65).optional(),
    role: Joi.string().valid('user', 'admin').default('user'),
});

const validateJoi = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(d => ({ field: d.path[0], message: d.message }));
            return res.status(400).json({ status: 'error', errors });
        }
        next();
    };
};

app.post('/api/register', validateJoi(registerSchema), registerController);

// express-validator vs Joi
// express-validator : Middleware-based, chain validators, works with body/params/query separately
// Joi : Schema-based, define schema object, cleaner for complex nested objects


// -----------------------------------------------------------------

@ Centralized Error Handling
=> Instead Of Writing try-catch In Every Controller, Create One Global Error Handler Middleware
=> Express Error Middleware Has 4 Parameters: (err, req, res, next)
=> Must Be Defined AFTER All Routes (app.use at the end)

// Custom Error Class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;  // trusted errors that we create intentionally
    }
}

// Async Handler Wrapper (eliminates try-catch in every controller)
const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);  // catches error and passes to error middleware
    };
};
// or: const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Controller WITHOUT asyncHandler (repetitive try-catch)
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Not Found" });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// Controller WITH asyncHandler (clean — no try-catch needed)
const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User Not Found', 404);
    res.json(user);
});

const createUser = asyncHandler(async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
});

// Global Error Handler Middleware (in app.js — AFTER all routes)
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        err = new AppError(`Validation Error: ${errors.join(', ')}`, 400);
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err = new AppError(`Duplicate value: ${field} already exists`, 409);
    }

    // Mongoose Cast Error (Invalid ObjectId)
    if (err.name === 'CastError') {
        err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        err = new AppError('Invalid Token', 401);
    }
    if (err.name === 'TokenExpiredError') {
        err = new AppError('Token Expired', 401);
    }

    // Send Error Response
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack        // show stack trace in development
        });
    } else {
        // Production: don't leak error details
        res.status(err.statusCode).json({
            status: err.status,
            message: err.isOperational ? err.message : 'Something went wrong'
        });
    }
};

// 404 Handler (for undefined routes — BEFORE error handler)
app.all('*', (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} Not Found`, 404));
});

// Register Error Handler (LAST middleware)
app.use(globalErrorHandler);

// Order in app.js:
// 1. app.use(express.json())
// 2. app.use(cors())
// 3. app.use('/api', routes)
// 4. app.all('*', 404Handler)
// 5. app.use(globalErrorHandler)


// -----------------------------------------------------------------

@ RESTful API Design Best Practices

=> REST (Representational State Transfer) is Architecture Style For Building APIs
=> RESTful API Follows A Set Of Conventions For URL Structure, HTTP Methods, Response Format

// @URL Naming Conventions
// 1. Use Nouns Not Verbs (resource names)
// GOOD:
GET    /api/users           // get all users
GET    /api/users/123       // get single user
POST   /api/users           // create user
PUT    /api/users/123       // update user
DELETE /api/users/123       // delete user
// BAD:
GET /api/getUsers
POST /api/createUser
DELETE /api/deleteUser/123

// 2. Use Plural Nouns
// GOOD: /api/users, /api/products, /api/orders
// BAD:  /api/user, /api/product, /api/order

// 3. Use Kebab-Case for Multi-Word
// GOOD: /api/order-items, /api/user-profiles
// BAD:  /api/orderItems, /api/user_profiles

// 4. Nested Resources for Relationships
GET /api/users/123/orders          // orders of user 123
GET /api/users/123/orders/456      // order 456 of user 123
POST /api/users/123/orders         // create order for user 123

// 5. Use Query Parameters for Filtering, Sorting, Pagination
GET /api/users?role=admin&status=active          // filter
GET /api/users?sort=name&order=asc               // sort
GET /api/users?page=2&limit=10                   // pagination
GET /api/products?minPrice=100&maxPrice=500       // range filter
GET /api/users?fields=name,email                  // field selection

// @API Versioning
// Include version in URL
GET /api/v1/users
GET /api/v2/users

// In Express:
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// @Standard Response Format
// Success Response
{
    "status": "success",
    "data": {
        "user": { "id": 1, "name": "Deep", "email": "deep@test.com" }
    }
}

// List Response with Pagination
{
    "status": "success",
    "results": 10,
    "data": {
        "users": [...]
    },
    "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 50,
        "limit": 10
    }
}

// Error Response
{
    "status": "fail",           // 4xx client errors
    "message": "User not found"
}
{
    "status": "error",          // 5xx server errors
    "message": "Internal server error"
}

// @Correct HTTP Status Codes To Send
// 200 : OK — GET success, general success
// 201 : Created — POST success (new resource created)
// 204 : No Content — DELETE success (nothing to return)
// 400 : Bad Request — invalid input / validation error
// 401 : Unauthorized — not logged in / invalid token
// 403 : Forbidden — logged in but no permission
// 404 : Not Found — resource doesn't exist
// 409 : Conflict — duplicate entry (email already exists)
// 422 : Unprocessable Entity — validation failed
// 500 : Internal Server Error — server crashed

// @Idempotency
// GET    : Idempotent (same request = same result)
// PUT    : Idempotent (same update = same result)
// DELETE : Idempotent (delete same resource = same result)
// POST   : NOT Idempotent (same request = may create duplicate)
// PATCH  : NOT necessarily Idempotent


// -----------------------------------------------------------------

@ Rate Limiting (express-rate-limit) — Overview
=> Limits Number Of Requests A Client Can Make In A Time Window
=> Prevents Brute Force Attacks, DDoS, API Abuse
=> `npm install express-rate-limit`

const rateLimit = require('express-rate-limit');

// Global rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 100,                    // max 100 requests per windowMs per IP
    message: { status: 'error', message: 'Too many requests, try again later' },
    standardHeaders: true,       // adds RateLimit-* headers
});
app.use('/api', limiter);

// Stricter limiter for auth routes (prevent brute force login)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use('/api/auth', authLimiter);


// -----------------------------------------------------------------

@ Pagination, Filtering, Sorting in APIs — Overview
=> Standard Pattern For Handling Large Data Sets In APIs
=> Use Query Parameters: ?page=1&limit=10&sort=-salary&department=MERN

// Controller Example (Mongoose)
const getEmployees = asyncHandler(async (req, res) => {
    // 1. Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'limit', 'sort', 'fields'];
    excludeFields.forEach(field => delete queryObj[field]);

    // Advanced filtering: ?salary[gte]=50000&age[lt]=30
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = Employee.find(JSON.parse(queryStr));

    // 2. Sorting: ?sort=-salary,name (- means descending)
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);  // sort('-salary name')
    } else {
        query = query.sort('-createdAt');
    }

    // 3. Field Selection: ?fields=name,email,salary
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
    }

    // 4. Pagination: ?page=2&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Execute
    const [data, total] = await Promise.all([
        query.lean(),
        Employee.countDocuments(JSON.parse(queryStr))
    ]);

    res.json({
        status: 'success',
        results: data.length,
        data: { employees: data },
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
});

// API Calls:
// GET /api/employees?department=MERN&salary[gte]=50000&sort=-salary&page=1&limit=10&fields=name,salary


// -----------------------------------------------------------------

@ Caching — Overview
=> Caching Stores Frequently Accessed Data In Memory For Faster Response
=> Reduces DB Queries & Improves API Performance

// 1. In-Memory Cache (Simple — using node-cache)
// `npm install node-cache`
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });  // 300 seconds = 5 min default TTL

const getUsers = asyncHandler(async (req, res) => {
    const cacheKey = 'all-users';

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return res.json({ source: 'cache', data: cachedData });
    }

    // If not in cache, query DB
    const users = await User.find().lean();

    // Store in cache
    cache.set(cacheKey, users, 600);  // cache for 10 minutes

    res.json({ source: 'database', data: users });
});

// Invalidate cache when data changes
const createUser = asyncHandler(async (req, res) => {
    const user = await User.create(req.body);
    cache.del('all-users');  // clear cache so next request gets fresh data
    res.status(201).json(user);
});


// 2. Redis (Production-Level Caching — External In-Memory Store)
// Redis is Separate Server That Stores Key-Value Data In Memory
// Faster Than node-cache, Shared Across Multiple Server Instances, Persistent
// `npm install redis`
// const redis = require('redis');
// const client = redis.createClient({ url: process.env.REDIS_URL });
// await client.connect();
// await client.set('key', JSON.stringify(data), { EX: 600 });
// const cached = JSON.parse(await client.get('key'));

// When to use:
// node-cache : Small apps, single server, simple caching
// Redis : Production, multiple servers, session store, rate limiting, pub/sub


*/