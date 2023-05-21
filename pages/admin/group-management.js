import {
    Flex, Grid, GridItem, Box, Heading, InputGroup,
    InputLeftElement, Input, Card, CardBody,
    Stack, Text, NumberInput, NumberInputField,
    NumberInputStepper, NumberIncrementStepper,
    NumberDecrementStepper, IconButton, Button, Modal, ModalOverlay, 
    ModalContent, ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, useDisclosure, FormControl, FormLabel, Spacer, Drawer, DrawerContent, DrawerHeader, DrawerCloseButton,
    SimpleGrid, Center,useToast, Textarea, Select, Badge, Image, BadgeProps, BadgeVariants, BadgePropsVariantLabel
  } from '@chakra-ui/react'
  import { SearchIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons'
  import Navbar from '../../components/navbar-admin'
  import { useEffect } from 'react';
  import { useRouter } from 'next/router'
  import React, { useState } from 'react';
  import { HiViewList } from 'react-icons/hi'
  import { BiStore } from 'react-icons/bi'
  import { getGroups } from '../../helpers/admin/api';
  import { getAllCategories } from '../../helpers/group/api';
  import { createGroup, createCategory} from '../../helpers/group/api';

  
  export default function Admin() {
    const baseUrl = "http://127.0.0.1:8000"
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const { isOpen:isAddOpen, onOpen:onAddOpen,onClose: onAddClose } = useDisclosure()

    const { isOpen:isCateOpen, onOpen:onCateOpen,onClose:onCateClose } = useDisclosure()

    const [groupList, setGroupList] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);

    //Get All Group

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    useEffect(() => {
      const fetchGroup = async () => {
        try{
          const response = await getGroups();
          setGroupList(response.groups_list);

          const response2 = await getAllCategories();
          setCategoriesList(response2.category_groups);
        }
        catch(error){
          console.log(error);
        }
      }
      fetchGroup();
    })
    //End Get All Group

    //Handle Form Add Group
    const toast = useToast()
    const handleForm = async (e) => {
      e.preventDefault()
      const body = {
        "name": e.target.group_name.value,
        "desc": e.target.group_description.value,
        "category": e.target.group_category.value,
        "photo_profile":"MASIH TESTING"
      }
      const response = await createGroup(body); 
      if(response.status === 201){
        onAddClose()
      }
    }

    //End Handle Form Add Group

    //Handle Form Add Category
    const handleFormCate = async (e) => {
      e.preventDefault()
      const body = {
        "name": e.target.category_name.value,
      }
      const response = await createCategory(body);
      if(response.status === 201){
        onCateClose()
      }
    }
    //End Handle Form Add Category



    return(
        <div>
          <Grid templateColumns="repeat(5, 1fr)" gap={0}>
            <GridItem colSpan={1} w="100%" h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight="1px" borderColor="gray.200">
              <Navbar />
            </GridItem>
            <GridItem colSpan={{ base: 4, md: 4, lg: 4 }} w={{ base: '100%', md: '100%', lg: '100%' }}>
            <Stack>
            <Heading pl={{base: '3', md: '5'}} pt={{base: '5', md: '7'}} color='black' size='md'>Group Management</Heading>
            </Stack>
            <Stack>
              <Stack direction="row" ml='5' mt='5'>
                <Button leftIcon={<AddIcon />} colorScheme='blue' onClick={onAddOpen} variant='solid'>
                  Create New Group
                </Button>
                <Button leftIcon={<AddIcon />} colorScheme='blue' onClick={onCateOpen} variant='solid'>
                  Create New Category
                </Button>
              </Stack>
              <Modal
                    isCentered
                    onClose={onAddClose}
                    isOpen={isAddOpen}
                    motionPreset='slideInBottom'
                  >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create New Group</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={handleForm}>
                            <FormControl mt={4}>
                            <FormLabel>Group Name</FormLabel>
                            <Input ref={initialRef} placeholder='Group Name' type='text' name="group_name" size="lg" />
                            </FormControl>

                            <FormControl mt={4}>
                            <FormLabel>Group Description</FormLabel>
                            <Textarea  ref={initialRef} placeholder='Group Description' type='text' name="group_description" size="lg" height="100px" resize="vertical"/>
                            </FormControl>

                            <FormControl mt={3}>
                            <FormLabel>Group Category</FormLabel>
                            <Select placeholder='Select option' name="group_category">
                                {categoriesList.map((category) => (
                                    <option value={category["category_id"]}>{category["category_name"]}</option>
                                ))}
                            </Select>
                            </FormControl>

                            <ModalFooter>
                            <Button type='submit' colorScheme='green' mr={3}
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
                            Create
                            </Button>
                            <Button onClick={onAddClose}>Cancel</Button>
                        </ModalFooter>
                            </form>
                        </ModalBody>
                        </ModalContent>
                  </Modal>

                  <Modal
                    isCentered
                    onClose={onCateClose}
                    isOpen={isCateOpen}
                    motionPreset='slideInBottom'
                  >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create New Category</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={handleFormCate}>
                            <FormControl mt={4}>
                            <FormLabel>Category Name</FormLabel>
                            <Input ref={initialRef} placeholder='Category Name' type='text' name="category_name" size="lg" />
                            </FormControl>

                            <ModalFooter>
                            <Button type='submit' colorScheme='green' mr={3}
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
                            Create
                            </Button>
                            <Button onClick={onAddClose}>Cancel</Button>
                        </ModalFooter>
                            </form>
                        </ModalBody>
                        </ModalContent>
                  </Modal>


            </Stack>
            <Stack>
              <SimpleGrid columns={{ base: 4, md: 4, lg: 4}} spacing={0} mt={5} ml={5} mr={5}>
                {groupList.map((group) => (
                    <Card w={{base: "100%", md: "550px", lg: "95%"}} borderRadius='15' mt='5' pr={{base: '3', md: '5'}}>
                    <CardBody>
                      <Stack spacing={2}>
                        <Heading size='md' color='black'>{group.group_name} <Badge colorScheme='purple'>{group.group_category}</Badge></Heading>
                        <Text color='black'>{group.group_desc}</Text>
                        <Text><b>Date Created:</b> {new Date(group.date_created).toISOString().slice(0, 10).replace(/-/g, "/")}</Text>
                        <Text color='black'><b>Total Member:</b> {group.group_total_member}</Text>
                        <Button colorScheme='blue' borderRadius='15' onClick={() => window.location.href = `/group/${group.group_id}`}>See Group</Button>
                        </Stack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
              </Stack>
            </GridItem>
          </Grid>
        </div>
    )
  }
  
  