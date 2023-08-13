const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/tickets.sqlite');
const config = require('../config.json');

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

    const context = {
      dataTickets: rows,
      specialties: specialties,
      config: config,
      coreCount: coreCount,
      specialtyCount: specialtyCount,
      coreTicketsTarget: 7,
      specialtyTicketsTarget: 1,
      totalticketsTarget: 9
    };

    res.render('index', { context: context });
  } catch (err) {
    // Handle errors
    console.error('Error:', err);
    res.status(500).send('An error occurred.');
  }
});

module.exports = router;
