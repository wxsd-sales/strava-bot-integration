import axios from "axios";

export const getParamValues = (url) => {
    return url
        .slice(1)
        .split("&")
        .reduce((prev, curr) => {
            const [title, value] = curr.split("=");
            prev[title] = value;
            return prev;
        }, {});
};

export const getAuthToken = (str) => {
    return str.split("&")[1].slice(5);
};

export const testAuthGetter = async (authTok) => {
    try {
        const response = await axios.post(
            `https://www.strava.com/api/v3/oauth/token?client_id=66644&client_secret=bf46e0664b746a64dcf75c118b06016bc8596200&code=${authTok}&grant_type=authorization_code`
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getUserData = async (userID, accessToken) => {
    try {
        const response = await axios.get(
            // `https://www.strava.com/api/v3/athletes/${userID}/stats`,
            `https://www.strava.com/api/v3/activities?before=1622686544&after=1622513744&access_token=${accessToken}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        // console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }
};
