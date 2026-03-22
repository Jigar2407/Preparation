
> **Topics Covered in This File:**
> 1. Higher Order Components (HOC)
> 2. Render Props Pattern
> 3. Controlled vs Uncontrolled Components
> 4. Keys in Depth (why NOT index)
> 5. React.StrictMode
> 6. forwardRef + useImperativeHandle
> 7. Context API + useReducer (combined pattern)
> 8. SSR vs CSR vs SSG
> 9. Event Delegation in React
> 10. Formik + Yup (Form Validation)
> 11. React Query — useQuery + useMutation

---

## Topic 1 : Advanced Patterns

---

**1. What is a Higher Order Component (HOC)?**

Answer:
A **Higher Order Component (HOC)** is a function that **takes a component and returns a NEW enhanced component** with additional props or behavior. It is a pattern for reusing component logic. HOCs are pure — they don't modify the original component, they wrap it.

```jsx
// SYNTAX: const EnhancedComponent = higherOrderComponent(WrappedComponent)

// ===== REAL EXAMPLE — withAuth HOC =====
// Problem: Many pages need to check if user is logged in before showing content
// Without HOC — copy-paste auth check in every protected page

// WITH HOC — write once, apply everywhere
function withAuth(WrappedComponent) {
    return function AuthenticatedComponent(props) {
        const isLoggedIn = localStorage.getItem("token");

        if (!isLoggedIn) {
            return <Navigate to="/login" replace />;
        }

        return <WrappedComponent {...props} />;  // spread all original props through
    };
}

// Wrap any component that needs auth protection
const ProtectedDashboard = withAuth(Dashboard);
const ProtectedProfile   = withAuth(Profile);
const ProtectedSettings  = withAuth(Settings);

// Usage
<ProtectedDashboard />   // auto-redirects to login if not authenticated

// ===== ANOTHER EXAMPLE — withLoading HOC =====
function withLoading(WrappedComponent) {
    return function WithLoadingComponent({ isLoading, ...props }) {
        if (isLoading) return <div className="spinner">Loading...</div>;
        return <WrappedComponent {...props} />;
    };
}

const UserListWithLoading = withLoading(UserList);

// Usage
<UserListWithLoading isLoading={loading} users={users} />
```

**HOC vs Custom Hooks:**
| Feature | HOC | Custom Hook |
|---------|-----|-------------|
| Returns | New Component | Values / Functions |
| Wraps | Component | Logic only |
| Nesting | Can cause "wrapper hell" | No extra components |
| Status | Legacy (pre-hooks) | Modern (React 16.8+) |
| When to use | Class component era, render wrapping | Functional components — preferred today |

Note:
- Key Point: HOC = function that takes component, returns enhanced component. Pattern: `withSomething(Component)`. In 2024, **custom hooks replace most HOC use cases** in functional components. HOCs still exist in legacy codebases. Always forward props using `{...props}` so original props reach the wrapped component.
- Why Interviewer Asks: Classic React interview question. They want to see if you know the pattern AND if you know when to use hooks instead. Saying "custom hooks are preferred today but HOCs are useful in class component codebases" shows maturity.

---

**2. What is the Render Props Pattern?**

Answer:
**Render Props** is a pattern where a component's **render logic is passed as a function prop** (usually called `render` or `children`). The component calls that function and renders whatever it returns — giving full control of rendering to the parent.

```jsx
// ===== RENDER PROPS PATTERN =====
// MouseTracker component — tracks mouse position and shares it via render prop

class MouseTracker extends React.Component {
    state = { x: 0, y: 0 };

    handleMouseMove = (e) => {
        this.setState({ x: e.clientX, y: e.clientY });
    };

    render() {
        return (
            <div onMouseMove={this.handleMouseMove} style={{ height: "100vh" }}>
                {/* Call the render prop function with current state */}
                {this.props.render(this.state)}
            </div>
        );
    }
}

// Usage — parent decides HOW to render the mouse data
<MouseTracker render={({ x, y }) => (
    <h1>Mouse is at ({x}, {y})</h1>
)} />

<MouseTracker render={({ x, y }) => (
    <img src="cat.png" style={{ position: "absolute", left: x, top: y }} />
)} />

// ===== CHILDREN AS FUNCTION (more common version) =====
function Toggle({ children }) {
    const [on, setOn] = useState(false);
    return children({ on, toggle: () => setOn(prev => !prev) });
}

// Usage — children is a function!
<Toggle>
    {({ on, toggle }) => (
        <div>
            <button onClick={toggle}>{on ? "Hide" : "Show"}</button>
            {on && <p>Revealed content!</p>}
        </div>
    )}
</Toggle>
```

Note:
- Key Point: Render props = pass a function as prop, component calls it with data. Pattern allows sharing stateful logic without HOCs. Like HOCs, **custom hooks replaced render props** in most cases for functional components. Still seen in libraries like React Final Form and older codebases.
- Why Interviewer Asks: Tests if you know classic React patterns and their history. They may ask "How would you modernize this render prop to use hooks?" — answer: extract the logic into a custom hook.

---

**3. What is the difference between Controlled and Uncontrolled Components?**

Answer:
This is one of the most important React form concepts.

**Controlled Component** — React **state** is the single source of truth. Every change to the input is controlled by `onChange` + `useState`.

**Uncontrolled Component** — The **DOM itself** stores the value. You read it using `useRef` only when needed (like on submit).

```jsx
// ===== CONTROLLED COMPONENT — React owns the value =====
function ControlledForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Name:", name, "Email:", email);
        // name and email are always current — real-time state
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}              // ← value tied to state
                onChange={e => setName(e.target.value)}  // ← state updates on every keystroke
                placeholder="Name"
            />
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
            />
            {/* Real-time features possible: validation, char count, enable/disable submit */}
            <p>{name.length}/50 characters</p>
            <button type="submit" disabled={!name || !email}>Submit</button>
        </form>
    );
}

// ===== UNCONTROLLED COMPONENT — DOM owns the value =====
function UncontrolledForm() {
    const nameRef  = useRef(null);   // ref to read DOM value
    const emailRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Read value from DOM only on submit — no state involved
        console.log("Name:", nameRef.current.value);
        console.log("Email:", emailRef.current.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text"  ref={nameRef}  placeholder="Name" />
            {/* No value prop, no onChange — DOM handles it directly */}
            <input type="email" ref={emailRef} placeholder="Email" />
            <button type="submit">Submit</button>
        </form>
    );
}
```

| Feature | Controlled | Uncontrolled |
|---------|-----------|--------------|
| Source of truth | React state | DOM |
| Read value | Always available in state | Only when you read the ref |
| Real-time validation | ✅ Easy | ❌ Hard |
| Conditional rendering based on input | ✅ Easy | ❌ Hard |
| File input | ❌ (file inputs are always uncontrolled) | ✅ Required |
| Simplicity | More code | Less code |
| Recommended | ✅ **Yes — for most cases** | Only for file inputs or simple forms |

Note:
- Key Point: Controlled = `value` + `onChange` + state. Uncontrolled = `ref` only. **Always use controlled components** unless you have a specific reason not to (file inputs, integrating with non-React libraries). Controlled gives you validation, conditional UI, and data transformation for free.
- Why Interviewer Asks: Very commonly asked. They may show you a form and ask "is this controlled or uncontrolled?" — look for `value` prop + `onChange`. No `value` prop = uncontrolled.

---

**4. Why should you NOT use array index as a Key? When is it acceptable?**

Answer:
React uses **keys** to identify which items in a list changed, were added, or removed during reconciliation. Using array index as key causes bugs when the list order changes.

```jsx
// ❌ PROBLEM — using index as key when list can reorder or change
const [items, setItems] = useState([
    { id: 1, text: "Apple" },
    { id: 2, text: "Banana" },
    { id: 3, text: "Cherry" }
]);

// User types "Modified Apple" in first input, then you add "Mango" to front:
const addToFront = () => setItems(prev => [{ id: 4, text: "Mango" }, ...prev]);

{items.map((item, index) => (
    <input key={index} defaultValue={item.text} />  // ❌ BAD
))}

// After adding Mango:
// Index 0 was "Apple" — now index 0 is "Mango"
// React thinks index 0 is same element (same key!)
// React REUSES the DOM input but changes only the defaultValue prop
// Result: "Modified Apple" text stays in first input but label says "Mango"
// → WRONG BEHAVIOR — React got confused!

// ✅ SOLUTION — use unique stable ID as key
{items.map((item) => (
    <input key={item.id} defaultValue={item.text} />  // ✅ GOOD
))}
// Now each input is tied to its data ID — adding Mango creates a NEW input
// React correctly identifies each item by its unique ID

// ===== WHEN is index as key ACCEPTABLE? =====
// Only when ALL THREE conditions are true:
// 1. The list is STATIC — never reordered
// 2. Items are NEVER added to the MIDDLE or FRONT
// 3. Items have NO state (pure display, no inputs)

// ✅ Acceptable — static display-only list that never changes
const months = ["Jan", "Feb", "Mar", "Apr"];
{months.map((month, index) => (
    <li key={index}>{month}</li>  // OK — static, never reordered, no state
))}
```

Note:
- Key Point: Index keys cause React to REUSE DOM elements incorrectly when list order changes. Use a unique, stable, non-index ID (`item.id`, `item.slug`, `item.uuid`). Index is only safe for truly static, never-reordered, stateless lists.
- Why Interviewer Asks: Very commonly asked. They may show you a buggy list and ask why inputs are in wrong order — answer is index key. This is a real production bug that developers commonly make.

---

## Topic 2 : React Tools & Patterns

---

**5. What is React.StrictMode? What does it do?**

Answer:
`React.StrictMode` is a **development-only** helper component that highlights potential problems in your app. It renders no visible UI — it just activates extra checks and warnings in the browser console.

```jsx
// In main.jsx or index.js — wraps entire app
import { StrictMode } from 'react';
ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);

// Can also wrap specific parts
function App() {
    return (
        <div>
            <Header />
            <StrictMode>       {/* only these check strictly */}
                <MainContent />
                <Sidebar />
            </StrictMode>
            <Footer />
        </div>
    );
}
```

**What StrictMode does:**

```jsx
// 1. DOUBLE-INVOKES render + lifecycle functions
// StrictMode calls your component function TWICE to detect side effects
// This is why you might see useEffect run twice in development!
function MyComponent() {
    console.log("Rendered!");   // logs TWICE in StrictMode — intentional
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("Effect ran!");   // runs TWICE in development with StrictMode
        // StrictMode mounts → unmounts → remounts to check cleanup works
        return () => console.log("Cleanup!");
    }, []);

    return <p>{count}</p>;
}
// In PRODUCTION: renders once, effect runs once — StrictMode is dev-only!

// 2. Warns about DEPRECATED APIs
// - String refs (ref="myInput") → deprecated, use useRef
// - Legacy Context API → deprecated
// - findDOMNode() → deprecated

// 3. Warns about missing cleanup in effects
// - If you add an event listener without removing it
// - If you start a timer without clearing it
// - StrictMode's double-mount exposes these bugs
```

Note:
- Key Point: StrictMode = development-only checks. No effect in production. Effects running TWICE in development is intentional — it tests that your cleanup function works correctly. Don't remove StrictMode because of double renders — fix your cleanup instead.
- Why Interviewer Asks: Tests if you understand why effects seem to run twice in development. Many beginners are confused by this. Knowing it's StrictMode (and why) shows experience.

---

**6. What is forwardRef? What is useImperativeHandle?**

Answer:
By default, React does NOT allow you to pass a `ref` directly through a component to its internal DOM element. `forwardRef` enables this. `useImperativeHandle` controls WHAT the parent can do with the forwarded ref.

```jsx
import { forwardRef, useRef, useImperativeHandle } from 'react';

// ===== forwardRef — pass ref THROUGH a component to its DOM element =====

// WITHOUT forwardRef — parent cannot access the input DOM element
function TextInput({ placeholder }) {
    return <input type="text" placeholder={placeholder} />;
}
const ref = useRef(null);
<TextInput ref={ref} />   // ❌ Warning: Function components cannot receive refs

// WITH forwardRef — ref is forwarded to the actual <input>
const TextInput = forwardRef(function TextInput({ placeholder }, ref) {
    return <input ref={ref} type="text" placeholder={placeholder} />;
});

// Parent can now access the DOM input directly
function Parent() {
    const inputRef = useRef(null);

    const focusInput = () => {
        inputRef.current.focus();      // ✅ access DOM methods
        inputRef.current.select();     // ✅ directly on the input
    };

    return (
        <>
            <TextInput ref={inputRef} placeholder="Type here" />
            <button onClick={focusInput}>Focus Input</button>
        </>
    );
}

// ===== useImperativeHandle — expose ONLY specific methods to parent =====
// Use when you want parent to call specific methods but not have full DOM access

const FancyInput = forwardRef(function FancyInput(props, ref) {
    const inputRef = useRef(null);

    // Control WHAT the parent ref can do
    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current.focus(),
        clear: () => { inputRef.current.value = ""; },
        getValue: () => inputRef.current.value
        // Parent can ONLY do focus, clear, getValue
        // Cannot do: inputRef.current.remove(), inputRef.current.style = ...
    }));

    return <input ref={inputRef} {...props} />;
});

function Parent() {
    const fancyRef = useRef(null);

    return (
        <>
            <FancyInput ref={fancyRef} placeholder="Fancy Input" />
            <button onClick={() => fancyRef.current.focus()}>Focus</button>
            <button onClick={() => fancyRef.current.clear()}>Clear</button>
            <button onClick={() => alert(fancyRef.current.getValue())}>Get Value</button>
        </>
    );
}
```

Note:
- Key Point: `forwardRef` = pass ref through functional component to DOM. `useImperativeHandle` = limit what the parent can do with the ref (expose API surface, not full DOM access). Use when building reusable component libraries or design systems.
- Why Interviewer Asks: Tests advanced React ref knowledge. Commonly asked for senior roles or if you mention building component libraries. Use case: building an `<Input>` component in a design system that can be focused programmatically.

---

**7. How do you combine Context API with useReducer? Why is this pattern powerful?**

Answer:
Combining Context API with useReducer creates a **lightweight Redux-like state management** pattern — global state + predictable updates — without any external library.

```jsx
import { createContext, useContext, useReducer } from 'react';

// ===== 1. Define State Shape and Actions =====
const initialState = {
    user: null,
    theme: "light",
    notifications: []
};

// Reducer — pure function (same as Redux reducer)
function appReducer(state, action) {
    switch (action.type) {
        case "SET_USER":
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null };
        case "TOGGLE_THEME":
            return { ...state, theme: state.theme === "light" ? "dark" : "light" };
        case "ADD_NOTIFICATION":
            return { ...state, notifications: [...state.notifications, action.payload] };
        default:
            return state;
    }
}

// ===== 2. Create Context =====
const AppStateContext    = createContext(null);
const AppDispatchContext = createContext(null);
// Separate contexts — components that only dispatch won't re-render on state changes

// ===== 3. Create Provider =====
function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppStateContext.Provider>
    );
}

// ===== 4. Custom hooks for consuming (clean API) =====
function useAppState()    { return useContext(AppStateContext); }
function useAppDispatch() { return useContext(AppDispatchContext); }

// ===== 5. Use in any component — no prop drilling! =====
function Navbar() {
    const { user, theme }  = useAppState();
    const dispatch         = useAppDispatch();

    return (
        <nav className={theme}>
            <span>{user ? `Hello ${user.name}` : "Guest"}</span>
            <button onClick={() => dispatch({ type: "TOGGLE_THEME" })}>
                Toggle Theme
            </button>
            {user && (
                <button onClick={() => dispatch({ type: "LOGOUT" })}>
                    Logout
                </button>
            )}
        </nav>
    );
}

function App() {
    return (
        <AppProvider>
            <Navbar />
            <Main />
        </AppProvider>
    );
}
```

Note:
- Key Point: Context + useReducer = mini-Redux without installation. Use separate contexts for state and dispatch — components that only dispatch won't re-render when state changes. This pattern is perfect for small-to-medium apps. For large apps with many slices, use Redux Toolkit.
- Why Interviewer Asks: Tests if you understand both Context and useReducer deeply enough to combine them. It also shows you know when to use Redux vs this lighter pattern.

---

## Topic 3 : Rendering Strategies

---

**8. What is the difference between CSR, SSR, and SSG?**

Answer:

**CSR (Client-Side Rendering)** — The browser downloads a mostly empty HTML, then JavaScript builds the entire page in the browser. This is how standard React apps work.

**SSR (Server-Side Rendering)** — The server generates the full HTML for every request and sends it to the browser. The browser shows content immediately, then React "hydrates" it (attaches event listeners).

**SSG (Static Site Generation)** — HTML is generated **at build time** (before deployment), stored as static files, and served instantly. Content doesn't change per request.

```
CSR  : Browser → Empty HTML → Download JS → React builds UI → Show page
SSR  : Browser → Request → Server generates HTML → Send full HTML → Show page → Hydrate
SSG  : Build time → Generate all HTML → Deploy → Browser → Get pre-built HTML instantly
```

```javascript
// CSR — standard React (Vite/CRA)
// index.html has just: <div id="root"></div>
// All content built by JavaScript in browser

// SSR — Next.js example
export async function getServerSideProps() {
    const data = await fetch("https://api.example.com/posts");
    const posts = await data.json();
    return { props: { posts } };    // runs on SERVER for every request
}
export default function Blog({ posts }) {
    return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}

// SSG — Next.js example
export async function getStaticProps() {
    const data = await fetch("https://api.example.com/posts");
    const posts = await data.json();
    return { props: { posts } };    // runs at BUILD TIME once
}
```

| Feature | CSR | SSR | SSG |
|---------|-----|-----|-----|
| When HTML generated | In browser | On each request | At build time |
| Initial load speed | Slow (wait for JS) | Fast (pre-built HTML) | Fastest (static file) |
| SEO | ❌ Poor | ✅ Good | ✅ Best |
| Dynamic content | ✅ Full | ✅ Full | ❌ Limited (at build) |
| Server needed | ❌ No | ✅ Yes | ❌ No (CDN) |
| Framework | React (Vite) | Next.js | Next.js / Gatsby |
| Use case | Dashboards, admin panels | E-commerce, social media | Blogs, docs, marketing |

Note:
- Key Point: CSR = React default (fast JS interaction, slow first load, bad SEO). SSR = Next.js (good SEO, fresh data per request, needs server). SSG = Next.js/Gatsby (best performance, best SEO, data fixed at build). **Hydration** = process where React attaches event listeners to server-rendered HTML.
- Why Interviewer Asks: Very important concept for MERN developers. Shows you understand beyond basic React. They'll ask: "Which rendering strategy would you use for a blog vs a real-time dashboard?"

---

## Topic 4 : React Events & Forms

---

**9. What is Event Delegation in React? How does React handle events differently?**

Answer:
**Event Delegation** is a technique where instead of attaching event listeners to every individual element, you attach ONE listener to a parent/root element and let events bubble up to it.

```jsx
// Plain JavaScript — event delegation
document.getElementById("list").addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        console.log("Clicked:", e.target.textContent);
    }
});
// ONE listener on parent catches ALL child clicks via bubbling

// ===== HOW REACT USES EVENT DELEGATION INTERNALLY =====
// React does NOT attach an event listener to each DOM element you write
// Instead: React attaches ONE listener at the ROOT (#root div)
// All events bubble up to the root — React figures out which component to call

// This means:
<button onClick={handleClick}>Click Me</button>
// Does NOT create: button.addEventListener("click", handleClick)
// Instead: React's root listener catches the bubbled click event
// and calls the React handleClick handler

// ===== SYNTHETIC EVENTS =====
// React wraps native DOM events in "SyntheticEvent" objects
// SyntheticEvent normalizes differences between browsers
// Has same interface as native events (preventDefault, stopPropagation, target, etc.)

function handleClick(e) {
    console.log(e.type);          // "click" — same as native
    e.preventDefault();           // works same as native
    e.stopPropagation();          // stops React's bubbling
    console.log(e.nativeEvent);   // access the actual DOM event
}

// React 17+ change:
// Before React 17: root listener was on document
// React 17+: root listener is on the #root div
// Reason: better compatibility with multiple React apps on same page
```

Note:
- Key Point: React uses event delegation internally — ONE listener at root catches all events. React wraps events in SyntheticEvent for cross-browser consistency. `stopPropagation()` stops React's synthetic event bubbling, not the native DOM bubbling directly.
- Why Interviewer Asks: Tests deeper React knowledge. Shows you understand that React's event system is an abstraction over native DOM events. Common follow-up: "Why did React move the root listener from `document` to `#root` in React 17?"

---

**10. How do you handle forms in React with Formik and Yup validation?**

Answer:
**Formik** manages form state, submission, and touched/error tracking. **Yup** is a schema validation library that works with Formik for field validation rules.

```bash
npm install formik yup
```

```jsx
import { useFormik } from "formik";
import * as Yup from "yup";

// ===== VALIDATION SCHEMA with Yup =====
const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),

    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),

    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain one uppercase letter")
        .required("Password is required"),

    age: Yup.number()
        .min(18, "Must be at least 18")
        .max(100, "Must be under 100")
        .required("Age is required")
});

// ===== FORM COMPONENT with Formik =====
function RegisterForm() {
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            age: ""
        },
        validationSchema,    // Yup schema
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await registerUser(values);
                resetForm();
                alert("Registered successfully!");
            } catch (err) {
                alert("Registration failed");
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>

            {/* NAME FIELD */}
            <div>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}     // updates formik state
                    onBlur={formik.handleBlur}         // marks field as touched
                    value={formik.values.name}         // controlled by formik
                />
                {/* Show error only after user has touched the field */}
                {formik.touched.name && formik.errors.name && (
                    <span className="error">{formik.errors.name}</span>
                )}
            </div>

            {/* EMAIL FIELD */}
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                    <span className="error">{formik.errors.email}</span>
                )}
            </div>

            {/* PASSWORD FIELD */}
            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                    <span className="error">{formik.errors.password}</span>
                )}
            </div>

            <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
            >
                {formik.isSubmitting ? "Registering..." : "Register"}
            </button>
        </form>
    );
}
```

Note:
- Key Point: Formik manages `values`, `errors`, `touched`, `isSubmitting`. `handleChange` + `handleBlur` + `value` are the three required props for each controlled input. Show errors only when `touched.field && errors.field` — avoids showing errors before user interacts. Yup schema goes in `validationSchema`.
- Why Interviewer Asks: Formik + Yup is the most widely used form solution in React. They'll ask: "How do you validate a form in React?" — this is the standard answer. The `touched` concept (showing errors only after blur) is a key detail they want to hear.

---

## Topic 5 : Data Fetching

---

**11. What is React Query? What are useQuery and useMutation?**

Answer:
**React Query** (now called TanStack Query) is a powerful library for **server state management** — fetching, caching, synchronizing, and updating data from APIs. It replaces the typical `useState + useEffect + fetch` pattern with a much simpler and more powerful API.

```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools   # optional devtools
```

```jsx
// ===== SETUP — wrap app with QueryClientProvider =====
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,   // data is fresh for 5 minutes
            retry: 2,                    // retry failed requests 2 times
        }
    }
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <MyApp />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

// ===== useQuery — for fetching / reading data (GET) =====
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function UsersList() {
    const {
        data: users,    // the fetched data
        isLoading,      // true during first fetch
        isFetching,     // true during any background refetch
        isError,        // true if fetch failed
        error,          // the error object
        refetch         // function to manually refetch
    } = useQuery({
        queryKey: ["users"],          // unique key — used for caching
        queryFn: () => axios.get("/api/users").then(res => res.data),
        staleTime: 1000 * 60,        // cache is fresh for 1 minute
        // After staleTime: React Query will refetch in background
    });

    if (isLoading) return <p>Loading users...</p>;
    if (isError)   return <p>Error: {error.message}</p>;

    return (
        <div>
            <button onClick={() => refetch()}>Refresh</button>
            <ul>
                {users.map(user => <li key={user.id}>{user.name}</li>)}
            </ul>
        </div>
    );
}

// ===== useQuery with dynamic queryKey (dependent query) =====
function UserDetail({ userId }) {
    const { data: user, isLoading } = useQuery({
        queryKey: ["users", userId],    // key changes when userId changes
        queryFn: () => axios.get(`/api/users/${userId}`).then(res => res.data),
        enabled: !!userId,              // only fetch if userId exists
    });

    if (isLoading) return <p>Loading...</p>;
    return <div>{user?.name}</div>;
}

// ===== useMutation — for creating/updating/deleting data (POST, PUT, DELETE) =====
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateUser() {
    const queryClient = useQueryClient();

    const { mutate: createUser, isPending, isError, error } = useMutation({
        mutationFn: (newUser) => axios.post("/api/users", newUser).then(res => res.data),

        onSuccess: (createdUser) => {
            // Invalidate and refetch the users list after creating
            queryClient.invalidateQueries({ queryKey: ["users"] });
            alert(`Created: ${createdUser.name}`);
        },

        onError: (err) => {
            console.error("Create failed:", err.message);
        }
    });

    const handleCreate = () => {
        createUser({ name: "New User", email: "new@user.com" });
    };

    return (
        <div>
            <button onClick={handleCreate} disabled={isPending}>
                {isPending ? "Creating..." : "Create User"}
            </button>
            {isError && <p>Error: {error.message}</p>}
        </div>
    );
}
```

**React Query vs useEffect + fetch:**
| Feature | useEffect + fetch | React Query |
|---------|------------------|-------------|
| Caching | Manual | ✅ Automatic |
| Background refetch | Manual | ✅ Automatic |
| Loading/error state | Manual useState | ✅ Built-in |
| Deduplication (same query) | Manual | ✅ Automatic |
| Refetch on window focus | Manual | ✅ Built-in |
| DevTools | None | ✅ React Query DevTools |
| Code lines | 20–30 lines | 5–10 lines |

Note:
- Key Point: `useQuery` = GET (read data), `useMutation` = POST/PUT/DELETE (write data). `queryKey` is the cache identifier — change it and React Query fetches again. `invalidateQueries` marks cache stale after mutation so lists refresh. `staleTime` controls how long cached data is considered fresh.
- Why Interviewer Asks: React Query is used in most modern React projects. They'll ask: "How do you manage server state in React?" — React Query is the preferred answer. Also ask: "How do you update the list after adding a new item?" — `queryClient.invalidateQueries`.

---

## Quick Revision — Missing Topics Summary

| # | Question | One-Line Answer |
|---|----------|----------------|
| 1 | HOC | Function that takes component, returns enhanced component. Legacy pattern — use custom hooks now |
| 2 | Render Props | Pass render logic as function prop. `render={({data}) => <Component data={data} />}`. Also legacy |
| 3 | Controlled component | `value` + `onChange` + state. React owns the input value |
| 4 | Uncontrolled component | `ref` only. DOM owns the value. Used for file inputs |
| 5 | Why not index as key | List reorder causes React to reuse wrong DOM elements. Use unique stable ID |
| 6 | StrictMode | Dev-only checks. Double-renders effects to test cleanup. No production effect |
| 7 | forwardRef | Pass ref through component to child DOM element |
| 8 | useImperativeHandle | Limit what parent can do with forwarded ref — expose specific API only |
| 9 | Context + useReducer | Mini-Redux without library. createContext + useReducer + Provider |
| 10 | CSR | Client builds HTML. React default. Bad SEO, fast interaction |
| 11 | SSR | Server builds HTML per request. Good SEO, needs server. Next.js |
| 12 | SSG | HTML built at build time. Best performance + SEO. Blogs/docs |
| 13 | Event delegation | React puts ONE listener at root, events bubble up. Uses SyntheticEvent |
| 14 | Formik | Manages form state, touched, errors, submission |
| 15 | Yup | Schema validation library. Works with Formik for field rules |
| 16 | useQuery | Fetch + cache + loading/error state. React Query for GET requests |
| 17 | useMutation | POST/PUT/DELETE with React Query. Use invalidateQueries after success |