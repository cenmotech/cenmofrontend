import {
  Flex, Grid, GridItem, Box, Heading, InputGroup,
  InputLeftElement, Input, Card, CardBody,
  Stack, Text, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, IconButton, Button
} from '@chakra-ui/react'
import { SearchIcon, DeleteIcon } from '@chakra-ui/icons'
import Navbar from '../components/navbar'
import { Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { getCart, updateToCart, getItemCart } from '../helpers/shopcart/api';
import { createTransactionAndGetToken } from '../helpers/transaction/api';
import  BasketCard  from '../components/basketCard';
import React from 'react';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseConfig';

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
  const [itemImageLink, setItemImageLink] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    getCart().then((data) => {
      setBasket(data.response)
    },)
  }, [])

  useEffect(() => {
    setItemTotalPrice(itemPrice * itemQuant);
  }, [itemPrice, itemQuant]);

  const descChange = (item) => {
    getItemCart(item.id).then((data) => {
      setItemQuant(data.response.quantity)
    },)
    setItemId(item.goods__goods_id)
    setItemName(item.goods__goods_name)
    setItemPrice(item.goods__goods_price)
    setSellerName(item.goods__seller_name)
    setItemDesc(item.goods__goods_description)
    setItemImageLink(item.goods__goods_image_link)
  }

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
    getPhotoOnListing(itemImageLink).then((res) => {
      setImages(res)
    })
  }, [itemImageLink])

  return (
    <div size={{ base: "100px", md: "200px", lg: "300px" }}>
      <Grid templateColumns='repeat(5, 1fr)' gap={0}>
        <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
          <Navbar />
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 2, lg: 2 }} w={{ base: '100%', md: '100%', lg: '100%' }}>
          <Heading pl={{ base: '3', md: '5' }} pt={{ base: '5', md: '7' }} color='black' size='md'>Basket</Heading>
          <Box pr={{ base: '3', md: '5' }} pl={{ base: '3', md: '5' }}>
            {basket.map((item, index) => {
              return (
              <div key={index} onClick={() => descChange(item)}>
                <BasketCard item={item} cursor="pointer"></BasketCard>
              </div>
            )})}
          </Box>
        </GridItem>
        <GridItem colSpan={2} borderLeft='1px' borderColor='gray.200'>
          {itemDesc === '' ? (
            <Flex justifyContent="center" alignItems="center" h="100vh">
              <Text fontSize='5xl'>Choose Items</Text>
            </Flex>) : (
            <Box pl='5' pr='10'>
              <Heading pt='7' pb='5' color='black' size='md'>Basket Details</Heading>
              <Stack direction='row' pb='7'>
                <Image boxSize='150px' src={images[0]} objectFit={'cover'} borderRadius='10' />
                <Stack direction='column' pl='5'>
                  <Text fontSize="xl">{itemName}</Text>
                  <Text fontSize="xl" as='b'>Rp {itemPrice.toLocaleString('id-ID')}</Text>
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
                    <Text pl='5'>Total price: {itemQuant} item * {itemPrice.toLocaleString('id-ID')}</Text>
                    <Text as='b'>Rp {itemTotalPrice.toLocaleString('id-ID')}</Text>
                  </Stack>
                  <br />
                  <Button float='right' onClick={showPayment} colorScheme='blue'>Buy</Button>
                </CardBody>
              </Card>
            </Box>
          )}
        </GridItem>
      </Grid>
    </div>
  )
}