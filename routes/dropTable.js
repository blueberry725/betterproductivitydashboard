// app.js
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database (replace 'my_database.db' with your database file name)
const db = new sqlite3.Database('db/tickets.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the database.');
});

// Route to drop the table
router.get('/', (req, res) => {
  // SQL query to drop the table
  const dropTableQuery = `DROP TABLE IF EXISTS users`;

  // Execute the query to drop the table
  db.run(dropTableQuery, (err) => {
    if (err) {
      console.error('Error dropping table:', err.message);
      res.status(500).send('Error dropping table.');
    } else {
      console.log('Table dropped successfully.');
      res.send('Table dropped successfully.');
    }
  });
});



module.exports = router;