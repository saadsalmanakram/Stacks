
---

# ⚛️ Effects in React

### Understanding Side Effects in React with the `useEffect` Hook

---

## 📜 What Are Effects in React?

In React, **effects** refer to the execution of **side effects** in functional components. Side effects are operations that affect things outside the scope of the function being executed, such as:

- Fetching data from an API
- Updating the DOM
- Setting up subscriptions
- Starting or stopping timers

React uses the `useEffect` hook to manage side effects in functional components. The `useEffect` hook allows you to run code after the component renders or when certain dependencies change.

---

## 🛠️ Syntax of `useEffect`

```jsx
import React, { useEffect } from 'react';

useEffect(() => {
  // Code for the side effect
});
```

### Basic Structure

- **First Argument**: A function that contains the side effect.
- **Second Argument (Optional)**: An array of dependencies that determine when the effect runs.

#### Example

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`You clicked ${count} times`);
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click Me</button>
    </div>
  );
}
```

---

## 🧠 Key Concepts of `useEffect`

### 1. **Running Effects After Every Render**

By default, `useEffect` runs after **every render**.

```jsx
useEffect(() => {
  console.log('This runs after every render');
});
```

### 2. **Running Effects Once on Mount**

To run the effect only **once** when the component mounts, pass an **empty dependency array `[]`**.

```jsx
useEffect(() => {
  console.log('This runs only once when the component mounts');
}, []);
```

### 3. **Running Effects When Dependencies Change**

Specify dependencies in the array to run the effect when those values change.

```jsx
useEffect(() => {
  console.log('This runs when `count` changes');
}, [count]);
```

### 4. **Cleaning Up Effects**

Sometimes, side effects like subscriptions or timers need cleanup to avoid memory leaks. `useEffect` supports cleanup by returning a function.

#### Example of Cleanup

```jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return <p>Seconds: {seconds}</p>;
}
```

---

## ⚙️ Common Use Cases for `useEffect`

1. **Fetching Data from an API**

   ```jsx
   import React, { useState, useEffect } from 'react';

   function DataFetcher() {
     const [data, setData] = useState(null);

     useEffect(() => {
       fetch('https://api.example.com/data')
         .then((response) => response.json())
         .then((data) => setData(data));
     }, []);

     return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
   }
   ```

2. **Setting Up Subscriptions**

   ```jsx
   useEffect(() => {
     const subscription = someAPI.subscribe();

     return () => {
       subscription.unsubscribe();
     };
   }, []);
   ```

3. **Listening to Window Resize Events**

   ```jsx
   import React, { useState, useEffect } from 'react';

   function WindowSize() {
     const [width, setWidth] = useState(window.innerWidth);

     useEffect(() => {
       const handleResize = () => setWidth(window.innerWidth);

       window.addEventListener('resize', handleResize);

       return () => window.removeEventListener('resize', handleResize);
     }, []);

     return <p>Window width: {width}px</p>;
   }
   ```

4. **Updating the Document Title**

   ```jsx
   useEffect(() => {
     document.title = `You clicked ${count} times`;
   }, [count]);
   ```

---

## 📝 Best Practices for Using `useEffect`

1. **Specify Dependencies**: Always specify dependencies to avoid unnecessary re-renders.
2. **Cleanup Side Effects**: Use cleanup functions to prevent memory leaks, especially for subscriptions or timers.
3. **Avoid Heavy Logic**: Keep heavy computations or synchronous code outside of `useEffect` to avoid blocking the UI.
4. **Avoid Infinite Loops**: Ensure that `useEffect` dependencies don't unintentionally trigger infinite loops.

---

## 🔗 Additional Resources

- [React Documentation: `useEffect`](https://react.dev/reference/react/useEffect)
- [React Hooks FAQ](https://reactjs.org/docs/hooks-faq.html)

---

📝 **Happy Coding with React Effects!** ⚛️🚀