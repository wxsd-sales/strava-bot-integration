import React, { Component } from 'react';

require('dotenv').config();
//const { REACT_APP_CLIENT_ID } = process.env;
const redirectUrl = "http://localhost:3000/redirect";


const authorize = () => {
    window.location = `http://www.strava.com/oauth/authorize?client_id=66644&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=activity:read_all`;
};

export default class Home extends Component {
    render(){
        return (
            <div className="App">
                <h4>Welcome!!</h4>
                <button className="strava-button" onClick={authorize}>STRAVA</button>
            </div>
          );
    }
}


