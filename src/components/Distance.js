import React from "react";
import "../App.css";
import Navbar from "./Navbar.js";

const Distance = ({ e, returnTokens }) => {

    const activity = JSON.parse(localStorage.getItem("rememberMe"))["data"];
    console.log("-------- Activity here --------");
    console.log(activity);
    const imgUrl = '';
    // {activity.map((info, index) => )}
    let imgUrl = 'https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap&path=enc:' + info.map.summary_polyline + '&key=<API_KEY>';
    return (
        <div>
            <Navbar />
            <h3 className="title">Activity details</h3>
            {activity.map((info, index) => 
                <div>
                    <div className="card card-size">
                        <img src={imgUrl} className="card-img-top" alt="polyline-map" />
                        <div className="card-body">
                            <h5 className="card-title"><b>Activity map</b></h5>
                            <p className="card-text">A polyline route of the activity.</p>
                        </div>
                            <ul className="list-group list-group-flush">
                                <li key={info.index} className="list-group-item"><b>Activity name: </b>{info.name}</li>
                                <li key={info.index} className="list-group-item"><b>Activity type: </b>{info.type}</li>
                                <li key={info.index} className="list-group-item"><b>Distance: </b>{info.distance / 1000} kms</li>
                                <li key={info.index} className="list-group-item"><b>Moving Time: </b>{info.moving_time} seconds</li>
                            </ul>
                    </div>
                </div>
            )}
        </div>

    );
};


export default Distance;