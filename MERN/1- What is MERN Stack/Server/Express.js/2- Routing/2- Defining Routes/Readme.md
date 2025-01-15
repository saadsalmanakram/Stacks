In Express.js, defining routes involves specifying the path (endpoint) and the HTTP method (GET, POST, etc.) for which a handler function will respond. Routes can be defined for specific HTTP methods, and the handler functions are executed when a request matches both the method and the path.

### Steps to Define Routes in Express.js

1. **Using HTTP Methods**: You use the Express app object (`app`) with HTTP methods like `get()`, `post()`, `put()`, `delete()`, etc., to define routes for specific HTTP requests.

   - **GET Route**:
     ```js
     app.get('/path', (req, res) => {
       res.send('Response for GET request')
     })
     ```

   - **POST Route**:
     ```js
     app.post('/path', (req, res) => {
       res.send('Response for POST request')
     })
     ```

2. **Defining Multiple Routes for Different HTTP Methods**: You can define routes for the same path but different HTTP methods to handle different types of requests. This is useful for handling form submissions (POST) and retrieving data (GET), for example.

   - **Example**:
     ```js
     app.get('/user', (req, res) => {
       res.send('Get user data')
     })
     
     app.post('/user', (req, res) => {
       res.send('Create new user')
     })
     ```

3. **Route Parameters**: You can define dynamic routes using route parameters, which are named placeholders within the route path. These parameters are captured from the URL and stored in the `req.params` object, allowing you to access their values in the handler.

   - **Example**:
     ```js
     app.get('/user/:id', (req, res) => {
       const userId = req.params.id
       res.send(`User ID: ${userId}`)
     })
     ```

   - **Path with Multiple Parameters**:
     ```js
     app.get('/user/:id/post/:postId', (req, res) => {
       const { id, postId } = req.params
       res.send(`User ID: ${id}, Post ID: ${postId}`)
     })
     ```

4. **Chained Routes with `app.route()`**: You can chain multiple route handlers for the same path using the `app.route()` method. This reduces redundancy by allowing you to define routes in a modular way.

   - **Example**:
     ```js
     app.route('/book')
       .get((req, res) => {
         res.send('Get a random book')
       })
       .post((req, res) => {
         res.send('Add a book')
       })
       .put((req, res) => {
         res.send('Update the book')
       })
     ```

5. **Using `express.Router()` for Modular Routing**: When building larger applications, it’s a good practice to use the `express.Router()` class to create modular, mountable route handlers. A router instance allows you to group related routes together in a separate module, which you can then use in your main app.

   - **Creating a Router Module**:
     ```js
     const express = require('express')
     const router = express.Router()

     router.get('/', (req, res) => {
       res.send('Home Page')
     })

     router.get('/about', (req, res) => {
       res.send('About Page')
     })

     module.exports = router
     ```

   - **Using the Router in the Main App**:
     ```js
     const app = express()
     const birdsRouter = require('./birds')

     app.use('/birds', birdsRouter)
     ```

   In this example, the `birdsRouter` handles routes under the `/birds` path, and the app will now respond to requests such as `/birds` and `/birds/about`.

6. **Wildcard Routes**: You can use wildcard (`*`) routes to handle all paths that don’t match any defined routes. This is often used for handling 404 pages.

   - **Example**:
     ```js
     app.get('*', (req, res) => {
       res.status(404).send('Page Not Found')
     })
     ```

### Summary
- **Route Methods**: Define routes based on HTTP methods (GET, POST, etc.).
- **Route Paths**: Specify the URL paths for the routes.
- **Route Parameters**: Use dynamic segments (`:param`) to capture data from the URL.
- **Route Chaining**: Use `app.route()` to chain multiple handlers for a single path.
- **Modular Routing**: Use `express.Router()` to break the app into smaller, reusable route modules. 

By following these steps, you can effectively define routes in your Express.js application, making it modular, scalable, and easy to maintain.