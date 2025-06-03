# 🚗 Smart Parking System – IoT-Based Project

## 🧠 Overview

The **Smart Parking System** is an IoT-powered web application designed to reduce urban traffic congestion by streamlining the parking process. It allows users to **register**, **find nearby parking slots**, **reserve in real time**, and **make secure payments** — all via a seamless web interface. The system also includes a working **Arduino-based prototype** that automates entry/exit using **IR sensors** and **servo motors**.

This project is envisioned as part of a **smart city initiative** to provide efficient, technology-driven parking solutions.

---

## ✨ Key Features

- 🔐 **User Authentication**
  - Secure user registration and login using **JWT** and **Bcrypt** for encrypted sessions and passwords.

- 📍 **Location-Based Parking Slot Booking**
  - Users can view and reserve nearby available parking slots using a live map interface.

- 💳 **Online Payment Integration**
  - Users can securely pay booking fees via **Razorpay** (₹50 for 3 hours, ₹20/hour post free hour).

- 🤖 **IoT-Based Hardware Integration**
  - Real-time slot validation via **IR sensors**, **servo-controlled barricades**, and **Arduino+NodeMCU** communication with the server.

---

## 🧰 Tech Stack

### 🖥 Frontend

- **React.js** – For responsive, dynamic UI
- **CSS** – Custom styles and layout
- **Axios** – For making API requests to the backend

### ⚙️ Backend

- **Node.js** – Runtime environment
- **Express.js** – Web framework for building REST APIs
- **PostgreSQL** – Relational database to manage users, bookings, payments
- **JWT (JSON Web Tokens)** – Authentication & session management
- **Bcrypt.js** – For password encryption
- **Razorpay** – For secure payment processing

### 🔌 IoT Hardware Components

- **Arduino UNO** – Microcontroller for controlling gate mechanisms
- **NodeMCU (ESP8266)** – For enabling WiFi-based communication with the server
- **IR Sensors** – For vehicle detection at entry/exit
- **Servo Motors** – To raise/lower the gate barricade
- **Power Supply, Breadboard, Jumper Wires** – Standard prototyping setup

---

## ⚙️ System Workflow

1. **User Flow:**
   - Register/login on the platform.
   - View nearby available slots on map.
   - Reserve a slot (₹50 for 3 hours).
   - Make payment via Razorpay.
   - Proceed to the parking spot.

2. **On Arrival (IoT Integration):**
   - IR sensor detects vehicle at entry.
   - User clicks “Open Gate” from the website.
   - Signal sent to NodeMCU → Arduino.
   - Servo motor lifts barricade automatically.

3. **On Exit:**
   - System calculates time stayed.
   - User pays extra if over 1 free hour (₹20/hr).
   - Upon payment, exit gate opens.

---

## 🛠️ Setup Instructions

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) database setup
- [Arduino IDE](https://www.arduino.cc/en/software) for uploading firmware to hardware

## Conclusion
Integrating the backend with the Arduino enhances the Smart Parking System by providing a robust mechanism for user management, reservation handling, and real-time communication with the hardware. This integration ensures a seamless experience for users, allowing them to easily interact with the system through the website.

## Future Enhancements
- Implement WebSocket communication for real-time updates between the Arduino and the server.
- Develop an admin panel for managing parking slots, reservations, and monitoring system performance.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
