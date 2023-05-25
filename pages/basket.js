import {
  Flex, Grid, GridItem, Box, Heading, Input, Card, 
  CardBody, Stack, Text, Button, Modal, ModalOverlay, 
  ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, useDisclosure, FormControl, 
  FormLabel, useToast, Image
} from '@chakra-ui/react'
import Navbar from '../components/navbar'
import React,{ useEffect, useState } from 'react';
import { getCart, getItemCart } from '../helpers/shopcart/api';
import { createTransactionAndGetToken } from '../helpers/transaction/api';
import  BasketCard  from '../components/basketCard';
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseConfig';
import {useRouter} from 'next/router'
import { addAddress } from '../helpers/profile/api';


export default function Basket() {
  const router = useRouter();
  const [basket, setBasket] = useState([]);
  const toast = useToast()
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
      console.log(token)
      if(token.status === 404){
        onOpen()
      }
      else{
        return token
      }
    } catch (error) {
      console.log(error)
    }
  }


  const showPayment = async  () => {
    const token = await createTransaction();
    if (token) {
      window.snap.pay(token, {
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

  //For Address not set
  const initialRef = React.useRef(null)
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [dataNewAddress, setNewAddress] = useState({
    address_name: "",
    street: "",
    city: "",
    province: "",
    zip_code: "",
  });

const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAddress((prevData) => ({ ...prevData, [name]: value }));
    console.log(dataNewAddress)
  };

  const handleNewAddress = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try{
        await addAddress(localStorage.getItem('accessToken'), dataNewAddress);
        setIsSuccess(true);
        onClose();
    }
    catch (error) {
        console.log(error)
    }
    router.reload()
};

  //End Address not set

  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <div size={{ base: "100px", md: "200px", lg: "300px" }}>
      <title>Basket</title>
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
                  {/* <Button float='right' isDisabled colorScheme='blue'>Buy</Button> */}
                  <Modal
                    isCentered
                    onClose={onClose}
                    isOpen={isOpen}
                    motionPreset='slideInBottom'
                  >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>You don't have any address<br></br>Please fill one</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={handleNewAddress}>
                            <FormControl>
                            <FormLabel>Label address</FormLabel>
                            <Input ref={initialRef} type='text' name="address_name" value={dataNewAddress.address_name} onChange={handleInputChange} placeholder='Input your label' />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>Jalan</FormLabel>
                            <Input type='text' name="street" value={dataNewAddress.street} onChange={handleInputChange} placeholder='Input your street' />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>Provinsi</FormLabel>
                            <Input type='text' name="province" value={dataNewAddress.province} onChange={handleInputChange} placeholder='Input your province' />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>Kota/Kabupaten</FormLabel>
                            <Input type='text' name="city" value={dataNewAddress.city} onChange={handleInputChange} placeholder='Input your city/regency' />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>Kode Pos</FormLabel>
                            <Input type='text' name="zip_code" value={dataNewAddress.zip_code} onChange={handleInputChange} placeholder='Input your pos code' />
                            </FormControl>
                            <ModalFooter>
                            <Button type='submit' colorScheme='blue' mr={3}
                                onClick={() =>
                                    toast({
                                      title: 'New address created.',
                                      description: "We've created your address for you.",
                                      status: 'success',
                                      duration: 9000,
                                      isClosable: true,
                                    })
                                  }
                            >
                            Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                            </form>
                        </ModalBody>
                        </ModalContent>
                  </Modal>
                </CardBody>
              </Card>
            </Box>
          )}
        </GridItem>
      </Grid>
    </div>
  )
}