import axios from "axios";
import baseURL from "../config/axiosPortConfig";

const verifyToken = async (token) => {
    console.log(token);
    try {
        const response = await axios.get(`${baseURL}/session/handle-token/${token}`);
        console.log(response.data);
        if (response.data === 'Token is Valid') {
            // console.log('Token is valid', response.data);
            return 'Token is Valid';
        } else if (response.data === 'Token is Expired') {
            // console.log('Token is Expired', response.data);
            return 'Token is Expired';
        } else if (response.data === 'Token is Invalid') {
            // console.log('Token is Invalid', response.data);
            return 'Token is Invalid';
        } else if (response.data === 'Token is not provided') {
            // console.log('Token is not provided', response.data);
            return 'Token is not provided';
        } else {
            // console.log('Error Occurred', response.data);
            return 'Error Occurred';
        }
    } catch (error) {
        // console.log(error);
        return 'Error Occured';
    }
} 

export default verifyToken;