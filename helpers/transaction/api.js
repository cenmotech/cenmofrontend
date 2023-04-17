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

export const getSnapToken = async (list) => {
    try {
        const body = { "gross_amount": list.goods_price }
        const response = await axios.post(`${baseUrl}/get-snap-token`, body, getConfig());
        return response.data.token;
    } catch (error) {
        console.log(error)
        throw new Error(error.response.data.error);
    }
}