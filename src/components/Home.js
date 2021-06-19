import React, { Component } from 'react';
import Navbar from "./Navbar";

require('dotenv').config();
//const { REACT_APP_CLIENT_ID } = process.env;
const redirectUrl = "http://localhost:3000/redirect";


const authorize = () => {
    window.location = `http://www.strava.com/oauth/authorize?client_id=<CLIENT_ID>&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=activity:read_all`;
};

export default class Home extends Component {
    render(){
        return (
            <div className="App">
                <Navbar />
                <button className="btn btn-warning strava-btn" onClick={authorize}>STRAVA</button>
            </div>
          );
    }
}


