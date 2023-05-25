import {
    Grid, GridItem, Box, Heading, InputGroup,
    InputLeftElement, Input, Card, CardBody,
    Stack, Text, Icon, Button, Divider, Select,
    Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalCloseButton, ModalBody,
    ModalFooter, FormControl, FormLabel,
    NumberInput, NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
    Flex, Show, Center, useToast, Spacer, useCheckbox, Checkbox, Badge
} from "@chakra-ui/react"
import { SearchIcon, ChevronRightIcon } from '@chakra-ui/icons'
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
import MultiImage from "../components/multiImage";

export default function Seller() {
    const baseUrl = `${process.env.NEXT_PUBLIC_BE_URL}`
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const toast = useToast();
    const [inputVisible, setInputVisible] = useState(false);

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
            toast({
                title: 'Order Approved',
                description: "Successfully approved the order",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            router.reload()
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


    const handleCancelStatus = async () => {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
        console.log("ID KIRIM", chosenTrx)
        const body = chosenTrx
        try {
            //Async function to send data to backend
            const { data } = await axios.post(`${baseUrl}/transaction/cancel_transaction`, body, config)
            toast({
                title: 'Order Cancelled',
                description: "The order has been cancelled.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            router.reload()
        } catch (error) {
            console.log(error)
        }
    }

    // const handleCanceled= (transactionId, index) => {
    //     const rejectBuyerList = [...buyerList]
    //     rejectBuyerList[index].progress = "Cancelled"
    //     setBuyerList(rejectBuyerList)
    //     setChosenTrx(transactionId)
    // }

    const openResi = (transactionId) => {
        onAcceptOpen()
        setChosenTrx(transactionId)
    }
    const checkbox = useCheckbox();
    return (
        <div size={{ base: "100px", md: "200px", lg: "300px" }}>
            <title>Seller Portal</title>
            <Grid templateColumns='repeat(5, 1fr)' gap={0}>
                <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200' >
                    <Navbar />
                </GridItem>
                <GridItem colSpan={{ base: 2, md: 2, lg: 2 }} w={{ base: '100%', md: '100%', lg: '100%' }}>
                    <Stack direction='column' spacing={1} ml='5' mr='5'>
                        <Heading pt='7' color='black' size='md'>Seller Portal</Heading>
                        <InputGroup pr={{ base: '3', md: '5' }} pt={{ base: '3', md: '5' }}>
                            <InputLeftElement
                                pl={{ base: '2', md: '2' }}
                                pt={{ base: '3', md: '10' }}
                                pointerEvents='none'
                                children={<SearchIcon color='gray.300' />}
                            />
                            <Input pl={{ base: '10', md: '10' }} type='tel' placeholder='Search your products' borderRadius='30' onKeyDown={handleSearchListing} backgroundColor='white' />
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
                                                    Rp {list.goods_price.toLocaleString('id-ID')}
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




                </GridItem>

                {itemId !== '' && (
                    <GridItem colSpan={2} borderLeft='1px' borderColor='gray.200'>
                        <Box pl='5' pr='10'>
                            <Heading pt='7' pb='5' color='black' size='md'>Detail Product</Heading>
                            <Stack direction='row' pb='7'>
                                <MultiImage size='200px' mar='0' image_url={itemImage} />
                                <Stack direction='column' pl='5'>
                                    <Text fontSize="xl">{itemName}</Text>
                                    <Text fontSize="xl" as='b'>Rp {itemPrice.toLocaleString('id-ID')}</Text>
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
                                                    <ListImage boxsize={{ base: '90px', md: '90px' }} url={itemImage} />
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
                                    <Button mt='3' backgroundColor='blue.100' onClick={() => setIsExpanded(false)}>Close</Button>
                                ) : (
                                    <Button mt='3' backgroundColor='blue.100' onClick={() => setIsExpanded(true)}>More</Button>
                                )}
                            </Box>

                            <Divider pt='5' mb='3' />
                            <Stack direction='row' justifyContent='space-between'>
                                <Text fontSize="lg" as='b'>Your Buyer</Text>
                                <Select variant="filled" width="fit-content" backgroundColor='blue.100' onChange={handleFilterChange}>
                                    <option value='All'>All</option>
                                    <option value='Pending'>Pending</option>
                                    <option value='Verifying'>Verifying</option>
                                    <option value='Processing'>Processing</option>
                                    <option value='Completed'>Completed</option>
                                    <option value='Cancelled'>Cancelled</option>
                                </Select>
                            </Stack>


                            <Stack direction='column' spacing={8}>
                                {/* Ini looping buyer yang di ID tersebut */}
                                {buyerListByGoodsId.map((buyer, index) => (
                                    <Card mt='3'>
                                        <CardBody>
                                            <Stack direction='row' justifyContent="space-between">
                                                <Stack direction='row' >
                                                    <Text>Transaction ID : </Text>
                                                    <Text >{buyer.transactionId}</Text>
                                                </Stack>
                                                <Stack direction='row' justifyContent="space-between" >
                                                    <Text >{buyer.date.substring(0, 10)}</Text>
                                                </Stack>
                                            </Stack>
                                            <Stack direction='row' >
                                                <Text>Buyer Name : </Text>
                                                <Text >{buyer.buyer_name}</Text>
                                            </Stack>
                                            <Divider my="3" />
                                            <Stack direction='row' justifyContent='space-between'>
                                                <Stack direction='column'>
                                                    <Text>Transaction Status</Text>
                                                    {selectedFilter === 'All' || buyer.progress === selectedFilter} {
                                                        <Flex alignItems='center'>
                                                            <Badge variant='solid' colorScheme={buyer.progress === 'Pending' ? 'orange' : buyer.progress === 'Completed' ? 'green' : buyer.progress === 'Cancelled' ? 'red' : 'gray'} fontSize='0.8em'>
                                                                {buyer.progress}
                                                            </Badge>
                                                        </Flex>

                                                    }
                                                </Stack>
                                                <Stack>
                                                    {buyer.progress === "Verifying" && (
                                                        <div>
                                                            <Button mt='3' onClick={() => openResi(buyer.transactionId)} color='blue.500' border='1px' colorScheme="white">
                                                                Process
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Stack>

                                            </Stack>


                                            <Divider my="3" />
                                            <Stack direction='row' justifyContent="space-between">
                                                <Stack direction='column'>
                                                    <Stack direction='row'>
                                                        <Text >Quantity : </Text>
                                                        <Text >{buyer.quantity}</Text>
                                                    </Stack>
                                                    <Stack direction='row'>
                                                        <Text >Total Price : </Text>
                                                        <Text >Rp {buyer.totalPrice.toLocaleString('id-ID')}</Text>
                                                    </Stack>
                                                </Stack>
                                                {/* <Stack>
                                                    <Button colorScheme='blue' mt='3'>Chat</Button>
                                                </Stack> */}

                                            </Stack>
                                            <Modal isCentered isOpen={isAcceptOpen} onClose={onCloseAccept} size="xl">

                                                <ModalContent height='400px' borderRadius='20px'>
                                                    <ModalHeader></ModalHeader>
                                                    <ModalCloseButton />
                                                    <ModalBody alignContent='center' mt='10'>
                                                        <Text textAlign={'center'} fontSize={'5xl'} fontWeight={'bold'} mb="7">Approve order?</Text>
                                                        <Stack direction='row'>
                                                            <FormControl pl='5'>
                                                                <Flex alignItems='center'>
                                                                    <Checkbox
                                                                        mb="5"
                                                                        borderColor='black'
                                                                        {...checkbox.getCheckboxProps({ value: '1' })}
                                                                        onChange={(e) => setInputVisible(e.target.checked)}
                                                                    >
                                                                        Add receipt number
                                                                    </Checkbox>
                                                                </Flex>
                                                                {inputVisible && (
                                                                    <Input
                                                                        type='resi'
                                                                        placeholder="Add receipt number"
                                                                        borderColor='blackAlpha.400'
                                                                        onChange={handleResi}
                                                                    />
                                                                )}
                                                            </FormControl>
                                                        </Stack>
                                                        <Stack direction='row' alignItems='center' justifyContent='center' mt='7'>
                                                            <Button colorScheme='blue' mr={3} onClick={() => {
                                                                handleSubmitStatus();
                                                            }}>
                                                                Approve
                                                            </Button>
                                                            <Button color='blue.500' border='1px' colorScheme="white" onClick={() => {
                                                                handleCancelStatus();
                                                                onClose();
                                                            }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </Stack>

                                                    </ModalBody>
                                                    <ModalFooter>

                                                    </ModalFooter>
                                                </ModalContent>
                                            </Modal>
                                        </CardBody>
                                    </Card>
                                ))}
                            </Stack>


                        </Box>
                    </GridItem>

                )}



            </Grid>
        </div>
    )
}