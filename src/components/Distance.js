import React from "react";

const Distance = ({ e, returnTokens }) => {

    const activity = JSON.parse(localStorage.getItem("rememberMe"))["data"][0];
    console.log("-------- Activity here --------");
    console.log(activity);

    const imgUrl = 'https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap&path=enc:' + activity.map.summary_polyline + '&key=<INSERT_YOUR_KEY>';
    return (
        <div>
            <h3>Activity name: {activity.name}</h3>
            <h3>Distance: {activity.distance}</h3>
            {/* <h2>{user.data.all_run_totals.distance}</h2>
            <h2>{user.data.all_ride_totals.distance}</h2>
            <h2>{user.data.all_swim_totals.distance}</h2> */}
            <p>Polyline Map of the route</p>
            <img src={imgUrl}></img>

        </div>
    );
};


export default Distance;