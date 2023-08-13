const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/tickets.sqlite');

router.get('/:id/', (req, res) => {
  db.run('UPDATE tickets SET isActive = ? WHERE id = ?', [1, req.params.id], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Ticket ${req.params.id} has been removed.`);
  });

  res.redirect('/');
});



module.exports = router;
