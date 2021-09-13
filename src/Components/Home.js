import React, { Component } from "react";
import Navbar from "./Navbar";
import "../App.css";

require("dotenv").config();
//const { REACT_APP_CLIENT_ID } = process.env;
//const redirectUrl = "http://localhost:3000/redirect";
const redirectUrl = "https://wxstrava-fe.glitch.me/redirect";
const authorize = () => {
  window.location = `http://www.strava.com/oauth/authorize?client_id=68776&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=activity:read_all`;
};

export default class Home extends Component {
  render() {
    return (
      <div className="App bg-lw-page">
        <Navbar />
        <div className="strava-btn">
          <h2>Hello!</h2>
          <h3>
            BE <b>FIT.</b> BE <b>INSPIRED.</b>
          </h3>
          <img
            className="img-spacing"
            src="https://cdn.glitch.com/2550078a-a257-41a1-9bc7-405e57736a00%2FStrava-logo.png?v=1627487321142"
            alt="club-logo.png"
            width="100"
            height="100"
          />
          <p>Take part virtually or physically in our charity bike ride!</p>
          <button className="btn btn-warning strava-btn" onClick={authorize}>
            Login
          </button>
        </div>
      </div>
    );
  }
}
