import { createContext, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const AuthenticationContext = createContext()

export const AuthenticationProvider = ({children}) => {
    const [user, setUser] = useState(null)
	const [accessToken, setAccessToken] = useState(null)
	const [error, setError] = useState(null)

	// const router = useRouter()

    // Login
	const login = async ({email, password}) => {
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

		try {
			const { data:access } = await axios.post('http://localhost:3000/api/login', body, config)
			if(access && access.user.email){
				setUser(access.user.email)
				localStorage.setItem('user', access.user.email)
			}

			if(access && access.accessToken){
				setAccessToken(access.accessToken)
				localStorage.setItem('accessToken', access.accessToken)
			}

		} catch(error){
			console.log(error)
			if (error.response & error.response.data) {
				setError(error.response)
				return      
			} else if (error.request) {
			  setError('Something went wrong')
			  return  
			} else {
			  setError('Something went wrong')
			  return
			}
			console.error('Error', error.message);
			setError('Something went wrong')
			return
		}

		
	}
    // Register
    const register = async ({name, email, password, phone}) => {
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
			// call nextjs api function to create a user
			await axios.post('http://localhost:3001/api/register', body, config)
			login({ email, password })
		} catch(error) {
		  if (error.response & error.response.data) {
		  	setError(error.response.data.message)
		  	return      
	      } else if (error.request) {
		    setError('Something went wrong')
		    return  
	      } else {
			setError('Something went wrong')
			return
	      }
	      console.error('Error', error.message);
	      setError('Something went wrong')
	      return
		}
    }

	return (
		<AuthenticationContext.Provider value={{ user, accessToken, error, login, register}}>
			{children}
		</AuthenticationContext.Provider>
	)
}

export default AuthenticationContext;