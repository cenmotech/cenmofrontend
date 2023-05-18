import { getDatabase, ref, set } from "firebase/database";
import {Button, Flex, Box, Avatar, Text, Heading, Input, FormControl} from '@chakra-ui/react'
import {database} from '../firebaseConfig'
import AuthenticationContext from "../context/AuthenticationContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import ChatMessages from "../components/chatMessages";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import getOtherUser from "../util/getOtherUser";
export default function Chat() {
    const {user} = useContext(AuthenticationContext);
    const {userName} = useContext(AuthenticationContext);
    const {accessToken} = useContext(AuthenticationContext);
    const {loadUser} = useContext(AuthenticationContext);
    const [currUser, setCurrUser] = useState("");
    const router = useRouter()

    const [snapshot, loading, error] = useCollection(collection(db, "chats"));
    const chats = snapshot?.docs.map(doc => ({id:doc.id, ...doc.data()}))
    const [chatID, setChatID] = useState("")
    // accessTokenChecker
    useEffect(() => {
        if(accessToken ===""){
            loadUser().then((data) => {
                if(data.accessToken === ""){
                    router.push('/login')
                }else{
                    console.log(data.userEmail+";"+data.userName)
                    setCurrUser(data.userEmail+";"+data.userName)
                }
            })
        }
    })
    
    //TESTING COLLECTION
    return(
        <Flex h='100vh'>
            {/* Navbar */}
            <Box flex='1' bg='green.100'>

            </Box>
            {/* Chat Users */}

            {chats && 
                <Flex flex='1' direction="column" bg='blue.200'>
                <Flex overflowX={'scroll'} direction={'column'} sx={{scrollbarWidth: "none"}} flex='1'> 
                    {chats?.filter(chat=> chat.users.includes(currUser))
                    .map((chat, index) => (
                        <Flex key ={index} p={3} align={'center'} _hover={{bg: "gray.100", cursor: "pointer"}} onClick={() => setChatID(chat.id)}>
                        <Avatar></Avatar>
                        <Text ml={3}>{getOtherUser(chat.users, currUser)}</Text>
                    </Flex>
                    ))}
                </Flex>
            </Flex>
            }

            {/* Chat */}
            <ChatMessages/>
        </Flex>
    )
}