# **Built-in Error Handling in Express.js**  

Error handling is an essential part of any application to ensure it runs reliably and can gracefully manage unexpected situations. Express.js provides **built-in mechanisms** for handling errors effectively, both **synchronous** and **asynchronous**. Understanding how to use these mechanisms will help you build more **robust** and **scalable** applications.

---

## **🌟 Key Concepts of Error Handling in Express.js**

1. **Default Error Handling**: Express has a built-in default error handler that handles any unhandled errors.
2. **Custom Error Handlers**: You can define your own custom error-handling middleware to manage errors more effectively.
3. **`next()` Function for Errors**: Use `next(err)` to pass errors to the next middleware or error handler.
4. **Asynchronous Error Handling**: Use `try/catch` blocks or **async/await** to handle errors in asynchronous code.

---

## **🔧 1. Default Error Handling in Express.js**

If an error occurs and is not explicitly handled, Express will automatically call its **default error handler**. The default error handler will:

- Send a **500 Internal Server Error** response if the error has no status code.
- Send the **error message** to the client if the app is not in production.

### **Example: Default Error Handling**

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  throw new Error('Something went wrong!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

**Output:**
```
Error: Something went wrong!
```

---

## **🧩 2. Custom Error-Handling Middleware**

You can create a **custom error-handling middleware** function to control how errors are handled. In Express, an error-handling middleware has **four arguments**: `(err, req, res, next)`.

### **Creating a Custom Error Handler**

```javascript
const express = require('express');
const app = express();

// Route that throws an error
app.get('/', (req, res) => {
  throw new Error('Custom error occurred!');
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

---

## **📚 Explanation of Custom Error Handler Parameters**

| **Parameter** | **Description**                                           |
|---------------|-----------------------------------------------------------|
| `err`         | The error object or message that was thrown.              |
| `req`         | The request object (provides request details).            |
| `res`         | The response object (used to send a response to the client). |
| `next`        | A function to pass the error to the next middleware.      |

---

## **🧩 3. Using the `next()` Function to Pass Errors**

You can use the **`next(err)`** function to **pass errors** to the next middleware or error handler.

### **Example: Using `next()` to Pass an Error**

```javascript
app.get('/error', (req, res, next) => {
  const error = new Error('This is an error!');
  next(error); // Pass the error to the custom error handler
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});
```

**Output:**
```json
{
  "message": "This is an error!"
}
```

---

## **🧩 4. Handling Asynchronous Errors**

Express does not catch **asynchronous errors** automatically. You need to use **try/catch** blocks or **async/await** to handle them.

### **Example: Handling Asynchronous Errors**

```javascript
app.get('/async-error', async (req, res, next) => {
  try {
    // Simulating an asynchronous error
    const result = await someAsyncFunction();
    res.send(result);
  } catch (err) {
    next(err); // Pass the error to the custom error handler
  }
});
```

---

### **Simplified Asynchronous Error Handling Using `express-async-errors`**

You can use the **`express-async-errors`** package to simplify error handling in asynchronous functions.

```bash
npm install express-async-errors
```

**Example: Using `express-async-errors`**

```javascript
require('express-async-errors');
const express = require('express');
const app = express();

app.get('/async-error', async (req, res) => {
  const result = await someAsyncFunction(); // If an error occurs, it will be handled automatically
  res.send(result);
});

// Custom error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

---

## **🧩 5. Setting Error Status Codes**

You can set custom **status codes** when handling errors by using **`res.status()`**.

### **Example: Setting a Custom Status Code**

```javascript
app.get('/not-found', (req, res, next) => {
  const error = new Error('Page not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});
```

---

## **🧩 6. Handling Different Error Types**

You can handle **different types of errors** in your custom error handler.

### **Example: Handling Different Error Types**

```javascript
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(400).json({ message: err.message });
  } else if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Unauthorized access' });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
```

---

## **🧩 7. Built-in Error Codes in Express**

| **Error Type**           | **Description**                                 |
|--------------------------|-------------------------------------------------|
| `404 Not Found`           | When a route is not found.                     |
| `500 Internal Server Error` | Generic server error.                        |
| `401 Unauthorized`        | When a user is not authorized to access a resource. |
| `400 Bad Request`         | When the client sends an invalid request.      |

---

## **🧩 8. Best Practices for Error Handling**

1. **Always define a custom error-handling middleware.**
2. **Use `next(err)` to pass errors to the error handler.**
3. **Handle both synchronous and asynchronous errors.**
4. **Log errors for debugging purposes.**
5. **Return appropriate HTTP status codes based on the error type.**
6. **Avoid exposing sensitive error details in production.**

---

## **✅ Complete Example: Error Handling in Express.js**

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

app.get('/error', (req, res, next) => {
  const error = new Error('Something went wrong!');
  next(error);
});

// 404 Error Handler
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// Custom Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

---

## **📚 Summary**

| **Feature**               | **Description**                                                |
|---------------------------|----------------------------------------------------------------|
| Default Error Handler      | Automatically handles unhandled errors with a 500 status code. |
| Custom Error Handler       | Define your own middleware to manage errors effectively.       |
| `next(err)`                | Pass errors to the next middleware or error handler.           |
| Asynchronous Errors        | Use `try/catch` blocks or `express-async-errors` package.      |
| Status Codes               | Set appropriate HTTP status codes for different errors.        |

With Express.js's **built-in error-handling** capabilities, you can build more resilient applications that handle both expected and unexpected errors gracefully.