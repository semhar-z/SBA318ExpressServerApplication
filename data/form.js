
let items = []; 
let lastId = 0; // Counter for item IDs

// Function to add a new item
const addItem = (name, description) => {
    lastId++; 
    const newItem = {
        id: lastId, 
        name: name,
        description: description
    };
    items.push(newItem); 
};

module.exports = { items, addItem }; // Export items array and addItem function


