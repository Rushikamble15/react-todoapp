require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Enable CORS for requests from any origin (or specify your frontend's origin)
app.use(cors({
  origin: '*' // You can specify a specific frontend URL here if needed
}));

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create MySQL connection using environment variables from .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,        // Using DB_HOST from .env
  user: process.env.DB_USER,        // Using DB_USER from .env
  password: process.env.DB_PASSWORD, // Using DB_PASSWORD from .env
  database: process.env.DB_NAME,    // Using DB_NAME from .env
  port: process.env.DB_PORT,        // Using DB_PORT from .env
  connectionLimit: 10,
  connectTimeout: 10000,
});

// Test database connection
pool.getConnection((err) => {
  if (err) {
    console.error('MySQL connection failed:', err); // Log the connection error
  } else {
    console.log('MySQL connected successfully');
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to your Node.js server!');
});

// Get all todos
app.get('/api/todos', (req, res) => {
  pool.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Add a new todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  pool.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, results) => {
    if (err) {
      console.log("error is ", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, title });
  });
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM tasks WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send(); // No content
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server on all interfaces (0.0.0.0)
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
