import axios from "axios";
const baseUrl = `${process.env.NEXT_PUBLIC_BE_URL}/group`
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
//CREATE GROUP POST LISTING CATEGORY
export const createGroup = async (body) => {
    try{
        const response  = await axios.post(`${baseUrl}/create_group`, body, getConfig());
        return response;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const createCategory = async (body) => {
    try{
        const response  = await axios.post(`${baseUrl}/create_category`, body, getConfig());
        return response;
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

export const getPostOnGroup = async (Token,groupId, tags="") => {
    accessToken = Token;
    try{
        if (tags === ""){
            const response  = await axios.get(`${baseUrl}/get_post_on_group/${groupId}`, getConfig());
            return response.data;
        } else {    
            // console.log(tags)
            tags = tags.split(",")
            const encodedTags = tags.map(tag => encodeURIComponent(tag));
            const queryString = `tags=${encodedTags.join(",")}`;
            const response  = await axios.get(`${baseUrl}/get_post_on_group/${groupId}?${queryString}`, getConfig());
            return response.data;
        }
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getListingBySeller = async (Token, sellerEmail) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_listing_by_seller`, getConfig());
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
        const response  = await axios.get(`${baseUrl}/search_post_on_group/${groupId}/${urlbody}`, getConfig());
        return response.data;
        // if (tags === ""){
        //     const response  = await axios.get(`${baseUrl}/search_post_on_group/${groupId}/${urlbody}`, getConfig());
        //     return response.data;
        // } else {
        //     tags = tags.split(",")
        //     const encodedTags = tags.map(tag => encodeURIComponent(tag));
        //     const queryString = `tags=${encodedTags.join(",")}`;
        //     const response  = await axios.get(`${baseUrl}/search_post_on_group/${groupId}/${urlbody}?${queryString}`, getConfig());
        //     return response.data;
        // }
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

export const searchListingByNameAndSeller = async (Token, urlbody) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/search_listing_by_seller_and_name/${urlbody}/`, getConfig());
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
        await axios.post(`${baseUrl}/join_group`, body, getConfig()).then(res => {
            return res.data;
        })
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

export const deletePost = async (Token, groupId, postId) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/delete_post/${groupId}/${postId}`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const isMember = async (Token, groupId) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/is_joined/${groupId}`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

//Get Store and Feed

export const getFeeds = async (Token) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_feed`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getStore = async (Token) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_store`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const editListing = async (Token, Body) => {
    accessToken = Token;
    try{
        const response  = await axios.post(`${baseUrl}/edit_listing`, Body, getConfig());
        return response.data;
    } catch(error){
        throw new Error(error.response.data.error);
    }
}

export const like = async (Token, postId) => {
    accessToken = Token;
    try{
        await axios.post(`${baseUrl}/like/${postId}`, body, getConfig()).then(res => {
            return res.data;
        })
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const likeByUser = async (Token) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/liked_by_user`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const comment = async (Token, postId) => {
    accessToken = Token;
    try{
        await axios.post(`${baseUrl}/comment/${postId}`, body, getConfig()).then(res => {
            return res.data;
        })
    }catch(error){
        throw new Error(error.response.data.error);
    }
}

export const getComment = async (Token, postId) => {
    accessToken = Token;
    try{
        const response  = await axios.get(`${baseUrl}/get_comment/${postId}`, getConfig());
        return response.data;
    }catch(error){
        throw new Error(error.response.data.error);
    }
}
