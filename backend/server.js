// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests

// PostgreSQL connection
const pool = new Pool({
    user: "postgres",
    host: 'localhost',
    database: "Smart-Parking-System",
    password: "piyush7",
    port: 5432,
});

// Connect to PostgreSQL database
pool.connect()
    .then(() => console.log("Connected to PostgreSQL Database"))
    .catch((error) => console.error("Database connection error:", error));

// User Registration Route (renamed to /signUp)
app.post('/api/auth/signUp', async (req, res) => {
    const { name, phone, email, username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (name, phone, email, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, phone, email, username, hashedPassword]
        );
        res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login Route (renamed to /login)
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', {
            expiresIn: '1h',
        });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/add-parking-location', async (req, res) => {
    const {
        locationName,
        completeAddress,
        pinCode,
        googleMapUrl,
        accountHolderName,
        accountNumber,
        panNumber, // PAN number comes right after account number
        ifscCode,
        branchName,
        availableSlots
    } = req.body;

    

    try {
        const result = await pool.query(
            `INSERT INTO parking_locations 
              (location_name, complete_address, pin_code, google_map_url, account_holder_name, 
              account_number, pan_number, ifsc_code, branch_name, available_slots) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
              RETURNING id`,
            [
                locationName,
                completeAddress,
                pinCode,
                googleMapUrl,
                accountHolderName,
                accountNumber,
                panNumber, 
                ifscCode,
                branchName,
                availableSlots
            ]
        );

        // If insertion is successful, send a success response
        res.status(201).json({ message: 'Process Completed! Your location will be added after verification.' });
    } catch (error) {
        console.error('Error inserting parking location:', error);
        res.status(500).json({ error: 'An error occurred while adding the parking location', details: error.message });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
