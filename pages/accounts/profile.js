import { Flex, Text, Box, Image, Heading, Editable,
    EditableInput, EditableTextarea, EditablePreview,
    Input, useEditableControls, IconButton, EditIcon, 
    ButtonGroup, Spacer, Button,Grid, GridItem,
    Stack, FormControl, FormLabel, Badge, Divider, 
    Link, FormErrorMessage, useToast, Center, Avatar,
    Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, 
    MenuOptionGroup, MenuDivider, Modal, ModalOverlay, 
    ModalContent, ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, useDisclosure} from '@chakra-ui/react'
import { CheckIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useEffect, useState, useContext } from 'react'
import Navbar from '../../components/navbar'
import axios from "axios";
import { getUserProfile } from '../../helpers/profile/api';
import {useRouter} from 'next/router'
import React from 'react';

export default function Profile() {
const router = useRouter();
const [name, setUserName] = useState("");
const [nameError, setNameError] = useState("");
const [email, setUserEmail] = useState("");
const [emailError, setEmailError] = useState("");
const [phone, setUserPhone] = useState("");
const [phoneError, setPhoneError] = useState("");
const toast = useToast()
const baseUrl = "http://127.0.0.1:8000"


useEffect (() => {
    setUserProfile()
}, [])

async function setUserProfile() {
    try {
        const response = await getUserProfile(localStorage.getItem('accessToken'));
        setUserName(response.name);
        setUserEmail(response.user);
        setUserPhone(response.phone);
        } catch (error) {
          // handle the error
          console.error(error);
        }
    }

const handleNameChange = (e) => {
    setUserName(e.target.value);

    if (!/^[a-zA-Z ]+$/.test(e.target.value)) {
      setNameError("Full name must contain only letters");
    } else {
      setNameError("");
    }
  };

const handlePhoneChange = (e) => {
    setUserPhone(e.target.value);

    if (e.target.value.length < 10) {
        setPhoneError("Mobile number must be at least 10 digits");
    } else {
        setPhoneError("");
    }
};

// Modal Tambah Alamat
const { isOpen, onOpen, onClose } = useDisclosure()
const initialRef = React.useRef(null)
const finalRef = React.useRef(null)

//Make function to get all the input file and send it to the backend
const handleSubmit = async (e) => {
    e.preventDefault()
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }

    const body = {
        email,
        name,
        phone
    }
    try{
        //Async function to send data to backend
        const {data} = await axios.post(`${baseUrl}/authuser/edit-profile`, body, config) 
        await router.reload()
    } catch (error) {
        console.log(error)
    }
}


return (
    <div size={{ base: "100px", md: "200px", lg: "300px" }}>
    <Grid templateColumns='repeat(5, 1fr)' gap={0}>
        <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
        <Navbar />
        </GridItem>
        <GridItem colSpan={3} w='100%'>

            <Heading pl='5' pt='7' color= 'black' size='md'>Profile</Heading>
                <Box pr='5'>
                    <Stack direction='row' pl='5' pt='5'>
                    <Avatar size='2xl' name={name} />
                        <FormControl id="firstName" pl='5'>
                            <FormLabel>Full Name</FormLabel>
                            <Input focusBorderColor="brand.blue" onChange={handleNameChange} type="text" placeholder="Tim Timberlake" value={name}/>
                            <Stack direction='row' mt='3'>
                            <Badge mt='1' fontSize='0.8em' colorScheme='red'>
                                Not Verified
                            </Badge>
                            <Link color='teal.500' href='#' pl='2'>
                                <Text pt='7' as='u' fontSize='xs'>Verify Your ID</Text>
                            </Link>
                            </Stack>
                            
                        </FormControl>
                    </Stack>

                    <FormControl id="Email" pl='5' pt='5'>
                    <FormLabel>Email</FormLabel>
                    <Input focusBorderColor="brand.blue" type="text" value={email} isDisabled={true} />
                    </FormControl>
                <FormControl id="no_hp" pl='5' pt='5'>
                    <FormLabel>No. HP</FormLabel>
                    <Input focusBorderColor="brand.blue" onChange={handlePhoneChange} type='number' value={phone} />
                    <FormErrorMessage>{phoneError}</FormErrorMessage>
                </FormControl>
                <Stack direction='row' pl='5' pt='9'>
                    <Text pr='5' pt='1' as='b' fontSize='xl'>Alamat</Text>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            Rumah
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Kos</MenuItem>
                            <MenuItem>Toko</MenuItem>
                        </MenuList>
                    </Menu>
                    <Spacer />
                    <Button variant='ghost' colorScheme='blue' onClick={onOpen}>Tambah Alamat</Button>
                    <Modal
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <ModalOverlay />
                        <ModalContent>
                        <ModalHeader>Create new address</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl>
                            <FormLabel>Label address</FormLabel>
                            <Input ref={initialRef} placeholder='Input your label' />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>Jalan</FormLabel>
                            <Input placeholder='Input your street' />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>Provinsi</FormLabel>
                            <Input placeholder='Input your province' />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>Kota/Kabupaten</FormLabel>
                            <Input placeholder='Input your city/regency' />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>Kode Pos</FormLabel>
                            <Input placeholder='Input your pos code' />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3}
                                onClick={() =>
                                    toast({
                                      title: 'New address created.',
                                      description: "We've created your address for you.",
                                      status: 'success',
                                      duration: 9000,
                                      isClosable: true,
                                    })
                                  }
                            >
                            Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Stack>
                <Stack direction='row'>
                    <FormControl id="jalan" pl='5' pt='5' pb='5'>
                        <FormLabel>Jalan</FormLabel>
                        <Input focusBorderColor="brand.blue" type="text" placeholder="Jl. Kemayoran Baru Blok 5D" />
                    </FormControl>
                    <FormControl id="provinsi" pl='5' pt='5' pb='5'>
                        <FormLabel>Provinsi</FormLabel>
                        <Input focusBorderColor="brand.blue" type="text" placeholder="Jawa Barat" />
                    </FormControl>
                </Stack>

                <Stack direction='row'>
                    <FormControl id="kota_kabupaten" pl='5' pt='5' pb='5'>
                        <FormLabel>Kota/Kabupaten</FormLabel>
                        <Input focusBorderColor="brand.blue" type="text" placeholder="DKI Jakarta" />
                    </FormControl>
                    <FormControl id="kode_pos" pl='5' pt='5' pb='5'>
                        <FormLabel>Kode Pos</FormLabel>
                        <Input focusBorderColor="brand.blue" type="text" placeholder="16810" />
                    </FormControl>
                </Stack>
                
                <Button ml='5' colorScheme='blue' onClick={e =>{toast({
                        title: 'Profile Updated',
                        description: "Make sure you fill the right data",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                        });
                        handleSubmit(e);
                    }} >Update</Button>
                </Box>
        </GridItem>
        <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderLeft='1px' borderColor='gray.200'>
            <Text textAlign='center' pt='7' fontSize='xl'>Coming Soon</Text>
        </GridItem>
        </Grid>
    </div>
  )
}