import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import Login from './components/Login';
import SignUp from './components/SignUp';
import AddParkingLocation from './components/AddParkingLocation';
import Footer from "./components/Footer";
import ListLocation from './components/ListLocation';
import RegisterLocation from './components/RegisterLocation'; // Import the RegisterLocation component
import { AuthContext } from './components/AuthContext';
import './style.css';

function App() {
    const { isLoggedIn } = useContext(AuthContext);

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
                        element={isLoggedIn ? <ListLocation /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/register-location/:locationId" 
                        element={isLoggedIn ? <RegisterLocation /> : <Navigate to="/" />} 
                    />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
