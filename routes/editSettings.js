const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/tickets.sqlite');

// Middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {
  const { columnsToShow } = req.body;

  req.body.timeColumn === "on" ? console.log("Yes"): console.log("No");

  console.log(req.body.timeColumn);

  db.run('UPDATE settings SET timeColumn = ?, specialtyColumn = ?, userColumn = ?, brandColumn =  ?, creationDateColumn = ?', [req.body.timeColumn === "on" ? true: false, req.body.specialtyColumn === "on" ? true: false, req.body.userColumn === "on" ? true: false, req.body.brandColumn === "on" ? true: false, req.body.creationDateColumn === "on" ? true: false], function(err) { 
    if (err) {
      return console.log(err.message);
    }
    console.log(`Color of ticket with id ${req.params.id} has been updated to ${req.params.color}.`);
  });

  res.redirect('/');
});

module.exports = router;
