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