const express = require('express');
const router = express.Router();
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/tickets.sqlite');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
  // Select date

  let date;

  if (Object.keys(req.query).length === 0) {
    date = new Date().toISOString().slice(0, 10);
  } else {
    date = req.query.date;
  }

  db.run('INSERT INTO targets (date, totalTarget, specialtyTarget) VALUES (?, ?, ?)', [date, req.body.totalTarget, req.body.specialtyTarget], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A new target with id ${this.lastID} has been inserted.`);
  });

  res.redirect('/');

});

module.exports = router;
