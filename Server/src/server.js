require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/mongo.config.js')

const uploadRoutes = require('./routes/upload.routes.js');
const dashboardRoutes = require('./routes/dashboard.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const downloadRoutes = require('./routes/download.routes.js');

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' }, // Use secure cookies in production
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/zips', express.static(path.join(__dirname, 'zips')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/uploads', uploadRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/download', downloadRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Digital Time Capsule Platform API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});

