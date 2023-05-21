import {
    Flex, Text, Box, Image, Heading, Editable,
    EditableInput, EditableTextarea, EditablePreview,
    Input, useEditableControls, IconButton, EditIcon,
    ButtonGroup, Spacer, Button, Grid, GridItem,
    Stack, FormControl, FormLabel, Badge, Divider,
    Link, FormErrorMessage, useToast, Center, Avatar,
    Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup,
    MenuOptionGroup, MenuDivider, Modal, ModalOverlay, InputRightElement,
    ModalContent, ModalHeader, ModalFooter, ModalBody, Select, InputGroup,
    ModalCloseButton, useDisclosure, Card, CardHeader, CardBody, CardFooter, StackDivider,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
} from '@chakra-ui/react'
import { CheckIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useEffect, useState, useContext } from 'react'
import Navbar from '../../components/navbar'
import axios from "axios";
import { getUserProfile, addAddress, setMainAddress } from '../../helpers/profile/api';
import { useRouter } from 'next/router'
import React from 'react';

export default function Profile() {
    const router = useRouter();
    const [name, setUserName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setUserEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phone, setUserPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [address, setUserAddress] = useState("");
    const [addressError, setAddressError] = useState("");
    const [city, setUserCity] = useState("");
    const [cityError, setCityError] = useState("");
    const [province, setUserProvince] = useState("");
    const [provinceError, setProvinceError] = useState("");
    const [postalCode, setUserPostalCode] = useState("");
    const [postalCodeError, setPostalCodeError] = useState("");
    const [street, setUserStreet] = useState("");
    const [addressList, setAddressList] = useState([]);
    const [balance, setUserBalance] = useState(0);
    const toast = useToast()
    const baseUrl = `${process.env.NEXT_PUBLIC_BE_URL}`

    const [addressId, setAddressId] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setUserProfile()
    }, [])

    async function setUserProfile() {
        try {
            const response = await getUserProfile(localStorage.getItem('accessToken'));
            setUserName(response.name);
            setUserEmail(response.email);
            setUserPhone(response.phone);
            setUserBalance(response.balance);
            setUserStreet(response.address_main.street);
            setUserCity(response.address_main.city);
            setUserProvince(response.address_main.province);
            setUserPostalCode(response.address_main.zip_code);
            setUserAddress(response.address_main.address_name);
            setAddressList(response.address_list);
            console.log(response.res);
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
        try {
            //Async function to send data to backend
            const { data } = await axios.post(`${baseUrl}/authuser/edit-profile`, body, config)
            await router.reload()
        } catch (error) {
            console.log(error)
        }
    }

    const [dataNewAddress, setNewAddress] = useState({
        address_name: "",
        street: "",
        city: "",
        province: "",
        zip_code: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAddress((prevData) => ({ ...prevData, [name]: value }));
        console.log(dataNewAddress)
    };

    const handleNewAddress = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await addAddress(localStorage.getItem('accessToken'), dataNewAddress);
            setIsSuccess(true);
        }
        catch (error) {
            console.log(error)
        }
        router.reload()
    };

    const handleMainAddress = async (e) => {
        e.preventDefault()
        try {
            const response = await setMainAddress(localStorage.getItem('accessToken'), addressId)
            await router.reload()
        }
        catch (error) {
            console.log(error)
        }
    }

    const { isOpen: isOpenCreateBank, onOpen: onOpenCreateBank, onClose: onCloseCreateBank } = useDisclosure()

    const handleCheckBank = () => {

    }

    return (
        <div size={{ base: "100px", md: "200px", lg: "300px" }}>
            <Grid templateColumns='repeat(5, 1fr)' gap={0}>
                <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
                    <Navbar />
                </GridItem>
                <GridItem colSpan={3} w='100%'>

                    <Heading pl='5' pt='7' color='black' size='md'>Profile</Heading>
                    <Box pr='5'>
                        <Stack direction='row' pl='5' pt='5'>
                            <Avatar size='2xl' name={name} />
                            <FormControl id="firstName" pl='5'>
                                <FormLabel>Full Name</FormLabel>
                                <Input focusBorderColor="brand.blue" onChange={handleNameChange} type="text" placeholder="Full Name" value={name} />
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
                            <Input focusBorderColor="brand.blue" type="text" isDisabled={true} value={email} />
                        </FormControl>
                        <FormControl id="no_hp" pl='5' pt='5'>
                            <FormLabel>No. HP</FormLabel>
                            <Input focusBorderColor="brand.blue" onChange={handlePhoneChange} type='number' value={phone} />
                            <FormErrorMessage>{phoneError}</FormErrorMessage>
                        </FormControl>
                        <Button ml='5' mt='5' colorScheme='blue' onClick={e => {
                            toast({
                                title: 'Profile Updated',
                                description: "Make sure you fill the right data",
                                status: 'success',
                                duration: 9000,
                                isClosable: true,
                            });
                            handleSubmit(e);
                        }} >Update</Button>
                        <Stack direction='row' pl='5' pt='9'>
                            <Text pr='5' pt='1' as='b' fontSize='xl'>Alamat</Text>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                    {address}
                                </MenuButton>
                                <MenuList>
                                    {addressList.map((address) => {
                                        return (
                                            <MenuItem key={address.id} onClick={() => {
                                                setAddressId(address.id);
                                                setUserAddress(address.address_name);
                                                setUserCity(address.city);
                                                setUserProvince(address.province);
                                                setUserPostalCode(address.zip_code);
                                                setUserStreet(address.street);
                                            }}>
                                                {address.address_name}
                                            </MenuItem>
                                        )
                                    }
                                    )}
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
                                        <form onSubmit={handleNewAddress}>
                                            <FormControl>
                                                <FormLabel>Label address</FormLabel>
                                                <Input ref={initialRef} type='text' name="address_name" value={dataNewAddress.address_name} onChange={handleInputChange} placeholder='Input your label' />
                                            </FormControl>

                                            <FormControl mt={4}>
                                                <FormLabel>Jalan</FormLabel>
                                                <Input type='text' name="street" value={dataNewAddress.street} onChange={handleInputChange} placeholder='Input your street' />
                                            </FormControl>

                                            <FormControl mt={4}>
                                                <FormLabel>Provinsi</FormLabel>
                                                <Input type='text' name="province" value={dataNewAddress.province} onChange={handleInputChange} placeholder='Input your province' />
                                            </FormControl>

                                            <FormControl mt={4}>
                                                <FormLabel>Kota/Kabupaten</FormLabel>
                                                <Input type='text' name="city" value={dataNewAddress.city} onChange={handleInputChange} placeholder='Input your city/regency' />
                                            </FormControl>

                                            <FormControl mt={4}>
                                                <FormLabel>Kode Pos</FormLabel>
                                                <Input type='text' name="zip_code" value={dataNewAddress.zip_code} onChange={handleInputChange} placeholder='Input your pos code' />
                                            </FormControl>
                                            <ModalFooter>
                                                <Button type='submit' colorScheme='blue' mr={3}
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
                                        </form>
                                    </ModalBody>
                                </ModalContent>
                            </Modal>
                        </Stack>
                        <Stack direction='row'>
                            <FormControl id="jalan" pl='5' pt='5' pb='5'>
                                <FormLabel>Jalan</FormLabel>
                                <Input focusBorderColor="brand.blue" type="text" placeholder="Jl. Kemayoran Baru Blok 5D" value={street} />
                            </FormControl>
                            <FormControl id="provinsi" pl='5' pt='5' pb='5'>
                                <FormLabel>Provinsi</FormLabel>
                                <Input focusBorderColor="brand.blue" type="text" placeholder="Jawa Barat" value={province} />
                            </FormControl>
                        </Stack>

                        <Stack direction='row'>
                            <FormControl id="kota_kabupaten" pl='5' pt='5' pb='5'>
                                <FormLabel>Kota/Kabupaten</FormLabel>
                                <Input focusBorderColor="brand.blue" type="text" placeholder="DKI Jakarta" value={city} />
                            </FormControl>
                            <FormControl id="kode_pos" pl='5' pt='5' pb='5'>
                                <FormLabel>Kode Pos</FormLabel>
                                <Input focusBorderColor="brand.blue" type="text" placeholder="16810" value={postalCode} />
                            </FormControl>
                        </Stack>

                        <Button ml='5' colorScheme='blue' onClick={e => {
                            toast({
                                title: 'Set Address Updated',
                                description: "This is your main address",
                                status: 'success',
                                duration: 9000,
                                isClosable: true,
                            });
                            handleMainAddress(e);
                        }} >Set as Main Address</Button>
                    </Box>
                </GridItem>
                <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderLeft='1px' borderColor='gray.200'>
                    <Heading pl='2' pt='7' color='black' size='md'>Balance</Heading>
                    <Stack m="2" divider={<StackDivider />} spacing='4'>
                        {/* <Text fontSize='xl' pl='3' pt='2'>Rp {balance.toLocaleString('id-ID')}</Text> */}
                        <Text fontSize='xl' pl='3' pt='2'>Rp XXXXXX</Text>
                        <div>
                            <Heading color='black' size='md'>Withdrawal</Heading>
                            <Stack pt="2" direction='row'>
                                <Select placeholder='Select Bank Account' pl='3' />
                                <Button mt="2" onClick={onOpenCreateBank}>+</Button>
                                <Modal isOpen={isOpenCreateBank} onClose={onCloseCreateBank}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Add New Bank Account</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <Select placeholder='Select Bank'>
                                                <option value='option1'>Option 1</option>
                                            </Select>
                                            <InputGroup mt="3">
                                                <Input placeholder='Input Account Number' />
                                                <InputRightElement width='4.5rem'>
                                                    <Button h='1.75rem' size='sm' onClick={handleCheckBank}>
                                                        Check
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                        </ModalBody>

                                        <ModalFooter>
                                            <Button colorScheme='blue' onClick={onClose}>
                                                Add
                                            </Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </Stack>
                            <Text mt="3" pl="3">Amount:</Text>
                            <NumberInput mt="1" pl='3' min={10000}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Stack mt="3" direction='row'>
                                <Spacer />
                                <Button>
                                    Withdraw
                                </Button>
                            </Stack>
                        </div>
                        <div>
                            <Heading pl='2' color='black' size='md'>History</Heading>
                            <Stack m="2" divider={<StackDivider />} spacing='2'>
                                <Card>
                                    <CardHeader py="0" pt="4">
                                        <Heading size='sm'>ID: XXXXX</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Stack divider={<StackDivider />}>
                                            <Box>
                                                <Text pt='2' fontSize='sm'>
                                                    Amount: Rp.20.0000
                                                </Text>
                                                <Text pt='2' fontSize='sm'>
                                                    Status: Success
                                                </Text>
                                            </Box>
                                        </Stack>
                                    </CardBody>
                                </Card>
                            </Stack>
                        </div>
                    </Stack>
                </GridItem>
            </Grid>
        </div>
    )
}