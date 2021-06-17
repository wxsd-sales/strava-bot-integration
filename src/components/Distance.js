import React from "react";
import "../App.css";
import Navbar from "./Navbar.js";

const Distance = ({ e, returnTokens }) => {

    const activity = JSON.parse(localStorage.getItem("rememberMe"))["data"][0];
    console.log("-------- Activity here --------");
    console.log(activity);

    const imgUrl = 'https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap&path=enc:' + activity.map.summary_polyline + '&key=AIzaSyB7zHW8oTnccu56JNs3Fw_cK9rDC8wFWQY';
    return (
        <div>
            <Navbar />
            <h3 className="title">Activity details</h3>
            <div className="card card-size">
                <img src={imgUrl} className="card-img-top" alt="polyline-map" />
                <div className="card-body">
                    <h5 className="card-title"><b>Activity map</b></h5>
                    <p className="card-text">A polyline route of the activity.</p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><b>Activity name: </b>{activity.name}</li>
                    <li className="list-group-item"><b>Activity type: </b>{activity.type}</li>
                    <li className="list-group-item"><b>Distance: </b>{activity.distance}</li>
                    <li className="list-group-item"><b>Moving Time: </b>{activity.moving_time} seconds</li>
                </ul>
            </div>
        </div>

    );
};


export default Distance;