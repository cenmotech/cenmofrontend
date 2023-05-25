import { getDatabase, ref, set } from "firebase/database";
import {Button} from '@chakra-ui/react'
import {database} from '../firebaseConfig'

export default function Chat() {
    function writeUserData(userId, name, email, imageUrl) {
        set(ref(database, 'users/' + userId), {
            username: name,
            email: email,
            profile_picture: imageUrl
        });

    }
    return (
        <Button colorScheme='green' onClick={() => writeUserData("1", "dummy@gmail.com", "dummy", "dummyPass")}>
            Register
        </Button >
    )
}

