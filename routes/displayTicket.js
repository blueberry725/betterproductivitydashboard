const express = require('express');
const router = express.Router();
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/tickets.sqlite');
const config = require('../config');

// Check if user is initialized already or not



// Utility function to promisify db.get
function getAsync(query, params) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Utility function to promisify db.all
function allAsync(query, params) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

router.get('/', async (req, res) => {
  
  // Dictionnary of Specialties
  
  const specialties = {
    '1': 'Core',
    '8': 'Int'
  };
  
  // Select date
  
  let date;
  
  if (Object.keys(req.query).length === 0) {
    date = new Date().toISOString().slice(0, 10);
  } else {
    date = req.query.date;
  }
  
  // Function to display an alert based on the content of a survey

  /*
  let apiUrl = 'https://yul1.qualtrics.com/API/v3/surveys/SV_elWIhhQuhW6c450'; 
  const apiKey = 'tRRdiC4AfEBSkke2SZlrc4M8Hv2S6x5VOwOh5cpr'; 
  
  const headers = {
    'x-api-token': apiKey,
    'Content-Type': 'application/json',
  };
  
  const requestBody = {
    "advance": true,
    "responses":{
      "QID1": "req.body.name,",
      "QID2": "req.body.email"
    }
  };

  const response = await axios.get(apiUrl, { headers });


  const alert = response.data.result.questions.QID1.questionText

  */
  
  // Function to display the ticket and return the context
  
  try {
    // Use async/await and Promises for better readability
    
    // Get the rows for the selected date
    const rows = await allAsync('SELECT * FROM tickets WHERE DATE(date) = ? AND isActive = ?', [date, 0]);
    
    // Count tickets where specialty is equal to one and date matches
    const rowEqualCore = await getAsync('SELECT COUNT(*) AS countEqualCore FROM tickets WHERE specialty = ? AND DATE(date) = ? AND isActive = ?', [1, date, 0]);
    const coreCount = rowEqualCore.countEqualCore;
    
    // Count tickets where specialty is not equal to one and date matches
    const rowNotEqualCore = await getAsync('SELECT COUNT(*) AS countNotEqualCore FROM tickets WHERE specialty <> ? AND DATE(date) = ? AND isActive = ?', [1, date, 0]);
    const specialtyCount = rowNotEqualCore.countNotEqualCore;
    
    // get current goals
    const ticketsTarget = await getAsync('SELECT * FROM targets WHERE DATE(date) = ? ORDER BY id DESC LIMIT 1', [date]);
    
    // get current settings
    const settings = await getAsync('SELECT * FROM settings ORDER BY id DESC LIMIT 1');
    
    const context = {
      dataTickets: rows,
      specialties: specialties,
      config: config,
      coreCount: coreCount,
      specialtyCount: specialtyCount,
      coreTicketsTarget: 7,
      specialtyTicketsTarget: 1,
      ticketsTarget: ticketsTarget,
      settings: settings,
      // alert: alert
    };
    
    res.render('index', { context: context });
  } catch (err) {
    // Handle errors
    console.error('Error:', err);
    res.status(500).send('An error occurred:' + err);
  }
});

module.exports = router;
