# **Using Express Router to Handle Routes Modularly**

In large Express.js applications, organizing your routes into **separate, modular files** improves **readability**, **maintainability**, and **scalability**. This is where **Express Router** comes into play. Express Router allows you to create **modular, mountable route handlers** to manage different parts of your application.

This guide will cover:

1. What is Express Router?
2. Benefits of using Express Router
3. Setting up Express Router
4. Creating Modular Routes
5. Mounting Routers in the Main App
6. Using Middleware in Routers
7. Parameter Handling with Express Router
8. Best Practices for Route Organization

---

## **🔧 1. What is Express Router?**

**Express Router** is a built-in feature of Express that helps you create **modular route handlers**. Instead of defining all routes in a single file (e.g., `app.js` or `server.js`), you can split them into separate files based on their functionality.

For example:
- `/users` routes can be in `users.js`.
- `/products` routes can be in `products.js`.

---

## **💡 2. Benefits of Using Express Router**

- **Better Code Organization:** Split routes by feature or functionality.
- **Easier Maintenance:** Make your code more readable and maintainable.
- **Improved Scalability:** Easily add new routes without cluttering your main file.
- **Middleware Per Router:** Apply specific middleware to different route groups.

---

## **🧩 3. Setting Up Express Router**

To use the Express Router, you need to **create a router instance** and define your routes on it. Then, you can **mount** the router to your main app.

### **Basic Setup Example:**
```javascript
const express = require('express');
const app = express();
const router = express.Router();

router.get('/users', (req, res) => {
  res.send('Users List');
});

app.use('/', router);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

---

## **🔧 4. Creating Modular Routes**

Let’s refactor an Express app to use modular routes.

### **Step 1: Create a `routes` folder**

Organize your project like this:

```
my-express-app/
│
├── server.js
└── routes/
    ├── users.js
    └── products.js
```

---

### **Step 2: Create the `users.js` file in the `routes` folder**

```javascript
const express = require('express');
const router = express.Router();

// Define routes
router.get('/', (req, res) => {
  res.send('Users List');
});

router.get('/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});

module.exports = router;
```

---

### **Step 3: Create the `products.js` file in the `routes` folder**

```javascript
const express = require('express');
const router = express.Router();

// Define routes
router.get('/', (req, res) => {
  res.send('Products List');
});

router.get('/:id', (req, res) => {
  res.send(`Product ID: ${req.params.id}`);
});

module.exports = router;
```

---

### **Step 4: Modify `server.js` to use these routes**

```javascript
const express = require('express');
const app = express();

// Import route modules
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

// Mount routers
app.use('/users', usersRouter);
app.use('/products', productsRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

**How It Works:**
- `/users` will be handled by the `users.js` file.
- `/products` will be handled by the `products.js` file.

---

## **🔧 5. Mounting Routers in the Main App**

You can **mount routers** to specific paths using **`app.use()`**.

### **Example:**
```javascript
app.use('/users', usersRouter);
app.use('/products', productsRouter);
```

**Routes:**
- `/users` → Handled by `usersRouter`
- `/products` → Handled by `productsRouter`

---

## **🧩 6. Using Middleware in Routers**

You can apply **middleware functions** to specific routers.

### **Example: Applying Middleware to a Router**
```javascript
// users.js
const express = require('express');
const router = express.Router();

// Middleware for this router
router.use((req, res, next) => {
  console.log('Request to /users');
  next();
});

router.get('/', (req, res) => {
  res.send('Users List');
});

module.exports = router;
```

---

## **🔧 7. Parameter Handling with Express Router**

You can handle **route parameters** using **Express Router**.

### **Example: Handling Path Parameters**
```javascript
// products.js
const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
  const productId = req.params.id;
  res.send(`Product ID: ${productId}`);
});

module.exports = router;
```

**Request:**  
`GET /products/456`  
**Response:**  
```
Product ID: 456
```

---

### **🧩 Using `app.param()` in Express Router**

You can use **`router.param()`** to handle route parameters.

```javascript
// users.js
router.param('id', (req, res, next, id) => {
  console.log(`User ID: ${id}`);
  next();
});

router.get('/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});
```

**Request:**  
`GET /users/123`  
**Output in Console:**  
```
User ID: 123
```

---

## **🔧 8. Best Practices for Route Organization**

1. **Create a `routes` folder** and split routes by functionality.
2. **Use descriptive file names** for route modules (e.g., `users.js`, `products.js`).
3. **Use router-level middleware** for specific routes.
4. **Keep your main app file (e.g., `server.js`) clean** by mounting routers.
5. **Handle errors gracefully** in routers.

---

## **📚 Example Project Structure**

```
my-express-app/
│
├── server.js
├── routes/
│   ├── users.js
│   └── products.js
└── middlewares/
    └── auth.js
```

### **server.js**
```javascript
const express = require('express');
const app = express();

// Import routers
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

// Mount routers
app.use('/users', usersRouter);
app.use('/products', productsRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

---

## **✅ Summary**

- **Express Router** helps organize routes into separate files.
- Use **`express.Router()`** to create modular routes.
- Use **`app.use()`** to mount routers in the main app.
- Apply **middleware** to specific routers or route groups.
- Handle **path parameters** and **query parameters** using routers.
  
