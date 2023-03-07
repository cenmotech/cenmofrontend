import { ChakraProvider } from '@chakra-ui/react'
import { AuthenticationProvider } from '../context/AuthenticationContext'
function MyApp({ Component, pageProps }) {
  return (
    <AuthenticationProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthenticationProvider>
  )
}

export default MyApp