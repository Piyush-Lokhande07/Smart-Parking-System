import React, { useState, useContext } from "react";
import { AuthContext } from './AuthContext'; // Import the AuthContext

function Login({ onSuccess }) {
    const { login } = useContext(AuthContext); // Get the login function from context
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                login(data.userId); 
                
                onSuccess("Login Successful", true); // Pass success message and loggedIn state
                console.log("UserId in Login",data.userId);
            } else {
                setMessage(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Error during login", error);
            setMessage("Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {message && <div>{message}</div>} {/* Display message */}
            <div>Enter your username:</div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <div>Enter password:</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className='in-btn' type="submit">Submit</button>
        </form>
    );
}

export default Login;
