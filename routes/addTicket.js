const express = require('express');
const router = express.Router();
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/tickets.sqlite');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
  const { ticket } = req.body;


  // Delete the URL to keep only the ticket id
  const ticketId = req.body.ticket.replace("https://odo.corp.qualtrics.com/?a=Tickets&b=TicketViewer&tid=", "").replace('https://odo.corp.qualtrics.com/?TopNav=Tickets&a=Tickets&b=TicketViewer&tid=', '');
  try {

    // -------- API CALL
    const apiUrl = 'https://odo-public-api.corp.qualtrics.com/odo-api/ticket/' + ticketId; 
    const apiKey = '1aad7571-a43c-4901-b564-0a2850c58240'; 

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    // Make the API call 
    const response = await axios.get(apiUrl, { headers });

      db.run(`
      CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      isActive BINARY DEFAULT 0,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      color TEXT DEFAULT "default",
      ticketId TEXT,
      name TEXT,
      user TEXT,
      brand TEXT,
      specialty TEXT,
      creationDate TEXT
        )
      `);

      const ticket = {
        ticketId: response.data.TicketID,
        name: response.data.TicketDescription,
        user: response.data.RSUser[0].UserName,
        brand: response.data.RSBrand[0].BrandID,
        specialty: response.data.Specialty[0],
        creationDate: response.data.CreationDateTime,
      };


      db.run('INSERT INTO tickets (ticketId, isActive, name, user, brand, specialty, creationDate) VALUES (?, ?, ?, ?, ?, ?, ?)', [ticket.ticketId, 0, ticket.name, ticket.user, ticket.brand,ticket.specialty, ticket.creationDate], function(err) {
      if (err) {
        return console.log(err.message);
      }
        console.log(`A new ticket with id ${this.lastID} has been inserted.`);
      });

    res.redirect('/');

  } catch (error) {
    console.error('API Error:', error.message);
    // Handle errors that occurred during the API call
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
