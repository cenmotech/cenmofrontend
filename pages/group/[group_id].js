import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import {useRouter} from 'next/router'
import {ReactNode, useState, useContext, useRef, useEffect } from 'react'
import { useController } from "react-hook-form";
import AuthenticationContext from '../../context/AuthenticationContext'
import Navbar from '../../components/navbar'
import { Progress, Image, InputLeftAddon, FormErrorMessage, Textarea, Grid, Select, GridItem, Input, FormControl, FormLabel, InputGroup, InputLeftElement, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ButtonGroup, Button, Flex, Card, CardHeader, Box, Heading, Avatar, Stack, Text, Center, CardBody, IconButton, CardFooter, Divider, Spacer, AspectRatio, position, useDisclosure, NumberInput, NumberInputField, FormHelperText} from '@chakra-ui/react'
import { BsThreeDotsVertical, GrLinkPrevious, BsCardImage } from 'react-icons/bs'
import { SearchIcon, BellIcon, AddIcon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import '@splidejs/react-splide/css';
import axios from "axios";
import { createListing } from '../../helpers/group/api';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../firebaseConfig';
import { v4 } from 'uuid';


export default function Group() {
  // HANDLE ROUTER GROUP
  const [groupId, setGroupId] = useState(0)

  const router = useRouter();
  useEffect(()=>{
      if(!router.isReady) return;
      setGroupId(router.query.group_id)

  }, [router.isReady]);


  // HANDLE API REGION
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [province, setProvince] = useState(null)
  const [city, setCity] = useState(null)

  useEffect(() => {
    const fetchProvinceList = async () => {
      const response = await axios.get("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      setProvinceList(response.data)
    }
    fetchProvinceList()
  }, [])

  // useEffect(() => {
  //   const fetchCityList = async () => {
  //     const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/11.json`)  
  //     setCityList(response.data)
  //   }
  //   fetchCityList()
  // }, [])
        
  useEffect(() => {
    if (province != null) {
      const fetchCityList = async () => {
        const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${province.id}.json`)  
        setCityList(response.data)
      }
      fetchCityList()
    } else {
      setCityList([])
    }
  }, [province])

  const images = [
    {id: 1, src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/800px-Eq_it-na_pizza-margherita_sep2005_sml.jpg"},
    {id: 2, src: "https://www.recipetineats.com/wp-content/uploads/2020/05/Pepperoni-Pizza_5-SQjpg.jpg"},
    {id: 3, src: "https://asset.kompas.com/crops/teG8bxBeC9NzNi6opEf38UDC74Q=/0x0:1000x667/750x500/data/photo/2020/09/22/5f69e601777db.jpg"},
    {id: 4, src: "https://awsimages.detik.net.id/community/media/visual/2021/07/06/perbedaan-pizza-italia-dan-pizza-amerika-2.jpeg"},
    {id: 5, src: "https://www.kingarthurbaking.com/sites/default/files/styles/featured_image/public/2022-03/Easiest-Pizza_22-2_11.jpg"},
  ];

  // HANDLE IMAGE UPLOAD
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleClickPrev = () => {
    setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };
  const handleClickNext = () => {
    setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
  };

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [progress, setProgress] = useState(0);

  async function uploadImage (type) {
    const identifier = v4();
    const user = localStorage.getItem('user');
    const promises = [];
    for (let i = 1; i < selectedFiles.length + 1; i++) {
      const storageRef = ref(storage, `images/${groupId}/${user}/${type}/${identifier}/${i}`);
      promises.push(uploadBytes(storageRef, selectedFiles[i-1]).then(() => {
        setProgress((progress) => progress + 1)
      }))
    }
    setProgress(0);
    return Promise.all(promises).then(() => { 
      return `images/${groupId}/${user}/${type}/${identifier}`
    });
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setSelectedFiles([...selectedFiles, ...files]);
    setPreviewUrls([...previewUrls, ...urls]);
  };

  const handleRemove = (index) => {
    const newFiles = [...selectedFiles];
    const newUrls = [...previewUrls];
    newFiles.splice(index, 1);
    newUrls.splice(index, 1);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };
  
  const renderImages = () => {
    return previewUrls.map((url, index) => (
      <Box key={index} mr={2} mb={2}>
        <Flex direction="column">
          <Image src={url} w="100px" h="100px" objectFit="contain" />
          <Button onClick={() => handleRemove(index)}>Remove</Button>
        </Flex>
      </Box>
    ));
  };

  const handleRemoveAll = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleCloseAndRemoveAll = () => {
    onClose();
    handleRemoveAll();
  };

  // HANDLE POST LISTING
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");

  // async function getRegion() {
  //   setCity(JSON.parse(document.getElementById("city").value))
  //   setProvince(JSON.parse(document.getElementById("province").value))
  // };

  const changeProvince = (e) => {
    if (e.target.value !== "") {
      setProvince(JSON.parse(e.target.value))
    } else {
      setProvince(null)
    }
  };

  const changeCity = (e) => {
    if (e.target.value !== "") {
      setCity(JSON.parse(e.target.value))
    } else {
      setCity(null)
    }
  };

  async function uploadListing() { 
      if (selectedFiles.length !== 0) {
        const x = document.getElementById("progressImage");
        x.style.display = "block"
        const image = await uploadImage("listing")
        await uploadOther(image) 
        await router.reload()
      } else {
        await uploadOther(image)
        await router.reload()
      }
    };

  const uploadOther = (image) => {
      const region = `${city.name},${province.name}`
      const group = groupId;
      const data = {name, price, desc, image, region, group};
      postCreateListing(data)
      return "success"
  };
  
  async function postCreateListing(data) {
    try {
      const response = await createListing(localStorage.getItem("accessToken"), data)
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  };

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
          closeOnOverlayClick={false}
        >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Listing</ModalHeader>
          <ModalCloseButton onClick={handleCloseAndRemoveAll} mt="2" mr="1" />
          <ModalBody>
          <form>
            <FormControl>
              <FormLabel>Product Title</FormLabel>
              <Input onChange={(e) => setName(e.target.value)} maxLength={50} type='text' />
            </FormControl>
            <br/>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea onChange={(e) => setDesc(e.target.value)} maxLength={400} h="180"/>
            </FormControl>
            <br/>
            <FormControl>
              <FormLabel>Image</FormLabel>
              <Stack direction="row" flexWrap="wrap">
              {renderImages()}
              <label htmlFor="file-input">
                <Input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  display="none"
                  multiple
                />
                <Button rightIcon={<BsCardImage/>} width={100} height={100} cursor="pointer" as="span"></Button>
              </label>
              </Stack>
            </FormControl>
            <br/>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <InputGroup>
              <InputLeftAddon children='Rp.' />
              <NumberInput onChange={(e) => setPrice(e)} min={100}>
                <NumberInputField />
              </NumberInput>
              </InputGroup>
            </FormControl>
            <br/>
            <FormControl>
              <FormLabel>Region</FormLabel>
              <Stack spacing={8} direction='row'>
                <Select id="province" placeholder="Select Province" onChange={(e) => changeProvince(e)}>
                  {provinceList.map((province, index) => (
                    <option key={index} value={JSON.stringify({"id":province.id, "name":province.name})}>{province.name}</option>
                  ))}
                </Select>
                <Select id="city" placeholder="Select City" onChange={(e) => changeCity(e)}>
                  {cityList.map((city, index) => (
                  <option key={index} value={JSON.stringify({"id":city.id, "name":city.name})}>{city.name}</option>
                  ))}
                </Select>
              </Stack>
            </FormControl>
            </form>
          </ModalBody>
          <ModalFooter justifyContent="flex-start">
            <Stack id="progressImage" w="100%" display="none" direction='column' mr="4" spacing={1}>
              <Text fontSize='sm'>Uploading Image {progress}/{selectedFiles.length}</Text>
              <Progress w="100%" value={progress/selectedFiles.length * 100} size='xs' colorScheme='green' />
            </Stack>
            <Spacer />
            {/* <Button colorScheme='red' mr={3} onClick={checkValue}>test</Button> */}
            <Button colorScheme='blue' onClick={uploadListing}>Save</Button>
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