import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components//Home";
import AboutUs from "./components//AboutUs";
import Login from './components//Login';
import SignUp from './components/SignUp';
import Footer from "./components/Footer";
import './style.css';

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/sign-up" element={<SignUp />} />
                </Routes>

                <Footer />
            </div>
        </Router>
    );
}

export default App;
