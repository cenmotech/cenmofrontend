import { createContext, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { set } from 'firebase/database'

const AuthenticationContext = createContext()

export const AuthenticationProvider = ({children}) => {
    const [user, setUser] = useState("")
	const [userName, setUsername] = useState("")
	const [accessToken, setAccessToken] = useState("")
	const [error, setError] = useState("")
	const baseUrl = process.env.NEXT_PUBLIC_DEV
	// const router = useRouter(

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

			// DELETE THIS LINE AFTER TESTING
			sessionStorage.setItem('accessToken', access.data.accessToken)
			sessionStorage.setItem('userEmail', access.data.user.email)
			sessionStorage.setItem('userName', access.data.user.name)
			setAccessToken(access.data.accessToken)
			localStorage.setItem('accessToken', access.data.accessToken)
			localStorage.setItem('user', access.data.user.email)
			return true;
		} catch(error){
			if (error) {
				setError(error.response)
				console.log(error)
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
	//LoadUser
	const loadUser = async () => {
		const token = sessionStorage.getItem('accessToken')
		const userName = sessionStorage.getItem('userName')
		const userEmail = sessionStorage.getItem('userEmail')
		setAccessToken(token)
		setUser(userEmail)
		setUsername(userName)
		let data = {token, userName, userEmail}	
		return data;
	}
	//Logout
	const logout = async () => {
		try{
			setUser("")
			setAccessToken("")
			localStorage.removeItem('accessToken')
			localStorage.removeItem('user')
			sessionStorage.removeItem('accessToken')
			sessionStorage.removeItem('userEmail')
			sessionStorage.removeItem('userName')
			return true
		}catch(error){
			setError(error.response)
			return false
		}
	}

	return (
		<AuthenticationContext.Provider value={{ user, setUser, userName, setUsername, accessToken, setAccessToken, error, login, register, logout, loadUser}}>
			{children}
		</AuthenticationContext.Provider>
	)
}

export default AuthenticationContext;