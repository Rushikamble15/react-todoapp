require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2');

// Create a connection to the database using environment variables
const connection = mysql.createConnection({
    host: process.env.DB_HOST,     // Host from environment variable (usually 'localhost' or 'mysql' in Docker)
    user: process.env.DB_USER,     // User from environment variable (e.g. 'testuser')
    password: process.env.DB_PASSWORD,  // Password from environment variable
    database: process.env.DB_NAME,     // Database name from environment variable (e.g. 'testdb')
    port: process.env.DB_PORT,          // Port from environment variable (usually 3306)
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Example query to test the connection
connection.query('SELECT NOW()', (err, results) => {
  if (err) {
    console.error('Error executing query:', err.stack);
    return;
  }
  console.log('Current time:', results[0]['NOW()']);
});

// Close the connection
connection.end();
