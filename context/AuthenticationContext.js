import { createContext, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const AuthenticationContext = createContext()

export const AuthenticationProvider = ({children}) => {
    const [user, setUser] = useState("")
	const [accessToken, setAccessToken] = useState("")
	const [error, setError] = useState("")
	const baseUrl = 'https://cenmo.tech/api'
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
			let access = await axios.post(`${baseUrl}/login`, body, config)
			setUser(access.data.user.email)
			setAccessToken(access.data.accessToken)
			localStorage.setItem('accessToken', access.data.accessToken)
			localStorage.setItem('user', access.data.user.email)
			return true;
		} catch(error){
			if (error) {
				setError(error.response)
				return false
			} else if (error.request) {
			  setError('Something went wrong')
			  return false
			} else {
			  setError('Something went wrong')
			  return false
			}
			console.error('Error', error.message);
			setError('Something went wrong')
			return false
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
			await axios.post(`${baseUrl}/register`, body, config)
			return true
		} catch(error) {
		  if (error) {
		  	setError(error.response)
		  	return false     
	      } else if (error.request) {
		    setError('Something went wrong')
		    return false 
	      } else {
			setError('Something went wrong')
			return false
	      }
	      console.error('Error', error.message);
	      setError('Something went wrong')
	      return false
		}
    }
	//Logout
	const logout = async () => {
		try{
			setUser("")
			setAccessToken("")
			localStorage.removeItem('accessToken')
			localStorage.removeItem('user')
			return true
		}catch(error){
			setError(error.response)
			return false
		}
	}

	return (
		<AuthenticationContext.Provider value={{ user, accessToken, error, login, register, logout}}>
			{children}
		</AuthenticationContext.Provider>
	)
}

export default AuthenticationContext;