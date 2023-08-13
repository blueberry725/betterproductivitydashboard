const express = require('express');
const router = express.Router();
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/ta.sqlite');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
  const { target } = req.body;

  db.run('INSERT INTO targets (date, totalTarget, specialtyTarget) VALUES (?, ?, ?)', [ticket.date, ticket.totalTarget, ticket.specialtyTarget], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A new target with id ${this.lastID} has been inserted.`);
  });

  res.redirect('/');

});

module.exports = router;
