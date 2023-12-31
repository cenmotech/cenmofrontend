import axios from "axios";
//const baseUrl = 'http://localhost:8000/shopcart';
const baseUrl = `${process.env.NEXT_PUBLIC_BE_URL}/shopcart`;
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
export const updateToCart = async (action, goodsID, amount) => {
    try{
        const body = {
            "action": action,
            "goods_id": goodsID,
            "amount": amount
        }
        const response  = await axios.post(`${baseUrl}/update_to_cart`, body, getConfig());
    }catch(error){
        console.log("ini error ", error)
        throw new Error(error.response.data.error);
    }
}

export const getCart = async() => {
    try{
        const response  = await axios.get(`${baseUrl}/get_cart`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getItemCart = async(items_id) => {
    try{
        const response  = await axios.get(`${baseUrl}/get_carts_item/${items_id}`, getConfig());
        console.log("test")
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}