
---

# 📝 Portals in React

### Introduction to React Portals

---

## 📜 What are Portals in React?

**Portals** in React provide a way to render children components into a DOM node that exists outside the parent component's DOM hierarchy. By default, React renders components as descendants of their parent component in the virtual DOM tree. However, with portals, we can render a component outside of the typical DOM structure, allowing more flexibility in certain UI use cases (e.g., modals, tooltips, and overlays).

Portals allow React components to break free from the confines of the usual parent-child DOM structure and render into a different part of the DOM tree, preserving the React component hierarchy.

---

## ⚙️ How Do Portals Work in React?

When you use a portal, you are telling React to **render a child component into a DOM node** that exists outside its current parent node. This means the child component is rendered in a different part of the DOM while still retaining its React component hierarchy, including event handling and state.

### Basic Example of a Portal:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

function Modal(props) {
  return ReactDOM.createPortal(
    <div className="modal">
      <h2>{props.title}</h2>
      <p>{props.message}</p>
    </div>,
    document.getElementById('modal-root') // The portal will render here
  );
}

function App() {
  return (
    <div>
      <h1>React Portal Example</h1>
      <Modal title="Hello, World!" message="This is a modal using React Portals!" />
    </div>
  );
}

export default App;
```

In this example:
- The `Modal` component is rendered using `ReactDOM.createPortal()`.
- It is rendered into a DOM node with the ID `modal-root`, which is **outside the component's parent DOM tree** (in this case, outside the `App` component's DOM).

---

## 🔑 Key Features of React Portals

1. **Render Outside the Parent DOM**:
   - Portals allow you to render components outside the parent component’s DOM hierarchy, enabling use cases like modals, tooltips, and dropdowns.

2. **Retain Component Hierarchy**:
   - Even though the child component is rendered outside of the parent, the component structure remains intact. This means React can handle state, context, and event handling as if the component were part of the regular tree.

3. **Event Bubbling**:
   - Even though the component is rendered outside the parent, event bubbling and handling still function as expected. For instance, clicking on an overlay that is rendered using a portal will still trigger events in the React component as though it is a regular part of the component hierarchy.

---

## 🛠️ How to Use React Portals

### 1. **Creating a Portal Using `ReactDOM.createPortal`**

To create a portal in React, use the `ReactDOM.createPortal(child, container)` function. This function takes two arguments:
- **child**: The React element you want to render.
- **container**: The DOM node where the child should be rendered.

#### Example: Using Portals for Modals

```jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function Modal(props) {
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <h2>{props.title}</h2>
        <p>{props.message}</p>
        <button onClick={props.onClose}>Close</button>
      </div>
    </div>,
    document.getElementById('modal-root') // This node is outside the parent DOM tree
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Portal Example</h1>
      <button onClick={openModal}>Open Modal</button>

      {isModalOpen && (
        <Modal title="Hello Portal" message="This is a modal rendered using a portal!" onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
```

In this example:
- The modal is rendered outside the parent `App` component into a separate DOM node (`#modal-root`), but the modal itself behaves just like a regular React component.

### 2. **Where to Render Portals**

Portals are especially useful in situations where you need to append elements to the body or other parts of the DOM that are outside of the component's DOM hierarchy. For instance:
- Modals
- Tooltips
- Dropdown menus
- Notifications

```html
<!-- In your HTML, create a container for your portal -->
<div id="modal-root"></div>
```

### 3. **Portals in Contexts and Event Handlers**

Since the child rendered through a portal still retains its place in the component tree, it can still access **context values** and respond to events that propagate from the component tree.

#### Example: Portal with Context

```jsx
import React, { createContext, useContext } from 'react';
import ReactDOM from 'react-dom';

const ThemeContext = createContext('light');

function Modal() {
  const theme = useContext(ThemeContext);  // Using context in a portal

  return ReactDOM.createPortal(
    <div className={`modal ${theme}`}>
      <h2>Themed Modal</h2>
      <p>This modal follows the context theme.</p>
    </div>,
    document.getElementById('modal-root')
  );
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <h1>React Portal with Context</h1>
      <Modal />
    </ThemeContext.Provider>
  );
}

export default App;
```

In this example, the `Modal` component rendered via a portal still consumes the `ThemeContext` value from the parent component.

---

## 💡 Use Cases for React Portals

1. **Modals**:
   - Modals are often rendered outside the main application structure to avoid z-index issues and provide better layering.

2. **Tooltips & Popovers**:
   - Tooltips that pop up outside the normal DOM hierarchy can be more flexible when rendered through portals.

3. **Dropdowns & Overlays**:
   - Dropdowns or overlays that need to be placed outside their parent container for proper positioning.

4. **Global Notifications**:
   - Notifications can be rendered as portals to be globally accessible, not confined by their parent component's layout.

---

## ⚠️ Limitations of React Portals

1. **Accessibility Concerns**:
   - Portals can sometimes cause issues with accessibility because elements are moved outside the typical DOM hierarchy. Ensure proper focus management and ARIA roles are applied when using portals for modals or other interactive elements.

2. **Event Handling**:
   - While event handling still works as expected in portals, you may encounter edge cases when trying to manage things like keyboard events or focus within a modal or popup rendered through a portal.

---

## 🔗 Additional Resources

- [React Docs: Portals](https://reactjs.org/docs/portals.html)
- [React GitHub: Portal Example](https://github.com/facebook/react/tree/main/packages/react-dom)

---

📝 **Happy Coding with React Portals!** ⚛️🎯