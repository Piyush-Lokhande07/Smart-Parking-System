import React from "react";

function Login() {
    return (
        <form>
            <div>Enter your username:</div>
            <input type="text" />
            <div>Enter password:</div>
            <input type="password" />
            <button className='in-btn' type="submit">Submit</button>
        </form>
    );
}

export default Login;
