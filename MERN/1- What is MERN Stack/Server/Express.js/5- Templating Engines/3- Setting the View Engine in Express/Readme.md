### **Setting the View Engine in Express.js**  

In an Express.js application, a **view engine** is used to render dynamic content on the server and send it to the client in the form of HTML pages. The **view engine** processes the templates (like EJS, Pug, or Handlebars) and dynamically injects data into them before sending the final HTML response to the user.

This guide will cover how to set up and configure a view engine in an Express app.

---

## 📚 **What is a View Engine in Express.js?**

A **view engine** is a template processor that enables rendering dynamic web pages by embedding server-side data into static HTML templates. Instead of sending plain HTML files to the client, Express can dynamically render templates based on the data provided.

Examples of popular view engines:
- **EJS** (Embedded JavaScript)
- **Pug** (formerly known as Jade)
- **Handlebars (HBS)**
- **Mustache**
- **Nunjucks**

---

## 🛠 **Steps to Set the View Engine in Express.js**

1. **Install the desired view engine.**
2. **Set the view engine using `app.set()` in your Express app.**
3. **Create templates in the `views` folder.**
4. **Use `res.render()` to render templates.**

---

## 🔧 **Example 1: Setting up EJS as the View Engine**

### **Step 1: Install EJS**
Run the following command to install **EJS**:

```bash
npm install ejs
```

### **Step 2: Set EJS as the View Engine in Your App**
In your main Express file (`app.js` or `server.js`), configure the view engine using `app.set()`:

```javascript
const express = require('express');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Example route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', message: 'Welcome to My Website!' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### **Step 3: Create a Template File**
Create an **`index.ejs`** file inside the **`views`** folder:

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

In this example:
- The `app.set('view engine', 'ejs')` tells Express to use **EJS** as the view engine.
- The `res.render('index', { title: 'Home', message: 'Welcome to My Website!' })` method dynamically renders the **index.ejs** template and injects the provided data into it.

---

## 🔧 **Example 2: Setting up Pug as the View Engine**

### **Step 1: Install Pug**
Run the following command to install **Pug**:

```bash
npm install pug
```

### **Step 2: Set Pug as the View Engine**
In your main Express file:

```javascript
const express = require('express');
const app = express();

// Set Pug as the view engine
app.set('view engine', 'pug');

// Example route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', message: 'Welcome to My Website!' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### **Step 3: Create a Pug Template File**
Create an **`index.pug`** file inside the **`views`** folder:

```pug
doctype html
html
  head
    title= title
  body
    h1= message
```

In this example:
- The `app.set('view engine', 'pug')` sets **Pug** as the view engine.
- The `res.render('index', { title: 'Home', message: 'Welcome to My Website!' })` method dynamically renders the **index.pug** template.

---

## 🔧 **Example 3: Setting up Handlebars (HBS) as the View Engine**

### **Step 1: Install HBS**
Run the following command to install **HBS**:

```bash
npm install hbs
```

### **Step 2: Set HBS as the View Engine**
In your main Express file:

```javascript
const express = require('express');
const app = express();

// Set Handlebars as the view engine
app.set('view engine', 'hbs');

// Example route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', message: 'Welcome to My Website!' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### **Step 3: Create an HBS Template File**
Create an **`index.hbs`** file inside the **`views`** folder:

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

In this example:
- The `app.set('view engine', 'hbs')` sets **Handlebars (HBS)** as the view engine.
- The `res.render('index', { title: 'Home', message: 'Welcome to My Website!' })` method dynamically renders the **index.hbs** template.

---

## 📂 **Setting the `views` Directory (Optional)**

By default, Express looks for templates in a folder named **`views`** in the root directory of your project. However, you can change the default directory using `app.set()`.

### **Example: Changing the `views` Directory**
```javascript
app.set('views', './templates');
```

This will tell Express to look for templates in the **`templates`** folder instead of the default **`views`** folder.

---

## 🧪 **Using Multiple Templating Engines in One App**

You can use multiple templating engines in the same Express app by specifying different file extensions.

### **Example:**
```javascript
const express = require('express');
const app = express();

// Use EJS for .ejs files
app.engine('ejs', require('ejs').renderFile);

// Use Pug for .pug files
app.engine('pug', require('pug').__express);

// Example routes
app.get('/ejs', (req, res) => {
  res.render('index.ejs', { message: 'Rendered with EJS' });
});

app.get('/pug', (req, res) => {
  res.render('index.pug', { message: 'Rendered with Pug' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

---

## 📑 **Summary of View Engine Setup Commands**

| **View Engine** | **Installation Command** | **Setup Command**                  |
|-----------------|--------------------------|------------------------------------|
| EJS             | `npm install ejs`        | `app.set('view engine', 'ejs')`    |
| Pug             | `npm install pug`        | `app.set('view engine', 'pug')`    |
| HBS             | `npm install hbs`        | `app.set('view engine', 'hbs')`    |

---

## ✅ **Best Practices for Using View Engines in Express**

1. **Organize your views folder**:  
   Keep your template files organized in a **`views`** directory or a custom directory if needed.

2. **Use Partials and Layouts**:  
   Use partials for reusable components (like headers and footers) and layouts for a consistent page structure.

3. **Pass Only Necessary Data**:  
   When using `res.render()`, pass only the data that is required for the template.

---

## 🎯 **Conclusion**

Setting up a **view engine** in Express.js is essential for building dynamic web applications that render server-side content. Express supports a variety of templating engines, including **EJS**, **Pug**, and **Handlebars**, each offering different syntax and features. Choose the one that best suits your project’s requirements and follow best practices to keep your codebase clean and maintainable.