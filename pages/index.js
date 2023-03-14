import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Flex, Spacer, Center, Text, Square, Box } from '@chakra-ui/react'
import Navbar from '../components/navbar'

//change this to home page using our navbar from components
export default function Home() {
  return (
    <div>
      <Flex color='white'>
      <Box flex='0.7'>
          <Navbar/>
        </Box>
        <Box flex='1' bg='blue'>
          <Text>Box 3</Text>
        </Box>
        <Box flex='1' bg='tomato'>
          <Text>Box 3</Text>
        </Box>
      </Flex>
    </div>
  )
}
