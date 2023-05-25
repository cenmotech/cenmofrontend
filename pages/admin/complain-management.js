import {
  Grid, GridItem, Box, Heading, Card, CardBody,
  Stack, Text, Button, Badge,
  useToast, Spacer
} from "@chakra-ui/react"
import Navbar from '../../components/navbar-admin'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { getComplain, updateComplainStatus } from '../../helpers/transaction/api';


export default function Admin() {
  const router = useRouter();
  const [complainList, setComplainList] = useState([]);

  const [complainId, setComplainId] = useState("");
  const [complainTransId, setComplainTransId] = useState("");
  const [complainStatus, setComplainStatus] = useState("");
  const [complainText, setComplainText] = useState("");
  const [complainDate, setComplainDate] = useState("");
  const [complainSeller, setComplainSeller] = useState("");
  const [complainBuyer, setComplainBuyer] = useState("");
  const [complainItemName, setComplainItemName] = useState("");
  const [complainItemId, setComplainItemId] = useState("");
  const [filteredComplainList, setFilteredComplainList] = useState([]);
  const toast = useToast()


  useEffect(() => {

    fetchComplain();
  }, [])
  const fetchComplain = async () => {
    try {
      const response = await getComplain();
      setComplainList(response);
      setFilteredComplainList(response);
    }
    catch (error) {
      console.log(error);
    }
  }

  const clickCard = (complain) => {
    const body = {
      "id": complain.complain_id,
    }
    setComplainId(complain.complain_id);
    setComplainTransId(complain.transaction_id);
    setComplainStatus(complain.complain_status);
    setComplainText(complain.complain_text);
    setComplainDate(complain.complain_date);
    setComplainSeller(complain.seller_id);
    setComplainBuyer(complain.user_id);
    setComplainItemName(complain.item_name);
    setComplainItemId(complain.item_id);
  }

  const handleComplainStatus = async (complain_id) => {
    const config = {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }
    const requestBody = {
      "complain_id": complain_id
    }
    try {
      //Async function to send data to backend
      await updateComplainStatus(requestBody)
      await router.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const listAll = () => {
    setFilteredComplainList(complainList);
  };

  const listPending = () => {
    const filteredList = complainList.filter(
      (complain) => complain.complain_status === 'Pending'
    );
    setFilteredComplainList(filteredList);
  };

  const listProcessing = () => {
    const filteredList = complainList.filter(
      (complain) => complain.complain_status === 'Processing'
    );
    setFilteredComplainList(filteredList);
  };

  const listResolved = () => {
    const filteredList = complainList.filter(
      (complain) => complain.complain_status === 'Resolved'
    );
    setFilteredComplainList(filteredList);
  };

  return (
    <div size={{ base: "100px", md: "200px", lg: "300px" }}>
      <Grid templateColumns='repeat(5, 1fr)' gap={0}>
        <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
          <Navbar />
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 2, lg: 2 }} w={{ base: '100%', md: '100%', lg: '100%' }}>
          <Heading pl={{ base: '3', md: '5' }} pt={{ base: '5', md: '7' }} color='black' size='md'>Complain Management</Heading>
          <Box pr={{ base: '3', md: '5' }} pl={{ base: '3', md: '5' }}>
            <Stack direction='row' mt='5' spacing={4} align='center'>
              <Button variant='outline' onClick={() => listAll()}>
                All
              </Button>
              <Button variant='outline' onClick={() => listPending()}>
                Pending
              </Button>
              <Button variant='outline' onClick={() => listProcessing()}>
                Processing
              </Button>
              <Button variant='outline' onClick={() => listResolved()}>
                Resolved
              </Button>

            </Stack>
            {filteredComplainList.map((complain, index) => (
              <Card w={{ base: "100%", md: "550px", lg: "95%" }} borderRadius='15' mt='5' pr={{ base: '3', md: '5' }} key={index} cursor='pointer' onClick={() => clickCard(complain)}>
                <CardBody>
                  <Stack direction={{ base: 'column', md: 'row' }} alignItems={{ base: 'flex-start', md: 'center' }}>
                    <Stack spacing={0} direction='column' pl={{ base: '0', md: '3' }}>
                      <Text fontWeight="bold" fontSize="m" marginTop={0} marginBottom={1}>
                        {complain.transaction_id}
                      </Text>
                      <Text marginTop={1} marginBottom={1}>
                        <b>Item Name: </b>{complain.item_name}
                      </Text>
                      <Text marginTop={1} marginBottom={0}>
                        <b>Complainer Name: </b>{complain.user_id}
                      </Text>

                    </Stack>
                    <Spacer></Spacer>
                    <Badge variant='solid' colorScheme={complain.complain_status === 'Pending' ? 'orange' : complain.complain_status === 'Processing' ? 'blue' : 'green'} fontSize='0.8em'>
                      {complain.complain_status}
                    </Badge>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Box>
        </GridItem>
        {complainId !== "" && (
          <GridItem colSpan={2} borderLeft='1px' borderColor='gray.200'>
            <Box pl='5' pr='10'>
              <Heading pt='7' pb='5' color='black' size='md'>Complain Details</Heading>
              <Stack direction='row' pb='7'>
                <Stack direction='column' pl='5'>
                  <Text fontSize="xl"><b>Transaction ID: </b>{complainTransId}</Text>
                  <Stack direction='row'>
                    <Text fontSize="xl">
                      <b>Status: </b>
                    </Text>
                    <Badge variant='solid' fontSize="xl" colorScheme={complainStatus === 'Pending' ? 'orange' : complainStatus === 'Processing' ? 'blue' : 'green'}>
                      {complainStatus}
                    </Badge>
                  </Stack>
                  <Text marginTop={1} marginBottom={1} fontSize="xl">
                    <b>Item Name: </b>
                    <u><a href={`/listing/${complainItemId}`}>{complainItemName}</a></u>
                  </Text>
                  <Stack direction='row'>
                    <Text fontSize="xl" as='b'>Complainer Name: </Text>
                    <Text fontSize="xl">{complainBuyer}</Text>
                    <Text fontSize="xl"> | </Text>
                    <Text fontSize="xl">{new Date(complainDate).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, '/')}</Text>
                  </Stack>
                  <Text fontSize="xl"><b>Seller Name: </b>{complainSeller}</Text>
                </Stack>
              </Stack>
              <Card mt='3'>
                <CardBody>
                  <Text as='b'>Complain Text</Text>
                  <Stack direction='row' justifyContent="space-between" >
                    <Text>{complainText}</Text>
                  </Stack>
                </CardBody>
              </Card>
              <Box width="100%" height="100px" display="flex" justifyContent="center" alignItems="center">
                {complainStatus !== "Resolved" && (
                  <Button
                    colorScheme='blue'
                    width='200px'
                    borderRadius='15'
                    onClick={() => {
                      handleComplainStatus(complainId);
                      toast({
                        title: 'Success',
                        description: "Status changed successfully",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                      });
                    }}
                  >
                    Change Status
                  </Button>
                )
                }
              </Box>

            </Box>
          </GridItem>
        )}
      </Grid>
    </div>
  )
}

