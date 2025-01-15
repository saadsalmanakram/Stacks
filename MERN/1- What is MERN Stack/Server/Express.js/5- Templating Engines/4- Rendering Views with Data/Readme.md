### **Rendering Views with Data in Express.js**

In Express.js, the **`res.render()`** method is used to render views (templates) with dynamic data and send the resulting HTML as a response to the client. This allows you to inject server-side data into your templates to create dynamic web pages.

Let’s go through the details of how to render views with data in Express.js using various templating engines like **EJS**, **Pug**, and **Handlebars (HBS)**.

---

## 🧩 **How `res.render()` Works**

The **`res.render()`** method takes two main arguments:
1. **The name of the view template file (without the file extension).**
2. **An object containing key-value pairs of data to be injected into the template.**

### **Syntax:**
```javascript
res.render(view, data);
```

- **`view`**: The name of the template file located in the `views` directory.
- **`data`**: An object containing the data you want to pass to the template.

---

## 🔧 **Example 1: Rendering Views with Data Using EJS**

### **Step 1: Install EJS**
```bash
npm install ejs
```

### **Step 2: Set the View Engine**
```javascript
const express = require('express');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
```

### **Step 3: Create a Route that Renders a View**
```javascript
app.get('/profile', (req, res) => {
  const user = {
    name: 'Saad Salman Akram',
    age: 25,
    profession: 'Software Engineer',
    skills: ['JavaScript', 'Node.js', 'React', 'Express']
  };

  res.render('profile', { user });
});
```

### **Step 4: Create the EJS Template (views/profile.ejs)**
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
  <p>Profession: <%= user.profession %></p>

  <h2>Skills:</h2>
  <ul>
    <% user.skills.forEach(function(skill) { %>
      <li><%= skill %></li>
    <% }); %>
  </ul>
</body>
</html>
```

### **Output:**
```
Welcome, Saad Salman Akram!
Age: 25
Profession: Software Engineer
Skills:
- JavaScript
- Node.js
- React
- Express
```

---

## 🔧 **Example 2: Rendering Views with Data Using Pug**

### **Step 1: Install Pug**
```bash
npm install pug
```

### **Step 2: Set the View Engine**
```javascript
const express = require('express');
const app = express();

// Set Pug as the view engine
app.set('view engine', 'pug');
```

### **Step 3: Create a Route that Renders a View**
```javascript
app.get('/profile', (req, res) => {
  const user = {
    name: 'Saad Salman Akram',
    age: 25,
    profession: 'Software Engineer',
    skills: ['JavaScript', 'Node.js', 'React', 'Express']
  };

  res.render('profile', { user });
});
```

### **Step 4: Create the Pug Template (views/profile.pug)**
```pug
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    title Profile
  body
    h1 Welcome, #{user.name}!
    p Age: #{user.age}
    p Profession: #{user.profession}

    h2 Skills:
    ul
      each skill in user.skills
        li= skill
```

---

## 🔧 **Example 3: Rendering Views with Data Using Handlebars (HBS)**

### **Step 1: Install HBS**
```bash
npm install hbs
```

### **Step 2: Set the View Engine**
```javascript
const express = require('express');
const app = express();

// Set HBS as the view engine
app.set('view engine', 'hbs');
```

### **Step 3: Create a Route that Renders a View**
```javascript
app.get('/profile', (req, res) => {
  const user = {
    name: 'Saad Salman Akram',
    age: 25,
    profession: 'Software Engineer',
    skills: ['JavaScript', 'Node.js', 'React', 'Express']
  };

  res.render('profile', { user });
});
```

### **Step 4: Create the HBS Template (views/profile.hbs)**
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
  <p>Profession: {{user.profession}}</p>

  <h2>Skills:</h2>
  <ul>
    {{#each user.skills}}
      <li>{{this}}</li>
    {{/each}}
  </ul>
</body>
</html>
```

---

## 🧪 **Passing Multiple Pieces of Data to a View**

You can pass multiple pieces of data to a view by including more key-value pairs in the data object.

### **Example:**
```javascript
app.get('/dashboard', (req, res) => {
  const title = 'Dashboard';
  const user = {
    name: 'Saad Salman Akram',
    isAdmin: true
  };

  res.render('dashboard', { title, user });
});
```

In the template:
```html
<h1>{{title}}</h1>
<p>Welcome, {{user.name}}</p>
{{#if user.isAdmin}}
  <p>You have admin access.</p>
{{/if}}
```

---

## 🧩 **Using `res.locals` for Global Data**

If you want to make some data available to **all templates** without passing it every time through `res.render()`, you can use the **`res.locals`** object.

### **Example:**
```javascript
app.use((req, res, next) => {
  res.locals.siteName = 'My Website';
  next();
});

app.get('/about', (req, res) => {
  res.render('about');
});
```

In the template:
```html
<h1>{{siteName}}</h1>
```

---

## 🎯 **Best Practices for Rendering Views with Data**

1. **Keep templates organized**:  
   Store your templates in a dedicated `views` folder.

2. **Use partials for reusable components**:  
   For elements like headers, footers, and navigation bars, use partial templates.

3. **Pass only necessary data**:  
   Avoid passing large or sensitive data to the templates.

4. **Use conditional rendering**:  
   Render different content based on the data passed to the view.

---

## ✅ **Summary of Templating Engines with Data Rendering**

| **View Engine** | **Installation Command** | **Template Syntax for Data**   |
|-----------------|--------------------------|--------------------------------|
| EJS             | `npm install ejs`        | `<%= data %>` / `<% code %>`   |
| Pug             | `npm install pug`        | `#{data}` / `each item in list`|
| HBS             | `npm install hbs`        | `{{data}}` / `{{#each list}}`  |

---

## 🎯 **Conclusion**

Rendering views with data in Express.js allows you to create dynamic web pages that respond to user inputs and server-side logic. By using different view engines like **EJS**, **Pug**, and **Handlebars**, you can inject data into templates and create a customized user experience.