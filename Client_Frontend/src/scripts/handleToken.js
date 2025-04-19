import axios from "axios";
import baseURL from "../config/axiosPortConfig";

const handleToken = async (token) => {

    if(!token) {
        console.log('Error Occured While checking Token Validity');
        return false;
    }

    try {
        // generate ne token ...
        const response = await axios.post(`${baseURL}/session/handle-token`, { token: token });
        console.log(response.data);
        if (response.status === 201) {
            console.log(response.data.message);
            console.log(response.data.token);
            localStorage.setItem('AccessToken', response.data.token);
            return 'Token Authentication Successfull';
        } else {
            console.log(response.data.message);
            return 'Token Authentication Error';
        }
    } catch (error) {
        console.log(error);
        return 'Token Authentication Error';
    }
}

export default handleToken;