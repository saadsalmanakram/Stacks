### **What is a Templating Engine in Express.js?**  

A **Templating Engine** is a tool used to **dynamically generate HTML pages on the server-side** by embedding dynamic content into predefined templates. Instead of writing static HTML files for every page, you can create a template file that contains placeholders for dynamic data. The templating engine processes the template file, replaces placeholders with actual data, and returns the final HTML to the client.

Express.js supports several templating engines, such as **EJS**, **Pug**, and **Handlebars**, making it easy to create dynamic web pages.

---

### **Why Use a Templating Engine?**  
Templating engines help reduce redundancy by allowing developers to reuse the same template across multiple pages. Instead of hardcoding content into HTML files, you can:

✅ Insert dynamic content into web pages  
✅ Reuse common layout elements (like headers and footers)  
✅ Simplify HTML code maintenance  
✅ Make web pages more interactive by passing server-side data  

For example, if you need to display user information, instead of writing separate HTML files for each user, you can create a single template file and dynamically pass user data to it.

---

### **How Does a Templating Engine Work?**

Here’s a step-by-step breakdown of how a templating engine works in an Express.js application:

1. The client sends a request to the server (e.g., `/profile`).
2. The server retrieves the necessary data (e.g., from a database).
3. The server uses a templating engine to **inject the data into the template**.
4. The templating engine generates **the final HTML page** and sends it back to the client.

---

### **Popular Templating Engines in Express.js**

Here are some commonly used templating engines:

| **Templating Engine** | **Description**                              | **Installation Command**  |
|-----------------------|----------------------------------------------|--------------------------|
| **EJS**               | Easy-to-use syntax, supports plain JavaScript | `npm install ejs`        |
| **Pug**               | Minimal syntax, indentation-based            | `npm install pug`        |
| **Handlebars**        | Logic-less templates with Mustache syntax     | `npm install hbs`        |

---

### **1. Using EJS (Embedded JavaScript)**  
**EJS** is one of the most popular templating engines for Express.js. It allows you to embed JavaScript directly into HTML files.

#### **Installation:**
```bash
npm install ejs
```

#### **Setup:**
```javascript
const express = require('express');
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Example route
app.get('/profile', (req, res) => {
  const user = { name: 'John Doe', age: 30 };
  res.render('profile', { user });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

#### **EJS Template (`views/profile.ejs`):**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Profile</title>
</head>
<body>
  <h1>Welcome, <%= user.name %>!</h1>
  <p>Age: <%= user.age %></p>
</body>
</html>
```

In this example:
- The `res.render()` method is used to render the `profile.ejs` template.
- The placeholder `<%= user.name %>` is replaced by the value of `user.name` from the server.

---

### **2. Using Pug (formerly Jade)**  
**Pug** is a minimalist, indentation-based templating engine. It removes the need for closing tags and uses a cleaner syntax.

#### **Installation:**
```bash
npm install pug
```

#### **Setup:**
```javascript
const express = require('express');
const app = express();

// Set Pug as the templating engine
app.set('view engine', 'pug');

// Example route
app.get('/profile', (req, res) => {
  const user = { name: 'John Doe', age: 30 };
  res.render('profile', { user });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

#### **Pug Template (`views/profile.pug`):**
```pug
doctype html
html
  head
    title Profile
  body
    h1 Welcome, #{user.name}!
    p Age: #{user.age}
```

In this example:
- The placeholders `#{user.name}` and `#{user.age}` are replaced by the values from the server.

---

### **3. Using Handlebars (HBS)**  
**Handlebars** is another popular templating engine that uses the **Mustache syntax** (`{{ }}`) for placeholders. It is known for its simplicity and logic-less templates.

#### **Installation:**
```bash
npm install hbs
```

#### **Setup:**
```javascript
const express = require('express');
const app = express();

// Set Handlebars as the templating engine
app.set('view engine', 'hbs');

// Example route
app.get('/profile', (req, res) => {
  const user = { name: 'John Doe', age: 30 };
  res.render('profile', { user });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

#### **Handlebars Template (`views/profile.hbs`):**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Profile</title>
</head>
<body>
  <h1>Welcome, {{user.name}}!</h1>
  <p>Age: {{user.age}}</p>
</body>
</html>
```

---

### **4. Comparison of Templating Engines**

| **Feature**      | **EJS**                 | **Pug**                  | **Handlebars (HBS)**       |
|------------------|-------------------------|--------------------------|----------------------------|
| Syntax           | Plain JavaScript         | Indentation-based         | Mustache (`{{ }}`) syntax   |
| Learning Curve   | Easy                    | Moderate                 | Easy                        |
| Readability      | Similar to HTML          | Cleaner but different     | Similar to HTML             |
| Use Case         | General-purpose          | Minimalist designs        | Logic-less templates        |

---

### **5. Dynamic Content Example with EJS**

#### **Route with Array Data:**
```javascript
app.get('/users', (req, res) => {
  const users = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 35 }
  ];
  res.render('users', { users });
});
```

#### **EJS Template (`views/users.ejs`):**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Users List</title>
</head>
<body>
  <h1>Users</h1>
  <ul>
    <% users.forEach(user => { %>
      <li><%= user.name %> - Age: <%= user.age %></li>
    <% }) %>
  </ul>
</body>
</html>
```

In this example:
- The `users` array is passed to the `users.ejs` template.
- The template loops through the array and displays each user's information.

---

### **Benefits of Using a Templating Engine in Express.js**

✅ **Reduces Code Duplication**: Templates can reuse common components (e.g., headers, footers).  
✅ **Simplifies Dynamic Content Rendering**: Easily embed server-side data into HTML pages.  
✅ **Improves Code Organization**: Separates business logic from presentation logic.  
✅ **Supports Server-Side Rendering (SSR)**: Renders complete HTML pages on the server before sending them to the client.

---

### **Conclusion**

A **templating engine** is essential for building dynamic web applications in Express.js. It allows developers to create reusable templates and dynamically inject data into HTML pages. Express supports several templating engines, including **EJS**, **Pug**, and **Handlebars**, each with its own syntax and use cases.

For most projects, **EJS** is a great starting point due to its similarity to HTML and ease of use. However, if you prefer cleaner syntax or logic-less templates, you can choose **Pug** or **Handlebars** accordingly.