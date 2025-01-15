### **Commonly Used Methods of `res` (Response) Object in Express.js**

In Express.js, the `res` (Response) object is responsible for sending the HTTP response to the client after processing the request. It offers several methods that help in setting headers, sending data, controlling the response status code, and managing cookies. Below is a detailed overview of the most commonly used methods of the `res` object in Express.js.

### **1. `res.send()`**
   - **Description**: The `send()` method is used to send a response to the client. It can send a variety of data types, including strings, objects, arrays, buffers, etc. If the response is an object or an array, Express automatically converts it to JSON format.
   - **Use Case**: This is one of the most common methods for sending data in response to a request.
   - **Example**:
     ```javascript
     app.get('/', (req, res) => {
         res.send('Hello, World!'); // Sends a plain text response
     });
     ```

### **2. `res.json()`**
   - **Description**: The `json()` method sends a JSON-formatted response. The input data is automatically stringified to JSON, and the `Content-Type` header is set to `application/json`.
   - **Use Case**: It is commonly used when returning data from APIs in JSON format.
   - **Example**:
     ```javascript
     app.get('/data', (req, res) => {
         const data = { name: 'John', age: 30 };
         res.json(data); // Sends the response as JSON
     });
     ```

### **3. `res.status()`**
   - **Description**: The `status()` method sets the HTTP status code of the response. It is used to indicate the success or failure of a request. If not specified, the default status code is `200 OK`.
   - **Use Case**: Useful when you want to return a specific HTTP status code, such as `404` for "Not Found" or `500` for "Internal Server Error."
   - **Example**:
     ```javascript
     app.get('/notfound', (req, res) => {
         res.status(404).send('Page not found'); // Sets the status code to 404
     });
     ```

### **4. `res.sendFile()`**
   - **Description**: The `sendFile()` method is used to send a file as the response. It allows you to specify the path to a file, such as an HTML file, image, or PDF.
   - **Use Case**: Used when you need to serve files like images, videos, or static HTML pages.
   - **Example**:
     ```javascript
     app.get('/image', (req, res) => {
         res.sendFile('/path/to/image.jpg'); // Sends an image file to the client
     });
     ```

### **5. `res.redirect()`**
   - **Description**: The `redirect()` method is used to redirect the client to a different URL. It can take a URL as a parameter, or a status code and a URL.
   - **Use Case**: Commonly used for URL redirection, such as sending users to a different page or domain.
   - **Example**:
     ```javascript
     app.get('/old-route', (req, res) => {
         res.redirect('/new-route'); // Redirects the user to '/new-route'
     });
     ```

### **6. `res.render()`**
   - **Description**: The `render()` method is used to render a view template and send the resulting HTML to the client. It is typically used in conjunction with a template engine (like EJS, Pug, or Handlebars).
   - **Use Case**: It is commonly used to render dynamic web pages by combining a template with data.
   - **Example**:
     ```javascript
     app.get('/profile', (req, res) => {
         const user = { name: 'John', age: 30 };
         res.render('profile', { user: user }); // Renders the 'profile' view with the user data
     });
     ```

### **7. `res.set()`**
   - **Description**: The `set()` method is used to set one or more HTTP response headers. It allows you to customize the response headers.
   - **Use Case**: It is used to manipulate HTTP headers, such as setting `Content-Type`, `Authorization`, or custom headers.
   - **Example**:
     ```javascript
     app.get('/custom-header', (req, res) => {
         res.set('X-Custom-Header', 'HeaderValue'); // Sets a custom header in the response
         res.send('Custom header set!');
     });
     ```

### **8. `res.cookie()`**
   - **Description**: The `cookie()` method is used to set a cookie in the client's browser. You can specify options like expiration, domain, and secure flag.
   - **Use Case**: Commonly used for session management, authentication, or storing user preferences.
   - **Example**:
     ```javascript
     app.get('/set-cookie', (req, res) => {
         res.cookie('user', 'JohnDoe', { maxAge: 900000, httpOnly: true }); // Sets a cookie
         res.send('Cookie set!');
     });
     ```

### **9. `res.clearCookie()`**
   - **Description**: The `clearCookie()` method is used to clear a cookie that was previously set in the client's browser.
   - **Use Case**: Useful for logging out users or clearing session-related cookies.
   - **Example**:
     ```javascript
     app.get('/clear-cookie', (req, res) => {
         res.clearCookie('user'); // Clears the 'user' cookie
         res.send('Cookie cleared!');
     });
     ```

### **10. `res.type()`**
   - **Description**: The `type()` method sets the `Content-Type` header for the response. It can be used to explicitly set the MIME type of the response.
   - **Use Case**: Useful when serving files with a specific content type or when the content type should be inferred based on the file extension.
   - **Example**:
     ```javascript
     app.get('/json', (req, res) => {
         res.type('json').send({ message: 'Hello, World!' }); // Sets the Content-Type to application/json
     });
     ```

### **11. `res.locals`**
   - **Description**: The `locals` property is an object that contains local variables that can be accessed within a view (if using a view engine) or middleware. It allows you to pass data to templates or store data for the lifecycle of the response.
   - **Use Case**: Commonly used to share data between middleware and views, especially in templated responses.
   - **Example**:
     ```javascript
     app.use((req, res, next) => {
         res.locals.user = { name: 'John', age: 30 }; // Sets local data
         next();
     });

     app.get('/profile', (req, res) => {
         res.render('profile'); // The 'profile' view has access to res.locals.user
     });
     ```

### **12. `res.sendStatus()`**
   - **Description**: The `sendStatus()` method is a combination of `res.status(code)` and `res.send()`. It sets the status code and sends a response with the status message corresponding to the code.
   - **Use Case**: It is a quick way to send a status code with a default message.
   - **Example**:
     ```javascript
     app.get('/success', (req, res) => {
         res.sendStatus(200); // Sends a 200 OK response
     });
     ```

### **13. `res.vary()`**
   - **Description**: The `vary()` method is used to add a `Vary` header to the response. The `Vary` header tells caches to consider the value of a specific header (like `Accept-Encoding`) when deciding whether a cached response is appropriate.
   - **Use Case**: Used in situations where content may vary based on headers (e.g., content encoding or language).
   - **Example**:
     ```javascript
     app.get('/vary', (req, res) => {
         res.vary('Accept-Encoding'); // Tells caches to vary based on the 'Accept-Encoding' header
         res.send('Response varies based on Accept-Encoding header');
     });
     ```

### **14. `res.links()`**
   - **Description**: The `links()` method is used to set the `Link` HTTP header for pagination or related resources. This header allows you to specify relationships between resources.
   - **Use Case**: Useful for pagination in REST APIs or linking related resources.
   - **Example**:
     ```javascript
     app.get('/items', (req, res) => {
         res.links({
             next: '/items?page=2',
             prev: '/items?page=1'
         });
         res.send('Items page 1');
     });
     ```

### **Conclusion**

The `res` (Response) object in Express.js provides a rich set of methods that allow you to control the HTTP response sent back to the client. From setting status codes and headers to sending data, redirecting users, and working with cookies, these methods are fundamental to building efficient and flexible web applications and APIs with Express.js.