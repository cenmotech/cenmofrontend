import axios from "axios";
const baseUrl = 'http://localhost:8000/transaction';
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

export const createTransactionAndGetToken = async (id, qty) => {
  try {
      const body = { "goodId": id , "quantity": qty}
      const response = await axios.post(`${baseUrl}/make-transaction`, body, getConfig());
      console.log(response.data.token)
      return response.data.token;
  } catch (error) {
      console.log(error)
      throw new Error(error.response.data.error);
  }
}

export const getUserTransaction = async() =>{
  try{
    const response = await axios.get(`${baseUrl}/get_user_transaction`, getConfig());
    return response.data;
  }catch (error) {
      console.log(error)
  }
}

export const getUserPendingTransaction = async() =>{
  try{
    const response = await axios.get(`${baseUrl}/get_user_pending_transaction`, getConfig());
    return response.data;
  }catch (error) {
      console.log(error)
  }
}

export const getUserVerifyingTransaction = async() =>{
  try{
    const response = await axios.get(`${baseUrl}/get_user_verifying_transaction`, getConfig());
    return response.data;
  }catch (error) {
      console.log(error)
  }
}

export const getUserProcessingTransaction = async() =>{
  try{
    const response = await axios.get(`${baseUrl}/get_user_processing_transaction`, getConfig());
    return response.data;
  }catch (error) {
      console.log(error)
  }
}


export const getUserCompletedTransaction = async() =>{
  try{
    const response = await axios.get(`${baseUrl}/get_user_completed_transaction`, getConfig());
    return response.data;
  }catch (error) {
      console.log(error)
  }
}

export const getUserCancelledTransaction = async() =>{
  try{
    const response = await axios.get(`${baseUrl}/get_user_cancelled_transaction`, getConfig());
    return response.data;
  }catch (error) {
      console.log(error)
  }
}

export const cancelTransaction = async (body) => {
  try{
      const response  = await axios.post(`${baseUrl}/cancel_transaction`, body, getConfig());
      return response.data;
  }catch(error){
    console.log("ini error ", error)
  }
}

export const updateTransaction = async (body) => {
  try{
      const response  = await axios.post(`${baseUrl}/finished_transaction`, body, getConfig());
      return response.data;
  }catch(error){
    console.log("ini error ", error)
  }
}