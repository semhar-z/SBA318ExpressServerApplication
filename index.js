const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const itemsRouter = require('./routes/itemsRouter'); // Import the items router
const { items } = require('./data/form.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/items', itemsRouter); // Use the items router for the API

// Render the index page
app.get('/', (req, res) => {
    res.render('index', { items }); // Pass the items to the index view
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
