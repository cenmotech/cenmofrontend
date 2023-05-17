import {
    Grid, GridItem, Box, Heading, InputGroup,
    InputLeftElement, Input, Card, CardBody,
    Stack, Text, Icon, Button, Divider, Select, ButtonGroup,
    Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalCloseButton, ModalBody, Lorem,
    ModalFooter, FormControl, FormLabel, Link,
    NumberInput, NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper, Editable,
    EditablePreview, EditableTextarea, Flex, Show, Center, useToast, Spacer, Drawer, DrawerContent, DrawerHeader, DrawerCloseButton
} from "@chakra-ui/react"
import { SearchIcon, DeleteIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { HiViewList } from 'react-icons/hi'
import { BiStore } from 'react-icons/bi'
import { Image, useDisclosure } from '@chakra-ui/react'
import { useEffect } from 'react';
import React, { useState } from 'react';
import Navbar from '../components/navbar'
import { searchListingByNameAndSeller, getListingBySeller, getFeeds, getStore, searchListingByName, getListingOnGroup } from '../helpers/group/api';
import { getSellerTransaction, getBuyerByGoodsId } from '../helpers/transaction/api';
import ListImage from '../components/listImage'
import { useRouter } from 'next/router'
import axios from "axios";

export default function Seller() {
    const baseUrl = `${process.env.NEXT_PUBLIC_BE_URL}`
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const toast = useToast();
    function handleTextChange(event) {
        setText(event.target.value);
    }

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

    const OverlayTwo = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()
    const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure()
    const { isOpen: isAcceptOpen, onOpen: onAcceptOpen, onClose: onCloseAccept } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayOne />)
    const [buyerList, setBuyerList] = useState([]);
    const [buyerListByGoodsId, setBuyerListByGoodsId] = useState([]);
    const [storeList, setStoreList] = useState([]);
    const [itemId, setItemId] = useState("")
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [sellerName, setSellerName] = useState("");
    const [itemDesc, setItemDesc] = useState("");
    const [itemImage, setItemImage] = useState("")
    const [filterList, setFilterList] = useState("")
    const [resi, setResi] = useState("");
    const [chosenTrx, setChosenTrx] = useState("")

    const descChange = (list) => {
        setItemId(list.goods_id)
        setItemName(list.goods_name)
        setItemPrice(list.goods_price)
        setSellerName(list.seller_name)
        setItemDesc(list.goods_description)
        setItemImage(list.goods_image_link)
    }

    async function getPhotoOnListing(url) {
        if (url != "") {
            const imageRef = ref(storage, url);
            const imageList = []
            const response = await listAll(imageRef)
            response.items.forEach((item) => {
                imageList.push(getDownloadURL(item))
            });
            return Promise.all(imageList)
        }
        else {
            return []
        }
    }

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const response = await getListingBySeller(localStorage.getItem("accessToken"));
                setStoreList(response.response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStore();
    }, []);

    useEffect(() => {
        const fetchBuyer = async () => {
            try {
                const response = await getSellerTransaction(localStorage.getItem("accessToken"));
                setBuyerList(response.transactions);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBuyer();
    }, []);
    useEffect(() => {
        const fetchBuyerByGoodsId = async () => {
            try {
                const response = await getBuyerByGoodsId(localStorage.getItem("accessToken"), itemId);
                setBuyerListByGoodsId(response.transactions);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBuyerByGoodsId();
    }, [itemId]);

    const handleListNameChange = (e) => {
        setItemName(e.target.value);

    };

    const handlePriceChange = (e) => {
        setItemPrice(e.target.value);
    };

    const handleDescChange = (e) => {
        setItemDesc(e.target.value);
    };

    const handleResi = (e) => {
        setResi(e.target.value);
    };
    const handleSubmitStatus = async () => {
        console.log("ID", chosenTrx)
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }

        const body = {
            "transactionId": chosenTrx,
            "resi": resi
        }
        try {
            //Async function to send data to backend
            const { data } = await axios.post(`${baseUrl}/transaction/update-transaction`, body, config)
            await router.reload()
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }

        const body = {
            "id": itemId,
            "name": itemName,
            "price": itemPrice,
            "desc": itemDesc
        }
        try {
            //Async function to send data to backend
            const { data } = await axios.post(`${baseUrl}/group/edit_listing`, body, config)
            await router.reload()
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (!router.isReady) return;
        const searchList = async () => {
            if (filterList === "") {
                const response = await getListingBySeller(localStorage.getItem("accessToken"));
                setStoreList(response.response)
            }
            else {
                const response = await searchListingByNameAndSeller(localStorage.getItem('accessToken'), filterList);
                setStoreList(response.response)
            }
        }
        searchList()
    }, [filterList])

    const handleSearchListing = (e) => {
        if (e.key === 'Enter') {
            setFilterList(e.target.value)
        }
    }

    const [selectedFilter, setSelectedFilter] = useState('All');
    useEffect(() => {
        if (!itemId) {

        }
        else {
        if (selectedFilter === "All") {
            getBuyerByGoodsId(localStorage.getItem("accessToken"), itemId).then((data) => {
                setBuyerListByGoodsId(data.transactions);

                
            });

        }
        else {
            getBuyerByGoodsId(localStorage.getItem("accessToken"), itemId).then((data) => {
                let newVar = data.transactions
                let filter = newVar.filter(item => item.progress === selectedFilter)
                setBuyerListByGoodsId(filter);
            })

        }
    }
    }, [selectedFilter, itemId])


    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
    };



    const handleRejected = (buyer, index) => {
        const rejectBuyerList = [...buyerList]
        rejectBuyerList[index].progress = "Rejected"
        setBuyerList(rejectBuyerList)
    }

    const openResi = (transactionId) => {
        onAcceptOpen()
        setChosenTrx(transactionId)
    }

    return (
        <div size={{ base: "100px", md: "200px", lg: "300px" }}>
            <title>Seller Portal</title>
            <Flex p="3" borderBottom='1px' borderColor='gray.200' height="100" display={{ base: "block", xl: "none" }} >
                <Stack direction="row">
                    <Button variant='ghost' onClick={onNavOpen}>
                        <HiViewList />
                    </Button>
                    <Spacer />
                    <Button variant='ghost' onClick={onDetailOpen} >
                        <BiStore />
                    </Button>
                </Stack>
            </Flex>
            <Drawer isOpen={isNavOpen} placement="left" onClose={onNavClose} >
                <DrawerContent>
                    <Navbar />
                </DrawerContent>
            </Drawer>
            {/* <Drawer isOpen={isDetailOpen} placement="right" size="sm" onClose={onDetailClose}>
                <DrawerContent overflow='scroll'>
                    <DrawerHeader>
                        <GridItem colSpan={2} borderLeft='1px' borderColor='gray.200'>
                            <Box pl='5' pr='10'>
                                <Heading pt='7' pb='5' color='black' size='md'>Detail Product</Heading>
                                <Stack direction='row' pb='7'>
                                    <Image boxSize='150px' src='https://bit.ly/dan-abramov' alt='Dan Abramov' borderRadius='10' />
                                    <Stack direction='column' pl='5'>
                                        <Text fontSize="xl">{itemName}</Text>
                                        <Text fontSize="xl" as='b'>Rp {itemPrice}</Text>
                                        <Stack direction='row'>
                                            <Text fontSize="md" as='b'>Seller |</Text>
                                            <Text fontSize="md">{sellerName}</Text>
                                        </Stack>
                                        <Button onClick={() => {
                                            onOpen()
                                        }} colorScheme='blue'
                                        > Edit
                                        </Button>
                                        <Modal isCentered isOpen={isOpen} onClose={onClose}>
                                            <ModalOverlay />
                                            <ModalContent>
                                                <ModalHeader>Edit Product</ModalHeader>
                                                <ModalCloseButton />
                                                <ModalBody>
                                                    <Stack direction='row'>
                                                        
                                                        <FormControl pl='5'>
                                                            <FormLabel>Name Product</FormLabel>
                                                            <Input type='name_product' onChange={handleListNameChange} />
                                                        </FormControl>
                                                    </Stack>
                                                    <FormControl mt='3'>
                                                        <FormLabel>Price</FormLabel>
                                                        <NumberInput >
                                                            <NumberInputField onChange={handlePriceChange} placeholder={itemPrice} />
                                                            <NumberInputStepper>
                                                                <NumberIncrementStepper />
                                                                <NumberDecrementStepper />
                                                            </NumberInputStepper>
                                                        </NumberInput>
                                                    </FormControl>
                                                    <FormControl mt='3'>
                                                        <FormLabel>Description</FormLabel>
                                                        <Input type='name_product' onChange={handleDescChange} placeholder={itemDesc} />
                                                    </FormControl>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button colorScheme='blue' mr={3} onClick={e => {
                                                        toast({
                                                            title: 'Listing Updated',
                                                            description: "Make sure you fill the right data",
                                                            status: 'success',
                                                            duration: 9000,
                                                            isClosable: true,
                                                        });
                                                        handleSubmit(e);
                                                    }}>
                                                        Save
                                                    </Button>
                                                    <Button variant='ghost' onClick={onClose}>Cancel</Button>
                                                </ModalFooter>
                                            </ModalContent>
                                        </Modal>
                                    </Stack>
                                </Stack>
                                <Text fontSize="lg" as='b' mt='10'>Product Description</Text>
                                <Box maxW="100%">
                                    <Text pb='0' fontSize='md' textAlign="justify" noOfLines={isExpanded ? 0 : 4}>
                                        {itemDesc}
                                    </Text>
                                    {isExpanded ? (
                                        <Button mt='3' onClick={() => setIsExpanded(false)}>Close</Button>
                                    ) : (
                                        <Button mt='3' onClick={() => setIsExpanded(true)}>More</Button>
                                    )}
                                </Box>
                                <Divider pt='5' mb='3' />
                                <Stack direction='row' justifyContent='space-between'>
                                    <Text fontSize="lg" as='b'>Your Buyer</Text>
                                    <Select variant='filled' width='fit-content'>
                                        <option value='All'>All</option>
                                        <option value='Pending'>Pending</option>
                                        <option value='Verifying'>Verifying</option>
                                        <option value='Processing'>Processing</option>
                                        <option value='Completed'>Completed</option>
                                        <option value='Rejected'>Rejected</option>
                                    </Select>
                                </Stack> */}
                                {/* <Card w={{ base: "400px", md: "550px", lg: "700px" }} h={"100%"} mt="5" borderRadius='15' >
                                    <Stack direction='column' spacing={8}>
                                        {buyerListByGoodsId.map((buyer, index) => (
                                            <Card w={{ base: "100%", md: "550px", lg: "100%", mx: "10px" }} borderRadius='15' mt='5' buyer={buyer} key={index} cursor="pointer" onClick={() => descChange(buyer)} >
                                                <CardBody >
                                                    <Stack direction={{ base: 'column', md: 'row' }} alignItems={{ base: 'flex-start', md: 'start' }} >
                                                        <Image boxSize={{ base: '50px', md: '50px' }} src='https://bit.ly/dan-abramov' alt='Dan Abramov' borderRadius='10' />
                                                        <Stack direction='row'>
                                                            <Stack spacing={0} direction='column' pl={{ base: '0', md: '3' }} pr={{ base: '0', md: '5' }}>
                                                                <Stack direction='row' pb={{ base: '0', md: '9' }}>
                                                                    <Text fontSize="md" as='b'>{buyer.buyer_name}</Text>
                                                                </Stack>
                                                                <Text fontSize="md" pb={{ base: '0', md: '1' }}>Status</Text >
                                                                {selectedFilter === 'All' || buyer.progress === selectedFilter} {
                                                                    <Text key={buyer.progress}>{buyer.progress}</Text>
                                                                }
                                                            </Stack>
                                                            <Center>
                                                                <Stack direction='column' pr={{ base: '0', md: '10' }} align="center" justify="center" >
                                                                    {buyer.progress === "Verifying" && (
                                                                        <div>
                                                                            <Button onClick={(buyer, index) => {
                                                                                onAcceptOpen()
                                                                            }} colorScheme='green'>Accept</Button>
                                                                            <Button colorScheme='red' >Reject</Button>
                                                                        </div>
                                                                    )}
                                                                    <Modal isCentered isOpen={isAcceptOpen} onClose={onCloseAccept}>

                                                                        <ModalContent>
                                                                            <ModalHeader>Pengisian Resi</ModalHeader>
                                                                            <ModalCloseButton />
                                                                            <ModalBody>
                                                                                <Stack direction='row'>
                                                                                    <FormControl pl='5'>
                                                                                        <FormLabel>Nomor Resi</FormLabel>
                                                                                        <Input type='resi' onChange={handleResi} />
                                                                                    </FormControl>
                                                                                </Stack>
                                                                            </ModalBody>
                                                                            <ModalFooter>
                                                                                <Button colorScheme='blue' mr={3} onClick={e => {
                                                                                    toast({
                                                                                        title: 'Listing Updated',
                                                                                        description: "Make sure you fill the right data",
                                                                                        status: 'success',
                                                                                        duration: 9000,
                                                                                        isClosable: true,
                                                                                    });
                                                                                    handleSubmitStatus(e, buyer.transactionId);
                                                                                }}>
                                                                                    Save
                                                                                </Button>
                                                                                <Button variant='ghost' onClick={onClose}>Cancel</Button>
                                                                            </ModalFooter>
                                                                        </ModalContent>
                                                                    </Modal>

                                                                </Stack>
                                                            </Center>

                                                            <Stack direction='column' pr={{ base: '0', md: '10' }} alignItems={"center"}>
                                                                <Stack>
                                                                    <Text fontSize="md" as='b'>{buyer.goodsName}</Text>
                                                                </Stack>
                                                                <Stack>
                                                                    <Text fontSize="md" as='b'>Rp {buyer.totalPrice}</Text>
                                                                </Stack>
                                                                <Stack>
                                                                    <Text fontSize="small" as='b'>{buyer.transactionId}</Text>
                                                                </Stack>
                                                                <Button colorScheme='orange'>Chat</Button>
                                                            </Stack>
                                                        </Stack>

                                                    </Stack>

                                                </CardBody>
                                            </Card>
                                        ))}
                                    </Stack>
                                </Card> */}
                            {/* </Box>
                        </GridItem>
                        <DrawerCloseButton />
                    </DrawerHeader>
                </DrawerContent>
            </Drawer> */}
            <Grid templateColumns={{ base: 'repeat(3, 1fr)', xl: 'repeat(5, 1fr)' }} gap={0} >
                <Show above='xl' >
                    <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200' >
                        <Navbar data-testid="navbar" />
                    </GridItem>
                </Show>
                <GridItem colSpan={2}>
                    <Center >
                        <Stack direction='column' spacing={4}>
                            <Heading pl={{ base: '3', md: '5' }} pt={{ base: '5', md: '7' }} color='black' size='md'>Seller Portal</Heading>
                            <InputGroup pr={{ base: '3', md: '5' }} pt={{ base: '3', md: '5' }} >
                                <InputLeftElement
                                    pl={{ base: '2', md: '2' }}
                                    pt={{ base: '3', md: '10' }}
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.300' />}
                                />
                                <Input pl={{ base: '10', md: '10' }} type='tel' placeholder='Search your products' borderRadius='30' onKeyDown={handleSearchListing} />
                            </InputGroup>
                            <Stack direction='column' spacing={8}>
                                {storeList.map((list, index) => (
                                    <Card w={{ base: "100%", md: "550px", lg: "100%", mx: "10px" }} borderRadius='15' mt='5' list={list} key={index} cursor="pointer" onClick={() => descChange(list)}>
                                        <CardBody >
                                            <Stack direction={{ base: 'column', md: 'row' }} alignItems={{ base: 'flex-start', md: 'center' }} justifyContent="space-between" >

                                                <ListImage boxsize={"70"} url={list.goods_image_link} />
                                                <Box flex="1">
                                                    <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' noOfLines={3} minHeight='2em'
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        {list.goods_name}
                                                    </Box>
                                                    <Box fontSize="sm" display="block" marginTop="auto" md='5px' >
                                                        Rp{list.goods_price}
                                                    </Box>
                                                </Box>
                                                <Box fontSize="sm" display="block" marginTop="auto" md='5px' >
                                                    <Icon as={ChevronRightIcon} boxSize={6} color='blue.500' />
                                                </Box>
                                            </Stack>
                                        </CardBody>
                                    </Card>
                                ))}
                            </Stack>
                        </Stack>
                    </Center>



                </GridItem>
                <Show above='xl'>
                    <GridItem colSpan={2} borderLeft='1px' borderColor='gray.200'>
                        <Box pl='5' pr='10'>
                            <Heading pt='7' pb='5' color='black' size='md'>Detail Product</Heading>
                            <Stack direction='row' pb='7'>
                                <ListImage boxsize={"150"} url={itemImage} />
                                <Stack direction='column' pl='5'>
                                    <Text fontSize="xl">{itemName}</Text>
                                    <Text fontSize="xl" as='b'>Rp {itemPrice}</Text>
                                    <Spacer />
                                    <Button w="100px" onClick={() => {
                                        setOverlay(<OverlayOne />)
                                        onOpen()
                                    }} colorScheme='blue'
                                    > Edit
                                    </Button>
                                    <Modal isCentered isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Edit Product</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <Stack direction='row'>
                                                    {/* <Image mb='1' boxSize={{ base: '90px', md: '90px' }} src='https://bit.ly/dan-abramov' alt='Dan Abramov' borderRadius='10' /> */}
                                                    <FormControl pl='5'>
                                                        <FormLabel>Name Product</FormLabel>
                                                        <Input type='name_product' onChange={handleListNameChange} />
                                                    </FormControl>
                                                </Stack>
                                                {/* <Link color='blue.500' href='#' fontSize='sm' as='b'>
                                                    Edit Picture
                                                </Link> */}
                                                <FormControl mt='3'>
                                                    <FormLabel>Price</FormLabel>
                                                    <NumberInput >
                                                        <NumberInputField onChange={handlePriceChange} placeholder={itemPrice} />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </FormControl>
                                                <FormControl mt='3'>
                                                    <FormLabel>Description</FormLabel>
                                                    <Input type='name_product' onChange={handleDescChange} placeholder={itemDesc} />
                                                </FormControl>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button colorScheme='blue' mr={3} onClick={e => {
                                                    toast({
                                                        title: 'Listing Updated',
                                                        description: "Make sure you fill the right data",
                                                        status: 'success',
                                                        duration: 9000,
                                                        isClosable: true,
                                                    });
                                                    handleSubmit(e);
                                                }}>
                                                    Save
                                                </Button>
                                                <Button variant='ghost' onClick={onClose}>Cancel</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </Stack>
                            </Stack>
                            <Text fontSize="lg" as='b' mt='10'>Product Description</Text>
                            <Box maxW="100%">
                                <Text pb='0' fontSize='md' textAlign="justify" noOfLines={isExpanded ? 0 : 4}>
                                    {itemDesc}
                                </Text>
                                {isExpanded ? (
                                    <Button mt='3' onClick={() => setIsExpanded(false)}>Close</Button>
                                ) : (
                                    <Button mt='3' onClick={() => setIsExpanded(true)}>More</Button>
                                )}
                            </Box>
                            <Divider pt='5' mb='3' />
                            <Stack direction='row' justifyContent='space-between'>
                                <Text fontSize="lg" as='b'>Your Buyer</Text>
                                <Select variant="filled" width="fit-content" onChange={handleFilterChange}>
                                    <option value='All'>All</option>
                                    <option value='Pending'>Pending</option>
                                    <option value='Verifying'>Verifying</option>
                                    <option value='Processing'>Processing</option>
                                    <option value='Completed'>Completed</option>
                                    <option value='Rejected'>Rejected</option>
                                </Select>
                            </Stack>
                            <Card w={{ base: "400px", md: "550px", lg: "700px" }} h={"100%"} mt="5" borderRadius='15' >
                                    <Stack direction='column' spacing={8}>
                                        {buyerListByGoodsId.map((buyer, index) => (
                                            <Card w={{ base: "100%", md: "550px", lg: "100%", mx: "10px" }} borderRadius='15' mt='5' buyer={buyer} key={index} cursor="pointer" onClick={() => descChange(buyer)} >
                                                <CardBody >
                                                    <Stack direction={{ base: 'column', md: 'row' }} alignItems={{ base: 'flex-start', md: 'start' }} >
                                                        <Stack direction='row'>
                                                            <Stack spacing={0} direction='column' pl={{ base: '0', md: '3' }} pr={{ base: '0', md: '5' }}>
                                                                <Stack direction='row' pb={{ base: '0', md: '9' }}>
                                                                    <Text fontSize="md" as='b'>{buyer.buyer_name}</Text>
                                                                </Stack>
                                                                <Text fontSize="md" pb={{ base: '0', md: '1' }}>Status</Text >
                                                                {selectedFilter === 'All' || buyer.progress === selectedFilter} {
                                                                    <Text key={buyer.progress}>{buyer.progress}</Text>
                                                                }
                                                            </Stack>
                                                            <Center>
                                                                <Stack direction='column' pr={{ base: '0', md: '10' }} align="center" justify="center" >
                                                                    {buyer.progress === "Verifying" && (
                                                                        <div>
                                                                            <Button onClick={() => {
                                                                                openResi(buyer.transactionId)
                                                                            }} colorScheme='green'>Accept</Button>
                                                                            <Button colorScheme='red' >Reject</Button>
                                                                        </div>
                                                                    )}
                                                                    <Modal isCentered isOpen={isAcceptOpen} onClose={onCloseAccept}>

                                                                        <ModalContent>
                                                                            <ModalHeader>Pengisian Resi</ModalHeader>
                                                                            <ModalCloseButton />
                                                                            <ModalBody>
                                                                                <Stack direction='row'>
                                                                                    <FormControl pl='5'>
                                                                                        <FormLabel>Nomor Resi</FormLabel>
                                                                                        <Input type='resi' onChange={handleResi} />
                                                                                    </FormControl>
                                                                                </Stack>
                                                                            </ModalBody>
                                                                            <ModalFooter>
                                                                                <Button colorScheme='blue' mr={3} onClick={(buyer) => {
                                                                                    toast({
                                                                                        title: 'Listing Updated',
                                                                                        description: "Make sure you fill the right data",
                                                                                        status: 'success',
                                                                                        duration: 9000,
                                                                                        isClosable: true,
                                                                                    });
                                                                                
                                                                                    handleSubmitStatus();
                                                                                }}>
                                                                                    Save
                                                                                </Button>
                                                                                <Button variant='ghost' onClick={onClose}>Cancel</Button>
                                                                            </ModalFooter>
                                                                        </ModalContent>
                                                                    </Modal>

                                                                </Stack>
                                                            </Center>

                                                            <Stack direction='column' pr={{ base: '0', md: '10' }} alignItems={"center"}>
                                                                <Stack>
                                                                    <Text fontSize="md" as='b'>{buyer.goodsName}</Text>
                                                                </Stack>
                                                                <Stack>
                                                                    <Text fontSize="md" as='b'>Rp {buyer.totalPrice}</Text>
                                                                </Stack>
                                                                <Stack>
                                                                    <Text fontSize="small" as='b'>{buyer.transactionId}</Text>
                                                                </Stack>
                                                                <Button colorScheme='orange'>Chat</Button>
                                                            </Stack>
                                                        </Stack>

                                                    </Stack>

                                                </CardBody>
                                            </Card>
                                        ))}
                                    </Stack>
                                </Card>
                        </Box>
                    </GridItem>
                </Show>
            </Grid>
        </div>
    )
}