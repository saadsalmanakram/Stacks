
---

# 📝 Strict Mode in React

### Introduction to Strict Mode in React

---

## 📜 What is Strict Mode in React?

**Strict Mode** is a feature in React that helps identify potential problems in an application by intentionally highlighting issues that might not be immediately obvious. It does not render any visible UI changes but enables additional checks and warnings in development mode. Strict Mode helps developers follow best practices and ensures that their codebase is robust, maintainable, and free of common issues.

Strict Mode is mainly used during development to help with debugging and improving the quality of the React application. It helps catch problems related to deprecated methods, unsafe lifecycle methods, and other common issues in React components.

---

## ⚙️ How Does Strict Mode Work?

Strict Mode is a wrapper component that can be applied to any part of the component tree. When React detects that a component is wrapped inside Strict Mode, it applies additional checks during rendering, lifecycle methods, and state updates.

Strict Mode works by double-invoking certain lifecycle methods and functions (such as `render`, `useEffect`, and `constructor`) in development. This helps in identifying any side effects, unsafe methods, or other issues that could be problematic during rendering or component lifecycle.

---

## 🔑 Key Features of Strict Mode

1. **Double Rendering of Components**:
   - Strict Mode intentionally runs components twice in development to help detect side effects, bugs, or improper use of lifecycle methods. This does **not** happen in production.
   - The second rendering helps in identifying any unsafe behaviors, particularly for asynchronous or side-effect-related issues.

2. **Warnings for Unsafe Lifecycle Methods**:
   - Strict Mode detects the usage of deprecated lifecycle methods, such as `componentWillMount`, `componentWillUpdate`, and `componentWillReceiveProps`. These methods are considered unsafe for async rendering and may cause issues in future versions of React.
   - React provides warnings when these lifecycle methods are used, encouraging developers to migrate to safer alternatives like `getDerivedStateFromProps` or `componentDidMount`.

3. **Detecting Unexpected Side Effects**:
   - Strict Mode helps in identifying side effects that might occur unexpectedly, especially those that persist between renders. By running components twice, React can highlight cases where state updates or side effects are causing unintended behaviors.

4. **Legacy Context API Detection**:
   - Strict Mode detects the usage of the legacy context API, which is being deprecated. React encourages developers to migrate to the new Context API for improved performance and flexibility.

5. **Detecting Multiple `useEffect` Calls**:
   - React's `useEffect` hook can be tricky when dealing with asynchronous actions and side effects. Strict Mode warns if there are any issues with how `useEffect` is used, ensuring that effects are executed properly without memory leaks or other issues.

---

## ⚙️ How to Enable Strict Mode?

To enable Strict Mode in your React application, simply wrap the components or the entire app with the `<React.StrictMode>` component. This can be done at the top level of your app, such as in the root `index.js` or `App.js` file.

### Example:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

- In this example, the entire app is wrapped with `<React.StrictMode>`. This enables all the checks and warnings in development.

You can also wrap specific parts of your application inside Strict Mode to apply it only to certain components:

```jsx
<React.StrictMode>
  <ComponentA />
</React.StrictMode>

<React.StrictMode>
  <ComponentB />
</React.StrictMode>
```

- In this case, `ComponentA` and `ComponentB` will undergo Strict Mode checks, but other parts of the app will not.

---

## 🔧 What Strict Mode Does Not Do

- **Strict Mode does not affect production builds**: It only runs in development mode and has no impact on the final production build. There will be no performance overhead or additional checks in production.
- **It doesn’t provide a performance boost**: Strict Mode is primarily a development tool that helps catch potential issues. It does not improve the runtime performance of the application.
- **It doesn't provide automatic fixes**: Strict Mode only helps by detecting issues and providing warnings. Developers are responsible for addressing these issues and ensuring their code follows React best practices.

---

## 🛠️ Example: Using Strict Mode with Functional Components

### Before Using Strict Mode (with issues):

```jsx
import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // This causes an issue: Stale state in the effect
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  return <div>Count: {count}</div>;
}

export default MyComponent;
```

- In the above example, the `useEffect` hook has a potential issue with stale state because `count` is used in the effect but isn’t updated correctly. Strict Mode will help identify this problem by running the component twice in development and displaying warnings.

### After Using Strict Mode (Detects Issues):

```jsx
import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1); // Fixes the issue: Using a function updater
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Dependency array is fixed

  return <div>Count: {count}</div>;
}

export default MyComponent;
```

- In this fixed version, the `setCount` function uses a function updater to access the previous state (`prevCount`), which avoids the stale state problem. Strict Mode would detect issues like this in development.

---

## 📦 Additional Resources

- [React Docs: Strict Mode](https://reactjs.org/docs/strict-mode.html)
- [React Blog Post on Strict Mode](https://reactjs.org/blog/2019/08/08/react-v16.9.0.html#react-strict-mode)

---

🎉 **Happy Debugging with React Strict Mode!** ⚛️