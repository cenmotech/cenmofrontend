import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useContext } from 'react'
import AuthenticationContext from '../context/AuthenticationContext'
import { Input, Text, initialRef, Button, onClose, 
    isError, input, handleInputChange, InputGroup, 
    InputRightElement, Link, NumberInput, NumberInputField,
    NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
    useToast, Card, CardHeader, CardBody, CardFooter, Heading, Highlight,
    Box, FormControl,FormLabel, FormErrorMessage, FormHelperText, Stack, } from '@chakra-ui/react'


export default function Login() {

        // Email
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
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
                    <FormControl>
                        <FormLabel>Email address</FormLabel>
                        <Input type='email' onChange={e => setEmail(e.target.value)} value={email}/>
                        <FormHelperText>We'll never share your email.</FormHelperText>
                    </FormControl>
                    <br/>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <InputGroup size='md' pa={5}>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter password'
                                onChange={e => setPassword(e.target.value)} value={password}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
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