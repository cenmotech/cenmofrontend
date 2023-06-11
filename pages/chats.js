import {Flex, Box, Show} from '@chakra-ui/react'
import SideBarChat from "../components/SideBarChat";
import Navbar from "../components/navbar";
import ResponsiveNavbar from '../components/responsiveNavbar';
import styles from '../styles/Home.module.css'
export default function Chats() {
    return(
        <main className={styles.container}>
            <ResponsiveNavbar/>
            <Flex h='100vh'>
            {/* Navbar */}
                <Show above='xl'>
                    <Box flex='1' w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
                        <Navbar/>
                    </Box>
                </Show>
            {/* Chat Users */}
                <SideBarChat/>

            {/* Chat */}
                <Flex flex='3' justifyContent="center" alignItems="center" display={{ base: "none", xl: "block" }}>
                    Choose a chat
                </Flex>
            </Flex>
        </main> 
    )
}