# **Defining HTTP Status Codes in Error Responses (Express.js)**

In Express.js, when responding to errors, it is crucial to return the correct **HTTP status code** alongside a meaningful message. This helps clients (such as browsers or APIs) understand the nature of the error and take appropriate actions.

## **🔧 1. What are HTTP Status Codes?**

HTTP status codes are standard responses issued by a server in response to a client’s request. These codes are divided into categories based on the first digit of the status code:

- **2xx**: Success
- **3xx**: Redirection
- **4xx**: Client errors (e.g., bad requests, unauthorized access)
- **5xx**: Server errors (e.g., internal server issues)

For error responses, it's important to choose the appropriate status code that reflects the nature of the error, allowing the client to handle it accordingly.

---

## **💡 2. Commonly Used HTTP Status Codes for Errors**

### **4xx: Client Errors**
These errors indicate that the client sent an invalid request. The issue is often due to user input or client misconfiguration.

- **400 Bad Request**: The server cannot process the request due to malformed syntax.
- **401 Unauthorized**: The client is not authenticated (needs to log in).
- **403 Forbidden**: The server understood the request but refuses to authorize it.
- **404 Not Found**: The requested resource is not found on the server.
- **422 Unprocessable Entity**: The server understands the request, but it cannot process the given data.

### **5xx: Server Errors**
These errors indicate that the problem lies with the server, and it was unable to process the request due to an internal issue.

- **500 Internal Server Error**: The server encountered an unexpected condition that prevented it from fulfilling the request.
- **502 Bad Gateway**: The server, while acting as a gateway or proxy, received an invalid response from the upstream server.
- **503 Service Unavailable**: The server is currently unavailable, usually due to being overloaded or down for maintenance.

---

## **🧩 3. Setting Status Codes in Express.js**

In Express, you can set the HTTP status code in your responses by using the `res.status(code)` method before sending the response.

### **Basic Example: Setting Status Codes in Express Error Responses**

```javascript
const express = require('express');
const app = express();

// Simulating a route that might throw an error
app.get('/data', (req, res, next) => {
  const data = null; // Simulating no data found
  if (!data) {
    const error = new Error('Data not found');
    error.statusCode = 404; // Setting the error status code
    next(error); // Pass the error to the error-handling middleware
  }
  res.json(data);
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message,
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### **Explanation:**
- If `data` is not found, an error is created, and the status code is set to `404` (`Data not found`).
- In the error-handling middleware, we use `res.status(err.statusCode || 500)` to set the HTTP status code dynamically. If no status code is defined in the error object, a default `500 Internal Server Error` is used.

---

## **💡 4. Custom Error Object for Status Codes**

It’s often useful to define custom error objects that can hold both the error message and an appropriate HTTP status code. This makes it easier to handle different types of errors in your application.

### **Example: Custom Error Object with Status Code**

```javascript
class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500; // Default to 500 if no status code provided
  }
}

// Using the custom error class
app.get('/user/:id', async (req, res, next) => {
  try {
    const user = await getUserFromDatabase(req.params.id);
    if (!user) {
      throw new HttpError('User not found', 404);
    }
    res.json(user);
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message,
  });
});
```

### **Explanation:**
- The `HttpError` class extends the `Error` object and allows us to specify both the error message and the status code when throwing an error.
- When an error is thrown in the route, it’s passed to the error-handling middleware with the status code and message intact.

---

## **🔧 5. Error Handling Based on HTTP Status Codes**

It’s a good practice to handle different types of errors with appropriate status codes. Here are some examples:

### **Example: Handling Different Error Types**

```javascript
// Route handler with different error scenarios
app.get('/login', (req, res, next) => {
  const isAuthenticated = false; // Simulating authentication failure
  if (!isAuthenticated) {
    const error = new HttpError('Unauthorized access. Please log in.', 401);
    return next(error);
  }
  res.send('Welcome to the Dashboard!');
});

// Route for handling a resource not found
app.get('/product/:id', (req, res, next) => {
  const product = null; // Simulating a missing product
  if (!product) {
    const error = new HttpError('Product not found', 404);
    return next(error);
  }
  res.json(product);
});

// General server error
app.get('/error', (req, res, next) => {
  const error = new Error('Something went wrong');
  error.statusCode = 500;
  return next(error);
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message,
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### **Explanation:**
- **401 Unauthorized**: If the user is not authenticated, the route throws an error with status code `401`.
- **404 Not Found**: If the requested product is not found, a `404` error is returned.
- **500 Internal Server Error**: Any other general server error is handled by default with `500`.

---

## **📚 Summary of Common HTTP Status Codes for Error Responses**

| **Status Code** | **Meaning**                | **Use Case**                                        |
|-----------------|----------------------------|----------------------------------------------------|
| **400**         | Bad Request                | The request cannot be processed due to malformed syntax. |
| **401**         | Unauthorized               | User must authenticate to access the resource. |
| **403**         | Forbidden                  | The server understands but refuses to fulfill the request. |
| **404**         | Not Found                  | The requested resource does not exist on the server. |
| **422**         | Unprocessable Entity       | The request is well-formed but contains invalid data. |
| **500**         | Internal Server Error      | A generic server-side error. |
| **502**         | Bad Gateway                | Server received an invalid response from an upstream server. |
| **503**         | Service Unavailable        | The server is temporarily unavailable (e.g., down for maintenance). |

---

By defining appropriate HTTP status codes in error responses, you ensure that the client receives clear feedback about the nature of the error and can handle it correctly. It also enhances the overall usability and maintainability of your API or web application.