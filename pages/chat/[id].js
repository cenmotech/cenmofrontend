import {useRouter} from 'next/router';
import { Flex, Box, Text, Show, Stack, Button, Spacer, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react';
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
import styles from '../../styles/Home.module.css'
import ResponsiveNavbar from '../../components/responsiveNavbar';
import { HiViewList } from 'react-icons/hi';
import { ChatIcon } from '@chakra-ui/icons';
export default function Chat() {
    const router = useRouter();
    const { id } = router.query;
    const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure()
    const { isOpen: isChatsOpen, onOpen: onChatsOpen, onClose: onChatsClose } = useDisclosure()
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
//     useEffect(() =>
//     setTimeout(
//       bottomOfChat.current.scrollIntoView({
//       behavior: "smooth",
//       block: 'start',
//     }), 100)
//   , [messages])
    
    return(
        <main className={styles.container}>
            <Flex p="3" borderBottom='1px' borderColor='gray.200' height="" display={{ base: "block", xl: "none" }}>
                <Stack direction="row">
                    <Button variant='ghost' onClick={onNavOpen}>
                        <HiViewList />
                    </Button>
                <Spacer />
                    <Button variant='ghost' onClick={onChatsOpen} >
                        <ChatIcon />
                    </Button>
                </Stack>
            </Flex>
            <Drawer isOpen={isNavOpen} placement="left" onClose={onNavClose} >
                <DrawerContent>
                    <Navbar />
                </DrawerContent>
            </Drawer>
            <Drawer isOpen={isChatsOpen} placement="left" onClose={onChatsClose}>
                <DrawerContent>
                    <SideBarChat/>
                </DrawerContent>
            </Drawer>
            <Flex h='100vh'>
                {/* NAVBAR */}
                <Show above='xl'>
                    <Box flex='1' w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
                        <Navbar/>
                    </Box>
                </Show>
                {/* SIDEBAR */}
                <Show above='xl'>
                    <SideBarChat/>
                </Show>
                {/* MESSAGES */}
                <Flex flex={3} direction="column" pt='1' bg='white'>
                    <Topbar email={getOtherUser(chat?.users, user)} />

                    <Flex flex={1} direction="column" pt={4} mx={5} overflowX="scroll" sx={{scrollbarWidth: "none"}}>
                        {getMessages()}
                        <div ref={bottomOfChat}></div>
                    </Flex>

                    <Bottombar id={id} user={user} />
                </Flex>
            </Flex>
        </main>
    )
}