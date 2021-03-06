## About The Project

This project is an integration of Webex and Strava. Strava is a fitness application that tracks user's activities, posts and other details. cycle4life@webex.bot is a bot created for tracking Strava user's recent activities and club's leaderboard inside webex. This bot provides details about a charity bike ride that includes both physical and virtual participants from all over the world. This integration helped users to be a part of the charity ride from wherever they are and raise donations for **Macmillan Cancer Support** and **Mind**.

## Video Demo
[![Strava bot integration demo](https://img.youtube.com/vi/3VmnvFlJE3Q/sddefault.jpg)](https://www.youtube.com/watch?v=3VmnvFlJE3Q, "Strava Bot Demo")

## Flow Diagram

![Strava Architecture](https://github.com/WXSD-Sales/strava-react/blob/master/strava-flow-diagram.png)

**1.** The flow starts on an user's device. The user is asked to login through a react application for **OAuth Grant flow authorization**. Once the user's login, the authorization code is exchanged for the access token and refresh token. Both the tokens are refreshed periodically to check for the expiration and get a new token. This way the user does not have to login every single time they use the app. \
**2.** A developer API application is created to obtain the cliend id and client secret and a webhook is set up for the application. You can find more details on [setting up a webhook](https://developers.strava.com/docs/webhooks/) here. \
**3.** Once the webhook is setup, whenever user posts an activity, a webhook data containing activity name, type, coordinates, map etc.., is received on the application. \
**4.** Every data received through webhook is stored as user activity data inside the Mongo database. \
**5.** When someone interacts with the bot inside webex, the data is pulled from the database and displayed as an adaptive card.

## Built with

* ReactJS
* NodeJS
* Express

## Prerequisites

* Update the client id and client secret with respect to your application in Strava
* Create a bot and get the bot's token from https://developer.webex.com
* Update port (eg: 3000)

## How to run

**1.** Clone the project
```
git clone https://github.com/WXSD-Sales/strava-react.git
```

**2.** Install necessary packages
```
npm install
```
### Frontend

**3.** Start your react app to login
```
npm start
```

### Backend

**4.** Run the server
```
node server.js
```


## License

Distributed under the MIT License. See `LICENSE` for more information.


## Contact
Please contact us at wxsd@external.cisco.com
