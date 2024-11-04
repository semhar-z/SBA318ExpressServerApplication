const express = require('express');
const { items, addItem } = require('../data/form'); // Import items array and addItem function

const router = express.Router();

// Route to handle form submissions for adding items
router.post('/', (req, res) => {
    const { item, description } = req.body; // Get item and description from form data
    if (!item || !description) {
        return res.status(400).json({ error: "Name and description are required" });
    }

    addItem(item, description); 
    res.redirect('/'); // back to main page
});

// Route to get all items (for API)
router.get('/', (req, res) => {
    res.json(items); 
});

module.exports = router;
