import {
    Card, CardBody,
    Stack, Text, NumberInput, NumberInputField,
    NumberInputStepper, NumberIncrementStepper,
    NumberDecrementStepper, IconButton, Spacer
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { updateToCart } from '../helpers/shopcart/api';
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseConfig';

const BasketCard = ({ item }) => {
    const [jumlah, setJumlah] = useState(item.quantity)
    const [images, setImages] = useState([])
    const [exist, setExist] = useState(true)

    useEffect(() => {
        console.log(jumlah)
        if (item.goods__stock == 0) {
            handleQuantityChange("delete", item.goods__goods_id, item.goods__stock, 0)
        } else if (jumlah > item.goods__stock) {
            handleQuantityChange("change", item.goods__goods_id, item.goods__stock, item.goods__stock)
        }
    }, [jumlah])
    
    async function getPhotoOnListing(url) {
        if (url != "") {
            const imageRef = ref(storage, url);
            const imageList = []
            const response = await listAll(imageRef)
            response.items.forEach((items) => {
                imageList.push(getDownloadURL(items))
            });
            return Promise.all(imageList)
        }
        else {
            return []
        }
    }

    useEffect(() => {
        getPhotoOnListing(item.goods__goods_image_link).then((res) => {
            setImages(res)
        })
    }, [item])

    async function cartHandler(action, goods_id, amount) {
        try {
          await updateToCart(action, goods_id, amount)
        } catch (error) {
          console.error(error)
        }
      }
    
      const handleQuantityChange = (action, id, stock, amount) => {
        if (action === 'add' && jumlah < stock) {
          setJumlah(jumlah + 1);
          cartHandler('add', id, 0)
        } else if (action === 'remove' && jumlah > 1) {
          setJumlah(jumlah - 1);
          cartHandler('remove', id, 0)
        } else if (action === 'delete') {
          setExist(false)
          cartHandler('delete', id, 0)
        } else if (action === 'change') {
          setJumlah(amount)
          cartHandler('change', id, amount)
        }
      }
    return <div>
        {exist && (
        <Card w={{ base: "100%"}} borderRadius='15' mt='5' pr={{ base: '3', md: '5' }}>
            <CardBody>
                <Stack direction={{ base: 'column', md: 'row' }} alignItems={{ base: 'flex-start', md: 'center' }}>
                    <Image boxSize={{ base: '70px', md: '70px' }} src={images[0]} objectFit={'cover'} overflow="hidden" borderRadius='10' />
                    <Stack spacing={0} direction='column' pl={{ base: '0', md: '3' }}>
                        <Stack direction='row'>
                            <Text fontSize="sm">{item.goods__goods_name}</Text>
                        </Stack>
                        <Text fontSize="md" as='b'>Rp {(item.goods__goods_price * jumlah).toLocaleString('id-ID')}</Text>
                        <Text fontSize="md">{item.goods__seller_name}</Text>
                    </Stack>
                    <Spacer/>
                    <Stack direction='row' alignItems={{ base: 'flex-start', md: 'center' }} pl={{ base: '0', md: '50' }}>
                        <IconButton aria-label='Delete' icon={<DeleteIcon />} color='red.500' onClick={(e) => { e.stopPropagation(); handleQuantityChange("delete", item.goods__goods_id, 0) }} />
                        <NumberInput size='sm' maxW={20} value={jumlah} min={1} max={item.goods__stock} onClick={(e) => e.stopPropagation()} isReadOnly={true}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper onClick={() => handleQuantityChange("add", item.goods__goods_id, item.goods__stock, 0)} />
                                <NumberDecrementStepper onClick={() => handleQuantityChange("remove", item.goods__goods_id, item.goods__stock, 0)} isDisabled={jumlah === 1} />
                            </NumberInputStepper>
                        </NumberInput>
                    </Stack>
                </Stack>
            </CardBody>
        </Card>
        ) }
    </div>
}

export default BasketCard