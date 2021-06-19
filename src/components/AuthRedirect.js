import React, { Component } from 'react';
import { getAuthToken, testAuthGetter, getUserData } from '../components/Functions';
import _ from "lodash";
import {Button, Spinner} from 'react-bootstrap';
import '../App.css';


class AuthRedirect extends Component {
    componentDidMount() {
        const authenticate = async () => {
            const { history, location } = this.props;
            try {
                //If not redirected to Strava, return to home
                if (_.isEmpty(location)) {
                    console.log("is empty executed")
                    return history.push("/");
                }
                // Save the Auth Token to the Store
                const stravaAuthToken = getAuthToken(window.location.search);
                console.log("auth token ---> " + stravaAuthToken);

                // Post Request to Strava (with AuthToken) which returns Refresh Token and and Access Token
                const tokens = await testAuthGetter(stravaAuthToken);
                console.log(tokens);
                // this.props.setUser(tokens);
                const accessToken = tokens.access_token;
                const userID = tokens.athlete.id;
                console.log(accessToken);
                console.log(userID);

                // Axios request to get users info
                const user = await getUserData(userID, accessToken);
                console.log(user);
                // this.props.setUserActivities(user);
                localStorage.setItem('rememberMe', JSON.stringify(user));
                // Once complete, go to display page
                history.push("/yourdistance");
            } catch (error) {
                console.log(error);
                history.push("/");
            }
        };
        authenticate();
    }

    render() {
        return(
            <div>
                <Button variant="warning" className="spinner-loading" disabled>
                    <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    />
                        Loading...
                </Button>
            </div>
        );
    }
};

export default AuthRedirect;
