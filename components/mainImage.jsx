import { useState, useEffect } from 'react'
import { Flex, Image, Button, Box } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseConfig';

const MainImage = ({ listingList }) => {
  const [images, setImages] = useState([])

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
    getPhotoOnListing(listingList.goods_image_link).then((res) => {
      setImages(res)
      console.log(images)
    })
  }, [listingList])


  return <div>
    <Image objectFit={'cover'} boxSize='100px' src={images[0]}/>
  </div>
}

export default MainImage