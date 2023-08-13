const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const username = 'John'; // Replace this with dynamic data from your database or other sources

  // Render the "index" EJS file with the provided data
  res.render('index', { username });
});

module.exports = router;
