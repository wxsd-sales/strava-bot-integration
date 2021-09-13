import React from "react";
import "../App.css";
import Navbar from "./Navbar.js";

const Welcome = ({ e, returnTokens }) => {
  return (
    <div className="App">
      <Navbar />
      <div className="strava-btn">
        <h2>Welcome!</h2>
        <p>You are logged in! 🎉</p>
      </div>
    </div>
  );
};
export default Welcome;
