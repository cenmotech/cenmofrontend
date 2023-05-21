import axios from "axios";
const baseUrl = 'http://127.0.0.1:8000/admin';
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

export const getSuggestions = async () => {
    try{
        const response = await axios.get(`${baseUrl}/get-suggestions`, getConfig());
        return response.data;
    }
    catch(error){
        console.log(error)
    }
}

export const changeStatusSuggestions = async (body) => {
    try{
        const response = await axios.post(`${baseUrl}/change-status-suggestions`, body, getConfig());
    }catch{
        console.log(error)
    }
}

export const sendSuggestions = async (body) => {
    try{
        const response = await axios.post(`${baseUrl}/add-suggestion`, body, getConfig());
    }catch{
        console.log(error)
    }
}

export const getGroups = async () => {
    try{
        const response = await axios.get(`${baseUrl}/get-all-groups-data`, getConfig());
        return response.data;
    }
    catch(error){
        console.log(error)
    }
}

export const getAllCategoriesAdmin = async () => {
    try{
        const response  = await axios.get(`${baseUrl}/get-all-categories-for-admin`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}