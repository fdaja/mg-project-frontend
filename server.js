const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000; // Use Vercel's assigned port or 5000 locally

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Temporary storage for registered users
const users = [];

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the user already exists
  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  // Add the user to the "database" (in-memory storage here)
  const newUser = { username, email, password };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// View all registered users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
