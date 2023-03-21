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


export default function Navbar() {
const [categories, setCategories] = useState([])
const [categoriesFilter, setCategoriesFilter] = useState(null)
const [filter, setFilter] = useState('')

useEffect (() => {
    const fetchCategories = async () => {
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
return (
    <Box>
        <Grid templateRows='repeat(6, 1fr)' gap={0}>
        <GridItem rowSpan={2}>
        <Flex minWidth='max-content' alignItems='center' gap='2' pt='3'>
            <Box p='2' pl='5'>
                <Heading as='b' color= 'black' size='lg'>Cenmo</Heading>
            </Box>
            <Spacer />
            <ButtonGroup gap='2' p='2' pr='5' borderRadius='30'>
                <Button borderRadius='15' color='black'>Log Out</Button>
            </ButtonGroup>
        </Flex>

        <List spacing={3} pl='5' pt='3' pr='3'>
        <ListItem>
            <Button leftIcon={<BellIcon />} justifyContent='left' width='100%' borderRadius='30' colorScheme='blue'>Home</Button>
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
                    <AccordionItem>
                        <h2>
                        <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                            {key}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        </h2>
                        {value.map((group, index) => (
                            <AccordionPanel pb={4}>
                                <Link href={'/group/'+group.group_id} style={{ textDecoration: 'none' }}><Button justifyContent='left' colorScheme='blue' variant='ghost'>{group.group_name} </Button></Link>
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
            <Stack direction='row' pl='5' pt='5'>
            <Avatar size='md' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
            <Stack direction='column' color='black' m='10' pl='3'>
                <p>Zeta Prawira Syah</p>
                <Link color='teal.500' href='#'>
                    Settings
                </Link>
            </Stack>
        </Stack>
        </Grid>
    </Box>
    )
}
