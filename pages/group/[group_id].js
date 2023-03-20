import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import {useRouter } from 'next/router'
import { useState, useContext, useRef } from 'react'
import AuthenticationContext from '../../context/AuthenticationContext'
import Navbar from '../../components/navbar'
import {SimpleGrid, Image, Grid, GridItem, Input, InputGroup, InputLeftElement, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ButtonGroup, Button, Flex, Card, CardHeader, Box, Heading, Avatar, Stack, Text, Center, CardBody, IconButton, CardFooter, Divider, Spacer, AspectRatio, position, useDisclosure} from '@chakra-ui/react'
import { BsThreeDotsVertical, GrLinkPrevious } from 'react-icons/bs'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { SearchIcon, BellIcon, AddIcon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import '@splidejs/react-splide/css';


const settings = {

};

export default function Group() {
    const Group = () => {
        const router = useRouter()
        const { group_id } = router.query
    }

    const images = [
      {id: 1, src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/800px-Eq_it-na_pizza-margherita_sep2005_sml.jpg"},
      {id: 2, src: "https://www.recipetineats.com/wp-content/uploads/2020/05/Pepperoni-Pizza_5-SQjpg.jpg"},
      {id: 3, src: "https://asset.kompas.com/crops/teG8bxBeC9NzNi6opEf38UDC74Q=/0x0:1000x667/750x500/data/photo/2020/09/22/5f69e601777db.jpg"},
      {id: 4, src: "https://awsimages.detik.net.id/community/media/visual/2021/07/06/perbedaan-pizza-italia-dan-pizza-amerika-2.jpeg"},
      {id: 5, src: "https://www.kingarthurbaking.com/sites/default/files/styles/featured_image/public/2022-03/Easiest-Pizza_22-2_11.jpg"},
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const handleClickPrev = () => {
      setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
    };
    const handleClickNext = () => {
      setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
    };

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef(null)
    
    return (
    <main className={styles.container}>
      <Grid templateColumns='repeat(5, 1fr)' gap={0}>
        <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
          <Navbar />
        </GridItem>
        <GridItem colSpan={3} w='100%'>
          <Center>
            <Stack direction='column' spacing={8}>
            <div style={{}}>
            <Card w={[700]} borderRadius='15'>
              <CardBody>
              {/* <Stack direction='row' spacing={0}> */}
                <Text mb="5" fontSize='3xl'>Jual Beli Kamera</Text>
              {/* </Stack> */}
              </CardBody>
            </Card>
            </div>
              <Card w={[700]} borderRadius='15'>
                <CardHeader>
                  <Stack direction='row'>
                    <Avatar size='md' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
                    <Stack spacing={0} direction='column'>
                      <Text fontSize="xl">Zeta Prawira Syah</Text>
                      <Text fontSize="sm" mt="0">Posted on 10/10/2021</Text>
                    </Stack>
                    <Spacer />
                    <IconButton
                      variant='ghost'
                      colorScheme='gray'
                      aria-label='See menu'
                      icon={<BsThreeDotsVertical />}
                    />
                  </Stack>
                </CardHeader>
                <CardBody pt='0'>
                  <Text mb="5" fontSize='xl'>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</Text>                   
                  <Flex alignItems="center">
                  <Button bg="transparent" leftIcon={<ArrowBackIcon cursor="pointer" />} onClick={handleClickPrev} ></Button>
                    <Box position="relative" width="100%" height="300px">
                    {images.map((image, index) => (
                      <Image
                        key={image.id}
                        src={image.src}
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
                    ))}
                  </Box>
                  <Button bg="transparent" rightIcon={<ArrowForwardIcon cursor="pointer" />} onClick={handleClickNext} ></Button>
                  </Flex>
                </CardBody>
                <Divider />
                <CardFooter p="2" ml="3">
                  <div>
                    Comment section coming soon!
                  </div>
                </CardFooter>
              </Card>
            </Stack>
          </Center>
        </GridItem>
        <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflowY="auto" borderLeft='1px' borderColor='gray.200'>
        <Flex minWidth='max-content' alignItems='center' gap='2'px='5' pt='7' >
          <Heading color= 'black' size='md'>Store</Heading>
          <Spacer />
          <IconButton icon={<AddIcon/>} size="sm" ref={btnRef} onClick={onOpen}/>
        </Flex>
        <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior={"inside"}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Listing</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            hello
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        
        <InputGroup pl='5' pr='5' pt='5'>
          <InputLeftElement
          pl='9' pt='10'
          pointerEvents='none'
          children={<SearchIcon color='gray.300' />}
          />
          <Input pl='10' type='tel' placeholder='Search' borderRadius='full' />
        </InputGroup>
        
        <Card overflow="hidden" height="145" m="5" borderRadius='15'>
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
                  Pizza Margherita Comment section coming soon!Comment section coming soon!Comment section coming soon!Comment section coming soon!Comment section coming soon!
                </Box>
                <Box fontSize="sm" display="block" marginTop="auto" mt='10px'>
                  Rp. 100.000
                </Box>
              </Box>
              <Stack alignItems="center" justifyContent="center">
                <Image boxSize='100px' src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/800px-Eq_it-na_pizza-margherita_sep2005_sml.jpg' alt='Dan Abramov' />
              </Stack>
            </Stack>
          </CardBody>
        </Card>
        </GridItem>
      </Grid>
    </main>
    )
}