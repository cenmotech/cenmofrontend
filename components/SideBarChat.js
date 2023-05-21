import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc } from "@firebase/firestore";
import { Flex, Avatar, Text } from '@chakra-ui/react';
import getOtherUser from '../util/getOtherUser';
import AuthenticationContext from '../context/AuthenticationContext';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { db } from '../firebaseConfig';

const SideBarChat = () => {
    const [snapshot, loading, error] = useCollection(collection(db, "chats"));
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
              <Flex key={index} p={3} align="center" _hover={{bg: "gray.100", cursor: "pointer"}} onClick={() => redirect(chat.id)}>
                <Avatar src="" marginEnd={3} />
                <Text>{getOtherUser(chat.users, user)}</Text>
              </Flex>
          )
        )
    }

    return(
        <Flex flex='1' direction="column" bg='blue.200'>
                <Flex overflowX={'scroll'} direction={'column'} sx={{scrollbarWidth: "none"}} flex='1'> 
                    {chatList()}
                </Flex>
        </Flex>
    )
}

export default SideBarChat;