import {
  Grid, GridItem, useDisclosure
} from '@chakra-ui/react'
import Navbar from '../../components/navbar-admin'
import { useRouter } from 'next/router'
import React, { useState } from 'react';

export default function Admin() {
  const baseUrl = `${process.env.NEXT_PUBLIC_BE_URL}`
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()
  const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure()
  const { isOpen: isAcceptOpen, onOpen: onAcceptOpen, onClose: onCloseAccept } = useDisclosure()
  return(
    <div>
        <Grid templateColumns='repeat(5, 1fr)' gap={0}>
            <GridItem colSpan={1} w='100%' h="100vh" position="sticky" top="0" left="0" overflow="hidden" borderRight='1px' borderColor='gray.200'>
                <Navbar />
            </GridItem>
        </Grid>
    </div>
  )
}

