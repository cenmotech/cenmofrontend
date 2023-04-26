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