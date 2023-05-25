import { useState, useEffect } from 'react'
import { Flex,Icon, Image, Button, Box, Stack, Center, Input, Avatar, Text, Textarea, Spacer, Tag, TagLabel, TagCloseButton, Menu, MenuButton, MenuItem, MenuList, Grid, GridItem, Card, CardHeader, CardFooter, CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, IconButton, InputRightElement, FormControl, FormLabel, InputGroup  } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { BsThreeDotsVertical, BsSend } from 'react-icons/bs'
import { storage } from '../firebaseConfig';
import { deletePost, like, getComment, comment } from '../helpers/group/api';
import { useRouter } from 'next/router'
import moment from "moment"
import { FaHeart, FaComment } from 'react-icons/fa';
import React from 'react';
import axios from "axios";


const Post = ({ post, userKey = "", groupId = 0, liked}) => {
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

    const [likes, setLikes] = useState(post.post_likes);
    const [isLiked, setIsLiked] = useState(liked);
  
    const handleLikeClick = async () => {
        try {
            if (isLiked){
                setLikes(likes-1);
            }else{
                setLikes(likes+1);
            }
            setIsLiked(!isLiked);
            const response = await like(post.post_id);
            
          } catch (error) {
            console.error(error);
        }
        
    };

    const [isOpen, setIsOpen] = useState(false);
    const [modalRefresh, setModalRefresh] = useState(0);
    const [scrollBehavior, setScrollBehavior] = React.useState('inside')
    const [comment_text, setComment] = useState('');

    const handleOpen = () => {
        setIsOpen(true);
        
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleComment = async () => {
        const komenData =  {comment_text}
        try {

            const response = await comment(post.post_id, komenData);
            console.log(response)
            setComment('');
            postComment();
            setModalRefresh((prevKey) => prevKey + 1);
            
          } catch (error) {
            console.error(error);
        }
        
        
    };


    const [commentPost, setCommentPost] = useState([]);

    useEffect(() => {
        postComment();
    }, []);

    const postComment = async () => {
        const result = await getComment(localStorage.getItem("accessToken"), post.post_id);
        setCommentPost(result.response)
    };

    return <div>
        <Card w={{ base: "400px", md: "550px", lg: "700px" }} borderRadius='15'>
            <CardHeader>
                <Stack direction='row'>
                    <Avatar size='md' name={post.post_user__name} />
                    <Stack spacing={0} direction='column'>
                        <Text fontSize="xl">{post.post_user__name}</Text>
                        <Text fontSize="xs" mt="0">Posted on {moment(post.post_date).format("MMMM Do YYYY, h:mm:ss a")}</Text>
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
            <CardBody pt='0' >
                {post.tags[0] !== null && (
                    <>
                        {post.tags.map((tag, index) => (
                            <Tag key={index} size="sm" mr="2" variant="subtle" colorScheme="blue">
                                <TagLabel>{tag}</TagLabel>
                            </Tag>
                        ))}
                    </>
                )}
                <Text mt="3" fontSize='lg'>{post.post_desc}</Text>
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
                            })}
                        </Box>
                        {images.length > 1 && (
                            <Button bg="transparent" rightIcon={<ArrowForwardIcon cursor="pointer" />} onClick={handleClickNext} ></Button>
                        )}
                    </Flex>
                }
            </CardBody>
            <CardFooter
                justify='space-between'
                flexWrap='wrap'
                sx={{
                '& > button': {
                    minW: '136px',
                },
                }}
            >
                <Button flex='1' variant='ghost' leftIcon={<Icon as={FaHeart} color={isLiked ? 'red.500' : 'gray.500'} />
                }
                onClick={handleLikeClick}
                >
                {likes}
                </Button>
                <Button flex='1' variant='ghost' leftIcon={<FaComment />} onClick={handleOpen}>
                Comment
                </Button>

                <Modal isOpen={isOpen} onClose={handleClose} size={'xl'} scrollBehavior={scrollBehavior} key={modalRefresh}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Komentar</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody overflow="hidden">
                        
                        <Stack maxHeight="500px" overflowY="auto" overflowX="hidden">
                            {commentPost.map((komen, index) => (
                            <Box key={index}>
                                <Text as='b' textAlign="left">{komen.user_username}</Text>
                                <Text textAlign="justify">{komen.comment_text}</Text>
                            </Box>
                            ))}
                        </Stack>
                        
                        <InputGroup display="flex" alignItems="center" position="sticky" bottom="0" bg="white" mt="5" >
                            <Input
                                onChange={(e) => setComment(e.target.value)}
                                as="textarea"
                                placeholder="Write a Comment..."
                                value={comment_text}
                                h="100"
                                resize='none'
                                mb='5'
                                
                            />
                            <InputRightElement width="4.5rem" display="flex" justifyContent="center" alignItems="center" mt="7">
                                {comment_text !== '' ? (
                                <BsSend cursor="pointer" onClick={handleComment} />
                                ) : (
                                <BsSend cursor="not-allowed" />
                                )}
                            </InputRightElement>
                        </InputGroup>
                        
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </CardFooter>
        </Card>
    </div>
}

export default Post