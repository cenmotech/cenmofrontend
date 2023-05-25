import {
    Text, Box, Heading, Input, Spacer, Button, Grid, 
    GridItem, Stack, FormControl, FormLabel, Badge,
    Link, FormErrorMessage, useToast, Avatar, Menu, 
    MenuButton, MenuList, MenuItem, Modal, ModalOverlay, InputRightElement,
    ModalContent, ModalHeader, ModalFooter, ModalBody, Select, InputGroup,
    ModalCloseButton, useDisclosure, Card, CardBody, StackDivider,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import React, { useEffect, useState} from 'react'
import Navbar from '../../components/navbar'
import axios from "axios";
import { getUserProfile, addAddress, setMainAddress } from '../../helpers/profile/api';
import { getBankList, getUserBankAccount, validateBank, addBankAccount, withdrawToBank, getWithdrawalHistory } from '../../helpers/transaction/api';
import { useRouter } from 'next/router'
import moment from "moment"

export default function Profile() {
    const router = useRouter();
    const [name, setUserName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setUserEmail] = useState("");
    const [phone, setUserPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [address, setUserAddress] = useState("");
    const [city, setUserCity] = useState("");
    const [province, setUserProvince] = useState("");
    const [postalCode, setUserPostalCode] = useState("");
    const [street, setUserStreet] = useState("");
    const [addressList, setAddressList] = useState([]);
    const [balance, setUserBalance] = useState(0);
    const toast = useToast()
    const baseUrl = `${process.env.NEXT_PUBLIC_BE_URL}`
    const [addressId, setAddressId] = useState("");

    useEffect(() => {
        setUserProfile()
        setListOfBank()
        setUserBankAccount()
        setUserWithdrawalHistory()
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

    const [bankList, setBankList] = useState([]);
    const [userBankList, setUserBankList] = useState([]);
    const [withdrawalHistory, setWithdrawalHistory] = useState([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [typedAccountNumber, setTypedAccountNumber] = useState("");
    const [verifiedBank, setVerifiedBank] = useState({});
    const [showAddButton, setShowAddButton] = useState("none");


    async function setListOfBank() {
        try {
            const response = await getBankList();
            setBankList(response.response.beneficiary_banks);
        } catch (error) {
            console.error(error);
        }
    }

    async function setUserBankAccount() {
        try {
            const response = await getUserBankAccount();
            setUserBankList(response.response)
            console.log(userBankList)
        } catch (error) {
            console.error(error);
        }
    }

    async function setUserWithdrawalHistory() {
        try {
            const response = await getWithdrawalHistory();
            setWithdrawalHistory(response.response)
            console.log(withdrawalHistory)
        } catch (error) {
            console.error(error);
        }
    }

    async function handleCheckBank() {
        if (selectedBank === "" || typedAccountNumber === "") {
            setShowAddButton("none")
            toast({
                title: "Please fill all fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            try {
                const response = await validateBank(selectedBank, typedAccountNumber);
                if (response != null) {
                    setVerifiedBank(response.data.response)
                    setShowAddButton("block")
                } else {
                    setShowAddButton("none")
                    toast({
                        title: "The account is not valid",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function saveBankAccount() {
        if (Object.keys(verifiedBank).length !== 0) {
            try {
                const response = await addBankAccount(verifiedBank);
                console.log(response)
                if (response != null) {
                    onCloseCreateBank()
                    router.reload()
                } else {
                    toast({
                        title: "Bank Account Already Exist",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            toast({
                title: "Please fill bank details",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    const [withdrawalAmount, setWithdrawalAmount] = useState(0);
    const [withdrawalBank, setWithdrawalBank] = useState("");
    const [amountValid, setAmountValid] = useState(true);

    const handleAmount = (amount) => {
        amount = parseInt(amount);
        setWithdrawalAmount(amount);
        if (amount > balance || amount < 10000 || amount == NaN) {
            console.log("masuk sini")
            setAmountValid(false);
        } else {
            setAmountValid(true);
        }
    }

    async function withdraw() {
        console.log(withdrawalAmount, withdrawalBank)
        if (withdrawalAmount < 10000 || withdrawalAmount > balance || withdrawalAmount == NaN || withdrawalBank === "") {
            toast({
                title: "Please fill all fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            try {
                await withdrawToBank(withdrawalBank, withdrawalAmount);
                router.reload()
            } catch (error) {
                console.error(error);
            }
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
            await axios.post(`${baseUrl}/authuser/edit-profile`, body, config)
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
        try {
            await addAddress(localStorage.getItem('accessToken'), dataNewAddress);
        }
        catch (error) {
            console.log(error)
        }
        router.reload()
    };

    const handleMainAddress = async (e) => {
        e.preventDefault()
        try {
            await setMainAddress(localStorage.getItem('accessToken'), addressId)
            await router.reload()
        }
        catch (error) {
            console.log(error)
        }
    }

    const { isOpen: isOpenCreateBank, onOpen: onOpenCreateBank, onClose: onCloseCreateBank } = useDisclosure()

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
                                <Input focusBorderColor="brand.blue" onChange={handleNameChange} type="text" placeholder="Full Name" value={name} backgroundColor='white'/>
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
                            <Input focusBorderColor="brand.blue" type="text" isDisabled={true} value={email} backgroundColor='white'/>
                        </FormControl>
                        <FormControl id="no_hp" pl='5' pt='5'>
                            <FormLabel>No. HP</FormLabel>
                            <Input focusBorderColor="brand.blue" onChange={handlePhoneChange} type='number' value={phone} backgroundColor='white'/>
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
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
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
                                                <Input ref={initialRef} type='text' name="address_name" value={dataNewAddress.address_name} onChange={handleInputChange} placeholder='Input your label'/>
                                            </FormControl>

                                            <FormControl mt={4}>
                                                <FormLabel>Jalan</FormLabel>
                                                <Input type='text' name="street" value={dataNewAddress.street} onChange={handleInputChange} placeholder='Input your street' backgroundColor='white'/>
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
                                <Input focusBorderColor="brand.blue" type="text" placeholder="Jl. Kemayoran Baru Blok 5D" value={street} backgroundColor='white'/>
                            </FormControl>
                            <FormControl id="provinsi" pl='5' pt='5' pb='5'>
                                <FormLabel>Provinsi</FormLabel>
                                <Input focusBorderColor="brand.blue" type="text" placeholder="Jawa Barat" value={province} backgroundColor='white'/>
                            </FormControl>
                        </Stack>

                        <Stack direction='row'>
                            <FormControl id="kota_kabupaten" pl='5' pt='5' pb='5'>
                                <FormLabel>Kota/Kabupaten</FormLabel>
                                <Input focusBorderColor="brand.blue" type="text" placeholder="DKI Jakarta" value={city} backgroundColor='white'/>
                            </FormControl>
                            <FormControl id="kode_pos" pl='5' pt='5' pb='5'>
                                <FormLabel>Kode Pos</FormLabel>
                                <Input focusBorderColor="brand.blue" type="text" placeholder="16810" value={postalCode} backgroundColor='white'/>
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
                    <Stack m="4" h='100vh' display="flex" flexDirection="column" divider={<StackDivider />} spacing='4'>
                        <Card >
                            <CardBody>
                                <Heading color='black' size='md'>Balance</Heading>
                                <Text fontSize='xl' pt='2'>Rp {balance.toLocaleString('id-ID')}</Text>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <Heading color='black' size='md'>Withdrawal</Heading>
                                <Stack pt="4" direction='row'>
                                    <Select placeholder='Select Bank Account' onChange={(e) => setWithdrawalBank(e.target.value)}>
                                        {userBankList.map((bank, index) => (
                                            <option key={index} value={bank.id}>{bank.bank_name} - {bank.account_name}</option>
                                        ))}
                                    </Select>
                                    <Button mt="2" onClick={onOpenCreateBank}>+</Button>
                                    <Modal isOpen={isOpenCreateBank} onClose={onCloseCreateBank} closeOnOverlayClick={false}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Add New Bank Account</ModalHeader>
                                            <ModalCloseButton onClick={() => { setVerifiedBank({}); setShowAddButton("none") }} />
                                            <ModalBody>
                                                <Select placeholder='Select Bank' onChange={(e) => setSelectedBank(e.target.value)}>
                                                    {bankList.map((bank, index) => (
                                                        <option key={index} value={bank.code}>{bank.name}</option>
                                                    ))}
                                                </Select>
                                                <InputGroup mt="3">
                                                    <Input type="number" onChange={(e) => setTypedAccountNumber(e.target.value)} placeholder='Input Account Number' />
                                                    <InputRightElement width='4.5rem'>
                                                        <Button h='1.75rem' size='sm' onClick={handleCheckBank}>
                                                            Check
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                                {Object.keys(verifiedBank).length !== 0 && (
                                                    <Text mt="3">{verifiedBank.bank_name} - {verifiedBank.account_name}</Text>
                                                )}
                                            </ModalBody>

                                            <ModalFooter>
                                                <Button display={showAddButton} colorScheme='blue' onClick={saveBankAccount}>
                                                    Add
                                                </Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </Stack>
                                <Text mt="3">Amount:</Text>
                                <FormControl isInvalid={!amountValid}>
                                    <Input placeholder="Minimum Rp10.000" onChange={(e) => handleAmount(e.target.value)} mt="1" />
                                    {!amountValid && (
                                        <FormErrorMessage>
                                            Enter minimum Rp10.000 and maximum Rp{balance.toLocaleString('id-ID')}
                                        </FormErrorMessage>
                                    )}
                                </FormControl>
                                <Stack mt="4" direction='row'>
                                    <Spacer />
                                    <Button onClick={withdraw}>
                                        Withdraw
                                    </Button>
                                </Stack>
                            </CardBody>
                        </Card>
                        <Card mb="8" overflowY="auto">
                            <CardBody>
                                <Heading color='black' size='md'>History</Heading>
                                <Stack mt="4" divider={<StackDivider />} spacing='2'>
                                    {withdrawalHistory.map((history, index) => (
                                    <Stack>
                                        <Box>
                                            <Heading size='sm'>ID: {history.id}</Heading>
                                            <Text fontSize='sm'>
                                                Date: {moment(history.date).format("MMMM Do YYYY, h:mm:ss a")}
                                            </Text>
                                            <Text fontSize='sm'>
                                                Amount: Rp {parseInt(history.amount).toLocaleString('id-ID')}
                                            </Text>
                                            <Text fontSize='sm'>
                                                Status:
                                                <Badge variant='solid' ml="1" colorScheme={history.progress === 'processed' ? 'orange' : history.progress === 'completed' ? 'green' : history.progress === 'failed' ? 'red' : 'gray'} fontSize='0.8em'>
                                                    {history.status}
                                                </Badge>
                                            </Text>
                                        </Box>
                                    </Stack>
                                    ))}
                                </Stack>
                            </CardBody>
                        </Card>
                    </Stack>
                </GridItem>
            </Grid>
        </div>
    )
}