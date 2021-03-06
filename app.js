const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

// Connect to mongodb
mongoose.connect('mongodb://localhost:27017/cabs', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected to database'));

// BODY PARSER
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// passport initialize
app.use(passport.initialize());

// Routes
const userRoutes = require('./routes/api/users');
const tripRoutes = require('./routes/api/trips');
const tripRequestRoutes = require('./routes/api/tripRequests');

app.use('/users', userRoutes);
app.use('/trips', tripRoutes);
app.use('/tripRequests', tripRequestRoutes);

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => console.log(`Server started on port ${PORT}`));