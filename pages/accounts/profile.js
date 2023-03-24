import { Flex, Text, Box, Image, Heading, Editable,
    EditableInput, EditableTextarea, EditablePreview,
    Input, useEditableControls, IconButton, EditIcon, 
    ButtonGroup, Spacer, Button,Grid, GridItem,
    Stack, FormControl, FormLabel, Badge, Divider, Link, FormErrorMessage, useToast, Center, Avatar} from '@chakra-ui/react'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { useEffect, useState, useContext } from 'react'
import Navbar from '../../components/navbar'
import axios from "axios";
import { getUserProfile } from '../../helpers/profile/api';
import {useRouter} from 'next/router'

export default function Profile() {
const router = useRouter();
const [name, setUserName] = useState("");
const [nameError, setNameError] = useState("");
const [email, setUserEmail] = useState("");
const [emailError, setEmailError] = useState("");
const [phone, setUserPhone] = useState("");
const [phoneError, setPhoneError] = useState("");
const toast = useToast()
const baseUrl = "https://cenmo-staging.herokuapp.com"


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
                <Stack direction='row' pl='5' pt='7'>
                    <Heading as='h4' size='md'>
                        Alamat (Utama)
                    </Heading>
                    <Spacer />
                    <Button variant='ghost' colorScheme='blue'>Tambah Alamat</Button>
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