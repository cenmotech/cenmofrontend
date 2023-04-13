import { Grid, GridItem, Box, Heading, InputGroup,
        InputLeftElement, Input, Card, CardBody,
        Stack, Text, NumberInput, NumberInputField,
        NumberInputStepper, NumberIncrementStepper,
        NumberDecrementStepper, IconButton, Button } from '@chakra-ui/react'
import { SearchIcon, DeleteIcon } from '@chakra-ui/icons'
import Navbar from '../components/navbar'
import { Image } from '@chakra-ui/react'
import { useState } from 'react';
import React from 'react';

export default function Basket() {
    const [quantity, setQuantity] = useState(1);
    const pricePerItem = 237000;
    const totalPrice = quantity * pricePerItem;

    const handleQuantityChange = (value) => {
        setQuantity(value);
      };
    
    return (
        <div size={{ base: "100px", md: "200px", lg: "300px" }}>
            <Grid templateColumns='repeat(5, 1fr)' gap={0}>
                <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
                    <Navbar />
                </GridItem>
                <GridItem colSpan={{base: 2, md: 2, lg: 2}} w={{base: '100%', md: '100%', lg: '100%'}}>
                    <Heading pl={{base: '3', md: '5'}} pt={{base: '5', md: '7'}} color='black' size='md'>Basket</Heading>
                    <Box pr={{base: '3', md: '5'}} pl={{base: '3', md: '5'}}>
                        <InputGroup pr={{base: '3', md: '5'}} pt={{base: '3', md: '5'}}>
                        <InputLeftElement
                            pl={{base: '2', md: '2'}}
                            pt={{base: '3', md: '10'}}
                            pointerEvents='none'
                            children={<SearchIcon color='gray.300' />}
                        />
                        <Input pl={{base: '10', md: '10'}} type='tel' placeholder='Search' borderRadius='30' />
                        </InputGroup>
                        <Card w={{base: "100%", md: "550px", lg: "510px"}} borderRadius='15' mt='5' pr={{base: '3', md: '5'}}>
                        <CardBody>
                            <Stack direction={{base: 'column', md: 'row'}} alignItems={{base: 'flex-start', md: 'center'}}>
                            <Image boxSize={{base: '70px', md: '70px'}} src='https://bit.ly/dan-abramov' alt='Dan Abramov' borderRadius='10' />
                            <Stack spacing={0} direction='column' pl={{base: '0', md: '3'}}>
                                <Stack direction='row'>
                                <Text fontSize="sm">WEBCAM 4k Limited Edition</Text>
                                </Stack>
                                <Text fontSize="md" as='b'>Rp 237,000</Text>
                                <Text fontSize="md">Haji Kunfayakun</Text>
                            </Stack>
                            <Stack direction='row' alignItems={{base: 'flex-start', md: 'center'}} pl={{base: '0', md: '50'}}>
                                <IconButton aria-label='Delete' icon={<DeleteIcon />} color='red.500'/>
                                <NumberInput size='sm' maxW={20} defaultValue={quantity} min={1} onChange={value => setQuantity(value)}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                                </NumberInput>
                            </Stack>
                            </Stack>
                        </CardBody>
                        </Card>
                    </Box>
                </GridItem>
                <GridItem colSpan={2} borderLeft='1px' borderColor='gray.200'>
                    <Box pl='5' pr='10'>
                        <Heading pt='7' pb='5' color= 'black' size='md'>Basket Details</Heading>
                        <Stack direction='row' pb='7'>
                            <Image boxSize='150px' src='https://bit.ly/dan-abramov' alt='Dan Abramov' borderRadius='10' />
                            <Stack direction='column' pl='5'>
                                <Text fontSize="xl">WEBCAM 4k Limited Edition</Text>
                                <Text fontSize="xl" as='b'>Rp 237,000</Text>
                                <Stack direction='row'>
                                        <Text fontSize="md" as='b'>Seller |</Text>
                                        <Text fontSize="md">Haji Kunfayakun</Text>
                                    </Stack>
                                    <Button colorScheme='blue'>Seller Chat</Button>
                            </Stack>                
                        </Stack>
                        <Text fontSize="lg" as='b' mt='10'>Product Description</Text>
                        <Text pb='7' fontSize='md'>TCL 43 inch Google TV - 4K UHD - Dolby Audio - Google Assistant - Netflix/Youtube (model 43A28) TCL 43 inch Google TV - 4K UHD - Dolby Audio - Google Assistant - Netflix/Youtube (model 43A28) adalah televisi LED berukuran 43 inch yang cocok digunakan untuk kebutuhan menonton di rumah Anda. Bingkai televisi ini didesain dengan warna hitam yang elegan dan sangat sesuai untuk berbagai jenis interior. Anda dapat menikmati konsumsi daya yang lebih efisien dengan mengendalikan fitur pencahayaan berdasarkan konten pada televisi Anda. Anda juga dapat memanfaatkan koneksi antarmuka menggunakan USB yang praktis untuk memutar konten multimedia melalui televisi Anda. Tidak hanya tampilan visual, Tv ini juga memberikan Anda keleluasaan untuk dapat menikmati kualitas audio yang lebih tangguh.</Text>
                        <Card boxShadow='outline'>
                            <CardBody>
                                <Text as='b'>Shopping Summary</Text>
                                <Stack direction='row' justifyContent="space-between">
                                    <Text pl='5'>Total price ({quantity} {quantity === 1 ? 'item' : 'items'})</Text>
                                    <Text as='b'>Rp {totalPrice.toLocaleString()}</Text>
                                </Stack>
                                <br/>
                                <Button float='right' colorScheme='blue'>Buy</Button>
                            </CardBody>
                        </Card>
                    </Box>
                </GridItem>
            </Grid>
        </div>
    )
}