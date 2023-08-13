const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/tickets.sqlite');
const db2 = new sqlite3.Database('db/targets.sqlite');

router.get('/', (req, res) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      isActive BINARY DEFAULT 1,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      color TEXT DEFAULT "default",
      ticketId TEXT,
      name TEXT,
      user TEXT,
      brand TEXT,
      specialty TEXT,
      creationDate TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table for tickets:', err.message);
      return;
    }
  })

    db2.run(`
    CREATE TABLE IF NOT EXISTS targets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE,
      totalTickets INTEGER,
      specialtyTickets INTEGER,
      totalTarget INTEGER,
      specialtyTarget INTEGER,
      timeBreakdown JSON
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table for target:', err.message);
      return;
    }

  });
});

module.exports = router;