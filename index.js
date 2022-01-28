const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

// Create Express Server
const app = express();

// Data Base
dbConnection();

// CORS
app.use(cors());


// Public Folder
app.use(express.static('public'));

// Read and parse body
app.use( express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Listen 
app.listen(process.env.PORT,() =>{
    console.log(`Server running in port ${process.env.PORT}`)
});