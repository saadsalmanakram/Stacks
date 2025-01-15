# **Setting Secure and HttpOnly Cookies in Express.js**

When working with cookies in Express.js, security is a critical aspect, especially when storing sensitive information like authentication tokens, session identifiers, or user credentials. Two key security flags that should be considered when setting cookies are **Secure** and **HttpOnly**. These flags add layers of protection against various attacks, such as cross-site scripting (XSS) and man-in-the-middle (MITM) attacks.

---

## **🔧 1. What are Secure and HttpOnly Cookies?**

### **Secure Cookies**
- **Definition**: A cookie is marked as **secure** when it is only sent over **HTTPS** connections. It ensures that the cookie is not transmitted over unencrypted HTTP connections, making it more secure against interception by attackers on an unsecured network (e.g., public Wi-Fi).
- **Purpose**: The `Secure` flag helps prevent **man-in-the-middle (MITM)** attacks, where an attacker intercepts network traffic between the client and the server.

### **HttpOnly Cookies**
- **Definition**: A cookie marked as **HttpOnly** is inaccessible via JavaScript running on the client side (in the browser). This means that even if an attacker manages to inject malicious scripts (XSS attacks) into the page, they will not be able to access the cookie.
- **Purpose**: The `HttpOnly` flag helps prevent **cross-site scripting (XSS)** attacks by ensuring that cookies are not exposed to malicious JavaScript code.

---

## **💡 2. Setting Secure and HttpOnly Cookies in Express.js**

In Express.js, you can set these security flags when defining a cookie using the `res.cookie()` method. Both flags can be set together or individually, depending on the requirements.

### **Example: Setting Secure and HttpOnly Cookies**

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Use the cookie-parser middleware
app.use(cookieParser());

// Set Secure and HttpOnly Cookies
app.get('/set-secure-cookie', (req, res) => {
  // Set a secure, HttpOnly cookie
  res.cookie('sessionID', '12345', {
    httpOnly: true,  // Prevent JavaScript access to the cookie
    secure: true,    // Only send the cookie over HTTPS
    maxAge: 3600000  // Expiry in 1 hour
  });
  res.send('Secure and HttpOnly cookie has been set!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### **Explanation:**
- **`httpOnly: true`**: This ensures that the cookie cannot be accessed by JavaScript running in the client’s browser (reduces the risk of XSS attacks).
- **`secure: true`**: The cookie will only be sent over HTTPS connections, making it secure against MITM attacks. For local development, this flag should only be used in production with HTTPS enabled.

---

## **💡 3. Using Secure Cookies Only in Production**

In development environments (where HTTP might be used instead of HTTPS), you should conditionally set the `secure` flag to `true` only when the application is running in production. In non-production environments, such as development, setting `secure: true` will prevent the cookie from being sent.

### **Example: Conditionally Setting Secure Cookies**

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Use the cookie-parser middleware
app.use(cookieParser());

// Set secure cookie only in production
app.get('/set-secure-cookie', (req, res) => {
  const cookieOptions = {
    httpOnly: true,      // Prevent JavaScript access
    maxAge: 3600000,     // Expiry in 1 hour
    secure: process.env.NODE_ENV === 'production'  // Only secure in production
  };

  res.cookie('sessionID', '12345', cookieOptions);
  res.send('Secure and HttpOnly cookie has been set!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### **Explanation:**
- **`secure: process.env.NODE_ENV === 'production'`**: This ensures the `secure` flag is only set when the application is running in a production environment. In development or testing environments, cookies can still be set without HTTPS.

---

## **💡 4. Why Use Secure and HttpOnly Cookies?**

### **Security Benefits:**
- **Mitigating XSS Attacks**: The `HttpOnly` flag ensures that cookies are not accessible to client-side JavaScript, preventing malicious scripts from reading or stealing the cookies (such as session cookies).
  
- **Mitigating MITM Attacks**: The `Secure` flag ensures that cookies are only sent over HTTPS connections, protecting them from being intercepted during transmission, especially over unsecured networks (like public Wi-Fi).

### **Best Practices for Using Secure and HttpOnly Cookies:**
- Always use **`httpOnly: true`** for cookies that store sensitive information (e.g., session identifiers, authentication tokens).
- Always use **`secure: true`** for cookies that need to be sent over secure connections. Ensure that your server uses HTTPS in production.
- Use **`SameSite`** cookie attribute to prevent cross-site request forgery (CSRF) attacks by controlling when cookies are sent along with cross-site requests.

---

## **💡 5. Example: Complete Example of Setting Secure and HttpOnly Cookies**

Here's a complete example of setting both **secure** and **httpOnly** cookies, along with proper error handling and a clear separation of development and production environments:

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Use cookie-parser middleware
app.use(cookieParser());

// Middleware to set cookies with Secure and HttpOnly flags
app.get('/set-cookie', (req, res) => {
  const cookieOptions = {
    httpOnly: true,   // Prevent access via JavaScript
    secure: process.env.NODE_ENV === 'production',  // Secure cookie only in production (use HTTPS)
    maxAge: 3600000   // Cookie expires in 1 hour
  };

  // Set the 'userSession' cookie
  res.cookie('userSession', 'abcdef12345', cookieOptions);
  res.send('Secure and HttpOnly cookie has been set!');
});

// Route to check cookies
app.get('/get-cookie', (req, res) => {
  const userSession = req.cookies.userSession;
  if (userSession) {
    res.send(`Hello, your session ID is: ${userSession}`);
  } else {
    res.send('No user session cookie found');
  }
});

// Route to clear cookies
app.get('/clear-cookie', (req, res) => {
  res.clearCookie('userSession');
  res.send('Cookie has been cleared!');
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### **Explanation:**
- **Cookie options**: Cookies are set with both `httpOnly` and `secure` flags to ensure they are only accessible to the server and sent over HTTPS connections.
- **Environment-based secure flag**: The `secure` flag is set based on the `NODE_ENV` environment variable, ensuring that the cookie is only secure in production environments.

---

## **📚 Summary of Secure and HttpOnly Cookies**

1. **HttpOnly Cookies**: Marking a cookie as `httpOnly: true` prevents access to the cookie from client-side JavaScript, protecting it from XSS attacks.
2. **Secure Cookies**: Setting `secure: true` ensures cookies are only sent over HTTPS, protecting them from MITM attacks.
3. **Best Practices**:
   - Always use `httpOnly` for sensitive cookies (e.g., session tokens).
   - Use `secure` only in production (when HTTPS is enabled).
   - Consider using `SameSite` for further CSRF protection.

