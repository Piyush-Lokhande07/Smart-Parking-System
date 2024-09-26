import React from "react";

function Register() {
    return (
        <form>
            <div>Enter your name:</div>
            <input type="text" />
            <div>Enter your phone no:</div>
            <input type="text" />
            <div>Enter your email-id:</div>
            <input type="text" />
            <div>Enter Username:</div>
            <input type="text" />
            <div>Enter password:</div>
            <input type="password" />
            <button className='in-btn' type="submit">Submit</button>
        </form>
    );
}

export default Register;
