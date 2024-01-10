const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/tickets.sqlite');

// Middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {

    db.get('SELECT * FROM settings LIMIT 1', (err, row) => {
        if (err) {
            console.error('Error checking for column:', err);
            return;
        }

        const columnExists = row && row.hasOwnProperty('darkMode');

        if (!columnExists) {
        // Column doesn't exist, add it
            db.run('ALTER TABLE settings ADD COLUMN darkMode data_type', (err) => {
                if (err) {
                    console.error('Error adding column:', err);
                    return;
                }
                console.log('Column added successfully!');
            });
        } else {
            console.log('Column already exists.');
        }
    });

  const { columnsToShow } = req.body;

  req.body.timeColumn === "on" ? console.log("Yes"): console.log("No");

  console.log(req.body.timeColumn);

  db.run('UPDATE settings SET timeColumn = ?, specialtyColumn = ?, userColumn = ?, brandColumn =  ?, creationDateColumn = ?, darkMode = ?', [req.body.timeColumn === "on" ? true: false, req.body.specialtyColumn === "on" ? true: false, req.body.userColumn === "on" ? true: false, req.body.brandColumn === "on" ? true: false, req.body.creationDateColumn === "on" ? true: false, req.body.darkMode === "on" ? true: false], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Color of ticket with id ${req.params.id} has been updated to ${req.params.color}.`);
  });

  res.redirect('/');
});

module.exports = router;
