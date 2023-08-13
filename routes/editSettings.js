const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');

// Middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {
  const { columnsToShow } = req.body;

  // Save the received config values to a config file (config.json in this example)
  const configData = JSON.stringify({ columnsToShow }, null, 2);

  fs.writeFile('config.json', configData, (err) => {
    if (err) {
      console.error('Error writing config file:', err);
      res.status(500).send('Error updating config');
    } else {
      console.log('Config file updated successfully!');
    }
  });

  res.redirect('/');
});

module.exports = router;
