import { useState, useEffect } from 'react'
import { Flex, Image, Button, Box } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseConfig';

const PostImage = ({ post }) => {
  const [images, setImages] = useState([])

  const [currentIndex, setCurrentIndex] = useState(0);
  const handleClickPrev = () => {
    setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };
  const handleClickNext = () => {
    setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
  };

  async function getPhotoOnPost(url) {
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
    getPhotoOnPost(post.post_image_link).then((res) => {
      setImages(res)
    })
  }, [post])

  return <div>
    <Flex alignItems="center">
    <Button bg="transparent" leftIcon={<ArrowBackIcon cursor="pointer" />} onClick={handleClickPrev} ></Button>
    <Box position="relative" width="100%" height="300px">
      {images.map((image, index) => {
        return <Image
          key={index}
          src={image}
          alt={`Image ${index + 1}`}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          opacity={index === currentIndex ? 1 : 0}
          transition="opacity 0.5s ease-in-out"
          objectFit="contain"
        />
      })
      }
    </Box>
    <Button bg="transparent" rightIcon={<ArrowForwardIcon cursor="pointer" />} onClick={handleClickNext} ></Button>
    </Flex>
  </div>
}

export default PostImage