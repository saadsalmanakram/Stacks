
---

# ⚛️ Hooks in React

### Understanding Hooks in React for State and Side Effects in Functional Components

---

## 📜 What Are Hooks in React?

**Hooks** are JavaScript functions introduced in React 16.8 that allow you to use **state** and **other React features** in **functional components**. Prior to Hooks, state management and side effects were only possible in **class components**. With Hooks, React enables functional components to handle state, side effects, context, refs, and more.

Hooks simplify component logic, reduce the need for class components, and make it easier to share stateful logic between components.

---

## 🛠️ Types of Hooks in React

React provides several built-in Hooks for managing state, handling side effects, and more.

### 1. **useState**

The `useState` hook allows you to add **state** to a functional component.

#### Syntax

```jsx
const [state, setState] = useState(initialState);
```

- `state`: The current state value.
- `setState`: A function to update the state.
- `initialState`: The initial state value when the component is first rendered.

#### Example:

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default Counter;
```

---

### 2. **useEffect**

The `useEffect` hook allows you to perform **side effects** in functional components, such as fetching data, subscriptions, or manually changing the DOM.

#### Syntax

```jsx
useEffect(() => {
  // Code to run on every render or specific conditions
}, [dependencies]);
```

- The effect callback runs after every render by default.
- If you pass an array of dependencies, the effect will run only when those dependencies change.

#### Example:

```jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return <p>Time: {seconds}s</p>;
}

export default Timer;
```

---

### 3. **useContext**

The `useContext` hook allows you to subscribe to **React context** and access context values directly in functional components.

#### Syntax

```jsx
const contextValue = useContext(MyContext);
```

- `MyContext`: The React context you want to subscribe to.

#### Example:

```jsx
import React, { useContext } from 'react';

const MyContext = React.createContext('default value');

function MyComponent() {
  const value = useContext(MyContext);
  return <p>Context Value: {value}</p>;
}

function App() {
  return (
    <MyContext.Provider value="Hello, React!">
      <MyComponent />
    </MyContext.Provider>
  );
}

export default App;
```

---

### 4. **useRef**

The `useRef` hook allows you to **persist values across renders** without causing re-renders. It's commonly used for accessing DOM elements or storing mutable values.

#### Syntax

```jsx
const ref = useRef(initialValue);
```

- `ref`: The object returned by `useRef`, with a `current` property pointing to the value.

#### Example (Accessing DOM):

```jsx
import React, { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

export default FocusInput;
```

---

### 5. **useReducer**

The `useReducer` hook is an alternative to `useState` for more complex state logic, especially when the state depends on previous state values.

#### Syntax

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

- `reducer`: A function that determines how the state changes based on an action.
- `dispatch`: A function used to send actions to the reducer.

#### Example:

```jsx
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
    </div>
  );
}

export default Counter;
```

---

### 6. **useMemo**

The `useMemo` hook memoizes the result of an expensive calculation so that it is recalculated only when the dependencies change.

#### Syntax

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- `computeExpensiveValue`: The function that computes the value.
- `[a, b]`: The dependencies, when they change, `computeExpensiveValue` will be recalculated.

#### Example:

```jsx
import React, { useState, useMemo } from 'react';

function ExpensiveCalculation({ num1, num2 }) {
  const calculate = (a, b) => {
    console.log('Calculating...');
    return a + b;
  };

  const result = useMemo(() => calculate(num1, num2), [num1, num2]);

  return <p>Result: {result}</p>;
}

function App() {
  const [num1, setNum1] = useState(1);
  const [num2, setNum2] = useState(2);

  return (
    <div>
      <ExpensiveCalculation num1={num1} num2={num2} />
      <button onClick={() => setNum1(num1 + 1)}>Increment num1</button>
      <button onClick={() => setNum2(num2 + 1)}>Increment num2</button>
    </div>
  );
}

export default App;
```

---

### 7. **useCallback**

The `useCallback` hook returns a **memoized version** of the callback function, preventing it from being recreated on every render unless its dependencies change.

#### Syntax

```jsx
const memoizedCallback = useCallback(() => { /* function body */ }, [dependencies]);
```

- `[dependencies]`: The list of dependencies that will trigger a re-creation of the memoized function when they change.

#### Example:

```jsx
import React, { useState, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  const memoizedFunction = useCallback(() => {
    console.log('Callback invoked');
  }, [count]);

  return <Child onClick={memoizedFunction} />;
}

function Child({ onClick }) {
  return <button onClick={onClick}>Click Me</button>;
}

export default Parent;
```

---

## ⚙️ Custom Hooks

React also allows you to create **custom hooks** to extract reusable logic from your components.

A custom hook is a function whose name starts with "use" and can call other hooks inside it.

#### Example:

```jsx
import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
```

---

## 📝 Best Practices for Hooks in React

1. **Only Call Hooks at the Top Level**: Don’t call hooks inside loops, conditions, or nested functions.
2. **Use Hooks in Functional Components**: Hooks can only be used inside functional components or custom hooks.
3. **Name Custom Hooks with 'use' Prefix**: Always start custom hook names with "use" to indicate they are hooks.
4. **Avoid Using Hooks in Class Components**: Hooks are designed to work only in functional components.
5. **Use useEffect Wisely**: Be mindful of the dependency array in `useEffect` to avoid unnecessary re-renders.

---

## 🔗 Additional Resources

- [React Documentation: Hooks](https://reactjs.org/docs/hooks-intro.html)
- [React Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)

---

📝 **Happy Coding with React Hooks!** ⚛️🚀