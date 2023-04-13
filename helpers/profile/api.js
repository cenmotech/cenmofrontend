import axios from "axios";
const baseUrl = 'http://127.0.0.1:8000/authuser';
let accessToken = null;
const getConfig = () => {
    return {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }
  }

export const getUserProfile = async (Token) => {
    accessToken = Token;
    try {
        const response = await axios.get(`${baseUrl}/get-user-profile`, getConfig());
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}

export const editProfile = async (Token, Body) => {
    accessToken = Token;
    try{
        const response  = await axios.post(`${baseUrl}/edit-profile`, Body, getConfig());
        return response.data;
    } catch(error){
        throw new Error(error.response.data.error);
    }
}

export const addAddress = async (Token, Body) => {
    accessToken = Token;
    try{
        const response  = await axios.post(`${baseUrl}/add-address`, Body, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getUserInfo = async (Token) => {
    accessToken = Token;
    try {
        const response = await axios.get(`${baseUrl}/get-user-session`, getConfig());
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}

export const setMainAddress = async (Token, id) => {
    accessToken = Token;
    try{
        console.log(getConfig());
        const response  = await axios.post(`${baseUrl}/set-address/${id}`, {}, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

//HOW TO USE IN A FRONTEND COMPONENT
// async function myFunction() {
//     try {
//       const userProfile = await getUserProfile('myToken');
//       // do something with the userProfile
        //preferably state management here 
//     } catch (error) {
//       // handle the error
//       console.error(error);
//     }
//   }