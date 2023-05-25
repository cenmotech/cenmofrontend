import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from "@firebase/firestore";
import { Flex, Avatar, Text, Heading } from '@chakra-ui/react';
import getOtherUser from '../util/getOtherUser';
import AuthenticationContext from '../context/AuthenticationContext';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { db } from '../firebaseConfig';

const SideBarChat = () => {
    const [snapshot] = useCollection(collection(db, "chats"));
    const [user, setUser] = useState("");
    const chats = snapshot?.docs.map(doc => ({id: doc.id, ...doc.data()}));
    const router = useRouter();
    const {loadUser} = useContext(AuthenticationContext);
    useEffect(() => {
        if(user === ""){
            loadUser().then(data => setUser(data.userEmail));
        }
    })
    const redirect = (id) => {
        router.push(`/chat/${id}`);
      }
    const chatList = () => {
        return (
          chats?.filter(chat => chat.users.includes(user))
          .map(
            (chat, index) => 
              <Flex key={index} p={3} align="center" _hover={{bg: "gray.400", cursor: "pointer"}} onClick={() => redirect(chat.id)} borderRadius='10' bg='gray.200' mb='3'>
                
                <Avatar src="" marginEnd={3} />
                <Text>{getOtherUser(chat.users, user)}</Text>
            
                
              </Flex>
          )
        )
    }

    return(
        <Flex flex='1' direction="column" borderSize='10px' borderColor='black.500'>
          <Heading color='black' size='lg' pt='6' pl='5' pb='3'>Chats</Heading>
                <Flex overflowX={'scroll'} direction={'column'} sx={{scrollbarWidth: "none"}} flex='1' pl='5' pr='5'> 
                    {chatList()}
                </Flex>
        </Flex>
    )
}

export default SideBarChat;