import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useContext } from 'react'
import AuthenticationContext from '../context/AuthenticationContext'
import { Input, Text, Button, onClose, 
    InputGroup, InputRightElement, useToast, Card, CardBody, Heading, Highlight,
    FormControl,FormLabel, FormHelperText, FormErrorMessage} from '@chakra-ui/react'


export default function Login() {

        // Handle Error Email
        const [email, setEmail] = useState("");
        const [emailError, setEmailError] = useState("");

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

            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/.test(e.target.value)) {
            setPasswordError("Password must meet the criteria");
            } else {
            setPasswordError("");
            }
        };


        // Email
        const [input, setInput] = useState(false)
        const isError = input === ''
        const {login} = useContext(AuthenticationContext)


        // Password
        const [show, setShow] = useState(false)
        const handleClick = () => setShow(!show)

        // Toast
        const toast = useToast()

        const submitHandler = e => {
            e.preventDefault();
            login({email, password})
        }
    return (
        <>
        <div className={styles.container}>
            <Head>
                <title>Login</title>
                <meta name="description" content="Cenmo Login" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </div>
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
                    <Button colorScheme='blue' mr={3}
                    onClick={e =>
                        {toast({
                            title: 'You have successfully logged in.',
                            description: "Let's discuss and find the item you want.",
                            status: 'success',
                            duration: 9000,
                            isClosable: true,
                            });
                            submitHandler(e);
                        }
                    }>
                        Log In
                    </Button>
                    <Button onClick={onClose}>Register</Button>
                </form>
            </CardBody>
        </Card>
        </main>
        </>
    )               
}