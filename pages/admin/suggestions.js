import {
  Grid, GridItem, Box, Heading, InputGroup,
  InputLeftElement, Input, Card, CardBody,
  Stack, Text, Icon, Button, Divider, Select, ButtonGroup,Badge,
  Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalCloseButton, ModalBody, Lorem,
  ModalFooter, FormControl, FormLabel, Link,
  NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper, Editable,
  EditablePreview, EditableTextarea, Flex, Show, Center, useToast, Spacer, Drawer, DrawerContent, DrawerHeader, DrawerCloseButton
  
} from "@chakra-ui/react"
  import { SearchIcon, DeleteIcon, ChevronRightIcon } from '@chakra-ui/icons'
  import { Image, useDisclosure } from '@chakra-ui/react'
  import Navbar from '../../components/navbar-admin'
  import { useEffect } from 'react';
  import { useRouter } from 'next/router'
  import ListImage from "../../components/listImage";
  import React, { useState } from 'react';
  import { HiViewList } from 'react-icons/hi'
  import { BiStore } from 'react-icons/bi'
  import { getSuggestions, changeStatusSuggestions } from "../../helpers/admin/api";
import { set } from "react-hook-form";
  
  
  export default function Admin() {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()
    const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure()
    const { isOpen: isAcceptOpen, onOpen: onAcceptOpen, onClose: onCloseAccept } = useDisclosure()
    const [suggestionList, setSuggestionList] = useState([]);


    const [suggestionId, setSuggestionId] = useState("");
    const [suggestionName, setSuggestionName] = useState("");
    const [suggestionDescription, setSuggestionDescription] = useState("");
    const [suggestionDate, setSuggestionDate] = useState("");
    const [suggestionEmail, setSuggestionEmail] = useState("");


    useEffect(() => {
      const fetchSuggestions = async () => {
        try{
          const response = await getSuggestions();
          setSuggestionList(response.suggestions_list);
        }
        catch(error){
          console.log(error);
        }
      }
      fetchSuggestions();
    })

    const clickCard = (suggestion) => {
      const body = {
        "id": suggestion.id,
    }
    changeStatusSuggestions(body);
    setSuggestionId(suggestion.id);
    setSuggestionName(suggestion.name);
    setSuggestionDescription(suggestion.suggestion);
    setSuggestionDate(suggestion.date);
    setSuggestionEmail(suggestion.user);
  }

    return(
      <div size={{ base: "100px", md: "200px", lg: "300px" }}>
          <Grid templateColumns='repeat(5, 1fr)' gap={0}>
                <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
                    <Navbar />
                </GridItem>
                <GridItem colSpan={{base: 2, md: 2, lg: 2}} w={{base: '100%', md: '100%', lg: '100%'}}>
                    <Heading pl={{base: '3', md: '5'}} pt={{base: '5', md: '7'}} color='black' size='md'>Suggestions from User</Heading>
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
                        {suggestionList.map((suggestion,index) => (
                            <Card w={{base: "100%", md: "550px", lg: "95%"}} borderRadius='15' mt='5' pr={{base: '3', md: '5'}} key= {index} cursor='pointer' onClick={() => clickCard(suggestion)}>
                                <CardBody>
                                    <Stack direction={{base: 'column', md: 'row'}} alignItems={{base: 'flex-start', md: 'center'}}>
                                        <ListImage boxsize={"70"} />
                                        <Stack spacing={0} direction='column' pl={{base: '0', md: '3'}}>
                                            <Stack direction='row'>
                                            <Text fontSize="sm">{suggestion.name}</Text>
                                            </Stack>
                                            <Text fontSize="md" as='b'>{new Date(suggestion.date).toISOString().slice(0, 10).replace(/-/g, "/")}</Text>
                                        </Stack>
                                        <Spacer></Spacer>
                                        <Badge variant='solid' colorScheme={suggestion.status === 'New' ? 'orange' : 'gray'} fontSize='0.8em'>
                                            {suggestion.status}
                                        </Badge>
                                    </Stack>
                                </CardBody>
                            </Card>
                        ))}
                    </Box>
                </GridItem>
                {suggestionId !== "" && (
                  <GridItem colSpan={2} borderLeft='1px' borderColor='gray.200'>
                  <Box pl='5' pr='10'>
                      <Heading pt='7' pb='5' color= 'black' size='md'>Suggestion Details</Heading>
                      <Stack direction='row' pb='7'>
                          <Stack direction='column' pl='5'>
                              <Text fontSize="xl">{suggestionName}</Text>
                              <Stack direction='row'>
                                  <Text fontSize="md" as='b'>Email : </Text>
                                  <Text fontSize="md" as='b'>{suggestionEmail}</Text> 
                                  <Text> | </Text>
                                  <Text>{new Date(suggestionDate).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, '/')}</Text>
                              </Stack>
                          </Stack>                
                      </Stack>
                      <Card mt='3'>
                          <CardBody>
                            <Text as='b'>Description</Text>
                              <Stack direction='row' justifyContent="space-between" >
                                  <Text>{suggestionDescription}</Text>
                              </Stack>
                          </CardBody>
                      </Card>
                  </Box>
              </GridItem>
                )}
            </Grid>
      </div>
    )
  }
  
  