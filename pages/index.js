

import styles from '../styles/Home.module.css'
import { Input , InputGroup, InputLeftElement ,Heading,Show, Grid, GridItem, Flex, Spacer, Center, Stack, Button, Drawer, DrawerContent, DrawerHeader, DrawerCloseButton, useDisclosure } from '@chakra-ui/react'
import { BiStore } from 'react-icons/bi'
import { HiViewList } from 'react-icons/hi'
import Navbar from '../components/navbar'
import Post from '../components/post'
import Listing from '../components/listing'
import { getFeeds, getStore, searchListingByName, likeByUser  } from '../helpers/group/api';
import { useEffect, useState, useContext } from 'react'
import { SearchIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'

import AuthenticationContext from '../context/AuthenticationContext'

//change this to home page using our navbar from components
export default function Home() {
  const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure()
  const { isOpen: isStoreOpen, onOpen: onStoreOpen, onClose: onStoreClose } = useDisclosure()
  const [feedList, setFeedList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const router = useRouter();
  const {accessToken} = useContext(AuthenticationContext);
  
  useEffect(() => {
    if (localStorage.getItem("accessToken") == null) {
      router.push("/login")
    } else {
    const fetchFeed = async () => {
      try {
        const response = await getFeeds(localStorage.getItem("accessToken"));
        setFeedList(response.response);
        console.log("Feed");
        console.log(response.response);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchStore = async () => {
      try {
        const response = await getStore(localStorage.getItem("accessToken"));
        setStoreList(response.response);
        console.log("Store");
        console.log(response.response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeed();
    fetchStore();
  }
  }, []);
  const [filterList, setFilterList] = useState("")


  useEffect(() => {
    if (!router.isReady) return;
    const searchList = async () => {
      if (filterList === "") {
      }
      else {
        const response = await searchListingByName(localStorage.getItem('accessToken'), filterList);
        setStoreList(response.response)
      }
    }
    searchList()
  }, [filterList])

  const handleSearchListing = (e) => {
    if (e.key === 'Enter') {
      setFilterList(e.target.value)
    }
  }

  const [likedPost, setlikedPost] = useState([]);
  let likedPush = []

  useEffect(() => {
    const postLiked = async () => {
        
      const result = await likeByUser(localStorage.getItem("accessToken"));

      for (let i in result['response']) {
        likedPush.push(result.response[i].like_post_id)
      }
      setlikedPost(likedPush)
    };

    postLiked();
  }, []);

  const listingTemplate = () => {
    return (  
      <div>
        <title>Home</title>
        <Flex minWidth='max-content' alignItems='center' gap='2' px='5' pt='7' >
          <Heading color='black' size='md'>Store</Heading>
          <Spacer />
        </Flex>
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
      <Flex p="3" borderBottom='1px' borderColor='gray.200' height="100" display={{ base: "block", xl: "none" }} >
        <Stack direction="row">
          <Button variant='ghost' onClick={onNavOpen}>
            <HiViewList />
          </Button>
          <Spacer />
          <Button variant='ghost' onClick={onStoreOpen} >
            <BiStore />
          </Button>
        </Stack>
      </Flex>
      <Drawer isOpen={isNavOpen} placement="left" onClose={onNavClose} >
        <DrawerContent>
          <Navbar />
        </DrawerContent>
      </Drawer>
      <Drawer isOpen={isStoreOpen} placement="right" size="sm" onClose={onStoreClose}>
        <DrawerContent overflow='scroll'>
          <DrawerHeader>
          {listingTemplate()}
          {storeList.map((list, index) => (
              <>
              {list.stock > 0 && (
                <Listing list={list} key={index} />
              )}
            </>
              ))}
        <DrawerCloseButton />
        </DrawerHeader>
        </DrawerContent>
      </Drawer>
      <Grid templateColumns={{ base: 'repeat(3, 1fr)', xl: 'repeat(5, 1fr)' }} gap={0} >
      <Show above='xl' >
        <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200' >
          <Navbar data-testid="navbar"/>
        </GridItem>
      </Show>
      <GridItem colSpan={3} mt='6'>
        <Center>
          <Stack direction='column' spacing={3} >
          <Heading color='black' size='md' mb='4'>Feeds</Heading>
          {feedList.map((post, index) => (
            <Post post={post} key={index} liked={likedPost.includes(post.post_id)}></Post>
          ))}
          </Stack>
        </Center>
        </GridItem>
        <Show above='xl'>
        <GridItem colSpan={1} backgroundColor='white' borderLeft='1px' borderColor='gray.200'>
        
        {listingTemplate()}
        {storeList.map((list, index) => (
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
