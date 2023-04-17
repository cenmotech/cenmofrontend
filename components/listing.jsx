import { useState, useEffect } from 'react'
import { Flex, Image, Button, Box, Stack, Center, Avatar, Text, Grid, GridItem, Card, CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseConfig';
import { useDisclosure } from "@chakra-ui/react"
import { getSnapToken } from '../helpers/transaction/api';
import { updateToCart } from '../helpers/shopcart/api';
const Listing = ({ list }) => {
    const [images, setImages] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleClickPrev = () => {
        setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
    };
    const handleClickNext = () => {
        setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
    };

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
        getPhotoOnListing(list.goods_image_link).then((res) => {
            setImages(res)
        })
    }, [list])

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

    async function getTokenFromSnap() {
      try {
        const token = await getSnapToken(list)
        return token
      } catch (error) {
        console.error(error)
      }
    }
    async function cartHandler(action, goods_id){
      try {
        await updateToCart(action, goods_id)
      } catch (error) {
        console.error(error)
      }
    }
    const cartHandler2 = (e, id) => {
      e.preventDefault()
      cartHandler('add', id)
    }
    const showPayment = () => {
      getTokenFromSnap().then((snapToken) => {
        console.log(snapToken.token)
        window.snap.pay(snapToken.token, {
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

    return <div>
        <Card overflow="hidden" height="145" m="5" borderRadius='15' className='listingCard' onClick={onOpen} cursor='pointer'>
            <CardBody>
                <Stack direction='row' align='stretch' spacing={3}>
                    <Box flex="1">
                        <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' noOfLines={3} minHeight='4em'
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}
                        >
                            {list.goods_name}
                        </Box>
                        <Box fontSize="sm" display="block" marginTop="auto" mt='10px'>
                            Rp{list.goods_price}
                        </Box>
                    </Box>
                    <Stack alignItems="center" justifyContent="center"></Stack>
                    <Image objectFit={'cover'} boxSize='100px' src={images[0]} />
                </Stack>
            </CardBody>
        </Card>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <ModalCloseButton mt="2" mr="1" />
              </ModalHeader>
              <ModalBody>
                <Grid
                  h='700px'
                  templateRows='repeat(15, 1fr)'
                  templateColumns='repeat(6, 1fr)'
                  gap={2}
                >
                  <GridItem rowSpan={8} colSpan={6}>
                  <Flex alignItems="center">
                    <Button bg="transparent" leftIcon={<ArrowBackIcon cursor="pointer" />} onClick={handleClickPrev} ></Button>
                    <Box position="relative" width="100%" height="300px">
                    {images.map((image, index) => {
                        return <Image
                        key={index}
                        src={image}
                        alt={`Image ${index + 1}`}
                        position="absolute"
                        top={0}
                        left={0}
                        width="100%"
                        height="100%"
                        opacity={index === currentIndex ? 1 : 0}
                        transition="opacity 0.5s ease-in-out"
                        objectFit="contain"
                        />
                    })
                    }
                    </Box>
                    <Button bg="transparent" rightIcon={<ArrowForwardIcon cursor="pointer" />} onClick={handleClickNext} ></Button>
                    </Flex>
                  </GridItem>
                  <GridItem>

                  </GridItem>
                  <GridItem rowSpan={1} colSpan={6}>
                    <Flex justifyContent='center'>
                      <Center height='23px' width='500px' justifyContent='left'>
                        <Text fontSize='30px'>
                          <b>{list.goods_name}</b>
                        </Text>
                      </Center>
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={6}>
                    <Flex justifyContent='center'>
                      <Center height='23px' width='500px' justifyContent='left'>
                        <Text fontSize='18px'>
                          <b>Rp{list.goods_price}</b>
                        </Text>
                      </Center>
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={2} colSpan={6} borderBottom='2px' borderColor='gray.200'>
                    <Box box='1' height='auto' justifyItems='center' marginX='15px'>
                      <Text mb="5" fontSize='16px'>{list.goods_description}
                      </Text>
                    </Box>

                  </GridItem>
                  <GridItem rowSpan={1} colSpan={6}>

                  </GridItem>
                  <GridItem rowSpan={2} colSpan={1}>
                    <Center w='100px' h='70px'>
                      <Avatar size='lg' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
                    </Center>
                  </GridItem>

                  <GridItem rowSpan={1} colSpan={5}>
                    <Flex justifyContent='center'>
                      <Center height='23px' width='500px' justifyContent='left'>
                        <Text fontSize='20px'>
                          <b>{list.seller_name}</b>
                        </Text>
                      </Center>
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={5} >
                    <Flex justifyContent='center'>
                      <Center height='23px' width='500px' justifyContent='left'>
                        <Text fontSize='18px'>
                          {list.goods_region}
                        </Text>
                      </Center>
                    </Flex>
                  </GridItem>
                </Grid>
              </ModalBody>
              <ModalFooter>
                <Button onClick={showPayment} colorScheme='green'>Buy</Button>
                <Button onClick={e => cartHandler2(e, list.goods_id)}>TARO KERNJANG</Button>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

    </div >
}

export default Listing