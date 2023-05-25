import {Button, Flex, Box, Avatar, Text, Heading, Input, FormControl} from '@chakra-ui/react'
import SideBarChat from "../components/SideBarChat";
import Navbar from "../components/navbar";

export default function Chats() {
    // const {accessToken} = useContext(AuthenticationContext);
    // const {loadUser} = useContext(AuthenticationContext);
    // const [currUser, setCurrUser] = useState("");
    // const [arrayUsers, setArrayUsers] = useState([]);

    // const [snapshot, loading] = useCollection(collection(db, "chats"));
    // const chats = snapshot?.docs.map(doc => ({id:doc.id, ...doc.data()}))
    // const [chatID, setChatID] = useState("")

    // useEffect(() => {
    //     if(accessToken ===""){
    //         loadUser().then((data) => {
    //             if(data.accessToken === ""){
    //                 router.push('/login')
    //             }else{
    //                 console.log(data.userEmail)
    //                 setCurrUser(data.userEmail)
    //             }
                
    //         })
    //     }
    //     if(loading==false){
    //         let filteredChat = chats.filter(chat => chat.users.includes(currUser))
    //         console.log(filteredChat)
    //         setArrayUsers(filteredChat)
    //         console.log("ini array users",arrayUsers)
    //         console.log(getOtherUser(arrayUsers[0], currUser))
    //     }
    // }, [loading])
    
    //TESTING COLLECTION
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