import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useContext } from 'react'
import AuthenticationContext from '../context/AuthenticationContext'
import { Input, Text, Button, onClose, 
    InputGroup, InputRightElement, useToast, Card, CardBody, Heading, Highlight,
    FormControl,FormLabel, FormHelperText, FormErrorMessage} from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function Login() {

        // Handle Error Email
        const [email, setEmail] = useState("");
        const [emailError, setEmailError] = useState("");
        const router = useRouter();
        const handleEmailChange = (e) => {
            setEmail(e.target.value);

            if (!e.target.value.includes("@")) {
            setEmailError("Email address must contain '@'");
            } else {
            setEmailError("");
            }
        };

        // Handle Error Password
        const [password, setPassword] = useState('');
        const [passwordError, setPasswordError] = useState("");

        const handlePasswordChange = (e) => {
            setPassword(e.target.value);

            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(e.target.value)) {
            setPasswordError("Password must meet the criteria");
            } else {
            setPasswordError("");
            }
        };


        // Email
        const [input, setInput] = useState(false)
        const isError = input === ''
        const {login} = useContext(AuthenticationContext)
        const {user} = useContext(AuthenticationContext);
        const {accessToken} = useContext(AuthenticationContext);

        // Password
        const [show, setShow] = useState(false)
        const handleClick = () => setShow(!show)

        // Toast
        const toast = useToast()

        function submitHandler (e) {
            e.preventDefault();
            if (email !== "" && password !== "") {
                login({email, password}).then((success) => {
                    /* istanbul ignore next */
                    if(success.success === true && success.is_admin === true){
                        router.push('/admin')
                    }
                    else if (success.success === true && success.is_admin === false){
                        router.push('/')
                    }
                    else {
                        toast({
                            title: "Wrong email or password",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                          })
                    }
                })
            }
            else {
                toast({
                    title: "Please Fill all the required form",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
            }

        }
    return (
        <>
        <div className={styles.container}>
            <Head>
                <title>Login</title>
                <meta name="description" content="Cenmo Login" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
        
        <main className={styles.main} >
        <Heading pb={3} lineHeight='tall'>
            <Highlight
                query='Cenmo!'
                styles={{ px: '2', py: '1', rounded: 'full', bg: 'blue.100' }}
            >
                Welcome in Cenmo!
            </Highlight>
        </Heading>
        <Text>Central Marketplace Online</Text>
        <br/>
        <Card>
            <CardBody>
                <form onSubmit={submitHandler}>
                    <FormControl isInvalid= {emailError}>
                        <FormLabel>Email address</FormLabel>
                        <Input type='email' onChange={handleEmailChange} value={email}/>
                        <FormErrorMessage>{emailError}</FormErrorMessage>
                    </FormControl>
                    <br/>
                    <FormControl isInvalid={passwordError}>
                        <FormLabel>Password</FormLabel>
                        <InputGroup size='md' pa={5}>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter password'
                                onChange={handlePasswordChange} value={password}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick} data-testid="toggle-password">
                                {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormHelperText>• Password must be at least 8 digits<br/>• Password must contain a combination of<br/>	&nbsp;	&nbsp;uppercase letters, lowercase letters, and numbers</FormHelperText>
                        <FormErrorMessage>{passwordError}</FormErrorMessage>
                    </FormControl>
                    <br/>
                    <Button colorScheme='blue' mr={3} onClick={e =>submitHandler(e)}>
                        Log In
                    </Button>
                    <Button onClick={() => router.push("/register")}>Register</Button>
                </form>
            </CardBody>
        </Card>
        </main>
        </div>
        </>
    )               
}