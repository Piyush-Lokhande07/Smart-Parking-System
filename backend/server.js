// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests
app.use(express.json());

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
        panNumber,
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

    
        res.status(201).json({ message: 'Process Completed! Your location will be added after verification.' });
    } catch (error) {
        console.error('Error inserting parking location:', error);
        res.status(500).json({ error: 'An error occurred while adding the parking location', details: error.message });
    }
});

app.get('/api/get-verified-locations', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM parking_locations WHERE verified = true');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching verified locations", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/api/location/:locationId', async (req, res) => {
    const locationId = req.params.locationId;
    try {
        const result = await pool.query('SELECT * FROM parking_locations WHERE id = $1 AND verified = true', [locationId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json(result.rows[0]); // Send the first row of the result
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post("/order",async(req,res)=>{
    try{
        const razorpay = new Razorpay({
            key_id:"rzp_test_TBBRXgPa4yzuqK",
            key_secret:"3zD9xctvxco5aKNfKaNoaf7D",
        })
    
        const options  =req.body;
        const order =await razorpay.orders.create(options);
    
        if(!order){
            return res.status(500).send("Error");
        }
        res.json(order);

    }catch(err){
        res.status(500).send(err);
        console.log(err);
    }
})

app.post('/order/validate',async(req,res)=>{
    const{razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;

    const sha =crypto.createHmac("sha256",process.env.KEY_SECRET);

    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = sha.digest("hex");

    if(digest!==razorpay_signature){
        return res.status(400).json({msg:"Transaction is not legit!"})
    }

    res.json({
        msg:"Success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
    });
})


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
