const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'l.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});