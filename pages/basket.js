import { Grid, GridItem, Box, Heading, InputGroup,
        InputLeftElement, Input, Card, CardBody,
        Stack, Text, NumberInput, NumberInputField,
        NumberInputStepper, NumberIncrementStepper,
        NumberDecrementStepper, IconButton, Button } from '@chakra-ui/react'
import { SearchIcon, DeleteIcon } from '@chakra-ui/icons'
import Navbar from '../components/navbar'
import { Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { getCart, updateToCart } from '../helpers/shopcart/api';
import { createTransactionAndGetToken } from '../helpers/transaction/api';
import React from 'react';

export default function Basket() {
    const [quantity, setQuantity] = useState(1);
    const pricePerItem = 237000;
    const totalPrice = quantity * pricePerItem;
    const [basket, setBasket] = useState([]);

    const [itemId, setItemId] = useState("")
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [sellerName, setSellerName] = useState("");
    const [itemDesc, setItemDesc] = useState("");
    const [itemQuant, setItemQuant] = useState("");
    const [itemTotalPrice, setItemTotalPrice] = useState("");

    useEffect(() => {
        getCart().then((data) => {
            setBasket(data.response)
        }, )
    }, [])

    useEffect(() => {
        setItemTotalPrice(itemPrice * itemQuant);
      }, [itemPrice, itemQuant]);

    const descChange = (item) => {
        setItemId(item.goods__goods_id)
        setItemName(item.goods__goods_name)
        setItemPrice(item.goods__goods_price)
        setSellerName(item.goods__seller_name)
        setItemDesc(item.goods__goods_description)
        setItemQuant(item.quantity)
    }

    const [snapToken, setSnapToken] = useState("");
    
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

    async function createTransaction() {
      try {
        const token = await createTransactionAndGetToken(itemId, itemQuant)
        return token
      } catch (error) {
        console.error(error)
      }
    }

    const showPayment = () => {
        createTransaction().then((snapToken) => {
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
        })
      }

    async function cartHandler(action, goods_id){
        try {
          await updateToCart(action, goods_id)
        } catch (error) {
          console.error(error)
        }
      }
      
      const handleQuantityChange = (action, id, index) => {
        const updatedBasket = [...basket];
        if (action === 'add') {
            updatedBasket[index].quantity += 1;
            cartHandler('add', id)
        }else if(action === 'remove' && updatedBasket[index].quantity > 1){
            updatedBasket[index].quantity -= 1;
            cartHandler('remove', id)
        }else if(action === 'delete'){
            updatedBasket.splice(index, 1);
            cartHandler('delete', id)
        }
        setBasket(updatedBasket);
      }
    return (
        <div size={{ base: "100px", md: "200px", lg: "300px" }}>
            <Grid templateColumns='repeat(5, 1fr)' gap={0}>
                <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
                    <Navbar />
                </GridItem>
                <GridItem colSpan={{base: 2, md: 2, lg: 2}} w={{base: '100%', md: '100%', lg: '100%'}}>
                    <Heading pl={{base: '3', md: '5'}} pt={{base: '5', md: '7'}} color='black' size='md'>Basket</Heading>
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
                        {basket.map((item, index) => (
                            <Card w={{base: "100%", md: "550px", lg: "510px"}} borderRadius='15' mt='5' pr={{base: '3', md: '5'}} key= {index} cursor="pointer" onClick={() => descChange(item)}>
                            <CardBody>
                                <Stack direction={{base: 'column', md: 'row'}} alignItems={{base: 'flex-start', md: 'center'}}>
                                <Image boxSize={{base: '70px', md: '70px'}} src={item.goods__goods_image_link} alt='URL Gambar' borderRadius='10' />
                                <Stack spacing={0} direction='column' pl={{base: '0', md: '3'}}>
                                    <Stack direction='row'>
                                    <Text fontSize="sm">{item.goods__goods_name}</Text>
                                    </Stack>
                                    <Text fontSize="md" as='b'>Rp {item.goods__goods_price * item.quantity}</Text>
                                    <Text fontSize="md">{item.goods__seller_name}</Text>
                                </Stack>
                                <Stack direction='row' alignItems={{base: 'flex-start', md: 'center'}} pl={{base: '0', md: '50'}}>
                                    <IconButton aria-label='Delete' icon={<DeleteIcon />} color='red.500' onClick={(e) => {e.stopPropagation(); handleQuantityChange("delete", item.goods__goods_id, index)}}/>
                                    <NumberInput size='sm' maxW={20} value={item.quantity} min={1} onClick={(e) => e.stopPropagation()} isReadOnly={true}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper onClick = {() => handleQuantityChange("add", item.goods__goods_id, index)}/>
                                        <NumberDecrementStepper onClick = {() => handleQuantityChange("remove", item.goods__goods_id, index)} isDisabled={item.quantity === 1}/>
                                    </NumberInputStepper>
                                    </NumberInput>
                                </Stack>
                                </Stack>
                            </CardBody>
                            </Card>
                        ))}
                    </Box>
                </GridItem>
                <GridItem colSpan={2} borderLeft='1px' borderColor='gray.200'>
                    <Box pl='5' pr='10'>
                        <Heading pt='7' pb='5' color= 'black' size='md'>Basket Details</Heading>
                        <Stack direction='row' pb='7'>
                            <Image boxSize='150px' src='https://bit.ly/dan-abramov' alt='Dan Abramov' borderRadius='10' />
                            <Stack direction='column' pl='5'>
                                <Text fontSize="xl">{itemName}</Text>
                                <Text fontSize="xl" as='b'>Rp {itemPrice}</Text>
                                <Stack direction='row'>
                                        <Text fontSize="md" as='b'>Seller |</Text>
                                        <Text fontSize="md">{sellerName}</Text>
                                    </Stack>
                                    <Button colorScheme='blue'>Seller Chat</Button>
                            </Stack>                
                        </Stack>
                        <Text fontSize="lg" as='b' mt='10'>Product Description</Text>
                        <Text pb='7' fontSize='md'>{itemDesc}</Text>
                        <Card boxShadow='outline'>
                            <CardBody>
                                <Text as='b'>Shopping Summary</Text>
                                <Stack direction='row' justifyContent="space-between">
                                    <Text pl='5'>Total price {itemQuant} item * {itemPrice}</Text>
                                    <Text as='b'>Rp {itemTotalPrice}</Text>
                                </Stack>
                                <br/>
                                <Button float='right' onClick={showPayment} colorScheme='blue'>Buy</Button>
                            </CardBody>
                        </Card>
                    </Box>
                </GridItem>
            </Grid>
        </div>
    )
}