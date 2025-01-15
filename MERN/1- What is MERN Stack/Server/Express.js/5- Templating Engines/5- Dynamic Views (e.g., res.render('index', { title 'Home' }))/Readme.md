### **Dynamic Views in Express.js**  
Dynamic views in Express.js allow you to pass data from the server to templates (view files) using the `res.render()` method. This enables the generation of web pages with content that changes based on the data passed. The data can include variables, objects, arrays, or even conditional logic for rendering different content.

Let’s dive deep into **dynamic views** with examples using various templating engines like **EJS**, **Pug**, and **Handlebars**.

---

## 🧩 **What Are Dynamic Views?**  
Dynamic views are templates that are rendered with dynamic data passed from the server. They allow you to:

- Display personalized content (e.g., user profiles).
- Create pages that change based on server-side data (e.g., product listings, blog posts).
- Use conditional logic to show or hide elements in the templates.

---

## 🔧 **How to Render Dynamic Views Using `res.render()`**

The **`res.render(view, data)`** method is used to render a dynamic view. Here's how it works:

### **Syntax:**
```javascript
res.render('view_name', { key1: value1, key2: value2 });
```

- **`view_name`**: The name of the view file (without the file extension).
- **`data`**: An object containing key-value pairs that will be passed to the view for dynamic rendering.

---

### 📝 **Example 1: Dynamic Views with EJS**

### **Step 1: Set Up Express and EJS**
```bash
npm install express ejs
```

### **Step 2: Configure the View Engine**
```javascript
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
```

### **Step 3: Create a Route with Dynamic Data**
```javascript
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', message: 'Welcome to Saad’s Website!' });
});
```

### **Step 4: Create the EJS Template (views/index.ejs)**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><%= title %></title>
</head>
<body>
  <h1><%= message %></h1>
</body>
</html>
```

### **Output:**
```
Welcome to Saad’s Website!
```

---

### 📝 **Example 2: Dynamic Views with Pug**

### **Step 1: Set Up Express and Pug**
```bash
npm install express pug
```

### **Step 2: Configure the View Engine**
```javascript
const express = require('express');
const app = express();

app.set('view engine', 'pug');
```

### **Step 3: Create a Route with Dynamic Data**
```javascript
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', message: 'Welcome to Saad’s Website!' });
});
```

### **Step 4: Create the Pug Template (views/index.pug)**
```pug
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    title= title
  body
    h1= message
```

---

### 📝 **Example 3: Dynamic Views with Handlebars (HBS)**

### **Step 1: Set Up Express and HBS**
```bash
npm install express hbs
```

### **Step 2: Configure the View Engine**
```javascript
const express = require('express');
const app = express();

app.set('view engine', 'hbs');
```

### **Step 3: Create a Route with Dynamic Data**
```javascript
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', message: 'Welcome to Saad’s Website!' });
});
```

### **Step 4: Create the HBS Template (views/index.hbs)**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{title}}</title>
</head>
<body>
  <h1>{{message}}</h1>
</body>
</html>
```

---

## 🎯 **Passing Multiple Pieces of Data to Dynamic Views**

You can pass multiple pieces of data in the object provided to `res.render()`.

### **Example:**
```javascript
app.get('/profile', (req, res) => {
  const user = {
    name: 'Saad Salman Akram',
    age: 25,
    profession: 'Software Engineer',
    skills: ['JavaScript', 'Node.js', 'React']
  };

  res.render('profile', { title: 'Profile', user });
});
```

In the template:
```html
<h1>{{title}}</h1>
<p>Name: {{user.name}}</p>
<p>Age: {{user.age}}</p>
<p>Profession: {{user.profession}}</p>
```

---

## 🧪 **Using Conditional Logic in Dynamic Views**

### **EJS Example:**
```html
<% if (user.isAdmin) { %>
  <p>Welcome, Admin!</p>
<% } else { %>
  <p>Welcome, Guest!</p>
<% } %>
```

### **Pug Example:**
```pug
if user.isAdmin
  p Welcome, Admin!
else
  p Welcome, Guest!
```

---

## ✅ **Summary of Dynamic Views**

| **Templating Engine** | **Dynamic Syntax**            |
|-----------------------|--------------------------------|
| **EJS**               | `<%= data %>` / `<% logic %>`  |
| **Pug**               | `#{data}` / `if condition`     |
| **HBS**               | `{{data}}` / `{{#if condition}}` |

---

## 🚀 **Best Practices for Dynamic Views**

1. **Organize templates** in a dedicated `views` folder.
2. **Use partials** for reusable components like headers and footers.
3. **Pass only necessary data** to views to reduce payload size.
4. **Sanitize data** before rendering it to prevent XSS attacks.

---

## 🎯 **Conclusion**

Dynamic views in Express.js allow you to create interactive, data-driven web pages. By using templating engines like **EJS**, **Pug**, or **Handlebars**, you can easily render views with dynamic content and build web applications with enhanced user experiences.