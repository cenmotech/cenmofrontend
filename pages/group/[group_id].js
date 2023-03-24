import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router'
import { ReactNode, useState, useContext, useRef, useEffect } from 'react'
import { useController } from "react-hook-form";
import AuthenticationContext from '../../context/AuthenticationContext'
import Navbar from '../../components/navbar'
import { useToast, Textarea, Progress, Menu, MenuButton, MenuItem, MenuList, Image, InputLeftAddon, FormErrorMessage, Grid, Select, GridItem, Input, FormControl, FormLabel, InputGroup, InputLeftElement, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ButtonGroup, Button, Flex, Card, CardHeader, Box, Heading, Avatar, Stack, Text, Center, CardBody, IconButton, CardFooter, Divider, Spacer, AspectRatio, position, useDisclosure, NumberInput, NumberInputField, FormHelperText } from '@chakra-ui/react'
import { BsThreeDotsVertical, GrLinkPrevious, BsCardImage } from 'react-icons/bs'
import { SearchIcon, BellIcon, AddIcon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { isMember, getPostOnGroup, getListingOnGroup, searchPostByDesc, seeGroup, joinGroup, createListing, createPost, searchPostOnGroup, searchListingOnGroup, deletePost } from '../../helpers/group/api'
import '@splidejs/react-splide/css';
import moment from "moment"
import { useClickable } from "@chakra-ui/clickable"
import axios from "axios";
import { getUserInfo } from '../../helpers/profile/api';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../firebaseConfig';
import { v4 } from 'uuid';
import { grid } from '@chakra-ui/styled-system';
import PostImage from '../../components/postImage';
import MainImage from '../../components/mainImage';


export default function Group() {
  // HANDLE ROUTER GROUP
  const [groupId, setGroupId] = useState(0)

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    setGroupId(router.query.group_id)

  }, [router.isReady]);

  useEffect(() => {
    if (localStorage.getItem("accessToken") == null) {
      router.push("/login")
    }
  }, [])


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

  // HANDLE IMAGE UPLOAD
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleClickPrev = () => {
    setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };
  const handleClickNext = () => {
    setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
  };

  const { isOpen: isDetailsListOpen, onOpen: onDetailsListOpen, onClose: onDetailsListClose } = useDisclosure()
  const { isOpen: isReadMoreOpen, onOpen: onReadMoreOpen, onClose: onReadMoreClose } = useDisclosure()
  const { isOpen: isListOpen, onOpen: onListOpen, onClose: onListClose } = useDisclosure()
  const { isOpen: isPostOpen, onOpen: onPostOpen, onClose: onPostClose } = useDisclosure()
  const btnRef = useRef(null)

  const [userName, setUserName] = useState("")
  const [userKey, setUserKey] = useState("")
  const [isJoined, setIsJoined] = useState(false)
  const [postList, setPostList] = useState([])
  const [listingList, setListingList] = useState([])
  const [groupMethod, setGroupMethod] = useState({})
  const [fullDesc, setFullDesc] = useState("")
  const [filter, setFilter] = useState("")
  const [filterList, setFilterList] = useState("")

  useEffect(() => {
    if (!router.isReady) return;
    const fetchGroupInfo = async () => {
      if (groupId !== 0) {
        getPostFromApi()
        getListingFromApi()
        seeGroupFromApi()
        checkIsMember()
        getUserFromApi()
      }
    }
    fetchGroupInfo()
  }, [groupId])

  async function checkIsMember() {
    try {
      const response = await isMember(localStorage.getItem('accessToken'), groupId);
      setIsJoined(response.isMember)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    if (!router.isReady) return;
    const searchPost = async () => {
      if (filter === "") {
        const response = await getPostOnGroup(localStorage.getItem('accessToken'), groupId);
        setPostList(response.response)
        console.log("IF")
        console.log(response.response)
      }
      else {
        const response = await searchPostOnGroup(localStorage.getItem('accessToken'), groupId, filter);
        setPostList(response.response)
        console.log("ELSE")
        console.log(filter)
        console.log(response.response)
      }
    }
    searchPost()
  }, [filter])


  async function getPostFromApi() {
    try {
      if (filter === '') {
        const response = await getPostOnGroup(localStorage.getItem('accessToken'), groupId);
        setPostList(response.response)
      } else {
        const response = await searchPostByDesc(localStorage.getItem('accessToken'), groupId, filter);
        setPostList(response.response)
      }
    } catch (error) {
      // handle the error
      console.error(error);
    }
  }
  

  async function getUserFromApi() {
    try{
      const response = await getUserInfo(localStorage.getItem('accessToken'));
      setUserName(response.name)
      setUserKey(response.email)
    } catch (error) {
      console.error(error)
    }
  }

  let originalDescription = "";
  async function seeGroupFromApi() {
    try {
      const response = await seeGroup(localStorage.getItem('accessToken'), groupId);
      setGroupMethod(response.response)
      setFullDesc(response.response.group_desc);
      const description = response.response.group_desc;
      var words = description.split(" ");
      if (words.length > 30) {
        response.response.group_desc = words.splice(0, 30).join(" ") + "...   ";
      }
    } catch (error) {
      // handle the error
      console.error(error);
    }
  }


  const [listingName, setListingName] = useState("")
  const [listingPrice, setListingPrice] = useState(0)
  const [listingDesc, setListingDesc] = useState("")
  const [listingImage, setListingImage] = useState("")
  const [listingRegion, setListingRegion] = useState("")
  const [listingSellerName, setListingSellerName] = useState("")
  const setModalValue = (listingData) => {
    setListingName(listingData.goods_name)
    setListingPrice(listingData.goods_price)
    setListingDesc(listingData.goods_description)
    setListingImage({ "post_image_link": listingData.goods_image_link })
    setListingRegion(listingData.goods_region)
    setListingSellerName(listingData.seller_name)
  }

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [progress, setProgress] = useState(0);

  async function uploadImage(type) {
    const identifier = v4();
    const user = localStorage.getItem('user');
    const promises = [];
    for (let i = 1; i < selectedFiles.length + 1; i++) {
      const storageRef = ref(storage, `images/${groupId}/${user}/${type}/${identifier}/${i}`);
      promises.push(uploadBytes(storageRef, selectedFiles[i - 1]).then(() => {
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
    onListClose();
    onPostClose();
  };

  // HANDLE POST LISTING
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const isErrorName = name === ''
  const isErrorDesc = desc === ''
  const isErrorPrice = price === ''


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
    if (selectedFiles.length !== 0 && name !== "" && desc !== "" && price !== "" && city !== null && province !== null) {
      const x = document.getElementById("progressImage");
      x.style.display = "block"
      const image = await uploadImage("listing")
      await uploadListingInfo(image)
      await router.reload()
    } else {
      toast({
        title: "Please Fill all the required form",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  };

  const uploadListingInfo = (image) => {
    const region = `${city.name},${province.name}`
    const group = groupId;
    const data = { name, price, desc, image, region, group };
    postCreateListing(data)
    return "success"
  };

  async function postCreateListing(data) {
    try {
      const response = await createListing(localStorage.getItem("accessToken"), data)
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Post
  const [postDesc, setPostDesc] = useState("");

  async function uploadPost() {
    if (selectedFiles.length !== 0) {
      const image = await uploadImage("post")
      await uploadPostInfo(image)
      await router.reload()
    } else {
      const image = ""
      await uploadPostInfo(image)
      await router.reload()
    }
  };

  const uploadPostInfo = (image) => {
    const group = groupId;
    const desc = postDesc;
    const data = { desc, image, group };
    postCreatePost(data)
    return "success"
  };

  async function postCreatePost(data) {
    try {
      const response = await createPost(localStorage.getItem("accessToken"), data)
    } catch (error) {
      console.error(error);
    }
  };

  const toast = useToast()
  async function join() {
    const id = groupId;
    const data = { id };
    groupJoined(data)
    await router.reload()
  };

  async function groupJoined(data) {
    try {
      const response = await joinGroup(localStorage.getItem("accessToken"), data)
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setFilter(e.target.value)
    }
  }

  useEffect(() => {
    if (!router.isReady) return;
    const searchList = async () => {
      if (filterList === "") {
        const response = await getListingOnGroup(localStorage.getItem('accessToken'), groupId);
        setListingList(response.response)
      }
      else {
        const response = await searchListingOnGroup(localStorage.getItem('accessToken'), groupId, filterList);
        setListingList(response.response)
      }
    }
    searchList()
  }, [filterList])

  async function getListingFromApi() {
    try {
      if (filter === '') {
        const response = await getListingOnGroup(localStorage.getItem('accessToken'), groupId);
        setListingList(response.response)
      } else {
        const response = await searchListingOnGroup(localStorage.getItem('accessToken'), groupId, filterList);
        setListingList(response.response)
      }
    } catch (error) {
      // handle the error
      console.error(error);
    }
  }

  const handleSearchListing = (e) => {
    if (e.key === 'Enter') {
      setFilterList(e.target.value)
    }
  }

  const handleDeleteClick = async (postId) => {
    console.log(postId)
    console.log(groupId)
    try {
      const response = await deletePost(localStorage.getItem("accessToken"), groupId, postId)
      await router.reload()
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
                <Card w={[700]} h={[200]} mt="5" borderRadius='15'>
                  <CardBody>
                    <Box position="relative" width="100%" height="500px">
                      <Grid h='170px' templateRows='repeat(5, 1fr)' templateColumns='repeat(9, 1fr)' gap={4}>
                        <GridItem rowSpan={6} colSpan={1} >
                          <Center w='100px' h='150px' >
                            <Avatar size='xl' name={groupMethod.group_name} />
                          </Center>
                        </GridItem>

                        <GridItem rowSpan={2} colSpan={7} >

                          <Text mb="5" fontSize='40px' as='b'>{groupMethod.group_name}</Text>
                        </GridItem>

                        <GridItem rowSpan={3} colSpan={6}>
                          <Text mb="5" fontSize='16px'>{groupMethod.group_desc}
                            {/* <a color='blue' onClick={onReadMoreOpen} cursor='pointer'>read more</a> */}
                          </Text>
                        </GridItem>

                        <GridItem rowSpan={3} colSpan={2} >
                          <Flex color='white'>
                            <Center w='200px' h='86px' justifyContent='center' >
                              {isJoined === true ?
                                <Button isDisabled justifyContent='center' width='90%' borderRadius='30' colorScheme='blue'>Joined</Button>
                                : <Button justifyContent='center' width='90%' borderRadius='30' colorScheme='blue' onClick={e => {
                                  toast({
                                    title: 'Success',
                                    description: "You have joined",
                                    status: 'success',
                                    duration: 9000,
                                    isClosable: true,
                                  });
                                  join();
                                }}>Join</Button>
                              }
                            </Center>
                          </Flex>
                        </GridItem>

                      </Grid>
                    </Box>
                    {/* <Stack direction='row' spacing={0}> */}

                    {/* </Stack> */}
                  </CardBody>
                </Card>
                <InputGroup pl='5' pr='5' pt='3'>
                  <InputLeftElement
                    pl='9' pt='6'
                    pointerEvents='none'
                    children={<SearchIcon color='gray.300' />}
                  />
                  <Input pl='10' type='tel' placeholder='Search' borderRadius='30' onKeyDown={handleSearch} />
                </InputGroup>

                {isJoined === true && (
                <Card w={[700]} borderRadius='15' mt='10'>
                  <CardBody>
                    <Stack direction='row' alignItems="center">
                      <Avatar size='md' name={userName} />
                      <Stack spacing={0} direction='column'>
                        <Text fontSize="xl">{userName}</Text>
                      </Stack>
                    </Stack>
                    <Box mt={5} w='100%' p={4} boxShadow="0px 1px 4px rgba(0, 0, 0, 0.25)" borderRadius="10px" cursor={'pointer'} onClick={onPostOpen} >
                      What's on your mind?
                    </Box>
                  </CardBody>
                </Card>)}

                <Modal isOpen={isPostOpen} onClose={onPostClose} size="xl" closeOnOverlayClick={false}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton onClick={handleRemoveAll} mt="2" mr="1" />
                    <ModalBody>
                      <Stack direction='row' alignItems="center">
                        <Avatar size='md' name={userName} />
                        <Stack spacing={0} direction='column'>
                          <Text fontSize="xl">{userName}</Text>
                        </Stack>
                      </Stack>
                      <Textarea
                        mt={4}
                        mb={6}
                        placeholder="What's on your mind?"
                        h="200"
                        onChange={(e) => setPostDesc(e.target.value)}
                      />

                      <Stack direction="row" flexWrap="wrap" >
                        {renderImages()}
                        <Box mr={2} mb={2}>
                          <Flex direction="column">
                            <label htmlFor="file-input">
                              <Input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                display="none"
                                multiple
                              />
                              <Button rightIcon={<BsCardImage />} width={100} height={100} cursor="pointer" as="span"></Button>
                            </label>
                          </Flex>
                        </Box>
                      </Stack>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={uploadPost}>
                        Post
                      </Button>
                      <Button onClick={handleRemoveAll}>Cancel</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </div>
              {postList.map((post, index) => (
                <Card key={index} w={[700]} borderRadius='15'>
                  <CardHeader>
                    <Stack direction='row'>
                      <Avatar size='md' name={post.post_user_name} />
                      <Stack spacing={0} direction='column'>
                        <Text fontSize="xl">{post.post_user_name}</Text>
                        <Text fontSize="sm" mt="0">Posted on {moment(post.post_date).format("MMMM Do YYYY, h:mm:ss a")}</Text>
                      </Stack>
                      <Spacer />
                      {post.post_user_id === userKey &&
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          variant='ghost'
                          colorScheme='gray'
                          aria-label='See menu'
                          icon={<BsThreeDotsVertical />}
                        />
                        <MenuList>
                          <MenuItem onClick={() => handleDeleteClick(post.post_id)} >Delete</MenuItem>
                        </MenuList>
                      </Menu>
                      }
                    </Stack>
                  </CardHeader>
                  <CardBody pt='0'>
                    <Text mb="5" fontSize='xl'>{post.post_desc}</Text>
                    { post.post_image_link !== "" && 
                    <PostImage post={post}></PostImage>
                    }
                  </CardBody>
                </Card>
              ))}
            </Stack>
          </Center>
        </GridItem>
        <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflowY="auto" borderLeft='1px' borderColor='gray.200'>
          <Flex minWidth='max-content' alignItems='center' gap='2' px='5' pt='7' >
            <Heading color='black' size='md'>Store</Heading>
            <Spacer />
            {isJoined === true && (
            <IconButton icon={<AddIcon />} size="sm" ref={btnRef} onClick={onListOpen} />
            )}
          </Flex>
          <Modal
            onClose={onListClose}
            finalFocusRef={btnRef}
            isOpen={isListOpen}
            scrollBehavior={"inside"}
            size="xl"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add Listing</ModalHeader>
              <ModalCloseButton onClick={handleRemoveAll} mt="2" mr="1" />
              <ModalBody>
                <form>
                  <FormControl>
                    <FormLabel>Product Title</FormLabel>
                    <Input onChange={(e) => setName(e.target.value)} maxLength={50} type='text' />
                  </FormControl>
                  <br />
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea onChange={(e) => setDesc(e.target.value)} maxLength={400} h="180" />
                  </FormControl>
                  <br />
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
                        <Button rightIcon={<BsCardImage />} width={100} height={100} cursor="pointer" as="span"></Button>
                      </label>
                    </Stack>
                  </FormControl>
                  <br />
                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <InputGroup>
                      <InputLeftAddon children='Rp.' />
                      <NumberInput onChange={(e) => setPrice(e)} min={100}>
                        <NumberInputField />
                      </NumberInput>
                    </InputGroup>
                  </FormControl>
                  <br />
                  <FormControl>
                    <FormLabel>Region</FormLabel>
                    <Stack spacing={8} direction='row'>
                      <Select id="province" placeholder="Select Province" onChange={(e) => changeProvince(e)}>
                        {provinceList.map((province, index) => (
                          <option key={index} value={JSON.stringify({ "id": province.id, "name": province.name })}>{province.name}</option>
                        ))}
                      </Select>
                      <Select id="city" placeholder="Select City" onChange={(e) => changeCity(e)}>
                        {cityList.map((city, index) => (
                          <option key={index} value={JSON.stringify({ "id": city.id, "name": city.name })}>{city.name}</option>
                        ))}
                      </Select>
                    </Stack>
                  </FormControl>
                </form>
              </ModalBody>
              <ModalFooter justifyContent="flex-start">
                <Stack id="progressImage" w="100%" display="none" direction='column' mr="4" spacing={1}>
                  <Text fontSize='sm'>Uploading Image {progress}/{selectedFiles.length}</Text>
                  <Progress w="100%" value={progress / selectedFiles.length * 100} size='xs' colorScheme='green' />
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
            <Input pl='10' type='tel' placeholder='Search' borderRadius='30' onKeyDown={handleSearchListing} />
          </InputGroup>
          <Modal isOpen={isDetailsListOpen} onClose={onDetailsListClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <ModalCloseButton onClick={handleRemoveAll} mt="2" mr="1" />
              </ModalHeader>


              <ModalBody>
                <Grid
                  h='700px'
                  templateRows='repeat(15, 1fr)'
                  templateColumns='repeat(6, 1fr)'
                  gap={2}
                >
                  <GridItem rowSpan={8} colSpan={6}>
                    <PostImage post={listingImage}></PostImage>
                  </GridItem>
                  <GridItem>

                  </GridItem>
                  <GridItem rowSpan={1} colSpan={6}>
                    <Flex justifyContent='center'>
                      <Center height='23px' width='500px' justifyContent='left'>
                        <Text fontSize='30px'>
                          <b>{listingName}</b>
                        </Text>
                      </Center>
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={6}>
                    <Flex justifyContent='center'>
                      <Center height='23px' width='500px' justifyContent='left'>
                        <Text fontSize='18px'>
                          <b>Rp{listingPrice}</b>
                        </Text>
                      </Center>
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={2} colSpan={6} borderBottom='2px' borderColor='gray.200'>
                    <Box box='1' height='auto' justifyItems='center' marginX='15px'>
                      <Text mb="5" fontSize='16px'>{listingDesc}
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
                          <b>{listingSellerName}</b>
                        </Text>
                      </Center>
                    </Flex>
                  </GridItem>
                  <GridItem rowSpan={1} colSpan={5} >
                    <Flex justifyContent='center'>
                      <Center height='23px' width='500px' justifyContent='left'>
                        <Text fontSize='18px'>
                          {listingRegion}
                        </Text>
                      </Center>
                    </Flex>
                  </GridItem>

                </Grid>


              </ModalBody>
              <ModalFooter>
                <Button onClick={onDetailsListClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isReadMoreOpen} onClose={onReadMoreClose} size="xl" closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{groupMethod.group_name}'s Description</ModalHeader>
              <ModalCloseButton onClick={handleRemoveAll} mt="2" mr="1" />
              <ModalBody>
                <Textarea rows="10">{fullDesc}</Textarea>

              </ModalBody>
              <ModalFooter>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {listingList.map((list, index) => (
            <Card overflow="hidden" height="145" m="5" borderRadius='15' className='listingCard' onClick={() => { setModalValue(list); onDetailsListOpen() }} cursor='pointer' key={index}>
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
                  <Stack alignItems="center" justifyContent="center">
                    <MainImage listingList={list}></MainImage>
                  </Stack>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </GridItem>
      </Grid>
    </main>
  )

}