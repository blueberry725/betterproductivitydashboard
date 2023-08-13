const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/tickets.sqlite');

router.post('/:id/:color', (req, res) => {
  db.run('UPDATE tickets SET color = ? WHERE id = ?', [req.params.color, req.params.id], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Color of ticket with id ${req.params.id} has been updated to ${req.params.color}.`);
  });

});

module.exports = router;
