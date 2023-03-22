import axios from "axios";
const baseUrl = 'http://127.0.0.1:8000/group';
let accessToken = null;
const getConfig = () => {
    return {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  }
//CREATE GROUP POST LISTING CATEGORY
export const createGroup = async (Token, body) => {
    accessToken = Token;
    try{
        const response  = await axios.post(`${baseUrl}/create_group`, body, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const createCategory = async (Token, body) => {
    accessToken = Token;
    try{
        const response  = await axios.post(`${baseUrl}/create_category`, body, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const createPost = async (Token, body) => {
    accessToken = Token;
    try{
        const response  = await axios.post(`${baseUrl}/create_post`, body, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const createListing = async (Token, body) => {
    accessToken = Token;
    try{
        const response  = await axios.post(`${baseUrl}/create_listing`, body, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

//GET

export const getAllCategories = async (Token) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_all_categories`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getPostbyLoggedUser = async (Token) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_post_by_logged_user`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getListingbyLoggedUser = async (Token) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_listing_by_logged_user`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getPostOnGroup = async (Token,groupId) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_post_on_group/${groupId}`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getListingBySeller = async (Token, sellerEmail) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_listing_by_seller/${sellerEmail}`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getListingBySellerOnGroup = async (Token, sellerEmail, groupId) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_listing_by_seller_on_group/${groupId}/${sellerEmail}`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getListingOnGroup = async (Token, groupId) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_listing_on_group/${groupId}`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getAllCategoriesContains = async (Token, urlbody) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_all_categories_contains/${urlbody}`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}
//SEARCH

export const searchPostByDesc = async (Token, urlbody) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/search_post_by_desc/${urlbody}/`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const searchPostOnGroup = async (Token,groupId, urlbody) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/search_post_on_group/${groupId}/${urlbody}/`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const searchListingByName = async (Token, urlbody) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/search_listing_by_name/${urlbody}/`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const searchListingOnGroup = async (Token,groupId, urlbody) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/search_listing_on_group/${groupId}/${urlbody}/`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const joinGroup = async (Token, body) => {
    accessToken = Token;
    try{
        const response  = await axios.post(`${baseUrl}/join_group`, body, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const searchGroup = async (Token, urlbody) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/search_group/${urlbody}`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const seeGroup = async (Token, groupId) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/see_group/${groupId}`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}
