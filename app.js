const express = require('express');
const path = require('path');
const app = express();

// Set 'views' folder as the location for EJS files
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Import and use the exampleRoute for a specific path
const exampleRoute = require('./routes/exampleRoute');
const addTicket = require('./routes/addTicket');
const displayTicket = require('./routes/displayTicket');
const dropTable = require('./routes/dropTable');
const init = require('./routes/init');
const editSettings = require('./routes/editSettings');
const updateColor = require('./routes/updateColor');
const removeTicket = require('./routes/removeTicket');
const setTarget = require('./routes/setTarget');

app.use('/path', exampleRoute);
app.use('/add', addTicket);
app.use('/', displayTicket);
app.use('/droptable', dropTable);
app.use('/init', init);
app.use('/editsettings', editSettings);
app.use('/updatecolor', updateColor);
app.use('/removeticket', removeTicket);
app.use('/setTarget', setTarget);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
