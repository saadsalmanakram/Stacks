const express = require('express');
const router = express.Router();

// Define a route for GET /users
router.get('/', (req, res) => {
  res.send('User List');
});

// Define a route for GET /users/:id
router.get('/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});

module.exports = router;