**HTTP status codes**, are part of the response sent by a web server when you make a request (like `GET` or `POST`). These codes indicate whether the request was successful or if an error occurred.

Here’s a breakdown of the **common HTTP status codes** and their meanings:

---

### ✅ **1xx: Informational Responses**  
These codes indicate that the server has received the request and is continuing the process.

- **100 Continue** – The server has received the request headers and the client should proceed to send the body.
- **101 Switching Protocols** – The server is switching protocols as requested by the client.

---

### ✅ **2xx: Success**  
These codes mean that the request was successfully received, understood, and processed by the server.

- **200 OK** – The request was successful, and the server responded with the requested data.  
  📌 *Example:* Fetching a web page via a `GET` request.

- **201 Created** – The request was successful, and a new resource was created.  
  📌 *Example:* Submitting a `POST` request to create a new user.

- **204 No Content** – The request was successful, but there’s no content to return.  
  📌 *Example:* Deleting a resource where the server doesn't return any content.

---

### 🚩 **3xx: Redirection**  
These codes indicate that the client must take additional action to complete the request.

- **301 Moved Permanently** – The resource has been permanently moved to a new URL.
- **302 Found** – The resource was found at a different URL temporarily.
- **304 Not Modified** – The cached version of the requested resource is still valid.

---

### ⚠️ **4xx: Client Errors**  
These codes indicate that there was an issue with the request made by the client.

- **400 Bad Request** – The server could not understand the request due to invalid syntax.  
  📌 *Example:* Sending malformed JSON in a `POST` request.

- **401 Unauthorized** – Authentication is required to access the resource.  
  📌 *Example:* Accessing an API without providing a valid token.

- **403 Forbidden** – The server understood the request but refuses to authorize it.  
  📌 *Example:* Accessing a resource that you don’t have permission for.

- **404 Not Found** – The server can’t find the requested resource.  
  📌 *Example:* Trying to access a non-existent API endpoint.

- **405 Method Not Allowed** – The method used in the request is not allowed for the resource.  
  📌 *Example:* Sending a `POST` request to an endpoint that only supports `GET`.

---

### ❌ **5xx: Server Errors**  
These codes indicate that something went wrong on the server side.

- **500 Internal Server Error** – The server encountered an unexpected condition that it can't handle.  
  📌 *Example:* A bug in the server's code causes it to crash.

- **502 Bad Gateway** – The server received an invalid response from an upstream server.  
  📌 *Example:* A proxy server can't get a valid response from the backend server.

- **503 Service Unavailable** – The server is temporarily unable to handle the request, often due to maintenance or overload.  
  📌 *Example:* The server is down for maintenance.

---

### 🎯 **Common Use Cases for APIs**  

| **Status Code** | **Use Case**              | **Description**                                    |
|-----------------|--------------------------|----------------------------------------------------|
| 200             | `GET` Request             | Successfully retrieved data                       |
| 201             | `POST` Request            | Successfully created a new resource               |
| 400             | Invalid Request           | The client sent invalid data                      |
| 401             | Unauthorized              | Authentication is required                       |
| 403             | Forbidden                 | The client is not allowed to access the resource  |
| 404             | Not Found                 | The resource could not be found                  |
| 500             | Server Error              | An error occurred on the server                  |

For more detailed explanation, visit:
https://www.restapitutorial.com/httpstatuscodes