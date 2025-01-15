In Express.js, there are **five main types of middleware**:

1. **Application-level Middleware**  
   This middleware is bound to the entire application using the `app.use()` or `app.METHOD()` functions. It applies to all routes unless specifically limited by a mount path. Example: logging, authentication, or parsing request data.

2. **Router-level Middleware**  
   Similar to application-level middleware, but it is applied to specific instances of `express.Router()`. It allows middleware to be scoped to particular route groups. Example: handling requests for a specific resource or set of routes.

3. **Error-handling Middleware**  
   This type of middleware is used to handle errors. It is defined with four parameters (`err, req, res, next`) and is invoked when an error occurs in the application. Example: catching unexpected errors and responding with an appropriate message.

4. **Built-in Middleware**  
   Express provides some built-in middleware functions that handle common tasks like serving static files or parsing request bodies. Examples: `express.static`, `express.json()`, `express.urlencoded()`.

5. **Third-party Middleware**  
   These are middleware functions provided by external packages that you install and use to extend Express's functionality. Examples include `cookie-parser` for parsing cookies, `morgan` for logging HTTP requests, or `cors` for enabling Cross-Origin Resource Sharing.

Each type of middleware is designed to serve a specific purpose in the request-response cycle, and they can be combined and customized to suit the needs of your Express application.