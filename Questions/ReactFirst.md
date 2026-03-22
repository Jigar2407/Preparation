# ⚛️ React + Redux Toolkit — Interview Questions & Answers
### For MERN Stack Entry-Level Developers
### Format matches your JavaScript.md files exactly

---

> **📊 Internet Analysis Summary (What Interviewers Actually Ask in 2024–2025)**
> Sources Analyzed: GeeksforGeeks, InterviewBit, GreatFrontEnd, Cuvette Tech, MentorCruise, DEV Community, Reddit, GitHub interview repos
>
> **Top Topics Asked (in order of frequency):**
> 1. React Basics — What is React, JSX, Virtual DOM, Components (100% of interviews)
> 2. Props vs State (100% of interviews)
> 3. useState & useEffect hooks — always asked (100%)
> 4. Component Lifecycle (90%)
> 5. useRef, useMemo, useCallback — performance hooks (85%)
> 6. Custom Hooks (80%)
> 7. React Router — BrowserRouter, Link, NavLink, useNavigate (75%)
> 8. Redux Toolkit — Store, Slice, useSelector, useDispatch (70%)
> 9. Context API vs Redux (65%)
> 10. Axios + API calls in React (60%)
> 11. Reconciliation & React Fiber (50%)
> 12. Tricky output/behavior questions (40% — higher-level interviews)
>
> **Sequence Logic:** Questions go from absolute basics → hooks → router → redux → tricky questions
> Just like your JS file goes from "What is JS Engine" → to "Promises"

---

## Topic 1 : React Basics

---

**1. What is React? Why do we use it?**

Answer:
React is a **JavaScript library** developed by **Meta (Facebook)** in 2013 for building **User Interfaces (UI)**. It is NOT a full framework — it only handles the **View layer** (what the user sees). React allows developers to build **reusable components** that can be combined to create complex UIs.

**Why React over plain JavaScript?**
- **Virtual DOM** — updates only what changed, not the whole page (faster)
- **Component-based architecture** — reusable building blocks
- **Declarative programming** — you describe WHAT the UI should look like, React figures out HOW to update it
- **Unidirectional data flow** — data flows top to bottom (easy to debug)
- **Huge ecosystem** — React Router, Redux, React Query, etc.

```bash
# Check React version
npm view react version

# Create project with Vite (recommended in 2024)
npm create vite@latest my-app --template react

# Create project with CRA (older)
npx create-react-app my-app
```

Note:
- Key Point: React is a **library not a framework**. Library = you call it. Framework = it calls you. React only does UI. You need extra tools (Router, Redux) for full app.
- Why Interviewer Asks: First question in almost every interview. They want to see if you understand what React actually is vs Angular/Vue. Saying "library not framework" immediately shows you know the difference.

---

**2. What is the difference between a Library and a Framework?**

Answer:
| Concept | Library | Framework |
|---------|---------|-----------|
| Control | **You call** the library code | **Framework calls** your code (Inversion of Control) |
| Flexibility | High — use only what you need | Low — must follow framework rules |
| Example | **React** (only UI) | **Angular** (routing + state + UI + testing all built-in) |
| Decision | You decide the structure | Framework decides the structure |

React is a library — you pick your own router (React Router), state manager (Redux/Context), HTTP client (Axios/Fetch), etc.

Note:
- Key Point: React = library. Angular = framework. The key difference is **Inversion of Control** — who calls whom.
- Why Interviewer Asks: Common follow-up to "What is React?" Tests if you understand the ecosystem vs blindly using tools.

---

**3. What is JSX? Why do we use it?**

Answer:
JSX stands for **JavaScript XML**. It is a **syntax extension** for JavaScript that lets you write HTML-like code inside JavaScript files. JSX is NOT valid JavaScript — **Babel transpiles** (converts) it into `React.createElement()` calls before the browser runs it.

```jsx
// JSX (what you write)
const element = <h1 className="title">Hello Dev!</h1>;

// What Babel converts it to (React.createElement)
const element = React.createElement(
  "h1",
  { className: "title" },
  "Hello Dev!"
);
```

**Important JSX Rules:**
```jsx
// 1. class → className, for → htmlFor
<div className="box">          // ✅ NOT class="box"
<label htmlFor="email">        // ✅ NOT for="email"

// 2. Every JSX element must be closed
<img src="pic.jpg" />          // ✅ self-closing
<br />                          // ✅

// 3. Must have ONE root element (or use Fragment)
return (
  <>                            // Fragment — no extra DOM node
    <h1>Title</h1>
    <p>Description</p>
  </>
);

// 4. JavaScript expressions in curly braces
const name = "Dev";
return <h1>Hello {name}!</h1>;  // ✅ outputs: Hello Dev!
return <h1>Hello {2 + 2}!</h1>; // ✅ outputs: Hello 4!
```

Note:
- Key Point: JSX = syntactic sugar for `React.createElement()`. Babel transpiles it. Key rules: `className` not `class`, `htmlFor` not `for`, single root element, expressions in `{}`.
- Why Interviewer Asks: Very common. They may show you invalid JSX and ask what's wrong. Knowing className/htmlFor swaps and the Fragment rule catches many candidates.

---

**4. What is the Virtual DOM? How does it work?**

Answer:
**Real DOM** is the browser's actual representation of the HTML page. Directly manipulating the Real DOM is slow because it triggers layout recalculations, repaints and reflows on every change.

**Virtual DOM** is a **lightweight JavaScript object (copy)** of the Real DOM that React maintains in memory. When state changes:

```
State Changes → React updates Virtual DOM → React compares new Virtual DOM
with old Virtual DOM (Diffing Algorithm) → React calculates minimum changes needed
→ React applies ONLY those changes to the Real DOM (Reconciliation)
```

```jsx
// Without React: Every DOM update re-renders everything
document.getElementById("counter").innerHTML = count; // direct = slow

// With React: Only the <p> with count re-renders
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>My App</h1>          {/* Does NOT re-render */}
      <p>Count: {count}</p>    {/* ONLY this re-renders */}
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

**Three steps React follows:**
1. **State changes** → React creates new Virtual DOM tree
2. **Diffing** → React compares new tree with previous tree
3. **Reconciliation** → React updates only the changed parts in Real DOM

Note:
- Key Point: Virtual DOM is NOT faster than Real DOM itself — it's the **smart diffing** that makes updates efficient. React only touches what changed. This is the core reason React exists.
- Why Interviewer Asks: One of the most asked React questions. Always explain the 3-step process: create → diff → reconcile.

---

**5. What is the difference between Functional Components and Class Components?**

Answer:
| Feature | Functional Component | Class Component |
|---------|---------------------|-----------------|
| Syntax | JavaScript function | ES6 class extending `React.Component` |
| State | `useState()` hook | `this.state` |
| Lifecycle | `useEffect()` hook | `componentDidMount()`, `componentDidUpdate()` etc |
| `this` keyword | NOT used | Used everywhere |
| Code length | Shorter, cleaner | More boilerplate |
| Performance | Slightly better (no `this` binding) | Slightly heavier |
| Status | **Current standard (2019+)** | **Deprecated (not removed but not recommended)** |

```jsx
// ✅ Functional Component (Modern — use this)
function Welcome({ name }) {
  const [count, setCount] = useState(0);
  return <h1>Hello {name}! Count: {count}</h1>;
}

// ❌ Class Component (Old — avoid in new code)
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  render() {
    return <h1>Hello {this.props.name}! Count: {this.state.count}</h1>;
  }
}
```

Note:
- Key Point: After React 16.8 (2019) introduced Hooks, functional components became the standard. Class components still work but are considered legacy. Always say "I use functional components with hooks" in interviews.
- Why Interviewer Asks: Tests if you know modern React. If you still say class components are preferred, that is a red flag to interviewers.

---

**6. What are Props? What is the difference between Props and State?**

Answer:
**Props (Properties)** are the way to pass data **from Parent → Child** component. Props are **read-only** (immutable) — the child cannot change them.

**State** is data managed **inside** a component that can change over time. When state changes, the component re-renders.

```jsx
// Props Example — Parent passes data to Child
function Parent() {
  return <Child name="Dev" age={23} />;
}

function Child({ name, age }) {      // destructuring props
  return <p>{name} is {age} years old</p>;
}

// State Example — data managed inside component
function Counter() {
  const [count, setCount] = useState(0);   // state

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

| Feature | Props | State |
|---------|-------|-------|
| Who controls it | **Parent** passes it | **Component itself** manages it |
| Mutable? | **No** (read-only in child) | **Yes** (via setState/useState) |
| Triggers re-render? | Yes (when parent re-renders) | Yes (when state changes) |
| Direction | Parent → Child (top-down) | Internal only |

Note:
- Key Point: Props = external data passed in (you cannot change them). State = internal data you manage and change. This is the most important distinction in React.
- Why Interviewer Asks: Always asked. Common trick: "Can a child modify its props?" → Answer: NO. Child can only call a function passed via props to tell parent to update its state.

---

**7. What is Prop Drilling? How do you solve it?**

Answer:
**Prop Drilling** is when you need to pass props through many levels of components just to get data from a grandparent to a deeply nested grandchild. The middle components don't need the data but must pass it along — this creates messy, hard-to-maintain code.

```jsx
// Prop Drilling Problem
function App() {
  const [user, setUser] = useState({ name: "Dev" });
  return <Parent user={user} />;       // Parent doesn't need user
}

function Parent({ user }) {
  return <Child user={user} />;        // Child doesn't need user
}

function Child({ user }) {
  return <GrandChild user={user} />;   // GrandChild doesn't need user
}

function GrandChild({ user }) {
  return <p>Hello {user.name}</p>;     // Only GrandChild needs it!
}

// ✅ Solution 1: Context API (built-in React)
const UserContext = React.createContext();

function App() {
  const [user] = useState({ name: "Dev" });
  return (
    <UserContext.Provider value={user}>
      <Parent />   {/* no prop passing needed */}
    </UserContext.Provider>
  );
}

function GrandChild() {
  const user = useContext(UserContext); // directly access
  return <p>Hello {user.name}</p>;
}

// ✅ Solution 2: Redux (for large apps with complex global state)
```

Note:
- Key Point: Prop drilling is a problem when props pass through 3+ levels of components that don't need them. Solutions: Context API (simple cases), Redux (complex global state).
- Why Interviewer Asks: Tests if you've faced real-world React problems. Always mention both Context API and Redux as solutions.

---

## Topic 2 : React Hooks

---

**8. What are React Hooks? Why were they introduced?**

Answer:
React Hooks are **special functions** that let you use React features (state, lifecycle, context) in **functional components** without writing class components. They were introduced in **React 16.8 (2019)**.

**Why Hooks were introduced:**
- Class components had confusing `this` keyword issues
- Sharing stateful logic between components was difficult (needed HOCs or render props — complex patterns)
- Complex components were hard to understand (lifecycle methods had unrelated logic mixed together)
- Hooks solved all these problems with simple functions

**Rules of Hooks (MUST follow):**
```jsx
// ❌ WRONG — Don't call hooks inside conditions
if (isLoggedIn) {
  useState(0);  // NEVER do this
}

// ❌ WRONG — Don't call hooks inside loops
for (let i = 0; i < 5; i++) {
  useEffect(() => {});  // NEVER do this
}

// ❌ WRONG — Don't call hooks inside regular JS functions
function helper() {
  useState(0);  // NEVER do this (not a React component or custom hook)
}

// ✅ CORRECT — Always call hooks at the TOP LEVEL of functional components
function MyComponent() {
  const [count, setCount] = useState(0);   // ✅ top level
  useEffect(() => {}, []);                  // ✅ top level
  return <div>{count}</div>;
}
```

**Why Rules exist:** React tracks hooks by their **call order**. If the order changes between renders (due to conditions/loops), React gets confused about which state belongs to which hook.

Note:
- Key Point: Hooks = functions starting with `use`. Two rules: (1) call at top level only, (2) call from React functions only (not regular JS functions). React 16.8+ only.
- Why Interviewer Asks: Very commonly asked. They may ask "What happens if you call a hook inside an if statement?" — Answer: React throws an error because hook order changes between renders.

---

**9. Explain useState() hook with example. How does it work internally?**

Answer:
`useState()` is the most basic React hook. It allows functional components to have **state** — data that when changed, causes the component to **re-render**.

```jsx
import { useState } from 'react';

function Counter() {
  // Syntax: const [currentValue, setterFunction] = useState(initialValue)
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Dev");
  const [user, setUser] = useState({ age: 23, city: "Ahmedabad" });

  return (
    <div>
      <p>Count: {count}</p>

      {/* Direct update */}
      <button onClick={() => setCount(count + 1)}>+1</button>

      {/* ✅ Functional update — use when new value depends on previous */}
      <button onClick={() => setCount(prev => prev + 1)}>+1 (Safe)</button>

      {/* Updating object state — always spread previous state */}
      <button onClick={() => setUser(prev => ({ ...prev, age: prev.age + 1 }))}>
        Birthday
      </button>
    </div>
  );
}
```

**When to use functional update form (`prev =>`):**
```jsx
// ❌ Problem: count may be stale in async operations
setTimeout(() => {
  setCount(count + 1);  // count might be outdated (stale closure)
}, 1000);

// ✅ Solution: always gets latest value
setTimeout(() => {
  setCount(prev => prev + 1);  // always correct
}, 1000);
```

**Updating Arrays with useState:**
```jsx
const [items, setItems] = useState([1, 2, 3]);

// Add item
setItems(prev => [...prev, 4]);

// Remove item
setItems(prev => prev.filter(item => item !== 2));

// Update item
setItems(prev => prev.map(item => item === 2 ? 20 : item));
```

Note:
- Key Point: useState returns `[value, setter]`. Never mutate state directly — always use the setter. For objects/arrays, always create a new copy (spread operator). Use functional form `prev =>` when new state depends on previous state.
- Why Interviewer Asks: Most asked hook question. They may ask about stale closures or why `setCount(count + 1)` twice in a row doesn't increase by 2 (answer: batching + stale closure).

---

**10. What is a Stale Closure in useState? (Tricky)**

Answer:
A **stale closure** happens when a function inside a component "remembers" an **old value** of state because it captured the value at the time it was created, not the current value.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ STALE CLOSURE PROBLEM
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(count);        // Always logs 0! Never updates
      setCount(count + 1);       // Always sets to 1 (0 + 1)
    }, 1000);

    return () => clearInterval(interval);
  }, []);  // [] means effect runs once — count is always 0 here


  // ✅ SOLUTION: Use functional update
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);  // Always gets the latest count
    }, 1000);

    return () => clearInterval(interval);
  }, []);  // Now it's fine because we don't read count directly

  return <p>Count: {count}</p>;
}
```

Note:
- Key Point: Stale closure = function remembers OLD state value. Fix: use functional update `prev =>` OR add the variable to the dependency array of useEffect. This is a very common real-world bug.
- Why Interviewer Asks: Tests deep understanding of closures + hooks. If you know stale closure, you clearly understand how React works behind the scenes.

---

**11. Explain useEffect() hook. What are its different usages?**

Answer:
`useEffect()` is used to perform **side effects** in functional components — things that happen "outside" of rendering like API calls, setting up timers, event listeners, subscriptions, or updating the document title.

**Syntax:**
```jsx
useEffect(() => {
  // side effect code here

  return () => {
    // cleanup function (optional) — runs before component unmounts
    // or before effect runs again
  };
}, [dependencies]); // dependency array — controls when effect runs
```

**Three different usages based on dependency array:**

```jsx
import { useState, useEffect } from 'react';

function Examples() {
  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState(1);

  // 1. Runs after EVERY render (no dependency array)
  useEffect(() => {
    console.log("Runs after every render");
    document.title = `Count: ${count}`;
  });

  // 2. Runs ONCE after first render (empty array = like componentDidMount)
  useEffect(() => {
    console.log("Runs only on mount");
    fetch("/api/init").then(res => res.json());
  }, []);

  // 3. Runs when specific values change (like componentDidUpdate)
  useEffect(() => {
    console.log("userId changed:", userId);
    fetch(`/api/user/${userId}`).then(res => res.json());
  }, [userId]);   // only runs when userId changes

  // Cleanup example — event listeners
  useEffect(() => {
    const handleResize = () => console.log(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize); // cleanup
    };
  }, []);

  return <div>{count}</div>;
}
```

**Lifecycle equivalent:**
```
useEffect(() => {}, [])                → componentDidMount (runs once)
useEffect(() => {}, [value])           → componentDidUpdate (runs on change)
useEffect(() => { return () => {} })   → componentWillUnmount (cleanup)
```

Note:
- Key Point: Dependency array controls WHEN effect runs. Empty `[]` = once on mount. `[value]` = on value change. No array = every render. Cleanup function = prevents memory leaks.
- Why Interviewer Asks: Second most asked hook after useState. They will ask all 3 usages. Also common: "How do you fetch data in React?" — answer uses useEffect.

---

**12. What is the Cleanup function in useEffect? Why is it important?**

Answer:
The cleanup function is the function you **return** from useEffect. React calls this cleanup before the component **unmounts** OR before the effect **runs again** (when dependencies change). Without cleanup, you can create **memory leaks**.

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // START: set up a timer
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // CLEANUP: clear the timer when component unmounts
    return () => {
      clearInterval(interval);   // without this, timer runs forever!
      console.log("Timer cleaned up");
    };
  }, []);

  return <p>Seconds: {seconds}</p>;
}

// Real Example — API call with cleanup
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isCancelled = false;  // flag to prevent state update after unmount

    fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!isCancelled) {   // only update if still mounted
          setUser(data);
        }
      });

    return () => {
      isCancelled = true;   // cleanup: mark as cancelled
    };
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

**What happens WITHOUT cleanup:**
- Timers keep running after component is removed → memory leak
- Event listeners stack up → multiple handlers fire
- API calls update state on unmounted component → React warning

Note:
- Key Point: Return a function from useEffect for cleanup. It prevents memory leaks. Common cleanup cases: clearInterval/clearTimeout, removeEventListener, abort API calls, unsubscribe from sockets.
- Why Interviewer Asks: Tests if you write production-quality React. Memory leaks are a real problem. Knowing cleanup shows you think about what happens after a component is removed.

---

**13. What is useRef()? What are its two main use cases?**

Answer:
`useRef()` returns a **mutable object** `{ current: value }` that **persists across re-renders** but does NOT trigger a re-render when changed. This is what makes it different from useState.

**Use Case 1 — Access DOM elements directly:**
```jsx
import { useRef, useEffect } from 'react';

function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();   // directly access the DOM element
  }, []);

  return <input ref={inputRef} type="text" placeholder="Auto-focused" />;
}

// Another example — scroll to element
function ScrollDemo() {
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <button onClick={scrollToBottom}>Scroll to Bottom</button>
      <div ref={bottomRef}>Bottom of page</div>
    </div>
  );
}
```

**Use Case 2 — Store mutable values that don't need re-render:**
```jsx
function RenderCount() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);  // does NOT cause re-render when changed

  renderCount.current += 1;  // update without re-rendering

  return (
    <div>
      <p>Count: {count}</p>
      <p>This component rendered {renderCount.current} times</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

| Feature | useState | useRef |
|---------|----------|--------|
| Triggers re-render | ✅ Yes | ❌ No |
| Persists across renders | ✅ Yes | ✅ Yes |
| Access DOM | ❌ No | ✅ Yes |

Note:
- Key Point: useRef has two uses — (1) DOM access via `ref={myRef}` then `myRef.current.focus()`, (2) store values that change but don't need to trigger re-render. Key insight: changing `.current` does NOT re-render the component.
- Why Interviewer Asks: Tests depth of React knowledge. Common question: "What's the difference between useRef and useState?" Focus on the re-render difference.

---

**14. What is useMemo()? When should you use it?**

Answer:
`useMemo()` is a performance optimization hook that **memoizes (caches) the result of an expensive calculation**. It only recalculates the value when one of its dependencies changes.

```jsx
import { useState, useMemo } from 'react';

function ExpensiveList({ items, filter }) {
  const [count, setCount] = useState(0);

  // ❌ Without useMemo — runs on EVERY render (even when count changes)
  const filteredItems = items.filter(item => item.includes(filter));

  // ✅ With useMemo — only recalculates when items or filter changes
  const filteredItems = useMemo(() => {
    console.log("Expensive filtering running...");
    return items.filter(item => item.includes(filter));
  }, [items, filter]);  // dependencies

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment (won't recalculate filter)</button>
      <ul>
        {filteredItems.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
```

**When to USE useMemo:**
- Expensive calculations (sorting large arrays, complex filtering, heavy math)
- When the calculation is inside a component that re-renders often
- When the value is passed to a child that uses `React.memo`

**When NOT to use useMemo:**
- For simple calculations (`const total = a + b` — no need)
- When the component rarely re-renders
- Overusing useMemo adds overhead (React still tracks dependencies)

Note:
- Key Point: useMemo = cache a **VALUE**. Formula: `useMemo(() => expensiveCalculation(), [deps])`. Only use when calculation is genuinely expensive. Premature optimization with useMemo can actually slow things down due to overhead.
- Why Interviewer Asks: Very common hook question. They always ask: "What's the difference between useMemo and useCallback?" — useMemo caches a VALUE, useCallback caches a FUNCTION.

---

**15. What is useCallback()? How is it different from useMemo()?**

Answer:
`useCallback()` memoizes a **function** itself (not the return value). It returns the **same function instance** between renders unless dependencies change. This prevents child components from re-rendering unnecessarily when they receive functions as props.

```jsx
import { useState, useCallback, memo } from 'react';

// Child component — wrapped in React.memo to prevent unnecessary re-renders
const Button = memo(({ onClick, label }) => {
  console.log(`${label} button rendered`);
  return <button onClick={onClick}>{label}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Dev");

  // ❌ Without useCallback — new function created every render
  // Button re-renders even when only name changes
  const handleIncrement = () => setCount(c => c + 1);

  // ✅ With useCallback — same function reference between renders
  // Button only re-renders when the function's dependencies change
  const handleIncrement = useCallback(() => {
    setCount(c => c + 1);
  }, []);  // empty array — function never changes

  return (
    <div>
      <p>Count: {count}, Name: {name}</p>
      <input value={name} onChange={e => setName(e.target.value)} />
      <Button onClick={handleIncrement} label="Increment" />
    </div>
  );
}
```

**useMemo vs useCallback:**
```jsx
// useMemo — memoizes the RETURN VALUE (result)
const expensiveValue = useMemo(() => compute(a, b), [a, b]);

// useCallback — memoizes the FUNCTION ITSELF
const stableFunction = useCallback(() => doSomething(a, b), [a, b]);

// They are equivalent internally:
// useCallback(fn, deps) === useMemo(() => fn, deps)
```

Note:
- Key Point: useCallback caches a **FUNCTION**. useMemo caches a **VALUE**. useCallback is useful when passing functions to child components wrapped in `React.memo`. Without useCallback, a new function reference is created every render, causing the child to re-render.
- Why Interviewer Asks: The useMemo vs useCallback distinction is one of the most asked performance questions. Interviewers also ask: "Does useCallback prevent re-renders by itself?" — Answer: NO, it only ensures function reference stability. You also need `React.memo` on the child.

---

**16. What is useContext()? How do you use it?**

Answer:
`useContext()` allows you to **consume context values** without prop drilling. Context provides a way to share data globally across the component tree.

```jsx
import { createContext, useContext, useState } from 'react';

// Step 1: Create Context
const ThemeContext = createContext("light");  // "light" is default value
const UserContext = createContext(null);

// Step 2: Provide Context — wrap components that need access
function App() {
  const [theme, setTheme] = useState("light");
  const [user] = useState({ name: "Dev", role: "developer" });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={user}>
        <Navbar />
        <Main />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// Step 3: Consume Context — anywhere in the tree (no prop drilling!)
function Navbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  const user = useContext(UserContext);

  return (
    <nav className={theme}>
      <span>Welcome, {user.name}</span>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
    </nav>
  );
}

function Main() {
  const { theme } = useContext(ThemeContext);
  return <main className={theme}>Main Content</main>;
}
```

**Context vs Redux:**
| Feature | Context API | Redux |
|---------|-------------|-------|
| Best for | Simple global state (theme, auth, language) | Complex state with many actions |
| Performance | Can cause unnecessary re-renders | Optimized with useSelector |
| DevTools | No dedicated devtools | Redux DevTools (time-travel debugging) |
| Setup | Simple, built-in | Requires installation |

Note:
- Key Point: Context solves prop drilling. Three steps: createContext → Provider (value) → useContext (consume). Context is NOT a replacement for Redux in large apps — context re-renders all consumers when value changes, Redux is more optimized.
- Why Interviewer Asks: Tests knowledge of built-in React state solutions vs Redux. They'll ask: "When would you use Context vs Redux?" Answer based on scale and complexity.

---

**17. What is useReducer()? How is it different from useState?**

Answer:
`useReducer()` is an alternative to `useState` for managing **complex state logic**. It works like Redux — you dispatch an action, and a **pure reducer function** decides how the state should change.

```jsx
import { useReducer } from 'react';

// Initial state
const initialState = { count: 0, step: 1 };

// Reducer function — pure function, takes state + action, returns new state
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "decrement":
      return { ...state, count: state.count - state.step };
    case "reset":
      return initialState;
    case "setStep":
      return { ...state, step: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}, Step: {state.step}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: "setStep", payload: Number(e.target.value) })}
      />
    </div>
  );
}
```

| Feature | useState | useReducer |
|---------|----------|------------|
| Best for | Simple state (1-2 values) | Complex state (multiple related values) |
| Update logic | Inline in component | Centralized in reducer function |
| Testability | Harder | Easy (pure function) |
| Resembles | Simple variable | Redux pattern |

Note:
- Key Point: useReducer = useState + Redux pattern. Use it when state has multiple sub-values, or when next state depends on previous state in complex ways. The reducer MUST be a pure function — no side effects, same input = same output.
- Why Interviewer Asks: Tests if you understand Redux concepts. Interviewer may ask: "When would you use useReducer over useState?" Answer: when state logic is complex and you want to centralize it in a reducer.

---

**18. What is a Custom Hook? Why and how do you create one?**

Answer:
A **Custom Hook** is a **JavaScript function whose name starts with `use`** that calls other hooks inside it. It lets you extract and reuse stateful logic across multiple components without code duplication.

```jsx
// ✅ Custom Hook — useFetch (reusable data fetching logic)
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then(data => {
        if (!isCancelled) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!isCancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { isCancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage — reuse in multiple components
function Users() {
  const { data: users, loading, error } = useFetch("/api/users");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

function Posts() {
  const { data: posts, loading } = useFetch("/api/posts");
  if (loading) return <p>Loading...</p>;
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

**Rules for Custom Hooks:**
- Name MUST start with `use` (e.g., `useFetch`, `useDebounce`, `useLocalStorage`)
- Can call other hooks inside (useState, useEffect, etc.)
- Does NOT return JSX — returns values/functions

Note:
- Key Point: Custom hooks = extract reusable logic. If you copy-paste the same useState + useEffect pattern in 2+ components, make a custom hook. Common examples: useFetch, useLocalStorage, useDebounce, useWindowSize.
- Why Interviewer Asks: Custom hooks show you can write clean, DRY, professional React code. They may ask you to write one on the spot — know useFetch or useDebounce from memory.

---

**19. What is React.memo()? How does it help performance?**

Answer:
`React.memo()` is a **Higher-Order Component (HOC)** that wraps a functional component to prevent unnecessary re-renders. It works like `shouldComponentUpdate` in class components — it **skips re-rendering** if the component's props haven't changed.

```jsx
import { memo, useState } from 'react';

// Without React.memo — re-renders every time Parent re-renders
function ChildExpensive({ name }) {
  console.log("Child rendered!"); // logs every time
  return <div>Name: {name}</div>;
}

// ✅ With React.memo — only re-renders if 'name' prop changes
const ChildExpensive = memo(function ChildExpensive({ name }) {
  console.log("Child rendered!"); // logs ONLY when name changes
  return <div>Name: {name}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <ChildExpensive name="Dev" />  {/* Won't re-render when count changes */}
    </div>
  );
}
```

**React.memo + useCallback together:**
```jsx
// If you pass functions as props, combine with useCallback
const Child = memo(({ onClick }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // Without useCallback: new function = Child re-renders despite memo
  // With useCallback: same function reference = Child skips re-render
  const handleClick = useCallback(() => {
    console.log("Clicked!");
  }, []);  // stable function

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Parent Count: {count}</button>
      <Child onClick={handleClick} />
    </>
  );
}
```

Note:
- Key Point: `React.memo` = PureComponent for functional components. It does **shallow comparison** of props. For function props, combine with `useCallback`. For object props, combine with `useMemo`.
- Why Interviewer Asks: Tests performance optimization knowledge. Key insight: React.memo alone isn't enough if you pass new function/object references every render — that's why you need useCallback/useMemo alongside it.

---

## Topic 3 : Component Lifecycle & Rendering

---

**20. What is the Component Lifecycle in React?**

Answer:
Every React component goes through three lifecycle phases — **Mounting** (born), **Updating** (changes), and **Unmounting** (removed from DOM).

**In Functional Components (using Hooks):**
```jsx
import { useState, useEffect } from 'react';

function LifecycleDemo() {
  const [count, setCount] = useState(0);

  // MOUNTING — runs once when component first appears
  useEffect(() => {
    console.log("Component Mounted!");
    document.title = "App Started";
  }, []);  // empty array = mount only

  // UPDATING — runs when count changes
  useEffect(() => {
    console.log("Count Updated to:", count);
  }, [count]);

  // UNMOUNTING — return cleanup function
  useEffect(() => {
    const subscription = someAPI.subscribe();

    return () => {
      console.log("Component Unmounted! Cleaning up...");
      subscription.unsubscribe();   // cleanup
    };
  }, []);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**Class Component Lifecycle (for reference/comparison):**
```
Mounting:   constructor() → render() → componentDidMount()
Updating:   render() → componentDidUpdate(prevProps, prevState)
Unmounting: componentWillUnmount()
```

**Hooks equivalent:**
```
componentDidMount    = useEffect(() => {}, [])
componentDidUpdate   = useEffect(() => {}, [dependency])
componentWillUnmount = useEffect(() => { return () => cleanup() }, [])
```

Note:
- Key Point: In functional components, ALL lifecycle is controlled through useEffect. The dependency array is the key — it determines which lifecycle phase runs.
- Why Interviewer Asks: Lifecycle is a core concept. Even if you use functional components, they'll ask class lifecycle to test fundamentals. Always map class methods to their hook equivalents.

---

**21. What triggers a re-render in React?**

Answer:
A React component re-renders when:
1. **Its own state changes** (via useState or useReducer)
2. **Its props change** (parent re-renders with new data)
3. **Its parent re-renders** (even if props didn't change — this is the default behavior)
4. **Context value changes** (if component uses useContext)
5. **Force update** (using forceUpdate in class components)

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <Child />  {/* ← re-renders every time Parent re-renders, even though
                      Child has no props and no state! */}
    </div>
  );
}

function Child() {
  console.log("Child rendered!"); // logs every time Parent re-renders
  return <p>I am Child</p>;
}

// ✅ Fix: wrap Child in React.memo to skip re-render when no props change
const Child = memo(() => {
  console.log("Child rendered!"); // only logs on mount now
  return <p>I am Child</p>;
});
```

Note:
- Key Point: By default, when a parent re-renders, ALL children re-render too — even if their props didn't change. This is the default React behavior. Use `React.memo` to optimize this.
- Why Interviewer Asks: Tests if you understand React's rendering behavior. Many developers don't know that children re-render even without prop changes. This is foundational for performance optimization.

---

**22. What is Reconciliation? What is React Fiber?**

Answer:
**Reconciliation** is the process React uses to update the DOM efficiently. When state changes, React creates a new Virtual DOM tree and **compares (diffs) it** with the previous tree to find the minimum set of changes needed.

**React's Diffing Rules:**
```
1. If root element TYPE changes (div → span) → tear down old tree, build new
2. If root element TYPE is same → only update changed attributes
3. For lists → use the KEY prop to match old vs new items
```

```jsx
// Keys help React identify which list items changed
// ❌ Without keys — React can't tell which item changed, re-renders all
{items.map(item => <li>{item.name}</li>)}

// ✅ With keys — React knows exactly which item changed
{items.map(item => <li key={item.id}>{item.name}</li>)}

// ❌ Never use index as key when list items can be reordered
{items.map((item, index) => <li key={index}>{item.name}</li>)} // bad!
```

**React Fiber (React 16+):**
React Fiber is the **reimplementation of the reconciliation algorithm** introduced in React 16. It improves the old algorithm by enabling:

- **Incremental Rendering** — splits work into small "fiber" units, can pause/resume
- **Priority Scheduling** — urgent updates (user clicks) get priority over less urgent (data fetching)
- **Concurrency** — React can work on multiple state updates at once
- **Better Error Boundaries** — catches errors in component tree

```
Old Reconciliation: One big sync update — blocks the main thread
React Fiber:        Break work into chunks — browser stays responsive
```

Note:
- Key Point: Reconciliation = how React updates the DOM efficiently using Virtual DOM diffing. React Fiber = the improved algorithm that allows React to pause, resume, and prioritize rendering work. Always use `key` prop for lists.
- Why Interviewer Asks: Tests your deep React internals knowledge. If you can explain Fiber, you stand out from entry-level candidates.

---

## Topic 4 : React Router

---

**23. What is React Router? Why do we need it?**

Answer:
**React Router** is a library for handling **client-side routing** in React apps. Without it, every URL change would reload the page from the server (traditional multi-page apps). React Router lets you navigate between different "pages" (components) **without a full page reload** — creating a **Single Page Application (SPA)**.

```bash
# Install React Router v6
npm install react-router-dom
```

```jsx
// Basic Setup (React Router v6)
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />  {/* 404 catch-all */}
      </Routes>
    </BrowserRouter>
  );
}
```

Note:
- Key Point: React is a SPA library — React Router enables navigation WITHOUT page reloads. Key components: `BrowserRouter` (wraps app), `Routes` (container), `Route` (defines path → component), `Link` (navigation).
- Why Interviewer Asks: Routing is used in every React project. They'll ask the difference between v5 and v6 (`Switch` → `Routes`, `component` prop → `element` prop, `useHistory` → `useNavigate`).

---

**24. What is the difference between Link, NavLink, and `<a>` tag?**

Answer:
| Component | What it does | Use case |
|-----------|-------------|----------|
| `<a href>` | Standard HTML — **full page reload** | External links outside app |
| `<Link>` | React Router — **no page reload**, client-side navigation | Internal navigation |
| `<NavLink>` | Like Link + **auto applies active class** when URL matches | Navigation menus/tabs |

```jsx
import { Link, NavLink } from 'react-router-dom';

// Link — basic navigation, no active styling
function Footer() {
  return (
    <footer>
      <Link to="/privacy">Privacy Policy</Link>
      <Link to="/terms">Terms of Service</Link>
      <a href="https://google.com" target="_blank">Google</a>  {/* external */}
    </footer>
  );
}

// NavLink — adds active class automatically when route matches
function Navbar() {
  return (
    <nav>
      {/* className receives { isActive } — you control the styling */}
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
      >
        Home
      </NavLink>

      <NavLink
        to="/about"
        style={({ isActive }) => ({
          color: isActive ? "blue" : "black",
          fontWeight: isActive ? "bold" : "normal"
        })}
      >
        About
      </NavLink>
    </nav>
  );
}
```

Note:
- Key Point: Never use `<a>` for internal navigation — it causes full page reload (destroys React state). Use `<Link>` for simple navigation. Use `<NavLink>` when you need to highlight the active route (navbar).
- Why Interviewer Asks: Common question. The key difference most candidates miss: using `<a>` inside React destroys the SPA and reloads everything. Always use `<Link>` or `<NavLink>` for internal routes.

---

**25. What is useNavigate()? What is the difference between useNavigate and Link?**

Answer:
`useNavigate()` is a hook for **programmatic navigation** — when you need to navigate based on logic (after form submission, login success, button click with conditions) rather than just clicking a link.

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await loginAPI(credentials);

    if (response.success) {
      navigate("/dashboard");         // ✅ go to dashboard after login
    } else {
      navigate("/login?error=true");  // go back with error query param
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// Navigate options
function Examples() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Go forward */}
      <button onClick={() => navigate("/profile")}>Go to Profile</button>

      {/* Go back (like browser back button) */}
      <button onClick={() => navigate(-1)}>Go Back</button>

      {/* Go forward in history */}
      <button onClick={() => navigate(1)}>Go Forward</button>

      {/* Replace history (can't go back) — good for login redirects */}
      <button onClick={() => navigate("/home", { replace: true })}>
        Home (no back)
      </button>
    </div>
  );
}
```

| Feature | `<Link>` | `useNavigate` |
|---------|----------|---------------|
| How triggered | User clicks | Code logic |
| Use case | Static navigation links | After API call, conditions, form submit |
| `replace` | `<Link to="/" replace>` | `navigate("/", { replace: true })` |

Note:
- Key Point: `useNavigate` = navigate via code logic. `Link` = navigate via user click. Use `navigate(-1)` for back button. Use `{ replace: true }` when you don't want the user to go back (after logout, login redirect).
- Why Interviewer Asks: Tests practical React Router knowledge. Common scenario: "How do you redirect after a successful login?" — answer uses useNavigate.

---

**26. What are Dynamic Routes and useParams()?**

Answer:
Dynamic routes have **URL parameters** that change based on data (e.g., `/user/123`, `/product/abc`). `useParams()` lets you access those URL parameters inside the component.

```jsx
import { Routes, Route, useParams, Link } from 'react-router-dom';

// Route setup with dynamic parameter (:id)
function App() {
  return (
    <Routes>
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:userId" element={<UserDetail />} />
      <Route path="/products/:category/:productId" element={<Product />} />
    </Routes>
  );
}

// UserDetail — access the :userId from URL
function UserDetail() {
  const { userId } = useParams();   // { userId: "123" } if URL is /users/123

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  if (!user) return <p>Loading...</p>;
  return <h1>User: {user.name}</h1>;
}

// UserList — navigate to detail page
function UserList() {
  const users = [{ id: 1, name: "Dev" }, { id: 2, name: "Jigo" }];

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
}
```

Note:
- Key Point: Dynamic routes use `:paramName` in the path. `useParams()` returns an object with those params as strings. Use it to fetch specific data based on the URL (like a user profile page).
- Why Interviewer Asks: Dynamic routing is used in nearly every real app. They'll ask: "How do you build a product detail page?" — answer uses dynamic routes + useParams.

---

**27. What is a Protected Route? How do you implement it?**

Answer:
A **Protected Route** prevents unauthenticated users from accessing certain pages. If not logged in, the user is redirected to the login page.

```jsx
import { Navigate, Outlet } from 'react-router-dom';

// Method 1: ProtectedRoute component using Outlet (Recommended in v6)
function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("token"); // check auth

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;  // redirect to login
  }

  return <Outlet />;   // render the protected child routes
}

// Setup in App
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes — all wrapped in ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
```

Note:
- Key Point: ProtectedRoute checks authentication and either renders `<Outlet />` (children) or redirects with `<Navigate to="/login" replace />`. Use `replace` so users can't press back to get to the protected page.
- Why Interviewer Asks: Protected routes are in every real production app with authentication. This shows you can build real-world features, not just tutorial projects.

---

## Topic 5 : Axios & API Calls in React

---

**28. How do you make API calls in React? What is Axios?**

Answer:
You can make API calls in React using two approaches:
1. **Fetch API** — built-in browser API, no installation needed
2. **Axios** — popular third-party library with more features

```bash
npm install axios
```

```jsx
import axios from 'axios';
import { useState, useEffect } from 'react';

// Using Fetch (built-in)
function UsersWithFetch() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())   // fetch needs manual JSON parsing
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Using Axios (recommended)
function UsersWithAxios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then(response => {
        setUsers(response.data);  // axios auto-parses JSON
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**Fetch vs Axios:**
| Feature | Fetch | Axios |
|---------|-------|-------|
| Installation | Built-in (no install) | `npm install axios` |
| JSON parsing | Manual (`.then(res => res.json())`) | Automatic |
| Error handling | Only network errors (4xx/5xx NOT auto-rejected) | 4xx/5xx automatically go to catch |
| Request cancellation | AbortController | CancelToken or AbortController |
| Interceptors | No built-in | ✅ Built-in interceptors |
| Default base URL | No | ✅ Can set with `axios.create()` |

Note:
- Key Point: Axios is preferred in production because: (1) auto JSON parsing, (2) 4xx/5xx errors automatically go to catch (Fetch doesn't), (3) interceptors for auth tokens, (4) better timeout handling.
- Why Interviewer Asks: API calls are in every React app. They'll ask why you prefer Axios over Fetch. The 4xx/5xx error handling difference is the most important point.

---

**29. How do you create an Axios instance? What are Interceptors?**

Answer:
An **Axios instance** lets you set a **base URL and default headers** once, so you don't repeat them in every request. **Interceptors** are functions that run before every request (modify it) or after every response (handle errors globally).

```jsx
// api.js — Create a reusable Axios instance
import axios from 'axios';

const api = axios.create({
  baseURL: "https://api.myapp.com",   // base URL — all requests prefix with this
  timeout: 5000,                        // cancel request if >5 seconds
  headers: {
    "Content-Type": "application/json"
  }
});

// REQUEST Interceptor — runs before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // add auth token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE Interceptor — runs after every response
api.interceptors.response.use(
  (response) => response,   // success: just pass through
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";   // redirect to login on unauthorized
    }
    if (error.response?.status === 500) {
      alert("Server error! Please try again.");
    }
    return Promise.reject(error);
  }
);

export default api;

// usage in any component
import api from './api';

function Products() {
  useEffect(() => {
    api.get("/products")        // → GET https://api.myapp.com/products
      .then(res => setProducts(res.data));
  }, []);
}
```

Note:
- Key Point: Axios instance = configure once, use everywhere (base URL + headers). Interceptors = middleware for HTTP — add auth tokens in request interceptor, handle 401/500 errors globally in response interceptor.
- Why Interviewer Asks: Shows professional API integration knowledge. If you mention interceptors for auth token injection, it immediately shows real-world experience.

---

**30. How do you handle all HTTP methods in Axios (GET, POST, PUT, PATCH, DELETE)?**

Answer:

```jsx
import api from './api';  // our axios instance

// GET — fetch data
const getUsers = async () => {
  try {
    const response = await api.get("/users", {
      params: { page: 1, limit: 10 }  // → /users?page=1&limit=10
    });
    return response.data;
  } catch (error) {
    console.error("GET error:", error.response?.data);
  }
};

// POST — create new data
const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);  // userData = body
    return response.data;
  } catch (error) {
    console.error("POST error:", error.response?.data);
  }
};

// PUT — replace entire resource
const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("PUT error:", error.response?.data);
  }
};

// PATCH — update specific fields only
const updateUserName = async (userId, name) => {
  try {
    const response = await api.patch(`/users/${userId}`, { name });
    return response.data;
  } catch (error) {
    console.error("PATCH error:", error.response?.data);
  }
};

// DELETE — remove resource
const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("DELETE error:", error.response?.data);
  }
};
```

**Error handling structure:**
```jsx
try {
  const res = await api.get("/users");
  console.log(res.data);
} catch (error) {
  if (error.response) {
    // Server responded with error status (4xx, 5xx)
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);
  } else if (error.request) {
    // Request made but no response received (network down)
    console.log("No response:", error.request);
  } else {
    // Something else (request setup error)
    console.log("Error:", error.message);
  }
}
```

Note:
- Key Point: GET=read, POST=create, PUT=replace all, PATCH=update part, DELETE=remove. Always use try/catch with async/await. `error.response` = server error, `error.request` = no response (network issue), `error.message` = setup error.
- Why Interviewer Asks: Practical question every MERN developer must know. They may ask PUT vs PATCH — PUT replaces the entire resource, PATCH updates only the fields you send.

---

## Topic 6 : Redux Toolkit

---

**31. What is Redux? Why do we need it?**

Answer:
**Redux** is a **state management library** that provides a **single global store** for your entire application's state. It solves the problem of sharing state between many components across different parts of the app.

**Problem Redux solves:**
```
Without Redux: Component A (top) needs to share data with Component Z (deep)
→ Prop drilling through 10+ components = nightmare

With Redux: All state in ONE store → any component can access any state directly
```

**Redux Core Concepts:**
1. **Store** — single object that holds the entire application state
2. **Action** — plain object describing WHAT happened `{ type: "INCREMENT", payload: 5 }`
3. **Reducer** — pure function that takes state + action → returns new state
4. **Dispatch** — function that sends an action to the store
5. **Selector** — function that reads specific state from store

```
UI Event → dispatch(action) → Reducer(state, action) → new State → UI updates
```

Note:
- Key Point: Redux = predictable state container. One store, one source of truth. Data flows in ONE direction: action → reducer → state → UI. Don't put ALL state in Redux — only state shared across many components.
- Why Interviewer Asks: Redux is used in most mid-to-large React projects. They'll ask: "When would you use Redux vs Context?" — Use Redux when state is complex, shared across many components, and needs DevTools/time-travel debugging.

---

**32. What is Redux Toolkit (RTK)? Why is it recommended over plain Redux?**

Answer:
**Redux Toolkit (RTK)** is the **official, recommended way to write Redux code**. It was created by the Redux team to solve the problems of plain Redux — too much boilerplate code, complex setup, and confusing patterns.

```bash
npm install @reduxjs/toolkit react-redux
```

**Plain Redux vs Redux Toolkit:**

```jsx
// ❌ Plain Redux — too much boilerplate
// actions.js
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// reducer.js
const initialState = { value: 0 };
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT: return { ...state, value: state.value + 1 };
    case DECREMENT: return { ...state, value: state.value - 1 };
    default: return state;
  }
}

// store.js
import { createStore } from 'redux';
const store = createStore(counterReducer);


// ✅ Redux Toolkit — same result, much less code
// counterSlice.js
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1; },   // looks like mutation — but RTK uses Immer under the hood
    decrement: state => { state.value -= 1; },
  }
});

const store = configureStore({
  reducer: { counter: counterSlice.reducer }
});
```

**RTK key advantages:**
- `createSlice` — auto-generates action creators and action types
- Uses **Immer** internally — you can write "mutating" code that safely creates new state
- `configureStore` — sets up Redux DevTools and redux-thunk automatically
- `createAsyncThunk` — easy async operations

Note:
- Key Point: RTK is the standard. Interviewers expect you to know RTK, not plain Redux. Key RTK functions: `createSlice`, `configureStore`, `createAsyncThunk`. Immer allows "mutating" syntax in reducers while maintaining immutability.
- Why Interviewer Asks: Most companies use RTK. Knowing plain Redux is a bonus but knowing RTK is a must for 2024+ interviews.

---

**33. Explain the Redux Toolkit flow: Store → Slice → Component**

Answer:
The complete RTK data flow in a React app:

```
Component dispatches action → Slice reducer handles it → Store state updates → Component re-renders with new data
```

```jsx
// STEP 1: Create a Slice (counterSlice.js)
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',                    // slice name — used in action type prefix
  initialState: {
    value: 0,
    name: "Dev"
  },
  reducers: {
    increment: (state) => {
      state.value += 1;               // Immer makes this safe (not direct mutation)
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;  // payload = data dispatched with action
    },
    setName: (state, action) => {
      state.name = action.payload;
    }
  }
});

// Auto-generated action creators
export const { increment, decrement, incrementByAmount, setName } = counterSlice.actions;
// Auto-generated action types: "counter/increment", "counter/decrement", etc.

export default counterSlice.reducer;


// STEP 2: Configure Store (store.js)
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,   // state.counter
    user: userReducer,         // state.user
  }
  // DevTools and redux-thunk middleware added automatically by RTK
});

export default store;


// STEP 3: Provide Store to React (main.jsx or index.js)
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);


// STEP 4: Use in Components (Counter.jsx)
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './counterSlice';

function Counter() {
  // useSelector — READ state from store
  const count = useSelector(state => state.counter.value);
  const name = useSelector(state => state.counter.name);

  // useDispatch — WRITE (send actions) to store
  const dispatch = useDispatch();

  return (
    <div>
      <h2>{name}: {count}</h2>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(10))}>+10</button>
    </div>
  );
}
```

Note:
- Key Point: Full RTK flow = createSlice (define state + reducers) → configureStore (combine slices) → Provider (give access to app) → useSelector (read) + useDispatch (write). This is the most important Redux pattern to know end-to-end.
- Why Interviewer Asks: They want to see if you can explain the complete Redux architecture. Being able to draw this flow on paper or explain it step-by-step separates good candidates from great ones.

---

**34. What is useSelector()? What is useDispatch()?**

Answer:
`useSelector` and `useDispatch` are the two React-Redux hooks that connect your React components to the Redux store.

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, updateUser } from './slices';

function Profile() {
  // useSelector — READ specific data from Redux store
  // Re-renders component ONLY when the selected value changes
  const user = useSelector(state => state.user);
  const count = useSelector(state => state.counter.value);

  // ✅ Better — select only what you need (prevents unnecessary re-renders)
  const userName = useSelector(state => state.user.name);
  const userEmail = useSelector(state => state.user.email);

  // useDispatch — get the dispatch function to SEND actions
  const dispatch = useDispatch();

  const handleNameChange = () => {
    // dispatch action with payload
    dispatch(updateUser({ name: "New Name" }));
  };

  return (
    <div>
      <p>Name: {userName}</p>
      <p>Email: {userEmail}</p>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={handleNameChange}>Update Name</button>
    </div>
  );
}
```

**useSelector performance tip:**
```jsx
// ❌ Selecting entire state — re-renders on ANY state change
const allState = useSelector(state => state);

// ✅ Select only what you need — re-renders only when that value changes
const count = useSelector(state => state.counter.value);

// ✅ For derived data — use multiple selectors
const firstName = useSelector(state => state.user.firstName);
const lastName = useSelector(state => state.user.lastName);
```

Note:
- Key Point: useSelector = read from store (causes re-render when selected value changes). useDispatch = write to store (send actions). Always select the minimum data you need to avoid unnecessary re-renders.
- Why Interviewer Asks: These are the two hooks used in every Redux component. They'll ask the difference between useSelector and `connect()` — hooks are simpler and the modern approach; `connect()` is the older HOC pattern.

---

**35. What is createAsyncThunk? How do you handle async operations in Redux?**

Answer:
`createAsyncThunk` is a Redux Toolkit utility for handling **async operations** (like API calls) in Redux. It automatically dispatches `pending`, `fulfilled`, and `rejected` actions based on the promise state.

```jsx
// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// createAsyncThunk — async action creator
// First arg: action type prefix, Second arg: async function that returns promise
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',                    // action type prefix
  async (_, { rejectWithValue }) => {  // _ = no argument needed
    try {
      const response = await axios.get('/api/users');
      return response.data;            // this becomes action.payload on fulfilled
    } catch (error) {
      return rejectWithValue(error.response.data);  // on error
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {
    clearUsers: state => { state.list = []; }
  },
  // extraReducers handles async actions (from createAsyncThunk)
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;   // data from API
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // error from rejectWithValue
      });
  }
});

export const { clearUsers } = usersSlice.actions;
export default usersSlice.reducer;

// Component — using the async thunk
function UserList() {
  const { list, loading, error } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());   // dispatch the async thunk
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{list.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

Note:
- Key Point: createAsyncThunk handles 3 states automatically: pending (loading), fulfilled (success + data), rejected (error). Use `extraReducers` in the slice to handle these states. `rejectWithValue` lets you pass custom error data to the rejected action.
- Why Interviewer Asks: Async operations with Redux is a very common interview scenario. They'll ask: "How do you make an API call with Redux?" — this is the answer.

---

## Topic 7 : Tricky Output & Behavior Questions

---

**36. What is the output? (useState batching)**

```jsx
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log("Count:", count);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}
// After clicking: what is the button label and what is console.log output?
```

Answer:
```
Console logs: "Count: 0"  (the OLD value — state is not updated yet in this function)
Button shows: "Count: 1"  (NOT 3)
```

**Explanation:**
React **batches** multiple setState calls in the same event handler into ONE render. All three `setCount(count + 1)` calls see the SAME old `count` value (0), so they all set it to `0 + 1 = 1`. Only ONE re-render happens.

**Fix — use functional update:**
```jsx
const handleClick = () => {
  setCount(prev => prev + 1);  // prev = 0 → 1
  setCount(prev => prev + 1);  // prev = 1 → 2
  setCount(prev => prev + 1);  // prev = 2 → 3
  // Now button shows: Count: 3
};
```

Note:
- Key Point: React batches state updates in event handlers — multiple setStates = ONE re-render. The state value inside the handler is the OLD value (stale). Functional update `prev =>` always gets the latest value.
- Why Interviewer Asks: Classic gotcha. Tests if you understand React's batching behavior and the stale closure problem in event handlers.

---

**37. What is the output? (useEffect dependency)**

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Effect ran, count:", count);
  }, [count]);

  useEffect(() => {
    console.log("Mount only effect");
  }, []);

  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
// What logs on first render? What logs when button is clicked once?
```

Answer:
```
On first render:
"Mount only effect"
"Effect ran, count: 0"

After first button click:
"Effect ran, count: 1"   (only this one — the [] effect doesn't run again)
```

**Explanation:**
Both effects run after the first render. On subsequent renders, only the `[count]` effect runs (because count changed). The `[]` effect ran only once.

Note:
- Key Point: ALL useEffect hooks (regardless of deps) run after the FIRST render. After that, only effects whose dependencies changed run. Empty `[]` = run once only.
- Why Interviewer Asks: Tests precise understanding of the dependency array. Many candidates don't know that all effects run on first render regardless of dependencies.

---

**38. What is the output? (Closure in useEffect)**

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log("Count is:", count);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
// After clicking the button 3 times, what does the interval log?
```

Answer:
```
The interval always logs: "Count is: 0"
Even after clicking the button multiple times.
```

**Explanation:**
The `useEffect` with `[]` runs only once on mount. The `setInterval` callback **captures (closes over)** the value of `count` at that time, which was `0`. Even as `count` updates in state, the closed-over value inside the interval stays `0` forever — this is the **stale closure** problem.

**Fix:**
```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => {
      console.log("Count is:", prev + 1);
      return prev + 1;
    });
  }, 1000);
  return () => clearInterval(id);
}, []);  // now safe because we use functional update
```

Note:
- Key Point: setInterval callback captures variables at creation time. With `[]` dependency, `count` is always the initial value (stale closure). Fix: use functional update `prev =>` inside setInterval to always get latest state.
- Why Interviewer Asks: Real-world bug. Tests understanding of closures, useEffect, and why intervals in React need special attention.

---

**39. What is the output? (Key prop in lists)**

```jsx
function App() {
  const [items, setItems] = useState(["Apple", "Banana", "Cherry"]);

  const addToFront = () => {
    setItems(prev => ["Mango", ...prev]);
  };

  return (
    <div>
      {items.map((item, index) => (
        <input key={index} defaultValue={item} />
      ))}
      <button onClick={addToFront}>Add Mango to Front</button>
    </div>
  );
}
// User types "Modified Apple" in the first input.
// Then clicks "Add Mango to Front". What happens to the input values?
```

Answer:
```
The first input will show "Modified Apple" but the label says "Mango"
React gets confused — "Modified Apple" value stays in the first input
but React assigns it to "Mango" because keys (indexes) didn't change.
```

**Explanation:**
Using `index` as key is dangerous when list order changes. React uses keys to identify which DOM element matches which data. When "Mango" is added at front, all indices shift:
- index 0 was "Apple" → now index 0 is "Mango" (but React thinks it's the same element!)
- React keeps the DOM input (with "Modified Apple" text) and just changes the `defaultValue` prop

**Fix:**
```jsx
{items.map((item) => (
  <input key={item} defaultValue={item} />  // use unique value as key
))}
```

Note:
- Key Point: NEVER use array index as key when list items can be added/removed/reordered. Use a unique, stable ID (`item.id`) or the value itself if unique. Index keys cause wrong element reuse in React's reconciliation.
- Why Interviewer Asks: Classic React gotcha. Using index as key is a very common bug in React apps. If you know this, it immediately shows real-world experience.

---

**40. What is the output? (useSelector performance)**

```jsx
// Redux store state:
// { user: { name: "Dev", age: 23, email: "dev@example.com" }, counter: { value: 5 } }

function UserCard() {
  const user = useSelector(state => state.user);  // selecting entire user object
  console.log("UserCard rendered");
  return <p>{user.name}</p>;
}

// Then somewhere else, only the counter is incremented:
dispatch(increment());
// Does UserCard re-render?
```

Answer:
```
Yes, UserCard re-renders — even though the user state didn't change!
"UserCard rendered" is logged.
```

**Explanation:**
`useSelector` compares the selected value using **reference equality** (`===`). When any part of the Redux store changes (counter changed), `useSelector` runs again. Even though the `user` object has the same data, if a new state object was created (which Redux always does for immutability), `state.user` might be a different reference → UserCard re-renders.

**Fix — select only what you need:**
```jsx
function UserCard() {
  // Select only the specific value needed
  const name = useSelector(state => state.user.name);   // re-renders only when name changes
  console.log("UserCard rendered");
  return <p>{name}</p>;
}
```

Note:
- Key Point: useSelector uses reference equality (`===`). Selecting an object (`state.user`) causes re-render whenever ANY state changes. Always select the minimum — primitives when possible. For complex selections use `shallowEqual` from react-redux or `createSelector` from reselect.
- Why Interviewer Asks: Performance question testing deep Redux knowledge. Very practical — this is a real performance bug in production apps.

---

## Topic 8 : Advanced React Concepts

---

**41. What is React.lazy() and Suspense? What is Code Splitting?**

Answer:
**Code Splitting** is breaking your JavaScript bundle into smaller chunks that load **on demand** instead of loading the entire app upfront. React provides `React.lazy()` and `<Suspense>` for component-level code splitting.

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Without lazy — ALL components are bundled together (large initial load)
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';

// ✅ With lazy — each component loads only when its route is visited
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports = lazy(() => import('./pages/Reports'));

function App() {
  return (
    // Suspense shows fallback while lazy component is loading
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Suspense>
  );
}
```

**Benefits:**
- Faster initial page load (smaller JS bundle)
- Components download only when needed
- Better user experience for large apps

Note:
- Key Point: `React.lazy()` imports component dynamically. `<Suspense fallback>` shows loading state while it loads. Code splitting is essential for large apps — without it, users download all code even for pages they never visit.
- Why Interviewer Asks: Performance optimization topic. They'll ask: "How do you improve React app performance?" — lazy loading / code splitting is a key answer.

---

**42. What is an Error Boundary in React?**

Answer:
An **Error Boundary** is a React component that **catches JavaScript errors** in its child component tree and displays a fallback UI instead of crashing the entire application. Error Boundaries must be class components (there is no hook equivalent yet).

```jsx
import { Component } from 'react';

// Error Boundary — must be a class component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Called when a child throws an error
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called after error for logging
  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
    // logToMonitoringService(error, errorInfo); // e.g. Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong!</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage — wrap components that might throw errors
function App() {
  return (
    <ErrorBoundary>
      <UserProfile />
      <Dashboard />
    </ErrorBoundary>
  );
}
```

**What Error Boundaries do NOT catch:**
- Event handler errors (use try/catch in event handlers)
- Async code (setTimeout, Promises)
- Server-side rendering errors
- Errors in the error boundary itself

Note:
- Key Point: Error boundaries prevent the entire app from crashing. Use them around major sections of your app. They only work for render-time errors, NOT for async errors or event handler errors.
- Why Interviewer Asks: Tests knowledge of React error handling patterns. This is also one of the only remaining reasons to use class components in 2024.

---

## Quick Revision Table — All React + Redux Topics

| # | Question | One-Line Answer |
|---|----------|----------------|
| 1 | What is React | JS library by Meta for building UIs, component-based, uses Virtual DOM |
| 2 | JSX | HTML-in-JS syntax, Babel converts to React.createElement(), use className not class |
| 3 | Virtual DOM | Lightweight JS copy of real DOM, React diffs and updates only what changed |
| 4 | Functional vs Class | Functional + hooks = modern standard. Class = legacy (deprecated) |
| 5 | Props vs State | Props = read-only data from parent. State = mutable data inside component |
| 6 | Prop Drilling | Passing props through many levels. Fix: Context API or Redux |
| 7 | useState | Add state to functional component. Returns [value, setter]. Setter triggers re-render |
| 8 | Stale Closure | useEffect captures old value. Fix: functional update `prev =>` or add to deps |
| 9 | useEffect | Side effects. `[]`=once, `[dep]`=on change, no array=every render. Return=cleanup |
| 10 | useRef | Mutable object, no re-render. Two uses: DOM access + store mutable values |
| 11 | useMemo | Cache expensive COMPUTED VALUE. Only recalculates when deps change |
| 12 | useCallback | Cache FUNCTION reference. Use with React.memo to prevent child re-renders |
| 13 | useContext | Consume context without prop drilling. createContext → Provider → useContext |
| 14 | useReducer | Complex state with reducer function. Like useState + Redux pattern |
| 15 | Custom Hook | Function starting with `use` that reuses stateful logic. e.g. useFetch |
| 16 | React.memo | Wraps component, skips re-render if props didn't change |
| 17 | Reconciliation | React's diffing algorithm — compares Virtual DOM trees, minimal DOM updates |
| 18 | React Fiber | React 16 reimplementation — incremental rendering, priority scheduling, concurrency |
| 19 | React Router | Client-side routing library. BrowserRouter → Routes → Route |
| 20 | Link vs NavLink | Link = basic navigation. NavLink = adds active class when route matches |
| 21 | useNavigate | Programmatic navigation. navigate("/path"), navigate(-1), {replace: true} |
| 22 | useParams | Access dynamic URL params like :id from the URL |
| 23 | Protected Route | Redirect unauthenticated users. Check auth → Navigate or Outlet |
| 24 | Axios vs Fetch | Axios: auto JSON, 4xx auto-rejected, interceptors. Fetch: built-in, manual JSON |
| 25 | Axios instance | axios.create() with baseURL + headers. Interceptors for auth tokens globally |
| 26 | Redux | Global state management. Store → Action → Reducer → new State |
| 27 | Redux Toolkit | Official Redux way. createSlice, configureStore, Immer, less boilerplate |
| 28 | createSlice | Defines name + initialState + reducers. Auto-generates actions |
| 29 | useSelector | Read state from Redux store. Re-renders when selected value changes |
| 30 | useDispatch | Get dispatch function to send actions to Redux store |
| 31 | createAsyncThunk | Async action creator. Auto-dispatches pending/fulfilled/rejected |
| 32 | Code Splitting | React.lazy + Suspense. Load components on demand, faster initial load |
| 33 | Error Boundary | Class component that catches render errors, shows fallback UI |

---

## Topics Covered — Summary Table

| Topic | Questions | Count |
|-------|-----------|:-----:|
| React Basics (What is React, JSX, Virtual DOM) | 1–7 | 7 |
| React Hooks (useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer) | 8–19 | 12 |
| Component Lifecycle & Rendering | 20–22 | 3 |
| React Router (BrowserRouter, Link, NavLink, useNavigate, useParams, Protected Route) | 23–27 | 5 |
| Axios & API Calls (Fetch vs Axios, Axios Instance, Interceptors, HTTP Methods) | 28–30 | 3 |
| Redux Toolkit (Redux basics, RTK, Slice, Store, useSelector, useDispatch, Async Thunk) | 31–35 | 5 |
| Tricky Output & Behavior Questions | 36–40 | 5 |
| Advanced Concepts (Code Splitting, Error Boundary) | 41–42 | 2 |
| **Total** | | **42** |

---

> **💡 Interview Day Tips:**
> 1. Always say "I prefer functional components with hooks" — never say you like class components
> 2. For EVERY hook question, mention the dependency array and when/why it matters
> 3. For Redux: walk through the full flow — slice → store → Provider → useSelector → useDispatch
> 4. For performance: mention React.memo + useCallback + useMemo together
> 5. For API calls: mention Axios over Fetch and explain why (4xx errors, interceptors)
> 6. The KEY question: "Tell me about a React project you built" — be ready to explain your architecture
