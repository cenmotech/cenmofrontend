import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Stack,
  } from '@chakra-ui/react'

import { Input, Text, initialRef, Button, onClose, 
    isError, input, handleInputChange, InputGroup, InputRightElement, Link } from '@chakra-ui/react'

import { Card, CardHeader, CardBody, CardFooter, Heading, Highlight, Box } from '@chakra-ui/react'

import bg from '../public/BGCenmo.png'

export default function Login() {

        // Email
        const [input, setInput] = useState(false)
        const handleInputChange = (e) => setInput(e.target.value)
        const isError = input === ''

        // Password
        const [show, setShow] = useState(false)
        const handleClick = () => setShow(!show)

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
                <FormControl>
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' />
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
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                
                <br/>
                <Button colorScheme='blue' mr={3}>
                    Log In
                </Button>
                <Button onClick={onClose}>Register</Button>
                
            </CardBody>
        </Card>
        </main>

            
            </>
    )
                    
}