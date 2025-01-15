### **Using Templating Engines with Express.js**  

Templating engines allow you to dynamically generate HTML content by embedding server-side logic into static HTML templates. In an Express.js application, you can easily integrate various templating engines to render dynamic content and serve HTML files. This helps in building **Server-Side Rendered (SSR)** applications where the server generates the final HTML before sending it to the client.

In this guide, we'll cover how to set up and use popular templating engines like **EJS**, **Pug**, and **Handlebars (HBS)** with Express.js.

---

## 📚 **Steps to Use a Templating Engine in Express.js**

1. **Install the desired templating engine.**
2. **Set the view engine in your Express app.**
3. **Create template files in the `views` folder.**
4. **Use `res.render()` to render templates and pass dynamic data.**

---

## 🛠 **1. Using EJS (Embedded JavaScript)**  

**EJS (Embedded JavaScript)** is one of the most widely used templating engines due to its similarity to standard HTML and its ability to embed JavaScript logic within templates.

### **Installation:**
```bash
npm install ejs
```

### **Setup:**
In your Express app, set **EJS** as the templating engine using `app.set()`:

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

### **Template File (`views/profile.ejs`):**
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
- The `res.render()` method renders the `profile.ejs` template.
- The `user` object is passed to the template, and its values are injected into the HTML using the `<%= %>` syntax.

---

## 🛠 **2. Using Pug (formerly Jade)**  

**Pug** is a minimalist, indentation-based templating engine that eliminates the need for closing tags and uses a cleaner syntax.

### **Installation:**
```bash
npm install pug
```

### **Setup:**
In your Express app, set **Pug** as the templating engine using `app.set()`:

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

### **Template File (`views/profile.pug`):**
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
- The `res.render()` method renders the `profile.pug` template.
- Pug uses a **cleaner, indentation-based syntax** to generate HTML.

---

## 🛠 **3. Using Handlebars (HBS)**  

**Handlebars** is a logic-less templating engine that uses the **Mustache (`{{ }}`)** syntax for embedding dynamic content.

### **Installation:**
```bash
npm install hbs
```

### **Setup:**
In your Express app, set **Handlebars** as the templating engine using `app.set()`:

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

### **Template File (`views/profile.hbs`):**
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

In this example:
- The `res.render()` method renders the `profile.hbs` template.
- Handlebars uses the `{{ }}` syntax to embed dynamic content.

---

## 🔧 **Passing Dynamic Data to Templates**

You can pass dynamic data to templates by providing an object to the `res.render()` method. Here's an example:

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

**EJS Template (`views/users.ejs`):**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Users</title>
</head>
<body>
  <h1>Users List</h1>
  <ul>
    <% users.forEach(user => { %>
      <li><%= user.name %> - Age: <%= user.age %></li>
    <% }) %>
  </ul>
</body>
</html>
```

---

## ⚡ **Using Layouts and Partials in Templating Engines**

Most templating engines support the concept of **layouts** and **partials** to avoid repetition of common elements like headers, footers, and navigation bars.

### **Example of Partials in EJS:**

Create a partial file (`views/partials/header.ejs`):

```html
<header>
  <h1>My Website</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
```

In your main template (`views/index.ejs`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Home</title>
</head>
<body>
  <% include partials/header %>
  <h2>Welcome to My Website!</h2>
</body>
</html>
```

---

## 🔍 **Comparison of Popular Templating Engines in Express.js**

| **Feature**        | **EJS**             | **Pug**                | **Handlebars (HBS)**     |
|--------------------|---------------------|-----------------------|--------------------------|
| Syntax             | Plain JavaScript    | Indentation-based      | Mustache (`{{ }}`) syntax |
| Learning Curve     | Easy                | Moderate              | Easy                      |
| Readability        | Similar to HTML     | Cleaner, but different | Similar to HTML           |
| Layouts/Partials   | Supported           | Supported             | Supported                 |
| Use Case           | General-purpose     | Minimalist designs     | Logic-less templates      |

---

## ✅ **Best Practices for Using Templating Engines in Express.js**

1. **Organize your views folder**:  
   Keep your template files organized in the `views` folder. Create subfolders for partials and layouts if needed.

2. **Use Partials for Reusability**:  
   Use partials for common components like headers, footers, and navigation bars.

3. **Pass Only Necessary Data**:  
   When using `res.render()`, pass only the data that is required for the template.

4. **Use Layouts to Avoid Repetition**:  
   Use layouts to define a common structure for your web pages and avoid code duplication.

---

## 🎯 **Conclusion**

Templating engines are powerful tools for building dynamic web applications in Express.js. They allow you to dynamically inject server-side data into HTML templates, making your web pages more interactive and maintainable. Express.js supports several templating engines, including **EJS**, **Pug**, and **Handlebars**, each with its unique syntax and features.

For most beginners, **EJS** is a great choice due to its similarity to HTML. However, you can choose other engines based on your project requirements.