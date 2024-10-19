// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');



dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); 
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: proccess.env.USERNAME,
    host: 'localhost',
    database: "Smart-Parking-System",
    password: process.env.PASSWORD,
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

        res.json({ message: 'Login successful', token, userId: user.id }); // Include userId in the response
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
        res.json(result.rows[0]); 
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post("/order",async(req,res)=>{
    try{
        const razorpay = new Razorpay({
            key_id:process.env.KEY_ID,
            key_secret:process.env.KEY_SECRET,
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



app.post('/api/registerinfo', async (req, res) => {
    const { userId, locationId, vehicleNumber, registeredTime } = req.body;
    try {
        const query = `
            INSERT INTO registered_users (userId, vehicle_number, registered_time, location_id)
            VALUES ($1, $2, $3, $4)
        `;
        await pool.query(query, [userId, vehicleNumber, registeredTime, locationId]);
        res.status(201).json({ message: 'Registration successful.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





app.patch('/api/update-slot/:locationId', async (req, res) => {
    const locationId = req.params.locationId;
    try {
        const query = `
            UPDATE parking_locations
            SET dynamic_slot_number = dynamic_slot_number - 1
            WHERE id = $1 AND dynamic_slot_number > 0
        `;
        const result = await pool.query(query, [locationId]);

        if (result.rowCount === 0) {
            return res.status(400).json({ error: 'No slots available or invalid location ID.' });
        }

        res.status(200).json({ message: 'Slot updated successfully.' });
    } catch (error) {
        console.error('Error updating slot:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Check presence of the vehicle
app.post('/api/checkPresence', async (req, res) => {
    const { userId } = req.body;

    try {
        const nodeMcuResponse = await fetch('http://192.168.1.11/checkPresence', {
            method: 'GET',
            timeout: 5000  // Add a timeout of 5 seconds
        });

        const data = await nodeMcuResponse.json();
        console.log("data:", data);

        if (data.isPresent) {
            res.json({ isPresent: true });
        } else {
            res.json({ isPresent: false });
        }
    } catch (error) {
        console.error('Error checking presence:', error);
        res.status(500).json({ error: 'Error checking presence' });
    }
});

// Open gate and log the entry
app.post('/api/openGateEntry', async (req, res) => {
    const { userId } = req.body;
    try {
        const client = await pool.connect();

        const openGateTiming = new Date().toISOString();
        // Update registered_users table with the opengate_timing
        const updateQuery = `
            UPDATE registered_users 
            SET opengate_timing = $1 
            WHERE userId = $2 AND opengate_timing IS NULL;
        `;
        const result = await client.query(updateQuery, [openGateTiming, userId]);

        if (result.rowCount > 0) {
            // Send signal to NodeMCU to open the gate
            const nodeMcuResponse = await fetch('http://192.168.1.11/openGate', {
                method: 'GET',
                timeout: 5000  // Add a timeout of 5 seconds
            });

            const nodeMcuData = await nodeMcuResponse.json();

            if (nodeMcuData.success) {
                res.json({ success: true });
            } else {
                res.status(500).json({ error: 'Failed to open the gate' });
            }
        } else {
            res.status(400).json({ error: 'Failed to log entry time or gate already opened' });
        }

        client.release();
    } catch (error) {
        console.error('Error opening gate:', error);
        res.status(500).json({ error: 'Error opening gate' });
    }
});

app.post('/api/closeGate', async (req, res) => {
    const { userId } = req.body;

    try {
        const client = await pool.connect();

        const closeGateTiming = new Date(); // Current server time (to be stored)

        // Update closegate_timing in the registered_users table
        const updateQuery = `
            UPDATE registered_users 
            SET closegate_timing = $1 
            WHERE userId = $2 AND closegate_timing IS NULL;
        `;
        await client.query(updateQuery, [closeGateTiming, userId]);

        // Retrieve opengate_timing and closegate_timing for the user from the registered_users table
        const selectQuery = `
            SELECT opengate_timing, closegate_timing FROM registered_users 
            WHERE userId = $1 AND closegate_timing IS NOT NULL;
        `;
        const selectResult = await client.query(selectQuery, [userId]);

        if (selectResult.rows.length === 0) {
            res.status(400).json({ error: 'No registered entry found for this user.' });
            client.release();
            return;
        }

        const { opengate_timing, closegate_timing } = selectResult.rows[0];
        const openTime = new Date(opengate_timing); // Time directly from DB
        const closeTime = new Date(closegate_timing); // Also from DB

        // Calculate the time difference in minutes
        const diffInMinutes = (closeTime - openTime) / (1000 * 60);  // Difference in minutes

        // Cost calculation: Rs.50 per hour or Rs.0.83 per minute
        const costPerMinute = 50 / 60;
        const totalAmount = Math.ceil(diffInMinutes * costPerMinute);  // Round up to nearest rupee

        console.log("Time difference in minutes:", diffInMinutes, "Total Amount:", totalAmount);

        client.release();

        // Respond with the calculated total amount
        res.json({ success: true, totalAmount });

    } catch (error) {
        console.error('Error closing gate:', error);
        res.status(500).json({ error: 'Failed to record exit time' });
    }
});



app.post('/api/openExitGate', async (req, res) => {
    const { userId } = req.body;

    try {
        const client = await pool.connect();

        // Retrieve the location_id from registered_users
        const selectQuery = `
            SELECT location_id FROM registered_users 
            WHERE userId = $1 AND closegate_timing IS NOT NULL;
        `;
        const selectResult = await client.query(selectQuery, [userId]);

        if (selectResult.rows.length === 0) {
            res.status(400).json({ error: 'No closed gate entry found for this user.' });
            client.release();
            return;
        }

        const { location_id } = selectResult.rows[0]; 

        // Increase available_slots by 1 in the parking_locations table
        const updateSlotsQuery = `
            UPDATE parking_locations
            SET dynamic_slot_number = dynamic_slot_number + 1
            WHERE id = $1;
        `;
        await client.query(updateSlotsQuery, [location_id]);

        // Send signal to NodeMCU to open the gate
        const nodeMcuResponse = await fetch('http://192.168.1.11/openGate', {
            method: 'GET',
            timeout: 5000  // Add a timeout of 5 seconds
        });

        const nodeMcuData = await nodeMcuResponse.json();

        if (nodeMcuData.success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to open the gate' });
        }

        client.release();

    } catch (error) {
        console.error('Error opening exit gate:', error);
        res.status(500).json({ error: 'Failed to open exit gate' });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
