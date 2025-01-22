require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const uploadRoutes = require('./routes/upload.routes.js');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/zips', express.static(path.join(__dirname, 'zips')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', uploadRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Digital Time Capsule Platform API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
