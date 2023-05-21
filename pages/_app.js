import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { mode } from "@chakra-ui/theme-tools";
import { AuthenticationProvider } from '../context/AuthenticationContext'
function MyApp({ Component, pageProps }) {
  const theme = extendTheme({
    styles: {
      global: (props) => ({
        body: {
          bg: mode("#f3f3f3")(props),
        }
      })
    },
  })
  return (
    <AuthenticationProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthenticationProvider>
  )
}

export default MyApp