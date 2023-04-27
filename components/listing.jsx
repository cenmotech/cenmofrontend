import { useState, useEffect } from 'react'
import { Flex, useToast, Image, Button, Box, Stack, Center, Avatar, Text, Grid, GridItem, Card, CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Spacer } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { MdLocationPin } from 'react-icons/md'
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

  const toast = useToast()

  async function cartHandler(action, goods_id) {
    try {
      await updateToCart(action, goods_id)
      toast({
        title: 'Success',
        description: "Item added to cart",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error)
    }
  }
  const cartHandler2 = (e, id) => {
    e.preventDefault()
    cartHandler('add', id)
  }

  const getCity = (region) => {
    const city = region.split(',')[0]
    var splitStr = city.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  return <div>
    <Card overflow="hidden" height="145" m="5" borderRadius='15' className='listingCard' onClick={onOpen} cursor='pointer'>
      <CardBody p="0">
        <Stack justifyContent="space-between" direction='row' align='stretch'>
          <Box flex="1">
            <Grid m="5" templateRows='repeat(4, 1fr)'>
              <GridItem rowSpan={2} >
                <Text noOfLines={2}>{list.goods_name} </Text>
              </GridItem>
              <GridItem rowSpan={1}>
                <Text as='b'>
                  Rp {list.goods_price.toLocaleString('id-ID')}
                </Text>
              </GridItem>
              <GridItem rowSpan={1}>
                <Text noOfLines={1}>{getCity(list.goods_region)}</Text>
              </GridItem>
            </Grid>
          </Box>
          <Image m="0" objectFit={'cover'} boxSize='145px' borderRadius="0 15px 15px 0"
            overflow="hidden" src={images[0]} />
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
                {images.length > 1 && (
                  <Button bg="transparent" leftIcon={<ArrowBackIcon cursor="pointer" />} onClick={handleClickPrev} ></Button>
                )}
                <Box m="5" position="relative" width="100%" height="300px">
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
                {images.length > 1 && (
                  <Button bg="transparent" rightIcon={<ArrowForwardIcon cursor="pointer" />} onClick={handleClickNext} ></Button>
                )}
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
                <Avatar size='lg' name={list.seller_name} />
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
          <Button mr="3" onClick={e => cartHandler2(e, list.goods_id)} colorScheme='green'>Add To Basket</Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

  </div >
}

export default Listing