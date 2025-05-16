import axios from 'axios';
import baseURL from '../config/axiosPortConfig';

const fetchLoggedUserData = async () => {
    try {
      // const loggedUserResponse = await axios.get('http://localhost:8000/session/profile-data', { headers: { 'authorization': `Bearer ${accessToken}` }});
      const loggedUserResponse = await axios.get(`${baseURL}/session/profile-data`);
      // console.log(loggedUserResponse.data);
      // console.log(loggedUserResponse.data.data);
      // console.log(loggedUserResponse.data.data.token);
      if(loggedUserResponse.status === 200) {
        const userData = loggedUserResponse.data.data;
        console.log(userData);
        return userData;
      } else {
        // console.log('Error fetching user data');
        console.log('Failed To Load User Data');
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
}

export default fetchLoggedUserData;