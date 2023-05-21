import {useRouter} from 'next/router';
import { Flex, Box, Text } from '@chakra-ui/react';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, doc, orderBy, query } from "firebase/firestore"
import { db } from '../../firebaseConfig';
import getOtherUser from '../../util/getOtherUser';
import { useContext, useEffect, useState, useRef } from 'react';
import AuthenticationContext from '../../context/AuthenticationContext';
import Navbar from '../../components/navbar';
import SideBarChat from '../../components/SideBarChat';
import Topbar from '../../components/Topbar';
import Bottombar from '../../components/Bottombar';
export default function Chat() {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState("");
    const {loadUser} = useContext(AuthenticationContext);
    useEffect(() => {
        if(user === ""){
            loadUser().then(data => setUser(data.userEmail));
        }
    })
    const [chat] = useDocumentData(doc(db, `chats/${id}`));
    const q = query(collection(db, `chats/${id}/messages`), orderBy("timestamp"));
    const [messages] = useCollectionData(q);
    const bottomOfChat = useRef();

    const getMessages = () =>
    messages?.map((msg, index) => {
      const sender = msg.sender == user;
      return (
        <Flex key={index} alignSelf={sender ? "flex-end" : "flex-start"} bg={sender ? "green.100" : "blue.100"} w="fit-content" minWidth="100px" borderRadius="lg" p={3} m={1}>
          <Text>{msg.text}</Text>
        </Flex>
      )
    })
    useEffect(() =>
    setTimeout(
      bottomOfChat.current.scrollIntoView({
      behavior: "smooth",
      block: 'start',
    }), 100)
  , [messages])
    
    return(
        <Flex h='100vh'>
            {/* NAVBAR */}
            <Box flex='1'>
                <Navbar/>
            </Box>
            {/* SIDEBAR */}
            <SideBarChat/>
            {/* MESSAGES */}
            <Flex flex={3} direction="column">
                <Topbar email={getOtherUser(chat?.users, user)} />

                <Flex flex={1} direction="column" pt={4} mx={5} overflowX="scroll" sx={{scrollbarWidth: "none"}}>
                    {getMessages()}
                    <div ref={bottomOfChat}></div>
                </Flex>

                <Bottombar id={id} user={user} />
            </Flex>
        </Flex>
    )
}