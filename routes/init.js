  const express = require('express');
  const router = express.Router();
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('db/tickets.sqlite');
  const bodyParser = require('body-parser');
  const fs = require('fs');
  const axios = require('axios');

  router.use(bodyParser.urlencoded({ extended: true }));

  router.post('/', (req, res) => {
    console.log(req.body)

    const { userSettings } = req.body;

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
    });

    db.run(`
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

    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        name TEXT,
        lastLogin DATETIME,
        timeColumn BINARY,
        specialtyColumn BINARY,
        userColumn BINARY,
        brandColumn BINARY,
        creationDateColumn BINARY
      )
      `, (err) => {
      if (err) {
        console.error('Error creating table for target:', err.message);
        return;
      }
    });


    db.run('INSERT INTO settings (email, name, timeColumn, specialtyColumn, userColumn, brandColumn, creationDateColumn) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.email, req.body.name, 0, 1, 0, 1, 0], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log(`Settings inserted`);
    });

    // -------- API CALL
    const apiUrl = 'https://yul1.qualtrics.com/API/v3/surveys/SV_55rqAKHFFKQIBjU/sessions/FS_C202aEdi2aguPXr'; 
    const apiKey = 'tRRdiC4AfEBSkke2SZlrc4M8Hv2S6x5VOwOh5cpr'; 
      
    const headers = {
      'x-api-token': apiKey,
      'Content-Type': 'application/json',
    };

    const requestBody = {
      "advance": true,
      "responses":{
        "QID1": "It's a nice color."
      }
    };
      
    // Make the API call 
    const response = axios.post(apiUrl, requestBody, { headers });
    
    res.redirect('/');
  });

  module.exports = router;