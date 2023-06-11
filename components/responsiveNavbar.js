import { Input, Box, InputGroup, InputLeftElement ,Heading,Show, Grid, GridItem, Flex, Spacer, Center, Stack, Button, Drawer, DrawerContent, DrawerHeader, DrawerCloseButton, useDisclosure } from '@chakra-ui/react'
import { BiStore } from 'react-icons/bi'
import { HiViewList } from 'react-icons/hi'
import Navbar from './navbar'
import Listing from './listing'

export default function ResponsiveNavbar() {
    const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure()
    const { isOpen: isStoreOpen, onOpen: onStoreOpen, onClose: onStoreClose } = useDisclosure()

    return(
      <div>
        <Flex p="3" borderBottom='1px' borderColor='gray.200' height="" display={{ base: "block", xl: "none" }}>
        <Stack direction="row">
            <Button variant='ghost' onClick={onNavOpen}>
            <HiViewList />
            </Button>
            <Spacer />
        </Stack>
        </Flex>
        <Drawer isOpen={isNavOpen} placement="left" onClose={onNavClose} >
        <DrawerContent>
            <Navbar />
        </DrawerContent>
        </Drawer>
        </div>
    )
}