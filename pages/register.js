import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useContext } from 'react'
import AuthenticationContext from '../context/AuthenticationContext'
import { useRef } from 'react'
import { useRouter } from 'next/router'
import { Input, Text, Button, onClose, InputGroup, 
    InputRightElement, useToast, Card, CardBody, Heading, Highlight,
    FormControl,FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react'

export default function Register() {
  const router = useRouter()
  const {register} = useContext(AuthenticationContext)
  const toast = useToast()
  const toastIdRef = useRef()
  
  // Handle Error Email
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (!e.target.value.includes("@")) {
      setEmailError("Email address must contain '@'");
    } else {
      setEmailError("");
    }
  };

  // Handle Error Full Name
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);

    if (!/^[a-zA-Z ]+$/.test(e.target.value)) {
      setNameError("Full name must contain only letters");
    } else {
      setNameError("");
    }
  };
  //Handle Error Mobile Number
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);

    if (e.target.value.length < 10) {
      setPhoneError("Mobile number must be at least 10 digits");
    } else {
      setPhoneError("");
    }
  };

  // Handle Error Password
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/.test(e.target.value)) {
      setPasswordError("Password must meet the criteria");
    } else {
        setPasswordError("");
      }
  };

  // Password
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  
  function handelSubmit (e) {
    e.preventDefault();
    register({name, email, password, phone}).then((success) => {
      /* istanbul ignore next */
      if(success){
        router.push('/login')
      }
    })
  }
  /* istanbul ignore next */
  return (
      <>
      <div className={styles.container}>
          <Head>
              <title>Cenmo</title>
              <meta name="description" content="Register Page" />
              <link rel="icon" href="/favicon.ico" />
          </Head>
      <main className={styles.main}>
      <Heading pb={3} lineHeight='tall'>
          <Highlight
              query='Register'
              styles={{ px: '2', py: '1', rounded: 'full', bg: 'blue.100' }}
          >
              Register
          </Highlight>
      </Heading>
      <Text>we can't wait to meet you!</Text>
      <br/>
      <Card>
          <CardBody>
            <form>
              <FormControl isInvalid= {emailError}>
                  <FormLabel>Email address</FormLabel>
                  <Input label='Email' type='email' fullwidth="true" onChange={handleEmailChange} value={email} placeholder='ex: michael.jordan@gmail.com'/>
                  <FormErrorMessage>{emailError}</FormErrorMessage>
              </FormControl>
              <br/>
              <FormControl isInvalid={nameError}>
                  <FormLabel>Full name</FormLabel>
                  <Input label='Full_name' fullwidth="true" onChange={handleNameChange} value={name} placeholder='ex: Michael Jordan'/>
                  <FormErrorMessage>{nameError}</FormErrorMessage>
              </FormControl>
              <br/>
              <FormControl isInvalid={phoneError}>
                  <FormLabel>Mobile number</FormLabel>
                  <Input label='No_HP' fullwidth="true" onChange={handlePhoneChange} value={phone} type='number' placeholder='ex: 0851xxx' data-testid="mobile-number"/>
                  <FormErrorMessage>{phoneError}</FormErrorMessage>
              </FormControl>
              <br/>
              <FormControl isInvalid={passwordError}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup size='md' pa={5}>
                      <Input label='Password' fullwidth="true" onChange={handlePasswordChange} value={password} data-testid="password-input"
                          pr='4.5rem'
                          type={show ? 'text' : 'password'}
                          placeholder='Enter password'
                      />
                      <InputRightElement width='4.5rem'>
                          <Button h='1.75rem' size='sm' onClick={handleClick} data-testid="show-password-button"> 
                          {show ? 'Hide' : 'Show'}
                          </Button>
                      </InputRightElement>
                  </InputGroup>
                  <FormHelperText>• Password must be at least 8 digits<br/>• Password must contain a combination of<br/>	&nbsp;	&nbsp;uppercase letters, lowercase letters, and numbers</FormHelperText>
                  <FormErrorMessage>{passwordError}</FormErrorMessage>
              </FormControl>
              <br/>
              <Button onClick={onClose} mr={3}>
                  Back to Log In
              </Button>
              <Button colorScheme='green' onClick={e => handelSubmit(e)}>
                Register
                </Button>
            </form>
          </CardBody>
      </Card>
      </main>
    </div>
    </>
  )       
}