import {
    useToast, Grid, GridItem, Heading, Box, Text, Stack, Divider, Button, Avatar, Center
} from "@chakra-ui/react";
import Navbar from '../../components/navbar'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage, db } from '../../firebaseConfig';
import { getListingbyId, getAllListingFromSeller } from '../../helpers/group/api';
import MultiImage from "../../components/multiImage";
import Listing from "../../components/listing";
import { updateToCart } from '../../helpers/shopcart/api';
import { collection, addDoc } from "@firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';

export default function Product() {
    const [listingId, setListingId] = useState(0);
    const [sellerEmail, setSellerEmail] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const router = useRouter();
    useEffect(() => {
        setUserEmail(sessionStorage.getItem('userEmail'))
        if (!router.isReady) return;
        setListingId(router.query.listing_id)
    }, [router.isReady, router.query.listing_id]);

    useEffect(() => {
        if (!router.isReady) return;
        const fetchListingInfo = async () => {
            if (listingId !== 0) {
                console.log("fetching")
                getDetailListing().then((res) => {
                    getSellerListing(res.goods_seller__email, listingId).then((res2) => {
                        console.log(otherListing)
                    })
                })
            }
        }
        fetchListingInfo()
    }, [listingId])

    const [listing, setListing] = useState([]);
    const [otherListing, setOtherListing] = useState([]);

    async function getDetailListing() {
        try {
            const response = await getListingbyId(listingId);
            setListing(response.response);
            setSellerEmail(response.response.goods_seller__email);
            return response.response
        } catch (error) {
            console.error(error);
        }
    }

    async function getSellerListing(email, id) {
        try {
            const response = await getAllListingFromSeller(email, id);
            setOtherListing(response.response);
        } catch (error) {
            console.error(error);
        }
    }

    const [images, setImages] = useState([])

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
        getPhotoOnListing(listing.goods_image_link).then((res) => {
            setImages(res)
        })
    }, [listing])

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
    const redirect = (id) => {
        router.push(`/chat/${id}`);
    }
    const chatExists = email => chats?.find(chat => (chat.users.includes(userEmail) && chat.users.includes(email)))

    const [snapshot] = useCollection(collection(db, "chats"));
    const chats = snapshot?.docs.map(doc => ({id: doc.id, ...doc.data()}));
    
    const handleChat = async () => {
        if (!chatExists(sellerEmail)) {
            const docRef = await addDoc(collection(db, "chats"), {users: [userEmail, sellerEmail] })
            redirect(docRef.id)
          }else{
            const getID = chats?.filter(chat => (chat.users.includes(userEmail) && chat.users.includes(sellerEmail)))
            redirect(getID[0].id)

          }
    }
    return (
        <>
            <title>Product</title>
            <Grid templateColumns='repeat(5, 1fr)'>
                <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
                    <Navbar />
                </GridItem>
                <GridItem colSpan={3}>
                    <Center>
                        <Box w={{ base: "400px", md: "550px", lg: "700px" }}>
                            <Heading pl={{ base: '3', md: '5' }} pt={{ base: '5', md: '7' }} color='black' size='md'>Detail Product</Heading>
                            <Stack direction='row'>
                                <MultiImage image_url={listing.goods_image_link} />
                                <Stack direction='column' pl='5' pt='2'>
                                    <Text fontSize='2xl' as='b'>{listing.goods_name}</Text>
                                    <Text fontSize='xl' as='b'>Rp {(listing.goods_price)}</Text>
                                    <Stack direction='row' pt='3'>
                                        <Button onClick={e => cartHandler2(e, listing.goods_id)} colorScheme='teal'>Add to Basket</Button>
                                        <Button ml='5' colorScheme='blue' onClick={handleChat}>Chat</Button>
                                    </Stack>
                                    <Text fontSize='lg' as='b' pt='5'>Product Description</Text>
                                    <Text fontSize='lg'>{listing.goods_description}</Text>
                                </Stack>
                            </Stack>

                        </Box>
                    </Center>
                </GridItem>
                <GridItem colSpan={1} backgroundColor='white'>
                    <Stack direction='column' pt='7'>
                        <Stack ml='5' mr='5'>
                        <Text as='b' fontSize='xl' mb='5'>Seller</Text>
                            <Stack direction='row'>
                                <Avatar size='md' name='Ryan Florence' src='https://bit.ly/ryan-florence' />
                                <Stack direction='column'>
                                    <Text as='b'>{listing.goods_seller__name}</Text>
                                    <Text >{listing.goods_region}</Text>
                                </Stack>
                            </Stack>
                            <br></br>
                            <Divider />
                            <br></br>
                            <Text as='b'>Product Recommendations from Seller</Text>
                        </Stack>
                        <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflowY="auto">
                            {otherListing.map((list, index) => (
                                <Listing list={list} key={index} />
                            ))}
                        </GridItem>
                        
                    </Stack>
                </GridItem>
            </Grid>
        </>
    )
}