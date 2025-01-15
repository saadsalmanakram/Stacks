### HTTP Method Routing (GET, POST, PUT, DELETE) in Express.js

In Express.js, you can define routes for specific HTTP methods such as **GET**, **POST**, **PUT**, and **DELETE**. Each HTTP method corresponds to a different action that the server should perform when handling the request. These methods are fundamental to the RESTful design of APIs and web applications.

### 1. **GET Method**
The **GET** method is used to retrieve data from the server. It is the most common HTTP method used to fetch resources, such as HTML pages, images, or API data. In Express.js, you can use the `.get()` function to define handlers for GET requests.

#### Example:
```js
app.get('/user/:id', (req, res) => {
  const userId = req.params.id
  // Fetch user from a database or other source
  res.send(`User details for ID: ${userId}`)
})
```
- **Request Example:** `GET /user/42`
- **Response Example:** `User details for ID: 42`

In this example, a GET request to `/user/:id` returns details about a user with the specified ID.

### 2. **POST Method**
The **POST** method is used to send data to the server, typically for creating a new resource. It is commonly used when submitting forms, uploading files, or creating new entries in a database. In Express.js, you use `.post()` to define handlers for POST requests.

#### Example:
```js
app.post('/user', (req, res) => {
  const { name, age } = req.body
  // Create a new user in the database
  res.status(201).send(`User ${name} created with age ${age}`)
})
```
- **Request Example:**
  - `POST /user` with body `{ "name": "John", "age": 30 }`
- **Response Example:** `User John created with age 30`

In this example, a POST request to `/user` creates a new user based on the data provided in the request body.

### 3. **PUT Method**
The **PUT** method is used to update an existing resource on the server. It is typically used for updating records in a database or modifying existing data. A PUT request should be idempotent, meaning multiple identical requests should have the same effect as a single request. In Express.js, you can define PUT handlers using `.put()`.

#### Example:
```js
app.put('/user/:id', (req, res) => {
  const userId = req.params.id
  const { name, age } = req.body
  // Update the user in the database
  res.send(`User ${userId} updated with name ${name} and age ${age}`)
})
```
- **Request Example:**
  - `PUT /user/42` with body `{ "name": "John", "age": 31 }`
- **Response Example:** `User 42 updated with name John and age 31`

In this example, a PUT request to `/user/:id` updates an existing user with the new data provided in the request body.

### 4. **DELETE Method**
The **DELETE** method is used to remove a resource from the server. It is commonly used to delete records from a database or remove files from the server. In Express.js, you can define DELETE handlers using `.delete()`.

#### Example:
```js
app.delete('/user/:id', (req, res) => {
  const userId = req.params.id
  // Delete the user from the database
  res.send(`User with ID ${userId} deleted`)
})
```
- **Request Example:** `DELETE /user/42`
- **Response Example:** `User with ID 42 deleted`

In this example, a DELETE request to `/user/:id` deletes the user with the specified ID from the server.

### 5. **HTTP Method Routing with Different Methods for the Same Route**
You can define multiple handlers for different HTTP methods on the same route. This allows you to implement full CRUD (Create, Read, Update, Delete) functionality on a single resource.

#### Example:
```js
// GET: Retrieve user information
app.get('/user/:id', (req, res) => {
  const userId = req.params.id
  // Fetch user from database
  res.send(`User details for ID: ${userId}`)
})

// POST: Create a new user
app.post('/user', (req, res) => {
  const { name, age } = req.body
  // Create new user in database
  res.status(201).send(`User ${name} created with age ${age}`)
})

// PUT: Update user information
app.put('/user/:id', (req, res) => {
  const userId = req.params.id
  const { name, age } = req.body
  // Update user information in the database
  res.send(`User ${userId} updated with name ${name} and age ${age}`)
})

// DELETE: Remove user from database
app.delete('/user/:id', (req, res) => {
  const userId = req.params.id
  // Delete the user from the database
  res.send(`User with ID ${userId} deleted`)
})
```

- **Request Examples:**
  - `GET /user/42` → `User details for ID: 42`
  - `POST /user` with `{ "name": "John", "age": 30 }` → `User John created with age 30`
  - `PUT /user/42` with `{ "name": "John", "age": 31 }` → `User 42 updated with name John and age 31`
  - `DELETE /user/42` → `User with ID 42 deleted`

### 6. **HTTP Method Routing with `app.route()`**
You can use `app.route()` to chain multiple HTTP methods for the same route. This is useful for simplifying the routing and making the code more readable.

#### Example:
```js
app.route('/user/:id')
  .get((req, res) => {
    const userId = req.params.id
    // Fetch and return user details
    res.send(`User details for ID: ${userId}`)
  })
  .put((req, res) => {
    const userId = req.params.id
    const { name, age } = req.body
    // Update user information
    res.send(`User ${userId} updated with name ${name} and age ${age}`)
  })
  .delete((req, res) => {
    const userId = req.params.id
    // Delete the user
    res.send(`User with ID ${userId} deleted`)
  })
```

- **Request Example:**
  - `GET /user/42` → `User details for ID: 42`
  - `PUT /user/42` with `{ "name": "John", "age": 31 }` → `User 42 updated with name John and age 31`
  - `DELETE /user/42` → `User with ID 42 deleted`

### 7. **Handling Unknown HTTP Methods**
If you want to handle HTTP methods that are not defined in your routes, you can define a catch-all handler to manage unsupported HTTP methods for specific routes.

#### Example:
```js
app.all('/user/:id', (req, res) => {
  res.status(405).send(`${req.method} method is not allowed for this route`)
})
```

- **Request Example:** `PATCH /user/42`
- **Response Example:** `PATCH method is not allowed for this route`

In this case, `app.all()` catches any HTTP method for the route `/user/:id` and returns a `405 Method Not Allowed` response.

### Summary of HTTP Method Routing in Express.js:

- **GET**: Used to retrieve resources or data. Defined using `app.get()`.
- **POST**: Used to create new resources. Defined using `app.post()`.
- **PUT**: Used to update existing resources. Defined using `app.put()`.
- **DELETE**: Used to remove resources. Defined using `app.delete()`.

You can define multiple methods for the same route using `app.route()` to handle the CRUD operations for a resource in a cleaner and more readable way. By using these methods appropriately, you can build fully RESTful APIs and web applications with Express.js.