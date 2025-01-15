### Dynamic Routing and Routing with Wildcards in Express.js

Express.js allows you to create dynamic routes where parts of the route can vary based on the request. This is achieved using route parameters, and you can also use wildcards to match multiple or undefined parts of a route. Here's how dynamic routing and wildcard routing work in Express.js.

### 1. **Dynamic Routing** (Route Parameters)
Dynamic routing allows parts of the route path to act as placeholders, capturing values from the URL. These values are accessible within the route handler through `req.params`. You can define route parameters by adding a colon (`:`) before the name of the parameter in the route path.

#### Example:
```js
// Capture a single parameter: `id`
app.get('/user/:id', (req, res) => {
  const userId = req.params.id
  res.send(`User ID: ${userId}`)
})

// Capture multiple parameters: `id` and `postId`
app.get('/user/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params
  res.send(`User ID: ${id}, Post ID: ${postId}`)
})
```

In the above example:
- `:id` and `:postId` are dynamic route parameters. These values are captured from the URL and can be accessed using `req.params`.
- **Request Example:** `GET /user/34/post/8989`
- **Response Example:** `User ID: 34, Post ID: 8989`

### 2. **Dynamic Routing with Regular Expressions**
You can further refine dynamic routing using regular expressions. By doing so, you can control what values a route parameter can capture based on patterns.

#### Example:
```js
// Route that captures only numeric `id`
app.get('/user/:id([0-9]+)', (req, res) => {
  const userId = req.params.id
  res.send(`User ID (numeric): ${userId}`)
})
```

- In this example, the `id` parameter will only match URLs with numeric values (`[0-9]+`).
- **Request Example:** `GET /user/42`
- **Response Example:** `User ID (numeric): 42`

If the URL doesn’t match the pattern, Express will not invoke the handler.

### 3. **Routing with Wildcards**
In Express, wildcards are used to match any part of a route path. Wildcards can be very useful in scenarios where you need to match any number of segments in a URL or handle undefined paths.

#### 3.1. **Single Wildcard (`*`)**
The `*` wildcard matches any part of the route path. It's often used for matching all routes, typically in 404 error handlers or in catching any route path.

#### Example:
```js
// Match all routes under `/docs/`
app.get('/docs/*', (req, res) => {
  res.send('This will catch any path under /docs/')
})
```

- **Request Example:** `GET /docs/tutorials` or `GET /docs/guide/express`
- **Response Example:** `This will catch any path under /docs/`

#### 3.2. **Wildcard for Undefined Paths (404 handler)**
You can use a wildcard route (`*`) at the end of all defined routes to catch any unhandled routes, usually for a 404 page.

#### Example:
```js
// 404 handler for undefined routes
app.get('*', (req, res) => {
  res.status(404).send('Page not found')
})
```

- **Request Example:** `GET /unknown`
- **Response Example:** `Page not found`

#### 3.3. **Wildcard with Multiple Path Segments (`*` matches everything)**
You can use a wildcard to match multiple path segments in one go. This is often useful for catching routes where the segments can vary.

#### Example:
```js
// Catch all routes under `/files/*`
app.get('/files/*', (req, res) => {
  res.send(`File path: ${req.params[0]}`)
})
```

- **Request Example:** `GET /files/images/photo.jpg`
- **Response Example:** `File path: images/photo.jpg`

Here, the wildcard captures everything after `/files/` and stores it in `req.params[0]`.

### 4. **Combination of Route Parameters and Wildcards**
You can combine dynamic route parameters with wildcards to create highly flexible routes.

#### Example:
```js
// Match dynamic parameters along with wildcards
app.get('/user/:id/*', (req, res) => {
  const userId = req.params.id
  const restOfPath = req.params[0]
  res.send(`User ID: ${userId}, Path after ID: ${restOfPath}`)
})
```

- **Request Example:** `GET /user/34/activities/10`
- **Response Example:** `User ID: 34, Path after ID: activities/10`

In this case, `:id` is a dynamic route parameter, and the `*` wildcard captures everything after it.

### 5. **Wildcard for Query Parameters**
It’s important to note that wildcards and route parameters only capture parts of the path, not the query parameters. Query parameters come after the `?` in the URL and are accessible via `req.query`.

#### Example:
```js
// Handle query parameters
app.get('/search/*', (req, res) => {
  const searchQuery = req.query.q
  const searchPath = req.params[0]
  res.send(`Search Query: ${searchQuery}, Path: ${searchPath}`)
})
```

- **Request Example:** `GET /search/images?q=cats`
- **Response Example:** `Search Query: cats, Path: images`

### Summary

- **Dynamic Routing**: Allows capturing URL segments using route parameters (e.g., `:id`, `:category`). These values are accessible through `req.params`.
- **Route Parameters with Regular Expressions**: You can use regular expressions to control what values a route parameter will capture (e.g., only numeric IDs).
- **Wildcard Routing (`*`)**: The `*` wildcard matches any part of the path. It’s commonly used for 404 handling or for catching all routes under a certain path.
- **Combination of Parameters and Wildcards**: You can mix route parameters and wildcards to match more complex URL structures.

By using dynamic routing and wildcards, you can make your Express.js routes more flexible and adaptable to a wide variety of URL structures and use cases.