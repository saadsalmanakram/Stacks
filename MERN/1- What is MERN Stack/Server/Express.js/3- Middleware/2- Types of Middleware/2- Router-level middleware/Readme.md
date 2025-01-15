### Router-level Middleware in Express.js

**Router-level middleware** in Express.js works similarly to **application-level middleware**, but it is specifically bound to an instance of the `express.Router()` object. This allows you to group middleware functions together and apply them to a specific set of routes defined in a router, giving you finer control over route-specific behavior.

Router-level middleware is especially useful when you want to modularize your application and apply middleware to a group of related routes (e.g., all routes related to a certain resource or endpoint).

#### Key Characteristics of Router-level Middleware

- **Scoped to a Specific Router**: Unlike application-level middleware that applies globally, router-level middleware applies only to routes defined in a specific router instance.
- **Execution Order**: Like application-level middleware, router-level middleware is executed in the order it is defined, and middleware functions must call `next()` to pass control to the next function in the stack.
- **Modularity**: Router-level middleware makes it easier to structure your application into smaller, reusable pieces, especially when your app has multiple routes grouped by functionality.

#### Syntax and Usage

Router-level middleware is defined using the `express.Router()` method. You can then attach middleware to a router using `router.use()` or `router.METHOD()` (where `METHOD` represents the HTTP method like `GET`, `POST`, etc.).

- **Creating a Router Instance**:  
   You create a router instance using `express.Router()` and attach route-specific middleware and route handlers to it.

   Example of creating a basic router:

   ```javascript
   const express = require('express');
   const app = express();
   const router = express.Router();

   // Router-level middleware
   router.use((req, res, next) => {
     console.log('Router-level middleware executed');
     next();  // Pass control to the next middleware or route handler
   });

   // Define a route in the router
   router.get('/', (req, res) => {
     res.send('Hello from the router!');
   });

   // Mount the router on the app
   app.use('/api', router);

   app.listen(3000, () => {
     console.log('Server running on port 3000');
   });
   ```

   In this example:
   - We created a router instance (`router`).
   - We applied a router-level middleware to log a message for every request to the `/api` route.
   - The router was mounted at the `/api` path using `app.use('/api', router)`.

---

#### Types of Router-level Middleware

1. **General Middleware**:
   Just like application-level middleware, router-level middleware can be used to perform general tasks such as logging, authentication, and request parsing for all requests to routes defined in the router.

   Example (logging middleware for the router):

   ```javascript
   router.use((req, res, next) => {
     console.log(`Request Type: ${req.method} - URL: ${req.url}`);
     next();  // Pass control to the next middleware
   });
   ```

2. **Middleware with a Mount Path**:
   Router-level middleware can also be mounted with a path, applying only to routes that match that path. This is useful when you want to apply middleware only to specific subsets of routes within the router.

   Example (middleware for specific path within the router):

   ```javascript
   router.use('/users', (req, res, next) => {
     console.log('This middleware applies to routes starting with /users');
     next();
   });

   router.get('/users', (req, res) => {
     res.send('List of users');
   });
   ```

   In this case, the middleware is only executed for routes that start with `/users` in the router.

3. **Route-specific Middleware**:
   You can also apply middleware to specific HTTP methods for particular routes, just like application-level middleware. This allows you to handle specific functionality, like authentication or validation, for individual routes.

   Example (route-specific middleware for a `GET` request):

   ```javascript
   router.get('/users/:id', (req, res, next) => {
     console.log(`Fetching user with ID: ${req.params.id}`);
     next();  // Pass control to the next middleware or route handler
   }, (req, res) => {
     res.send(`User details for ID: ${req.params.id}`);
   });
   ```

   Here, the middleware logs the user ID when handling `GET` requests to `/users/:id`, and then the route handler sends a response.

---

#### Important Features of Router-level Middleware

- **Modular Structure**: Router-level middleware allows you to encapsulate logic for a particular group of related routes, making it easy to organize and scale your application. For example, you might create a router for handling authentication and another for managing users.
  
  Example of multiple routers:

  ```javascript
  const authRouter = express.Router();
  const userRouter = express.Router();

  authRouter.use((req, res, next) => {
    console.log('Authentication middleware');
    next();
  });

  userRouter.use((req, res, next) => {
    console.log('User-related middleware');
    next();
  });

  authRouter.get('/login', (req, res) => {
    res.send('Login page');
  });

  userRouter.get('/profile', (req, res) => {
    res.send('User profile');
  });

  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  ```

  In this example, we have two separate routers (`authRouter` and `userRouter`), each with their own middleware and routes.

- **Error-handling**: Just like application-level middleware, error-handling middleware can be added to the router. These middleware functions take four arguments (`err, req, res, next`) and are used to catch and handle errors specific to the routes in the router.

  Example (error-handling middleware for a router):

  ```javascript
  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  ```

- **Mounting Routers**: After defining your router with middleware and routes, you use `app.use()` to mount the router on a specific path. The path you specify is the "mount point" for the router, and all routes defined within the router will be prefixed with that mount path.

  Example (mounting a router):

  ```javascript
  app.use('/api/v1', router);
  ```

  Here, all the routes defined in the `router` will be prefixed with `/api/v1`, so the route `/users` would be accessed via `/api/v1/users`.

---

#### Skipping Middleware in Router-level Middleware

In router-level middleware, you can skip remaining middleware and route handlers by using `next('route')`. This is useful if you want to skip to the next route if a certain condition is met.

Example (skipping middleware):

```javascript
router.get('/users/:id', (req, res, next) => {
  if (req.params.id === '0') {
    next('route');  // Skip to the next route handler
  } else {
    next();
  }
}, (req, res) => {
  res.send('Regular user response');
});

router.get('/users/:id', (req, res) => {
  res.send('Special user response for ID 0');
});
```

In this case, if the user ID is `0`, the request will skip the first route handler and go directly to the second one.

---

### Summary

**Router-level middleware** in Express.js allows you to apply middleware specifically to a set of routes defined within an `express.Router()` instance. This middleware is ideal for managing route-specific functionality, grouping related routes together, and applying shared logic, such as authentication or validation, to a subset of routes in a modular way. It makes your application structure cleaner, especially when dealing with large, complex applications, and provides the flexibility to handle requests at the route level rather than globally.