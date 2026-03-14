
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

*/