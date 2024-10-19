# Smart Parking System

## Overview
The Smart Parking System is an innovative solution designed to streamline the parking experience for users. This system features a website that informs users of available parking slots, allows for reservations, and integrates an Arduino model for practical demonstrations. Users can book a parking slot, pay the required fees, and gain access to the parking lot through an automated barricade system that uses infrared (IR) sensors for car detection.

## Features
- **Real-time Slot Availability**: Users can view available parking slots on the website.
- **Reservation System**: Users can book a slot for a maximum of 3 hours after a fee payment of 50 Rs.
- **Automated Barricade Control**: The entry and exit barricade will operate based on user input and IR sensor data.
- **Flexible Payment Options**: Users incur a fee of 20 Rs per hour after the first free hour upon exit.

## Components Required
For the Arduino model and system integration, the following components are necessary:

### Hardware Components
- **Arduino UNO Board**: The microcontroller that will handle the logic for the barricade operation.
- **IR Sensor Module**: To detect the presence of a car at the entry point.
- **Servo Motor**: To control the movement of the barricade.
- **NodeMCU**: To connect the Arduino to the internet, allowing communication with the backend via WiFi.
- **Power Supply**: To power the Arduino and connected components.
- **Breadboard and Jumper Wires**: For prototyping and connections.

### Software Components
- **Arduino IDE**: For writing and uploading the code to the Arduino.
- **Backend Framework**: Node.js, Flask, or any suitable framework to handle HTTP requests and database management.
- **Database**: A database (Postgre SQL) to manage user reservations and payments.

## System Architecture
The system architecture consists of two main components: the front end (website) and the back end (server + database). The interaction between these components is facilitated by the Arduino microcontroller.

### Workflow
1. **User Reservation**:
   - Users log in to the website and book a parking slot.
   - Upon booking, the slot is reserved for 3 hours.
   - The user receives a confirmation and is instructed to arrive within the allotted time.

2. **Entry Procedure**:
   - Upon arrival, the user logs into the website and selects the option to lift the barricade.
   - The IR sensor detects the presence of the car.
   - If the car is detected, the Arduino receives a signal to lift the barricade.
   - If no car is detected, the barricade remains closed.

3. **Exit Procedure**:
   - Users can exit the parking lot after paying any additional charges (20 Rs per hour after the first free hour).
   - Once the payment is confirmed, the website sends a signal to the Arduino to lift the exit barricade.

## Backend Integration

The backend of the Smart Parking System is responsible for managing user interactions, processing reservations and payments, and facilitating communication between the website and the Arduino. The following sections outline the key components and processes involved in the backend integration.

### Technologies Used
- **Node.js / Flask / Django**: Choose a backend framework suitable for handling HTTP requests and managing application logic.
- **Express.js (if using Node.js)**: For setting up the server and routing.
- **Database**: MySQL, MongoDB, or another suitable database to store user data, reservations, and payment information.
- **Axios or Fetch API**: For making HTTP requests from the frontend to the backend.

## Conclusion
Integrating the backend with the Arduino enhances the Smart Parking System by providing a robust mechanism for user management, reservation handling, and real-time communication with the hardware. This integration ensures a seamless experience for users, allowing them to easily interact with the system through the website.

## Future Enhancements
- Implement WebSocket communication for real-time updates between the Arduino and the server.
- Develop an admin panel for managing parking slots, reservations, and monitoring system performance.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
