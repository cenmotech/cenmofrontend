import { useState } from "react";
import { FormControl, Input, Button } from "@chakra-ui/react";
import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Bottombar({id, user}) {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input !== '') {
      await addDoc(collection(db, `chats/${id}/messages`), {
        text: input,
        sender: user,
        timestamp: serverTimestamp()
      })
      setInput("");
    }
    
  }

  return (
    <FormControl
      bg='white'
      p={3}
      pl={6}
      pr={6}
      onSubmit={sendMessage}
      as="form"
    >
      <Input placeholder="Type a message..." autoComplete="off" onChange={e => setInput(e.target.value)} value={input} bg='white'/>
      <Button type="submit" hidden>Submit</Button>
    </FormControl>
  )
}