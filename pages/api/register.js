/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'

export default async (req, res) => {
  let accessToken = null;

  if (req.method === 'POST') {
    const {name, email, password, phone} = req.body

    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    const body = {
      name,
      email,
      password,  
      phone
    }

    try {
      await axios.post('http://127.0.0.1:8000/authuser/register', body, config)
    } catch(error) {
      if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
        return res.status(401).json({message: error.response.data.detail})
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error('Error', error.message);
      }
      console.error(error.config);
      return res.status(500).json({message: 'Something went wrong'})
    }
    res.status(200).json({message: "User has been created"})
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({message: `Method ${req.method} is not allowed`})
  }
}