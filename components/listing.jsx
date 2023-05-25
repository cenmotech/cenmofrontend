import { useState, useEffect } from 'react'
import { Image, Box, Stack, Text, Grid, GridItem, Card, CardBody} from '@chakra-ui/react';
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseConfig';

import { useRouter } from 'next/router'
const Listing = ({ list }) => {
  const [images, setImages] = useState([])
  const router = useRouter();

  async function getPhotoOnListing(url) {
    if (url != "") {
      const imageRef = ref(storage, url);
      const imageList = []
      const response = await listAll(imageRef)
      response.items.forEach((item) => {
        imageList.push(getDownloadURL(item))
      });
      return Promise.all(imageList)
    }
    else {
      return []
    }
  }

  useEffect(() => {
    getPhotoOnListing(list.goods_image_link).then((res) => {
      setImages(res)
    })
  }, [list])


  const getCity = (region) => {
    const city = region.split(',')[0]
    var splitStr = city.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  return <div>
    <Card overflow="hidden" height="145" m='5' borderRadius='15' className='listingCard' onClick={() => router.push(`/listing/${list.goods_id}`)} cursor='pointer'>
      <CardBody p="0">
        <Stack justifyContent="space-between" direction='row' align='stretch'>
          <Box flex="1">
            <Grid m="5" templateRows='repeat(4, 1fr)'>
              <GridItem rowSpan={2} >
                <Text noOfLines={2}>{list.goods_name} </Text>
              </GridItem>
              <GridItem rowSpan={1}>
                <Text as='b'>
                  Rp {list.goods_price.toLocaleString('id-ID')}
                </Text>
              </GridItem>
              <GridItem rowSpan={1}>
                <Text noOfLines={1}>{getCity(list.goods_region)}</Text>
              </GridItem>
            </Grid>
          </Box>
          <Image m="0" objectFit={'cover'} boxSize='145px' borderRadius="0 15px 15px 0"
            overflow="hidden" src={images[0]} />
        </Stack>
      </CardBody>
    </Card>



  </div >
}

export default Listing