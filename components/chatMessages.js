import { getDatabase, ref, set } from "firebase/database";
import {Button, Flex, Box, Avatar, Text, Heading, Input, FormControl} from '@chakra-ui/react'
import {database} from '../firebaseConfig'
import AuthenticationContext from "../context/AuthenticationContext";
import { useContext, useEffect } from "react";
import { useRouter } from 'next/router'

const ChatMessages = ({ Id, email}) => {
    return(
        <Flex flex='3' direction={'column'}>
                {/* chat info */}
                <Flex align={'center'} h='81px' p={5}>
                    <Avatar marginEnd={3}></Avatar>
                    <Heading> User 123 </Heading>
                </Flex>
                {/* chat messages */}
                <Flex flex='1' direction={'column'} pt={4} mx={5} overflowX={"scroll"} sx={{scrollbarWidth: "none"}}>
                    <Flex p={5} bg={'blue.300'} w={'fit-content'} minWidth={"50px"} borderRadius={"lg"} m={1}>
                        <Text>message 1</Text>
                    </Flex>
                    <Flex p={5} bg={'green.300'} w={'fit-content'} minWidth={"50px"} borderRadius={"lg"} m={1} alignSelf={"flex-end"}>
                        <Text>message 2</Text>
                    </Flex>
                    
                </Flex>
                {/* chat box */}
                <FormControl p={3}>
                   <Input placeholder="send a message"/>
                    
                </FormControl>
            </Flex>
    )
}

export default ChatMessages