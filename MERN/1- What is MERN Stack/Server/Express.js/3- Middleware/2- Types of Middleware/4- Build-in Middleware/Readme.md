### Built-in Middleware in Express.js

Express.js provides several **built-in middleware** functions that simplify common tasks in handling HTTP requests and responses. These middleware functions are part of Express and are included by default to perform essential tasks like serving static files, parsing incoming request bodies, and more.

Starting with **Express 4.x**, these built-in middleware functions are no longer bundled directly with Express but are now available as separate modules that can be installed independently. Despite this, they are still commonly used in most Express applications.

Here’s a detailed overview of the built-in middleware functions provided by Express:

---

### 1. **`express.static` (Serving Static Files)**

The `express.static` middleware is used to serve static files, such as HTML, CSS, images, JavaScript files, and more. It allows your Express app to deliver these files directly from a folder on your server, making it easy to host assets like images or front-end code.

**Syntax:**
```javascript
app.use(express.static('public'));
```

- `express.static` is typically used to serve static assets from a directory. In the example above, it serves all files within the `public` directory.
- It automatically handles caching and sets appropriate headers to optimize the delivery of static files.

**Example:**
```javascript
const express = require('express');
const app = express();

// Serve static files from the 'public' folder
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
In this case, any file located in the `public` directory can be accessed by the client. For example, if there is an `index.html` file inside `public`, it can be accessed at `http://localhost:3000/index.html`.

---

### 2. **`express.json` (Parsing JSON Bodies)**

The `express.json` middleware is used to parse incoming JSON payloads in the request body. It is typically used in APIs that accept JSON-formatted data, such as when a client sends data in a POST or PUT request.

**Syntax:**
```javascript
app.use(express.json());
```

- This middleware parses the JSON data in the body of the request and populates `req.body` with the resulting object.
- It also handles errors if the body is malformed or not valid JSON by sending a `400 Bad Request` response.

**Example:**
```javascript
const express = require('express');
const app = express();

// Use the express.json middleware to parse JSON bodies
app.use(express.json());

app.post('/data', (req, res) => {
  console.log(req.body);  // Access the parsed JSON data
  res.send('Received JSON data');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
In this example:
- The `express.json` middleware automatically parses the JSON data in the request body.
- The parsed data can then be accessed using `req.body` in the route handler.

---

### 3. **`express.urlencoded` (Parsing URL-encoded Bodies)**

The `express.urlencoded` middleware is used to parse URL-encoded data in the request body, which is commonly used when submitting forms in web applications. URL-encoded data is typically submitted with `application/x-www-form-urlencoded` content type.

**Syntax:**
```javascript
app.use(express.urlencoded({ extended: true }));
```

- The `{ extended: true }` option allows you to handle nested objects in URL-encoded data, while `{ extended: false }` would limit it to simple key-value pairs.
- URL-encoded data is parsed and placed into `req.body` for easy access.

**Example:**
```javascript
const express = require('express');
const app = express();

// Use the express.urlencoded middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.post('/form', (req, res) => {
  console.log(req.body);  // Access the parsed URL-encoded data
  res.send('Received form data');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
In this example:
- The `express.urlencoded` middleware parses the form data sent via a POST request.
- The parsed data is accessible via `req.body`.

---

### 4. **`express.raw` (Parsing Raw Request Bodies)**

The `express.raw` middleware is used to parse incoming request bodies as raw buffers. This is useful when dealing with binary data (e.g., images, audio files, or other non-textual data) that you need to handle directly as a buffer.

**Syntax:**
```javascript
app.use(express.raw({ type: 'application/octet-stream' }));
```

- It processes incoming requests as raw buffer data and places the buffer in `req.body`.
- This middleware is typically used when you expect to handle binary data.

**Example:**
```javascript
const express = require('express');
const app = express();

// Use the express.raw middleware to parse raw request bodies
app.use(express.raw({ type: 'application/octet-stream' }));

app.post('/upload', (req, res) => {
  console.log(req.body);  // Access the raw buffer data
  res.send('Received raw data');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
In this example:
- The request body will be handled as a raw binary buffer, and you can access it using `req.body`.

---

### 5. **`express.text` (Parsing Plain Text Request Bodies)**

The `express.text` middleware parses incoming request bodies as plain text. It’s commonly used when the body of the request contains plain textual data, rather than JSON or form data.

**Syntax:**
```javascript
app.use(express.text());
```

- It places the parsed text content into `req.body`.

**Example:**
```javascript
const express = require('express');
const app = express();

// Use the express.text middleware to parse plain text bodies
app.use(express.text());

app.post('/text', (req, res) => {
  console.log(req.body);  // Access the parsed plain text data
  res.send('Received text data');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
In this example:
- The `express.text` middleware parses the incoming request body as plain text and stores it in `req.body`.

---

### When to Use Built-in Middleware

- **`express.static`**: Use it when you need to serve static assets such as HTML files, images, JavaScript files, etc.
- **`express.json`**: Use it when you expect to receive JSON data in the body of requests (commonly used in REST APIs).
- **`express.urlencoded`**: Use it when handling form submissions or other URL-encoded data.
- **`express.raw`**: Use it for handling raw binary data (e.g., when processing file uploads).
- **`express.text`**: Use it when handling plain text data in requests.

---

### Summary

**Built-in middleware** in Express simplifies common tasks like parsing incoming request bodies, serving static files, and more. These middleware functions are designed to streamline the development of web applications and APIs by handling basic but essential tasks for you. Express provides several built-in middleware options such as:
- `express.static` for serving static files.
- `express.json` for parsing JSON bodies.
- `express.urlencoded` for parsing URL-encoded bodies.
- `express.raw` for handling raw binary data.
- `express.text` for parsing plain text bodies.

These middleware are fundamental components of many Express applications and provide the functionality needed for most web applications out-of-the-box.