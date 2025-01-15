# **Accessing Query Parameters in Express.js**

Query parameters in Express.js are key-value pairs appended to the URL after a **`?`** symbol. They allow users to send additional information to the server through the URL. Query parameters are commonly used for filtering, sorting, searching, pagination, and more.

In Express, you can access query parameters using the **`req.query`** object. Let's explore how query parameters work and how to use them effectively in your routes.

---

## **🧩 What Are Query Parameters?**

Query parameters are a part of the URL that provide **additional information** to the server. They are included after the **`?`** symbol and are separated by **`&`** if there are multiple parameters.

### **Example URL with Query Parameters:**
```
http://localhost:3000/search?name=John&age=25
```

In this example:
- **`name=John`** is a query parameter with `name` as the key and `John` as the value.
- **`age=25`** is another query parameter with `age` as the key and `25` as the value.

---

## **🔧 How to Access Query Parameters in Express.js**

You can access query parameters using the **`req.query`** object, which returns an object containing all the query parameters as key-value pairs.

### **Example: Accessing Query Parameters**
```javascript
const express = require('express');
const app = express();

app.get('/search', (req, res) => {
  const name = req.query.name;
  const age = req.query.age;

  res.send(`Name: ${name}, Age: ${age}`);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### **How It Works:**
- When you visit **`http://localhost:3000/search?name=John&age=25`**, the server will respond with:
  ```
  Name: John, Age: 25
  ```

---

## **🔧 Handling Optional Query Parameters**

Query parameters are **optional**. If a query parameter is not provided, its value will be `undefined`.

### **Example: Optional Query Parameters**
```javascript
app.get('/search', (req, res) => {
  const name = req.query.name || 'Guest';
  const age = req.query.age || 'Unknown';

  res.send(`Name: ${name}, Age: ${age}`);
});
```

### **Output:**
- **`http://localhost:3000/search?name=John`** will respond with:
  ```
  Name: John, Age: Unknown
  ```
- **`http://localhost:3000/search`** will respond with:
  ```
  Name: Guest, Age: Unknown
  ```

---

## **🔧 Handling Multiple Query Parameters**

You can pass multiple query parameters separated by **`&`**.

### **Example: Filtering with Query Parameters**
```javascript
app.get('/products', (req, res) => {
  const category = req.query.category;
  const price = req.query.price;

  res.send(`Category: ${category}, Price: ${price}`);
});
```

### **How It Works:**
- **`http://localhost:3000/products?category=electronics&price=500`** will respond with:
  ```
  Category: electronics, Price: 500
  ```

---

## **🧪 Example: Using Query Parameters for Search**

Let’s build a simple search endpoint using query parameters.

```javascript
app.get('/search', (req, res) => {
  const { name, age } = req.query;

  if (name && age) {
    res.send(`Searching for ${name}, Age ${age}`);
  } else if (name) {
    res.send(`Searching for ${name}`);
  } else {
    res.send('No search parameters provided');
  }
});
```

### **Output:**
- **`http://localhost:3000/search?name=John&age=25`** will respond with:
  ```
  Searching for John, Age 25
  ```
- **`http://localhost:3000/search?name=John`** will respond with:
  ```
  Searching for John
  ```

---

## **📚 Using `req.query` with Arrays**

Express also supports query parameters as arrays.

### **Example:**
```
http://localhost:3000/search?tags=javascript&tags=nodejs&tags=express
```

```javascript
app.get('/search', (req, res) => {
  const tags = req.query.tags;
  res.send(`Tags: ${tags}`);
});
```

### **Output:**
```
Tags: javascript,nodejs,express
```

You can convert the string into an array using:
```javascript
const tagsArray = Array.isArray(tags) ? tags : [tags];
```

---

## **✅ Validating Query Parameters**

It’s important to **validate and sanitize** query parameters to prevent malicious inputs.

### **Example: Validating Query Parameters**
```javascript
app.get('/search', (req, res) => {
  const { name, age } = req.query;

  if (!name) {
    return res.status(400).send('Name is required');
  }

  if (age && isNaN(age)) {
    return res.status(400).send('Age must be a number');
  }

  res.send(`Searching for ${name}, Age ${age || 'Unknown'}`);
});
```

---

## **🛠 Using Query Parameters with Database Queries**

Query parameters are commonly used for filtering database queries.

### **Example: Searching Users in a Database**
```javascript
const users = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Saad', age: 25 }
];

app.get('/users', (req, res) => {
  const { name, age } = req.query;

  let filteredUsers = users;

  if (name) {
    filteredUsers = filteredUsers.filter(user => user.name.toLowerCase() === name.toLowerCase());
  }

  if (age) {
    filteredUsers = filteredUsers.filter(user => user.age === parseInt(age));
  }

  res.json(filteredUsers);
});
```

### **Example Queries:**
- **`http://localhost:3000/users?name=John`** will return:
  ```json
  [{ "id": 1, "name": "John", "age": 25 }]
  ```
- **`http://localhost:3000/users?age=25`** will return:
  ```json
  [
    { "id": 1, "name": "John", "age": 25 },
    { "id": 3, "name": "Saad", "age": 25 }
  ]
  ```

---

## **📚 Accessing Query Parameters: Summary**

| **Property**     | **Description**                                     |
|------------------|-----------------------------------------------------|
| `req.query`      | An object containing all query parameters.          |
| `req.query.name` | Access the value of a specific query parameter.     |

---

## **🎯 Best Practices for Query Parameters**

1. **Validate user input** to prevent injection attacks.
2. **Use optional parameters wisely** to make your endpoints flexible.
3. **Document your API endpoints** to clarify what query parameters are supported.
4. **Use default values** to handle cases where query parameters are not provided.

---

## **✅ Summary**

- Query parameters are used to send additional information in the URL.
- Use **`req.query`** to access query parameters in Express.
- Query parameters are **optional** and can be **multiple**.
- Always **validate and sanitize** query parameters to ensure security.

---
