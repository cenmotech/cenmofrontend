import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Show, Grid, GridItem, Flex, Spacer, Center, Text, Square, Box, Stack, Button, Drawer, DrawerContent, DrawerHeader, DrawerCloseButton, useDisclosure } from '@chakra-ui/react'
import { BiStore } from 'react-icons/bi'
import { HiViewList } from 'react-icons/hi'
import Navbar from '../components/navbar'

//change this to home page using our navbar from components
export default function Home() {
  const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure()
  const { isOpen: isStoreOpen, onOpen: onStoreOpen, onClose: onStoreClose } = useDisclosure()
  return (
    <main className={styles.container}>
      <Flex p="3" borderBottom='1px' borderColor='gray.200' height="100" display={{ base: "block", xl: "none" }}>
        <Stack direction="row">
          <Button variant='ghost' onClick={onNavOpen}>
            <HiViewList />
          </Button>
          <Spacer />
          <Button variant='ghost' onClick={onStoreOpen}>
            <BiStore />
          </Button>
        </Stack>
      </Flex>
      <Drawer isOpen={isNavOpen} placement="left" onClose={onNavClose}>
        <DrawerContent>
          <Navbar />
        </DrawerContent>
      </Drawer>
      <Drawer isOpen={isStoreOpen} placement="right" size="sm" onClose={onStoreClose}>
        <DrawerContent overflow='scroll'>
          <DrawerHeader>
        <DrawerCloseButton />
        </DrawerHeader>
        </DrawerContent>
      </Drawer>
      <Grid templateColumns={{ base: 'repeat(3, 1fr)', xl: 'repeat(5, 1fr)' }} gap={0}>
      <Show above='xl'>
        <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
          <Navbar data-testid="navbar"/>
        </GridItem>
      </Show>
        <GridItem colSpan={3}>
        </GridItem>
        <Show above='xl'>
        <GridItem colSpan={1}>
        </GridItem>
        </Show>
      </Grid>
    </main>
  )
}
