### **Commonly Used Properties of `req` (Request) Object in Express.js**

In Express.js, the `req` (Request) object holds a wealth of information about the incoming HTTP request. Below is a detailed list of the most commonly used properties of the `req` object, which are essential for handling various aspects of HTTP requests in your Express.js applications.

### **1. `req.method`**
   - **Description**: This property holds the HTTP method of the incoming request, such as `GET`, `POST`, `PUT`, `DELETE`, etc.
   - **Use Case**: It is used to identify the type of HTTP request and to route or handle the request accordingly.
   - **Example**:
     ```javascript
     app.all('*', (req, res) => {
         console.log(req.method); // Outputs the HTTP method (e.g., 'GET', 'POST')
     });
     ```

### **2. `req.url`**
   - **Description**: The `url` property contains the complete URL of the request (excluding the domain and protocol).
   - **Use Case**: It is used when you need to examine or manipulate the URL of the request, especially in middleware or logging.
   - **Example**:
     ```javascript
     app.use((req, res, next) => {
         console.log(req.url); // Logs the URL of the incoming request
         next();
     });
     ```

### **3. `req.headers`**
   - **Description**: This property contains the headers sent by the client in the request. It is an object where each key represents a header field, and the value is the field's value.
   - **Use Case**: Headers provide additional information about the request, such as authentication details, content types, user agents, etc.
   - **Example**:
     ```javascript
     app.get('/', (req, res) => {
         console.log(req.headers); // Logs all headers sent in the request
     });
     ```

### **4. `req.params`**
   - **Description**: The `params` property holds the route parameters, which are dynamic parts of the URL defined by a colon (`:`) in the route path.
   - **Use Case**: It is used to capture values from dynamic parts of the URL, for example, when dealing with RESTful APIs.
   - **Example**:
     ```javascript
     app.get('/user/:id', (req, res) => {
         const userId = req.params.id; // Access the 'id' parameter from the URL
         res.send(`User ID: ${userId}`);
     });
     // URL: /user/1234 will capture '1234' as the userId
     ```

### **5. `req.query`**
   - **Description**: The `query` property contains the query string parameters from the URL, which are the key-value pairs found after the `?` in the URL.
   - **Use Case**: It is used to access URL parameters in GET requests, often for filtering, sorting, or searching data.
   - **Example**:
     ```javascript
     app.get('/search', (req, res) => {
         const searchTerm = req.query.term; // Access query parameter 'term'
         res.send(`Search term: ${searchTerm}`);
     });
     // URL: /search?term=nodejs
     ```

### **6. `req.body`**
   - **Description**: The `body` property contains data sent in the body of the request, typically for POST or PUT requests. This property is populated when middleware like `express.json()` or `express.urlencoded()` is used to parse incoming request bodies.
   - **Use Case**: It is used to capture and process form submissions, JSON payloads, or any other type of data sent in the request body.
   - **Example**:
     ```javascript
     app.post('/submit', express.json(), (req, res) => {
         const userData = req.body; // Access JSON data from the request body
         res.send(`Received data: ${JSON.stringify(userData)}`);
     });
     // Request body: { "name": "John", "age": 30 }
     ```

### **7. `req.cookies`**
   - **Description**: The `cookies` property contains cookies sent by the client with the request. This requires the `cookie-parser` middleware to be used in the Express app.
   - **Use Case**: It is used to retrieve cookies set on the client’s side, which can be useful for authentication, sessions, or tracking user preferences.
   - **Example**:
     ```javascript
     const cookieParser = require('cookie-parser');
     app.use(cookieParser());

     app.get('/cookie', (req, res) => {
         console.log(req.cookies); // Logs all cookies sent in the request
         res.send('Cookies received');
     });
     ```

### **8. `req.ip`**
   - **Description**: The `ip` property holds the IP address of the client that made the request.
   - **Use Case**: This property is commonly used for logging, monitoring, or blocking requests based on client IP.
   - **Example**:
     ```javascript
     app.get('/', (req, res) => {
         console.log(req.ip); // Logs the IP address of the client
         res.send('Hello from the server!');
     });
     ```

### **9. `req.hostname`**
   - **Description**: The `hostname` property contains the hostname (domain name) from the URL of the incoming request.
   - **Use Case**: Useful for extracting the domain of the request, especially in cases where your app is running on multiple domains or subdomains.
   - **Example**:
     ```javascript
     app.get('/', (req, res) => {
         console.log(req.hostname); // Logs the domain of the request (e.g., localhost)
         res.send('Request hostname logged');
     });
     ```

### **10. `req.originalUrl`**
   - **Description**: This property contains the full URL (including query string) of the incoming request. Unlike `req.url`, `req.originalUrl` doesn’t change if middleware or route handlers modify `req.url`.
   - **Use Case**: It is helpful when you need the original URL for logging, redirection, or after modifying `req.url` in middleware.
   - **Example**:
     ```javascript
     app.use((req, res, next) => {
         console.log(req.originalUrl); // Logs the original request URL
         next();
     });
     ```

### **11. `req.secure`**
   - **Description**: The `secure` property is a boolean that tells you if the request was made over HTTPS. It is `true` if the request was made via HTTPS, and `false` if it was made via HTTP.
   - **Use Case**: It is used to determine whether a request is secure or not, which can be important for handling cookies, redirects, or security checks.
   - **Example**:
     ```javascript
     app.get('/', (req, res) => {
         if (req.secure) {
             res.send('Request was made over HTTPS');
         } else {
             res.send('Request was not secure');
         }
     });
     ```

### **12. `req.get(headerName)`**
   - **Description**: The `get()` method allows you to retrieve a specific header from the request by specifying the name of the header.
   - **Use Case**: Useful when you need to access specific headers, such as `Authorization`, `Content-Type`, etc.
   - **Example**:
     ```javascript
     app.get('/headers', (req, res) => {
         const userAgent = req.get('User-Agent'); // Retrieve the 'User-Agent' header
         res.send(`Your User-Agent is: ${userAgent}`);
     });
     ```

### **13. `req.route`**
   - **Description**: The `route` property provides information about the current route being matched in Express, such as the path and method.
   - **Use Case**: It is useful for logging, debugging, or middleware that needs to inspect the matched route.
   - **Example**:
     ```javascript
     app.get('/product/:id', (req, res) => {
         console.log(req.route); // Logs the matched route object
         res.send(`Product ID: ${req.params.id}`);
     });
     ```

### **14. `req.get('param')`**
   - **Description**: This is another way to get a parameter from the request, similar to `req.params`, but works for retrieving specific header or query parameters.
   - **Use Case**: Useful for specific header retrieval and analysis.
   - **Example**:
     ```javascript
     app.get('/test', (req, res) => {
         console.log(req.get('Content-Type')); // Retrieves the 'Content-Type' header
         res.send('Content-Type header logged');
     });
     ```

### **Conclusion**

The `req` object in Express.js provides essential properties that allow developers to access various aspects of the HTTP request, such as headers, URL parameters, query strings, request body, client information, and more. Understanding these properties is vital for effectively handling requests and building scalable web applications or APIs using Express.js.