import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import Login from './components/Login';
import SignUp from './components/SignUp';
import AddParkingLocation from './components/AddParkingLocation';
import Footer from "./components/Footer";
import { AuthContext } from './components/AuthContext'; // Import the AuthContext
import './style.css';

function App() {
    const { isLoggedIn } = useContext(AuthContext); // Get the login status

    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route 
                        path="/add-parking-location" 
                        element={isLoggedIn ? <AddParkingLocation /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/list-locations" 
                        element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/" />} 
                    />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
