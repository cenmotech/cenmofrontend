import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router'
import { ReactNode, useState, useContext, useRef, useEffect } from 'react'
import { set, useController } from "react-hook-form";
import AuthenticationContext from '../../context/AuthenticationContext'
import Navbar from '../../components/navbar'
import {
  Show, Drawer, DrawerHeader, DrawerContent, DrawerCloseButton, Hide, useToast, Textarea, Progress, Menu, MenuButton,
  MenuItem, MenuList, Image, InputLeftAddon, FormErrorMessage, Grid, Select, GridItem, Input, FormControl, FormLabel,
  InputGroup, InputLeftElement, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  ButtonGroup, Button, Flex, Card, CardHeader, Box, Heading, Avatar, Stack, Text, Center, CardBody, IconButton, CardFooter,
  Divider, Spacer, AspectRatio, position, useDisclosure, NumberInput, NumberInputField, FormHelperText, NumberIncrementStepper,
  NumberDecrementStepper, NumberInputStepper, Tag, TagLabel, TagCloseButton, HStack, Radio, RadioGroup
} from '@chakra-ui/react'
import { BsThreeDotsVertical, GrLinkPrevious, BsCardImage, BsList } from 'react-icons/bs'
import { GoSettings } from 'react-icons/go'
import { BiStore } from 'react-icons/bi'
import { HiViewList } from 'react-icons/hi'
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
import Post from '../../components/post';
import Listing from '../../components/listing';
import { setTag } from '@sentry/nextjs';


export default function Group() {
  // HANDLE ROUTER GROUP
  const [groupId, setGroupId] = useState(0)
  const [tagsUrl, setTagsUrl] = useState([])

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    setGroupId(router.query.group_id)
    setTagsUrl(router.query.tags)
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

  const { isOpen: isListOpen, onOpen: onListOpen, onClose: onListClose } = useDisclosure()
  const { isOpen: isPostOpen, onOpen: onPostOpen, onClose: onPostClose } = useDisclosure()
  const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure()
  const { isOpen: isStoreOpen, onOpen: onStoreOpen, onClose: onStoreClose } = useDisclosure()
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure()
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
        const response = await getPostOnGroup(localStorage.getItem('accessToken'), groupId, tagsUrl);
        setPostList(response.response)
      }
      else {
        const response = await searchPostOnGroup(localStorage.getItem('accessToken'), groupId, filter, tagsUrl);
        setPostList(response.response)
      }
    }
    searchPost()
  }, [filter, tagsUrl])


  async function getPostFromApi() {
    try {
      if (filter === '') {
        const response = await getPostOnGroup(localStorage.getItem('accessToken'), groupId, tagsUrl);
        setPostList(response.response)
      } else {
        const response = await searchPostOnGroup(localStorage.getItem('accessToken'), groupId, filter, tagsUrl);
        setPostList(response.response)
      }
    } catch (error) {
      // handle the error
      console.error(error);
    }
  }


  async function getUserFromApi() {
    try {
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
    setTags([]);
    onListClose();
    onPostClose();
    onFilterClose();
  };

  // HANDLE POST LISTING
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);


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
    if (selectedFiles.length !== 0 && name !== "" && desc !== "" && price !== "" && city !== null && province !== null && stock !== 0) {
      const x = document.getElementById("progressImage");
      x.style.display = "block"
      const image = await uploadImage("listing")
      uploadListingInfo(image).then((res) => { router.reload() })
    } else {
      toast({
        title: "Please Fill all the required form",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  };

  function uploadListingInfo(image) {
    const region = `${city.name},${province.name}`
    const group = groupId;
    const data = { name, price, desc, image, region, group, stock };
    return postCreateListing(data)
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
    if (postDesc == "") {
      toast({
        title: "Please Fill all the required form",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } else {
      var image = "";
      if (selectedFiles.length !== 0) {
        image = await uploadImage("post")
      }
      uploadPostInfo(image).then(() => { router.reload() })
    }
  };

  function sleep(ms) {
    console.log("sleep")
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function uploadPostInfo(image) {
    const group = groupId;
    const desc = postDesc;
    const data = { desc, image, group, tags };
    return postCreatePost(data)
  };

  async function postCreatePost(data) {
    try {
      const response = await createPost(localStorage.getItem("accessToken"), data)
      return response
    } catch (error) {
      console.error(error);
    }
  };

  const toast = useToast()
  async function join() {
    const id = groupId;
    const data = { id };
    groupJoined(data).then(() => { router.reload() })
  };

  async function groupJoined(data) {
    console.log("groupJoined")
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

  // HANDLE TAG INPUT
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" && inputValue) {
      setTags([...tags, inputValue]);
      setInputValue("");
    }
  };

  const handleTagDelete = (tagToDelete) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(newTags);
  };

  const filterPost = () => {
    if (tags.length === 0) {
      toast({
        title: "Please Fill at least one tag",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } else {
      onFilterClose()
      const joinedTags = tags.join(",");
      const encodedTags = tags.map(tag => encodeURIComponent(tag));
      const queryString = `tags=${encodedTags.join(",")}`;
      const urlPathname = `/group/${groupId}`;
      setTagsUrl(joinedTags)
      setTags([])
      router.push({
        pathname: urlPathname,
        query: queryString
      });
    }
  }

  const listingTemplate = () => {
    return (
      <div>
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
                <Flex>
                  <FormControl mr="8">
                    <FormLabel>Price</FormLabel>
                    <InputGroup>
                      <InputLeftAddon children='Rp.' />
                      <NumberInput onChange={(e) => setPrice(e)} min={100} >
                        <NumberInputField />
                      </NumberInput>
                    </InputGroup>
                  </FormControl>
                  <Spacer />
                  <FormControl>
                    <FormLabel>Stock</FormLabel>
                    <InputGroup>
                      <NumberInput onChange={(e) => setStock(e)} w="100%" min={1}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </InputGroup>

                  </FormControl>
                </Flex>
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
      </div>
    )
  }

  return (
    <main className={styles.container}>
      <title>{groupMethod.group_name} Group</title>
      <Flex p="3" borderBottom='1px' borderColor='gray.200' height={100} display={{ base: "block", xl: "none" }}>
        <Stack direction="row">
          <Button variant='ghost' onClick={onNavOpen}>
            <HiViewList />
          </Button>
          <Spacer />
          <Button variant='ghost' onClick={onStoreOpen}>
            <BiStore />
          </Button>
        </Stack>
      </Flex>
      <Drawer isOpen={isNavOpen} placement="left" onClose={onNavClose}>
        <DrawerContent>
          <Navbar />
        </DrawerContent>
      </Drawer>
      <Drawer isOpen={isStoreOpen} placement="right" size="sm" onClose={onStoreClose}>
        <DrawerContent overflow='scroll'>
          <DrawerHeader>
            <DrawerCloseButton />
          </DrawerHeader>
          {listingTemplate()}
          {listingList.map((list, index) => (
            <>
              {list.stock > 0 && (
                <Listing list={list} key={index} />
              )}
            </>
          ))}
        </DrawerContent>
      </Drawer>
      <Grid templateColumns={{ base: 'repeat(3, 1fr)', xl: 'repeat(5, 1fr)' }} gap={0}>
        <Show above='xl'>
          <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
            <Navbar />
          </GridItem>
        </Show>
        <GridItem colSpan={3}>
          <Center>
            <Stack direction='column' spacing={8} >
              <div style={{}}>
                <Card w={{ base: "400px", md: "550px", lg: "700px" }} h={[200]} mt="5" borderRadius='15'>
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
                                  join();
                                  toast({
                                    title: 'Success',
                                    description: "You have joined",
                                    status: 'success',
                                    duration: 9000,
                                    isClosable: true,
                                  });
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
                <Stack direction='row' spacing={2} pt='3'>
                  <InputGroup w={{ base: "300px", md: "450px", lg: "600px" }}>
                    <InputLeftElement
                      pointerEvents='none'
                      children={<SearchIcon color='gray.300' />}
                    />
                    <Input type='tel' placeholder='Search' borderRadius='30' onKeyDown={handleSearch} />
                  </InputGroup>
                  <Button rightIcon={<GoSettings />} w="90px" m="" onClick={onFilterOpen} colorScheme='blue' >
                    Filter
                  </Button>
                </Stack>

                <Modal isOpen={isFilterOpen} onClose={onFilterClose} isCentered closeOnOverlayClick={false}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Filter Post</ModalHeader>
                    <ModalCloseButton onClick={handleRemoveAll} mt="2" mr="1" />
                    <ModalBody>
                      <FormControl id="tag-form" maxW="100%">
                        <FormLabel>Tags</FormLabel>
                        <Input
                          placeholder="Type a tag & Press enter"
                          value={inputValue}
                          onChange={handleInputChange}
                          onKeyDown={handleInputKeyDown}
                          size='md'
                          mb={2}
                        />
                        <HStack flexWrap="wrap">
                          {tags.map((tag, index) => (
                            <Tag mb="5" key={index} size="md" variant="subtle" colorScheme="blue">
                              <TagLabel>{tag}</TagLabel>
                              <TagCloseButton onClick={() => handleTagDelete(tag)} />
                            </Tag>
                          ))}
                        </HStack>

                      </FormControl>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" onClick={filterPost}>
                        Filter
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>


                {isJoined === true && (
                  <Card w={{ base: "400px", md: "550px", lg: "700px" }} borderRadius='15' mt='10'>
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

                            <FormControl pt='5' id="tag-form" maxW="100%">
                              <FormLabel>Tags</FormLabel>
                              <Input
                                placeholder="Type a tag & Press enter"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                size='md'
                                mb={2}
                              />
                              <HStack flexWrap="wrap">
                                {tags.map((tag, index) => (
                                  <Tag key={index} size="md" variant="subtle" colorScheme="blue">
                                    <TagLabel>{tag}</TagLabel>
                                    <TagCloseButton onClick={() => handleTagDelete(tag)} />
                                  </Tag>
                                ))}
                              </HStack>

                            </FormControl>
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
                <Post post={post} userKey={userKey} groupId={groupId} key={index}></Post>
              ))}
            </Stack>
          </Center>
        </GridItem>
        <Show above='xl'>
          <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflowY="auto" borderLeft='1px' borderColor='gray.200'>
            {listingTemplate()}
            {listingList.map((list, index) => (
              <>
                {list.stock > 0 && (
                  <Listing list={list} key={index} />
                )}
              </>
            ))}
          </GridItem>
        </Show>
      </Grid>
    </main>
  )

}