import { useState, useEffect } from 'react'
import { Flex, Image, Button, Box, Stack, Center, Avatar, Text, Spacer, Menu, MenuButton, MenuItem, MenuList, Grid, GridItem, Card, CardHeader, CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { BsThreeDotsVertical } from 'react-icons/bs'
import { storage } from '../firebaseConfig';
import { deletePost } from '../helpers/group/api';
import { useRouter } from 'next/router'
import moment from "moment"

const Post = ({ post, userKey = "", groupId = 0}) => {
    const [images, setImages] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();
    const handleClickPrev = () => {
        setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
    };
    const handleClickNext = () => {
        setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
    };

    const handleDeleteClick = async (postId, groupId) => {
        try {
            const response = await deletePost(localStorage.getItem("accessToken"), groupId, postId)
            response.then(router.reload())
        } catch (error) {
            console.error(error);
        }
    };

    async function getPhotoOnPost(url) {
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
        getPhotoOnPost(post.post_image_link).then((res) => {
            setImages(res)
        })
    }, [post])

    return <div>
        <Card w={{base: "400px", md:"550px", lg: "700px"}} borderRadius='15'>
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
                                <MenuItem onClick={() => handleDeleteClick(post.post_id, groupId)} >Delete</MenuItem>
                            </MenuList>
                        </Menu>
                    }
                </Stack>
            </CardHeader>
            <CardBody pt='0'>
                <Text mb="5" fontSize='xl'>{post.post_desc}</Text>
                {post.post_image_link !== "" &&
                    <Flex alignItems="center">
                        {images.length > 1 && (
                            <Button bg="transparent" leftIcon={<ArrowBackIcon cursor="pointer" />} onClick={handleClickPrev} ></Button>
                        )}
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
                        {images.length > 1 && (
                            <Button bg="transparent" rightIcon={<ArrowForwardIcon cursor="pointer" />} onClick={handleClickNext} ></Button>
                        )}
                    </Flex>
                }
            </CardBody>
        </Card>
    </div>
}

export default Post