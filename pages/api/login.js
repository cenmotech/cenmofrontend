/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import cookie from "cookie";

export default async (req, res) => {
    let accessToken = null;
    const baseUrl = "https://cenmo-pro.vercel.app"

    if (req.method === 'POST') {
        const {email, password} = req.body
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    
        const body = {
            email,
            password
        }

        try{
            const {data} = await axios.post(`${baseUrl}/authuser/login`, body, config) 
            accessToken = data.accessToken
            if(accessToken){
              const userConfig ={
                  headers: {
                    'Authorization': `Bearer ${accessToken}`
                  }
              }
              const {data: user} = await axios.get(`${baseUrl}/authuser/get-user-session`, userConfig)
              res.status(200).json({user, accessToken})
          }
        } catch(error){
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error)
              console.error(error.response.data);
              console.error(error.response.status);
              console.error(error.response.headers);
              return res.status(401).json({message: error.response.data.detail})
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.error(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.error('Error', error.message);
            }
            console.error(error.config);
      
            return res.status(500).json({message: 'Something went wrong'})
          }
        
    }else{
        res.setHeader('Allow', ['POST'])
        res.status(405).json({message: `Method ${req.method} is not allowed`})
    }
}