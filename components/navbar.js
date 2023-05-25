//use Chakra UI components
import {
    Grid, GridItem, Flex, Spacer, Box, Heading, ButtonGroup,
    Button, List, ListItem, InputLeftElement,
    Input, InputGroup, Card, CardBody,
    Stack, Accordion, AccordionItem,
    AccordionButton, AccordionIcon, AccordionPanel,
    Avatar, Link, Modal, ModalOverlay, 
    ModalContent, ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, useDisclosure, FormControl, FormLabel,useToast, Textarea 
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { BsCart2, BsChatRightText, BsBell } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";
import { BiStore } from "react-icons/bi";
import React, { useEffect, useState, useContext } from 'react'
import axios from "axios";
import AuthenticationContext from '../context/AuthenticationContext'
import { useRouter } from 'next/router'
import { getUserInfo } from '../helpers/profile/api';
import { sendSuggestions } from '../helpers/admin/api';


export default function Navbar() {
    const [categories, setCategories] = useState([])
    const [filter, setFilter] = useState('')
    const { logout } = useContext(AuthenticationContext);
    const baseUrl = process.env.NEXT_PUBLIC_BE_URL
    const router = useRouter();
    const toast = useToast()

    useEffect(() => {
        if (localStorage.getItem("accessToken") == null) {
            router.push("/login")
        } else {
            getUserFromApi();
        }
    }, [])

    async function getUserFromApi() {
        try {
            const response = await getUserInfo(localStorage.getItem('accessToken'));
            setUserName(response.name)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (localStorage.getItem("accessToken") == null) {
            router.push("/login")
        } else {
            const fetchCategories = async () => {
                if (filter === '') {
                    const response = await axios.get(`${baseUrl}/group/get_all_categories`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    })
                    if (response && response.data && response.data.category_groups) {
                        setCategories(response.data.category_groups)
                    }
                }
                else {
                    const response = await axios.get(`${baseUrl}/group/get_all_categories_contains/${filter}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    })
                    if (response && response.data && response.data.category_groups) {
                        setCategories(response.data.category_groups)
                    }
                }
            }
            fetchCategories()
        }
    }, [filter])

    const handleSearch = (e) => {
        setFilter(e)
    }

    const handleLogout = () => {
        logout().then((success) => {
            /* istanbul ignore next */
            if (success) {
                router.push('/login')
            }
        })
    }

    const [userName, setUserName] = useState("")
    useEffect(() => {
        if (localStorage.getItem("accessToken") == null) {
            router.push("/login")
        } else {
            const getUser = async () => {
                const response = await getUserInfo(localStorage.getItem('accessToken'));
                setUserName(response.name)
            }
            getUser()
        }
    }, [])

    const initialRef = React.useRef(null)

    const handleRequestForm = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try{
            const body={
                "suggestion":e.target.request_user.value
            }
            await sendSuggestions(body);

            onClose();
        }
        catch (error) {

        }
    };

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box data-testid="navbar" h='100vh' display="flex" flexDirection="column" bg='white'>
            <Grid templateRows='repeat(13, 1fr)' gap={0} flex="1" minHeight="0">
                <GridItem>
                    <Flex minWidth='max-content' alignItems='center' gap='2' pt='13'>
                        <Box p='2' pl='5'>
                            <Heading as='b' color='black' size='lg'>Cenmo</Heading>
                        </Box>
                        <Spacer />
                        <ButtonGroup gap='2' p='2' pr='5' borderRadius='30'>
                            <Button borderRadius='15' color='black' onClick={handleLogout}>Log Out</Button>
                        </ButtonGroup>
                    </Flex>
                </GridItem>
                <GridItem rowSpan={1}>
                <List spacing={3} pl='5' pt='3' pr='3'>
                        <ListItem>
                            <Button leftIcon={<BsBell />} justifyContent='left' onClick={() => router.push("/")} cursor="pointer" width='100%' borderRadius='30' colorScheme='blue'>Home</Button>
                        </ListItem>
                        <ListItem>
                            <Button leftIcon={<BsChatRightText />} justifyContent='left' onClick={() => router.push("/chats")} width='100%' borderRadius='30' colorScheme='blue'>Chats</Button>
                        </ListItem>
                        <ListItem>
                            <Button leftIcon={<BsCart2 />} justifyContent='left' onClick={() => router.push("/basket")} width='100%' borderRadius='30' colorScheme='blue'>Baskets</Button>
                        </ListItem>
                        <ListItem>
                            <Button leftIcon={<MdAttachMoney />} justifyContent='left' onClick={() => router.push("/transaction")} width='100%' borderRadius='30' colorScheme='blue'>Transaction</Button>
                        </ListItem>
                        <ListItem>
                            <Button leftIcon={<BiStore />} justifyContent='left' onClick={() => router.push("/sellerportal")} width='100%' borderRadius='30' colorScheme='blue'>Seller Portal</Button>
                        </ListItem>
                    </List>
                </GridItem>
                <GridItem rowSpan={9} overflowY="auto">
                    <Heading pl='5' pt='7' color='black' size='md'>Categories</Heading>
                    <InputGroup pl='5' pr='5' pt='3'>
                        <InputLeftElement
                            pl='9' pt='6'
                            pointerEvents='none'
                            children={<SearchIcon color='gray.300' />}
                        />
                        <Input pl='10' type='tel' placeholder='Search' borderRadius='30' onChange={e => handleSearch(e.target.value)} />
                    </InputGroup>
                    <Box maxH='370px' overflowY='auto'>
                        <Card variant='unstyled' pl='5' pr='5' pt='3' pb='3'>
                            <CardBody >
                                <Accordion allowToggle>
                                    {Object.entries(categories).map(([key, value]) => (
                                        <AccordionItem key={key}>
                                            <h2>
                                                <AccordionButton>
                                                    <Box as="span" flex='1' textAlign='left'>
                                                        {key}
                                                    </Box>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                            </h2>
                                            {value.map((group, index) => (
                                                <AccordionPanel pb={4} key={index}>
                                                    <Link href={'/group/' + group.group_id} key={index} style={{ textDecoration: 'none' }}><Button justifyContent='left' colorScheme='blue' variant='ghost'>{group.group_name} </Button></Link>
                                                </AccordionPanel>
                                            ))}
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                                <Button justifyContent='left' colorScheme='blue'onClick={onOpen} variant='ghost'>Request Category</Button>
                                <Modal
                    isCentered
                    onClose={onClose}
                    isOpen={isOpen}
                    motionPreset='slideInBottom'
                  >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Request Form</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={handleRequestForm}>
                            <FormControl>
                            <FormLabel>What's your request?</FormLabel>
                            <Textarea  ref={initialRef} type='text' name="request_user" size="lg" height="200px" resize="vertical"/>
                            </FormControl>
                            <ModalFooter>
                            <Button type='submit' colorScheme='blue' mr={3}
                                onClick={() =>
                                    toast({
                                      title: 'Suggestions Sent',
                                      description: "Your suggestion has been send to admin",
                                      status: 'success',
                                      duration: 9000,
                                      isClosable: true,
                                    })
                                  }
                            >
                            Send
                            </Button>
                        </ModalFooter>
                            </form>
                        </ModalBody>
                        </ModalContent>
                  </Modal>
                            </CardBody>
                        </Card>
                    </Box>
                </GridItem>
                <GridItem rowSpan={3} alignItems='end'>
                    <Stack onClick={() => router.push('/accounts/profile')} cursor="pointer" direction='row' pl='5' pt='12'>
                        <Avatar size='md' name={userName} />
                        <Stack direction='row' alignItems={"center"} color='black' m='5' pl='3'>
                            <p>{userName}</p>
                        </Stack>
                    </Stack>
                </GridItem>
            </Grid>
        </Box>
    )
}