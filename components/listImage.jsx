import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseConfig';
import { useEffect, useState } from 'react';
import { Image } from '@chakra-ui/react'

const ListImage = ({ url, boxsize }) => {
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
        getPhotoOnListing(url).then((res) => {
            setImages(res)
        })
    }, [url])

    return <div>
        <Image boxSize={boxsize} objectFit={'cover'} src={images[0]} alt='urlgambar' borderRadius='10' />
    </div>
} 

export default ListImage