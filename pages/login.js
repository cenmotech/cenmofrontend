import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'

import { Input } from '@chakra-ui/react'

export default function Login() {
    return (
        <><div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </div>

        <main className={styles.main}>
            <form action="/api/form" method="post">
                <label htmlFor="first">Email</label>
                <br/>
                <Input placeholder='Email address' />
                <br/>
                <label htmlFor="first">Password</label>
                <br/>
                <Input placeholder='Password' />
            </form>
            </main>

            <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input type='email' />
                <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
            </>
    )
}