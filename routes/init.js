  const express = require('express');
  const router = express.Router();
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('db/tickets.sqlite');
  const bodyParser = require('body-parser');
  const fs = require('fs');
  const axios = require('axios');
  const config = require('../config');

  router.use(bodyParser.urlencoded({ extended: true }));

  router.post('/', async(req, res) => {
    console.log(req.body)

    const { userSettings } = req.body;

    // Create the correct tables in the db

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
      console.log('Table created successfully.');
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
      console.log('Table created successfully.');
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
      console.log('Table created successfully.');
      
      db.run('INSERT INTO settings (email, name, timeColumn, specialtyColumn, userColumn, brandColumn, creationDateColumn) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.email, req.body.name, 0, 1, 0, 1, 0], function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`Settings inserted`);
      });
    });


    // create a survey session and update it to save the name of the user in a survey


    // -------- API CALL
    let apiUrl = 'https://yul1.qualtrics.com/API/v3/surveys/SV_55rqAKHFFKQIBjU/sessions'; 
    const apiKey = config.apiToken1; 
      
    const headers = {
      'x-api-token': apiKey,
      'Content-Type': 'application/json',
    };

    const requestBody = {
      "advance": true,
      "responses":{
        "QID1": req.body.name,
        "QID2": req.body.email
      }
    };
      
    // Make the API call 1
    const response1 = await axios.post(apiUrl, requestBody, { headers });

    apiUrl = 'https://yul1.qualtrics.com/API/v3/surveys/SV_55rqAKHFFKQIBjU/sessions/' + response1.data.result.sessionId; 
      
    // Make the API call 2
    const response2 = axios.post(apiUrl, requestBody, { headers });
    
    res.redirect('/');
  });

  module.exports = router;