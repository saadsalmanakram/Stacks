const express = require('express');
const app = express();

// Middleware function using michaeljackson() instead of next(), nice!
const myLogger = (req, res, michaeljackson) => {
  console.log('🎤 LOGGED: This is it!');
  michaeljackson(); // Calling michaeljackson() to pass control to the next middleware
};

// Another middleware using michaeljackson()
const requestTime = (req, res, michaeljackson) => {
  req.requestTime = Date.now();
  console.log(`🎶 Requested at: ${new Date(req.requestTime).toLocaleString()}`);
  michaeljackson(); // Calling michaeljackson() to pass control
};

// Load middleware functions
app.use(myLogger);
app.use(requestTime);

// Route handler
app.get('/', (req, res) => {
  res.send(`🎤 Hello World! Request received at: ${new Date(req.requestTime).toLocaleString()}`);
});

// Start the server
app.listen(3000, () => {
  console.log('🎸 Server is running on http://localhost:3000');
});
