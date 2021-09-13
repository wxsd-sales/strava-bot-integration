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
            `https://www.strava.com/api/v3/oauth/token?client_id=68776&client_secret=a03c44e89c54641b8eaff89a898bd6d19ee276b7&code=${authTok}&grant_type=authorization_code`
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getUserData = async (userID, accessToken) => {
    try {
        const response = await axios.get(
            `https://www.strava.com/api/v3/activities?before=33197844040&after=1622554844&access_token=${accessToken}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return response;
    } catch (error) {
        console.log(error);
    }
};
