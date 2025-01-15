# **Custom Error Handling Middleware in Express.js**

Custom error-handling middleware in Express.js allows you to manage and customize how errors are caught, processed, and sent as responses to the client. By creating custom error-handling middleware, you can ensure that your application responds in a consistent and structured manner, providing meaningful error messages and the appropriate HTTP status codes.

---

## **🔧 1. What is Custom Error Handling Middleware?**

In Express, middleware functions are used to handle requests and responses. The custom error-handling middleware is a special type of middleware designed specifically for processing errors. It is placed after all route handlers and other middleware functions to catch errors that occur during the processing of requests.

### **Custom Error-Handling Middleware Definition**
Custom error-handling middleware is defined with **four arguments**:
```javascript
function (err, req, res, next) {
  // Error handling logic
}
```
- **`err`**: The error object that is passed through the `next()` function.
- **`req`**: The request object.
- **`res`**: The response object.
- **`next`**: The next function, though it’s generally not used in error-handling middleware.

---

## **💡 2. When to Use Custom Error-Handling Middleware?**

You typically use custom error-handling middleware in the following situations:
- **Handling specific error cases**: For example, a `ValidationError` or a `DatabaseError`.
- **Standardizing error responses**: Ensuring your API consistently responds with proper status codes and error messages.
- **Handling unhandled errors**: Catches all errors thrown by route handlers or asynchronous code.

---

## **🧩 3. Basic Structure of Custom Error Handler**

The custom error handler should be defined **last**, after all your route handlers and other middleware. This allows it to catch any unhandled errors.

### **Example: Basic Custom Error Handler**

```javascript
const express = require('express');
const app = express();

// Route that throws an error
app.get('/', (req, res) => {
  throw new Error('Something went wrong!');
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

## **🔧 4. Custom Error Object**

You can create a **custom error object** to enrich the information provided in the error response. A custom error object can include additional details, such as an error code, a user-friendly message, or an HTTP status code.

### **Example: Custom Error Object**

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage
app.get('/custom-error', (req, res, next) => {
  const error = new AppError('Resource not found', 404);
  next(error);
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
  });
});
```

In this example:
- **`AppError`** is a custom class that extends the native `Error` object.
- **`statusCode`** defines the HTTP status code.
- **`status`** defines whether the error is a `fail` (client-side) or `error` (server-side).
- **`isOperational`** flags whether this is a known, expected error or an unexpected one.

---

## **🔧 5. Handling Asynchronous Errors with Custom Error Handling Middleware**

To catch errors from asynchronous code (such as promises or `async/await`), you should use **`try/catch` blocks** or use a package like **`express-async-errors`**.

### **Using `express-async-errors`**

`express-async-errors` simplifies handling errors in asynchronous route handlers without the need for `try/catch`.

Install the package:
```bash
npm install express-async-errors
```

**Example: Handling Async Errors with `express-async-errors`**

```javascript
require('express-async-errors');
const express = require('express');
const app = express();

// Asynchronous route
app.get('/async-error', async (req, res, next) => {
  const data = await someAsyncFunction(); // If an error occurs, it will be passed to the custom error handler
  res.send(data);
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

Now, any asynchronous error will be automatically passed to the custom error handler.

---

## **🧩 6. Handling Different Types of Errors**

You may encounter different types of errors, such as validation errors, authentication errors, or server errors. By defining your custom error handler, you can handle these cases more specifically.

### **Example: Handling Validation and Authentication Errors**

```javascript
// Custom Error Classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.status = 'fail';
    this.isOperational = true;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.status = 'fail';
    this.isOperational = true;
  }
}

// Route that throws a ValidationError
app.get('/validate', (req, res, next) => {
  const error = new ValidationError('Invalid input');
  next(error);
});

// Route that throws an AuthenticationError
app.get('/authenticate', (req, res, next) => {
  const error = new AuthenticationError('Unauthorized');
  next(error);
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
  });
});
```

---

## **🔧 7. Logging Errors for Debugging**

You can **log errors** in your custom error handler for debugging purposes, especially in production. Use a logging library like **winston** or **morgan** for more advanced logging.

**Example: Logging Errors Using `console.error`**

```javascript
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
  });
});
```

---

## **🧩 8. Best Practices for Custom Error Handling**

- **Define specific error classes** for different types of errors (e.g., validation errors, authentication errors).
- **Always pass operational errors** (e.g., user-related errors, validation errors) to the error handler using `next()`.
- **Handle unexpected errors** in your custom handler to avoid exposing stack traces to the client.
- **Log errors** for troubleshooting purposes, but ensure that sensitive information is not exposed.
- **Send proper HTTP status codes** (e.g., 400 for client errors, 401 for unauthorized, 500 for server errors).
- **Use `isOperational` flag** in custom errors to distinguish between expected and unexpected errors.

---

## **✅ Complete Example of Custom Error Handling**

```javascript
const express = require('express');
const app = express();

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Route that throws an error
app.get('/error', (req, res, next) => {
  const error = new AppError('Something went wrong!', 500);
  next(error); // Pass the error to the custom error handler
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

---

## **📚 Summary**

| **Feature**                      | **Description**                                                |
|-----------------------------------|----------------------------------------------------------------|
| Custom Error Class                | Create custom error classes to handle specific errors.         |
| `next(err)`                        | Pass errors to the custom error handler using `next()`.        |
| Error Logging                     | Log errors for debugging, especially in production.            |
| Status Codes                      | Use appropriate HTTP status codes for different error types.   |
| `isOperational` Flag              | Flag expected errors as operational to handle them separately. |

Custom error-handling middleware ensures that your Express.js application can handle errors in a clean, consistent, and structured way, providing better error management and improved user experience.