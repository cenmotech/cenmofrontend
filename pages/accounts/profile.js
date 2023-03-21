import { Flex, Text, Box, Image, Heading, Editable,
        EditableInput, EditableTextarea, EditablePreview,
        Input, useEditableControls, IconButton, EditIcon, 
        ButtonGroup, Spacer, Button,
        Stack, FormControl, FormLabel, Badge, Divider, Link} from '@chakra-ui/react'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import Navbar from '../../components/navbar'

export default function Profile() {
      
    return (
        <div size={{ base: "100px", md: "200px", lg: "300px" }}>
          <Flex>
          <Box flex='0.7' borderRight='1px' borderColor='gray.200'>
              <Navbar/>
              
            </Box>
            
            <Box flex='1'>
                <Heading pl='5' pt='7' color= 'black' size='md'>Profile</Heading>
                    <Box pr='5'>
                        <Stack direction='row' pl='5' pt='5'>
                            <Image borderRadius='15' boxSize='20%' src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
                            <FormControl id="firstName" pl='5'>
                                <FormLabel>Full Name</FormLabel>
                                <Input focusBorderColor="brand.blue" type="text" placeholder="Tim Timberlake" />
                                
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
                        <Input focusBorderColor="brand.blue" type="text" placeholder="tim.timberlake@gmail.com" />
                        </FormControl>
                    <FormControl id="no_hp" pl='5' pt='5'>
                        <FormLabel>No. HP</FormLabel>
                        <Input focusBorderColor="brand.blue" type="text" placeholder="0851xxx" />
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
                    
                    <Button ml='5' colorScheme='blue'>Update</Button>
                    
                    
                    </Box>
            </Box>
            
            <Box flex='0.7' bg='tomato'>
              <Text>Box 3</Text>
            </Box>
          </Flex>
        </div>
      )
}