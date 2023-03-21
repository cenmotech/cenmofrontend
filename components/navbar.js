//use Chakra UI components
import { Grid, GridItem, Flex, Spacer, Box, Heading, ButtonGroup,
    Button, List, ListItem, InputLeftElement, 
    Input, InputGroup, SimpleGrid, Card, CardBody, 
    Stack, StackDivider, Accordion, AccordionItem,
    AccordionButton, AccordionIcon, AccordionPanel,
    Avatar, Link } from '@chakra-ui/react'
import { SearchIcon, BellIcon } from '@chakra-ui/icons'

export default function Navbar() {
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
        <Input pl='10' type='tel' placeholder='Search' borderRadius='30' />
        </InputGroup>
        <Box maxH='370px' overflowY='auto'>
        <Card variant='unstyled' pl='5' pr='5' pt='3' pb='3'>
            <CardBody >
            <Accordion allowToggle>
                <AccordionItem>
                    <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        Electronics
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                    <Button justifyContent='left' colorScheme='blue' variant='ghost'>Keyboard</Button>
                    </AccordionPanel>
                    <AccordionPanel pb={4}>
                    <Button justifyContent='left' colorScheme='blue' variant='ghost'>PC</Button>
                    </AccordionPanel>
                    <AccordionPanel pb={4}>
                    <Button justifyContent='left' colorScheme='blue' variant='ghost'>PC</Button>
                    </AccordionPanel>
                    <AccordionPanel pb={4}>
                    <Button justifyContent='left' colorScheme='blue' variant='ghost'>PC</Button>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        Part Vehicle
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                    <Button justifyContent='left' colorScheme='blue' variant='ghost'>Wheel</Button>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        Clothes
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                    <Button justifyContent='left' colorScheme='blue' variant='ghost'>Pants</Button>
                    </AccordionPanel>
                    <AccordionPanel pb={4}>
                    <Button justifyContent='left' colorScheme='blue' variant='ghost'>Shirt</Button>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        Sports Equipment
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                    <Button justifyContent='left' colorScheme='blue' variant='ghost'>Baseball</Button>
                    </AccordionPanel>
                    <AccordionPanel pb={4}>
                    <Button justifyContent='left' colorScheme='blue' variant='ghost'>Racket</Button>
                    </AccordionPanel>
                </AccordionItem>
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