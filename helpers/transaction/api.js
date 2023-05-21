import axios from "axios";
const baseUrl = `${process.env.NEXT_PUBLIC_BE_URL}/transaction`;
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

export const getSellerTransaction = async (Token, qty) => {
  accessToken = Token;
  try {
      const response = await axios.get(`${baseUrl}/get-seller-transaction`, getConfig());
      return response.data;
  } catch (error) {
      console.log(error)
      throw new Error(error.response.data.error);
  }
}

export const createTransactionAndGetToken = async (id, qty) => {
  try {
      const body = { "goodId": id , "quantity": qty}
      const response = await axios.post(`${baseUrl}/make-transaction`, body, getConfig());
      console.log(response.data.token)
      return response.data.token;
  } catch (error) {
    return error.response
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
export const getBuyerByGoodsId = async (Token,goods_id) => {
  accessToken = Token
  try{
    const response = await axios.get(`${baseUrl}/get-buyer-by-goods-id/${goods_id}`, getConfig());
    return response.data;
  }catch (error) {
      console.log(error)
  }
}
export const createComplain = async (body) => {
  try{
      const response  = await axios.post(`${baseUrl}/create-complain`, body, getConfig());
      return response.data;
  }catch(error){
    console.log("ini error ", error)
  }
}

export const getBankList = async () => {
  try{
    const response = await axios.get(`${baseUrl}/get-bank-list`, getConfig());
    return response.data;
  }catch (error) {
    console.log(error)
  }
}

export const validateBank = async (bank_name, bank_no) => {
  try{
    const response  = await axios.get(`${baseUrl}/validate-bank?bank_name=${bank_name}&bank_no=${bank_no}`, getConfig());
    return response;
  }catch(error){
    console.log(error)
  }
}

export const addBankAccount = async (data) => {
  try{
    const body = {
      "validation_id": data.id,
      "bank_name": data.bank_name,
      "account_no": data.account_no,
      "account_name": data.account_name
    }
    const response  = await axios.post(`${baseUrl}/add-bank-to-user`, body, getConfig());
    return response;
  }catch(error){
    console.log(error)
  }
}

export const getUserBankAccount = async () => {
  try{
    const response  = await axios.get(`${baseUrl}/get-user-bank`, getConfig());
    return response.data;
  }catch(error){
    console.log(error)
  }
}

export const withdrawToBank = async (bank_id, amount) => {
  try{
    const body = {
      bank_id,
      amount
    }
    const response  = await axios.post(`${baseUrl}/withdraw`, body, getConfig());
    return response;
  }catch(error){
    console.log(error)
  }
}

export const getWithdrawalHistory = async () => {
  try{
    const response  = await axios.get(`${baseUrl}/get-user-withdrawal`, getConfig());
    return response.data;
  }catch(error){
    console.log(error)
  }
}