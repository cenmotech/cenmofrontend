import {Flex, Box} from '@chakra-ui/react'
import SideBarChat from "../components/SideBarChat";
import Navbar from "../components/navbar";

export default function Chats() {
    return(
        <Flex h='100vh'>
            {/* Navbar */}
            <Box flex='1'>
                <Navbar/>
            </Box>
            {/* Chat Users */}
            <SideBarChat/>

            {/* Chat */}
            <Flex flex='3' justifyContent="center" alignItems="center">
                Choose a chat
            </Flex>
        </Flex>
    )
}