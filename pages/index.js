import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {Grid, GridItem, Flex, Spacer, Center, Text, Square, Box } from '@chakra-ui/react'
import Navbar from '../components/navbar'

//change this to home page using our navbar from components
export default function Home() {
  return (
    <main className={styles.container}>
      <Grid templateColumns='repeat(5, 1fr)' gap={0}>
        <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
          <Navbar data-testid="navbar"/>
        </GridItem>
        <GridItem colSpan={3}>
        </GridItem>
        <GridItem colSpan={1}>
        </GridItem>
      </Grid>
    </main>
  )
}
