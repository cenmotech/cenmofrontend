import { Flex, Heading, Avatar } from "@chakra-ui/react"

export default function Topbar({email}) {
  return (
    <Flex
      bg='white'
      h="81px" w="100%"
      align="center"
      p={5}
      boxShadow='xl'
    >
      <Avatar src="" marginEnd={3} />
      <Heading size="lg">{email}</Heading>
    </Flex>
  )
}