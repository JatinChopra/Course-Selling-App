import { useState } from "react";

import axios from "axios";
import useLocalStorageState from "use-local-storage-state";

import { createRenderToast, useToast } from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Center,
  Button,
} from "@chakra-ui/react";

const ApplyInstructor = ({ isOpen, onOpen, onClose, isLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const toast = useToast();
  const [token, setToken] = useLocalStorageState("token");

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent>
          <Center>
            <ModalHeader width="100%">
              {isLogin ? "Login" : "Signup"}
            </ModalHeader>
          </Center>
          <ModalCloseButton />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              //   console.log(username, email, password);
              let reqObj = {
                username: username,
                email: email,
                password: password,
              };

              let url = isLogin
                ? "http://localhost:5000/api/auth/login"
                : "http://localhost:5000/api/auth/signup";

              axios
                .post(url, reqObj)
                .then((res) => {
                  toast({
                    title: isLogin ? "Logged In" : "Account Created",
                    description: res.data.message,
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                  });

                  // set the token in local storage
                  setToken(res.data.token);

                  // close the modal
                  onClose();
                })
                .catch((er) => {
                  if (er.response) {
                    toast({
                      title: "Error.",
                      description: er.response.data.message,
                      status: "error",
                      duration: 4000,
                      isClosable: true,
                    });
                  }
                  console.log(er.message);
                });

              setUsername("");
              setEmail("");
              setPassword("");
            }}
          >
            <ModalBody>
              <FormControl>
                {isLogin || (
                  <>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      isRequired
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                    />
                  </>
                )}

                <FormLabel mt="5">Email address</FormLabel>
                <Input
                  type="email"
                  isRequired
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />

                <FormLabel mt="5">Password</FormLabel>
                <Input
                  type="password"
                  isRequired
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </FormControl>
            </ModalBody>

            <Center my="7">
              <Button type="submit">Submit</Button>
            </Center>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ApplyInstructor;
