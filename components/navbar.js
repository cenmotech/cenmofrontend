//use Chakra UI components
import { Grid, GridItem, Flex, Spacer, Box, Heading, ButtonGroup,
    Button, List, ListItem, InputLeftElement, 
    Input, InputGroup, SimpleGrid, Card, CardBody, 
    Stack, StackDivider, Accordion, AccordionItem,
    AccordionButton, AccordionIcon, AccordionPanel,
    Avatar, Link } from '@chakra-ui/react'
import { SearchIcon, BellIcon } from '@chakra-ui/icons'
import { useEffect, useState, useContext } from 'react'
import axios from "axios";
import AuthenticationContext from '../context/AuthenticationContext'
import { useRouter } from 'next/router'
import { getUserInfo } from '../helpers/profile/api';

export default function Navbar() {
const [categories, setCategories] = useState([])
const [categoriesFilter, setCategoriesFilter] = useState(null)
const [filter, setFilter] = useState('')
const {logout} = useContext(AuthenticationContext);
const router = useRouter();
useEffect (() => {
    const fetchCategories = async () => {
        console.log(localStorage.getItem('accessToken'))
        if(filter === '') {
            const response = await axios.get(`http://localhost:8000/group/get_all_categories`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            setCategories(response.data.category_groups)
            setCategoriesFilter(response.data.category_groups)
        }
        else{
            const response = await axios.get(`http://localhost:8000/group/get_all_categories_contains/${filter}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            setCategories(response.data.category_groups)
            setCategoriesFilter(response.data.category_groups)
        }
        }
    fetchCategories()
}, [filter])

const handleSearch = (e) => {
    setFilter(e)
}

const handleLogout = () => {
    logout().then((success) => {
        /* istanbul ignore next */
        if(success){
            router.push('/login')
        }
    })
}

const [userName, setUserName] = useState("")
useEffect(() => {
  const getUser = async () => {
    const response = await getUserInfo(localStorage.getItem('accessToken'));
    setUserName(response.name)
  }
  getUser()
}, [])

return (
    <Box data-testid="navbar">
        <Grid templateRows='repeat(6, 1fr)' gap={0}>
        <GridItem rowSpan={2}>
        <Flex minWidth='max-content' alignItems='center' gap='2' pt='3'>
            <Box p='2' pl='5'>
                <Heading as='b' color= 'black' size='lg'>Cenmo</Heading>
            </Box>
            <Spacer />
            <ButtonGroup gap='2' p='2' pr='5' borderRadius='30'>
                <Button borderRadius='15' color='black' onClick={handleLogout}>Log Out</Button>
            </ButtonGroup>
        </Flex>

        <List spacing={3} pl='5' pt='3' pr='3'>
        <ListItem>
            <Button leftIcon={<BellIcon />} justifyContent='left' onClick={() => router.push("/")} cursor="pointer" width='100%' borderRadius='30' colorScheme='blue'>Home</Button>
        </ListItem>
        <ListItem>
            <Button leftIcon={<BellIcon />} justifyContent='left' width='100%' borderRadius='30' colorScheme='blue'>Chats</Button>
        </ListItem>
        <ListItem>
            <Button leftIcon={<BellIcon />} justifyContent='left' width='100%' borderRadius='30' colorScheme='blue'>Baskets</Button>
        </ListItem>
        <ListItem>
            <Button leftIcon={<BellIcon />} justifyContent='left' width='100%' borderRadius='30' colorScheme='blue'>Transaction</Button>
        </ListItem>
        <ListItem>
            <Button leftIcon={<BellIcon />} justifyContent='left' width='100%' borderRadius='30' colorScheme='blue'>Seller Portal</Button>
        </ListItem>
        </List>
        </GridItem>
        <GridItem rowSpan={3}>
        <Heading pl='5' pt='7' color= 'black' size='md'>Categories</Heading>

        <InputGroup pl='5' pr='5' pt='3'>
        <InputLeftElement
            pl='9' pt='6'
            pointerEvents='none'
            children={<SearchIcon color='gray.300' />}
            />
        <Input pl='10' type='tel' placeholder='Search' borderRadius='30' onChange={e => handleSearch(e.target.value)}/>
        </InputGroup>
        <Box maxH='370px' overflowY='auto'>
        <Card variant='unstyled' pl='5' pr='5' pt='3' pb='3'>
            <CardBody >
            <Accordion allowToggle>
                { Object.entries(categories).map(([key, value]) => (
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
                                <Link href={'/group/'+group.group_id} key={index} style={{ textDecoration: 'none' }}><Button justifyContent='left' colorScheme='blue' variant='ghost'>{group.group_name} </Button></Link>
                            </AccordionPanel>
                        ))}
                    </AccordionItem>
                ))}
                    </Accordion>
                    <Button justifyContent='left' colorScheme='blue' variant='ghost'>Request Category</Button>
                </CardBody>
            </Card>
            </Box>
            </GridItem>
            <GridItem rowSpan={1}>
                <Stack  onClick={() => router.push('/accounts/profile')} cursor="pointer" direction='row' pl='5' pt='5'>
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
