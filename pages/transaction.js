import { Grid, GridItem, Box, Heading, InputGroup,
    InputLeftElement, Input, Card, CardBody,
    Stack, Badge,Text,Slider,SliderTrack,SliderFilledTrack,SliderThumb, SliderMark,NumberInput, NumberInputField,
    NumberInputStepper, NumberIncrementStepper,
    NumberDecrementStepper, IconButton, Button, Spacer, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, 
    useDisclosure,
    Textarea} from '@chakra-ui/react'
import { SearchIcon, DeleteIcon } from '@chakra-ui/icons'
import Navbar from '../components/navbar'
import ListImage from '../components/listImage';
import { Image,Divider } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import React from 'react';
import { SlBasket } from 'react-icons/sl';
import {AiOutlineClose} from 'react-icons/ai';
import { getUserTransaction,getUserPendingTransaction,getUserVerifyingTransaction,getUserProcessingTransaction,getUserCompletedTransaction,getUserCancelledTransaction, cancelTransaction, updateTransaction, createComplain } from '../helpers/transaction/api';


export default function Transaction() {
    const [transaction, setTransaction] = useState([]);

    const [itemId, setItemId] = useState("")
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [sellerName, setSellerName] = useState("");
    const [itemDesc, setItemDesc] = useState("");
    const [itemQuant, setItemQuant] = useState("");
    const [itemProgress, setItemProgress] = useState("");
    const [itemTotalPrice, setItemTotalPrice] = useState("");
    const [itemDate, setItemDate] = useState("");
    const [itemImage, setItemImage] = useState("");
    const [sliderValue, setSliderValue] = useState(0);
    const [snapToken , setSnapToken] = useState("");

    const descChange = (item) => {
        setItemId(item.transaction_id)
        setItemName(item.goods__goods_name)
        setItemPrice(item.price)
        setSellerName(item.goods__seller_name)
        setItemDesc(item.goods__goods_description)
        setItemQuant(item.quantity)
        setItemProgress(item.progress)
        setItemTotalPrice(item.total_price)
        setItemDate(item.date)
        setItemImage(item.goods__goods_image_link)
        setSnapToken(item.snap_token)
    }

    useEffect(() => {
        if (itemProgress === "Verifying") {
          setSliderValue(33);
        } else if (itemProgress === "Processing") {
            setSliderValue(66);
        } else if (itemProgress === "Pending") {
          setSliderValue(0);
        } else {
          setSliderValue(99);
        }
    }, [itemProgress]);

    useEffect(() => {
        getUserTransaction().then((data) => {
          setTransaction(data.response);
        });
    }, []);

    const listAll = () =>{
        getUserTransaction().then((data) => {
            setTransaction(data.response);
        });
    }

    const listPending = () =>{
        getUserPendingTransaction().then((data) => {
            setTransaction(data.response);
        });
    }

    const listVerifying = () =>{
        getUserVerifyingTransaction().then((data) => {
            setTransaction(data.response);
        });
    }

    const listProcessing = () =>{
        getUserProcessingTransaction().then((data) => {
            setTransaction(data.response);
        });
    }

    const listCompleted = () =>{
        getUserCompletedTransaction().then((data) => {
            setTransaction(data.response);
        });
    }

    const listCancelled = () =>{
        getUserCancelledTransaction().then((data) => {
            setTransaction(data.response);
        });
    }

    const cancelOrder = async () => {
        cancelTransaction(itemId);
        window.location.reload();
    };

    const finishTransaction = async () => {
        updateTransaction(itemId);
        window.location.reload();
    };


    useEffect(() => {
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    
        let scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;
    
        const myMidtransClientKey = "Mid-client-giT1yaCWRdXGL4_h";
        scriptTag.setAttribute('data-client-key', myMidtransClientKey);
    
        document.body.appendChild(scriptTag);
    
        return () => {
          document.body.removeChild(scriptTag);
        }
      }, []);
    
    const showPayment = () => {
        window.snap.pay(snapToken, {
        onSuccess: function (result) {
            console.log(result);
        },
        onPending: function (result) {
            console.log(result);
        },
        onError: function (result) {
            console.log(result);
        }
        }); 
    }
    //COMPLAIN MODAL LOGIC
    const { isOpen, onOpen, onClose } = useDisclosure()
    const complainOrder = async () => {
        if(complainText === ""){
            alert("Please fill the complain form")
        }else{
            let transactionId = itemId;
            console.log({complainText, transactionId})
            createComplain({complainText, transactionId}).then((data) => {
                console.log(data);
                onClose();
            })
        }
    };

    const OverlayTwo = () => (
        <ModalOverlay
          bg='none'
          backdropFilter='auto'
          backdropBlur='2px'
        />
      )
    const [overlay, setOverlay] = useState(<OverlayTwo/>)
    const [complainText, setComplaintext] = useState("")
    return (

        <div size={{ base: "100px", md: "200px", lg: "300px" }}>
            <Grid templateColumns='repeat(5, 1fr)' gap={0}>
                <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
                    <Navbar />
                </GridItem>
                <GridItem colSpan={{base: 2, md: 2, lg: 2}} w={{base: '100%', md: '100%', lg: '100%'}}>
                    <Heading pl={{base: '3', md: '5'}} pt={{base: '5', md: '7'}} color='black' size='md'>Transaction</Heading>
                    <Box pr={{base: '3', md: '5'}} pl={{base: '3', md: '5'}}>
                        <InputGroup pr={{base: '3', md: '5'}} pt={{base: '3', md: '5'}}>
                            <InputLeftElement
                                pl={{base: '2', md: '2'}}
                                pt={{base: '3', md: '10'}}
                                pointerEvents='none'
                                children={<SearchIcon color='gray.300' />}
                            />
                            <Input pl={{base: '10', md: '10'}} type='tel' placeholder='Search' borderRadius='30' />
                        </InputGroup>
                        <Stack direction='row' mt='5' spacing={4} align='center'>
                            <Button variant='outline' onClick={() => listAll()}>
                                All
                            </Button>
                            <Button variant='outline' onClick={() => listPending()}>
                                Pending
                            </Button>
                            <Button variant='outline' onClick={() => listVerifying()}>
                                Verifying
                            </Button>
                            <Button variant='outline' onClick={() => listProcessing()}>
                                Processing
                            </Button>
                            <Button variant='outline' onClick={() => listCompleted()}>
                                Completed
                            </Button>
                            <Button variant='outline' onClick={() => listCancelled()}>
                                Cancelled
                            </Button>
                        </Stack>
                        {transaction.map((item,index) => (
                            <Card w={{base: "100%", md: "550px", lg: "95%"}} borderRadius='15' mt='5' pr={{base: '3', md: '5'}} key= {index} cursor='pointer' onClick={() => descChange(item)}>
                                <CardBody>
                                    <Stack direction={{base: 'column', md: 'row'}} alignItems={{base: 'flex-start', md: 'center'}}>
                                        <ListImage boxsize={"70"} url={item.goods__goods_image_link}/>
                                        <Stack spacing={0} direction='column' pl={{base: '0', md: '3'}}>
                                            <Stack direction='row'>
                                            <Text fontSize="sm">{item.goods__goods_name}</Text>
                                            </Stack>
                                            <Text fontSize="md" as='b'>Rp {item.total_price}</Text>
                                            <Text fontSize="md">{item.goods__seller_name}</Text>    
                                        </Stack>
                                        <Spacer></Spacer>
                                        <Badge variant='solid' colorScheme={item.progress === 'Pending' ? 'orange' : item.progress === 'Completed' ? 'green' : item.progress === 'Cancelled' ? 'red' : 'gray'} fontSize='0.8em'>
                                            {item.progress}
                                        </Badge>
                                    </Stack>
                                </CardBody>
                            </Card>
                        ))}
                        
                    </Box>
                </GridItem>
                {itemId !== '' && (

                    <GridItem colSpan={2} borderLeft='1px' borderColor='gray.200'>
                        <Box pl='5' pr='10'>
                            <Heading pt='7' pb='5' color= 'black' size='md'>Transaction Details</Heading>
                            <Stack direction='row' pb='7'>
                                <ListImage boxsize={"150"} url={itemImage}/>
                                <Stack direction='column' pl='5'>
                                    <Text fontSize="xl">{itemName}</Text>
                                    <Text fontSize="xl" as='b'>Rp {itemPrice}</Text>
                                    <Stack direction='row'>
                                        <Text fontSize="md" as='b'>Seller | </Text>
                                        <Text fontSize="md" as='b'>{sellerName}</Text>
                                    </Stack>
                                    <Stack direction='row'>
                                        <Button colorScheme='blue'>Chat Seller</Button>
                                        {itemProgress === 'Pending' && <Button colorScheme='red' onClick={() => cancelOrder()}>Cancel Order</Button>}
                                        {(itemProgress === 'Cancelled' || itemProgress === 'Pending' || itemProgress === 'Verifying') && <Button colorScheme='orange' onClick={() => {onOpen(); setComplaintext("")}}>Complain Order</Button>}
                                        <Modal onClose={onClose} isOpen={isOpen} isCentered>
                                            {overlay}
                                            <ModalOverlay />
                                            <ModalContent>
                                            <ModalHeader>Complain Order</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <Stack direction='column'>
                                                    <Text fontSize='md'>Please describe your problem</Text>
                                                    <Textarea
                                                    placeholder='...'
                                                    size='sm'
                                                    resize='vertical'
                                                    onChange={(e) => setComplaintext(e.target.value)}
                                                    isInvalid={complainText === '' ? true : false}
                                                    />
                                                </Stack>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button colorScheme='orange' isDisabled={complainText === '' ? true : false} onClick={() => complainOrder()}>Complain Order</Button>
                                                <Button onClick={onClose}>Close</Button>
                                            </ModalFooter>
                                            </ModalContent>
                                        </Modal>
                                        {itemProgress === 'Processing' && <Button colorScheme='green' onClick={() => finishTransaction()}>Finished Order</Button>}
                                    </Stack>
                                </Stack>                
                            </Stack>
                            <Box mx='7'>

                                <Slider value={sliderValue} min={0} max={99} step={33} mb='5' isReadOnly>
                                    <SliderMark value={0} mt='1' ml='-2.5' fontSize='sm' >
                                        Pending
                                    </SliderMark>
                                    <SliderMark value={30} mt='1' ml='-2.5' fontSize='sm' textAlign='center'>
                                        Verifying
                                    </SliderMark>
                                    <SliderMark value={63} mt='1' ml='-2.5' fontSize='sm'>
                                        Processing
                                    </SliderMark>
                                    <SliderMark value={94} mt='1' ml='-2.5' fontSize='sm'>
                                        Completed
                                    </SliderMark>
                                    <SliderTrack bg='green.100'>
                                        <Box position='relative' right={10} />
                                        <SliderFilledTrack bg={itemProgress === 'Cancelled' ? 'red' : 'green'} />
                                    </SliderTrack>
                                    <SliderThumb boxSize={6}>
                                        <Box color={itemProgress === 'Cancelled' ? 'red' : 'green'} as={itemProgress === 'Cancelled' ? AiOutlineClose : SlBasket} />
                                    </SliderThumb>
                                </Slider>
                            </Box>
                            <Text fontSize="lg" as='b' mt='10'>Product Detail</Text>
                            <Text pb='7' fontSize='md'>{itemDesc}</Text>
                            <Text as='b'>Shopping Summary</Text>
                            <Card mt='3'>
                                <CardBody>
                                    <Stack direction='row' justifyContent="space-between" >
                                        <Text pl='5'>Transaction ID</Text>
                                        <Text >{itemId}</Text>
                                    </Stack><Stack direction='row' justifyContent="space-between" >
                                        <Text pl='5'>Transaction Date</Text>
                                        <Text >{itemDate.substring(0, 10)}</Text>
                                    </Stack>
                                    <Divider my="3" />
                                    <Stack direction='row' justifyContent="space-between" >
                                        <Text pl='5'>Payment Method</Text>
                                        <Text >-</Text>
                                    </Stack>
                                    <Divider my="3" />
                                    <Stack direction='row' justifyContent="space-between">
                                        <Text pl='5'>Total Price ({itemQuant} {itemQuant === 1 ? 'item' : 'items'})</Text>
                                        <Text>Rp {parseInt(itemPrice) * parseInt(itemQuant)}</Text>
                                    </Stack>
                                    <Stack direction='row' justifyContent="space-between">
                                        <Text pl='5'>Payment Fee</Text>
                                        <Text >-</Text>
                                    </Stack>
                                    <Divider my="3" />
                                    <Stack direction='row' justifyContent="space-between">
                                        <Text pl='5' as='b'>Total </Text>
                                        <Text as='b'>Rp {itemTotalPrice}</Text>
                                    </Stack>
                                    <Stack>
                                        {itemProgress === 'Pending' && <Button colorScheme='blue' onClick={() => showPayment()} mt='5' >Pay</Button>}
                                    </Stack>
                                    
                                </CardBody>
                            </Card>
                        </Box>
                    </GridItem>
                )}
            </Grid>
        </div>
    )
}