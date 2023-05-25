import { useState, useEffect } from 'react'
import { Flex, Image, Button, Box} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseConfig';
const MultiImage = ({ image_url }) => {
    const [images, setImages] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleClickPrev = () => {
        setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
    };
    const handleClickNext = () => {
        setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
    };

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
        getPhotoOnListing(image_url).then((res) => {
            setImages(res)
        })
    }, [image_url])

    return <div>
        <Flex>
            <Box m="5" position="relative" height="300px" width="300px">
                {images.length > 1 && (
                    <Button
                        bg="transparent"
                        leftIcon={<ArrowBackIcon color="white" />}
                        onClick={handleClickPrev}
                        position="absolute"
                        top="50%"
                        left="0"
                        transform="translateY(-50%)"
                        zIndex="1"
                        _hover={{ bg: "transparent" }}
                    ></Button>
                )}
                {images.map((image, index) => {
                    return (
                        <Image
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
                            objectFit="cover"
                            borderRadius="10"
                        />
                    );
                })}
                {images.length > 1 && (
                    <Button
                        bg="transparent"
                        rightIcon={<ArrowForwardIcon color="white" />}
                        onClick={handleClickNext}
                        position="absolute"
                        top="50%"
                        right="0"
                        transform="translateY(-50%)"
                        zIndex="1"
                        _hover={{ bg: "transparent" }}
                    ></Button>
                )}
            </Box>
        </Flex>
    </div >
}

export default MultiImage