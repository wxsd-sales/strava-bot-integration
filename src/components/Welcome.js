import React from "react";
import "../App.css";
import Navbar from "./Navbar.js";

const Welcome = ({ e, returnTokens }) => {
    return (
        <div>
            <Navbar />
            <h3 className="alert alert-success" role="alert">Welcome! You're logged in 🎉</h3>
        </div>

    );
};


export default Welcome;