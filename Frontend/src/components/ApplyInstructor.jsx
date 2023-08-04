import { useState } from "react";

import axios from "axios";
import useLocalStorageState from "use-local-storage-state";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

// import contexts
import { useContext } from "react";
import UserContext from "./contexts/UserContext";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Flex,
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
  Box,
  Textarea,
  Heading,
} from "@chakra-ui/react";

const ApplyInstructor = ({ isOpen, onOpen, onClose }) => {
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [token, setToken] = useLocalStorageState("token");
  const toast = useToast();
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent>
          <Flex
            h="45"
            alignItems={"center"}
            // background="green"
            justifyContent={"center"}
          >
            <Box mt="5" fontSize={"xl"} fontWeight={"semibold"}>
              Become Instructor
            </Box>
          </Flex>
          <ModalCloseButton />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              let sarray = skills.split(",");
              sarray = sarray.map((item) => {
                return item.replaceAll(" ", "");
              });

              let reqObj = {
                bio: bio,
                skills: sarray,
              };

              let url = "http://localhost:5000/api/auth/instructor/apply";

              onClose;
              axios
                .post(url, reqObj, {
                  headers: { Authorization: "Bearer " + token },
                })
                .then((res) => {
                  toast({
                    title: "Instructor Application",
                    description: res.data.message,
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                  });
                  setUserData((data) => {
                    return { ...data, isInstructor: true };
                  });
                  setBio("");
                  setSkills("");
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
            }}
          >
            <ModalBody>
              <FormControl>
                <FormLabel mt="5">Bio</FormLabel>
                <Textarea
                  type="text"
                  isRequired
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                  }}
                />

                <FormLabel mt="5">Skills</FormLabel>
                <Input
                  type="text"
                  isRequired
                  value={skills}
                  onChange={(e) => {
                    setSkills(e.target.value);
                  }}
                />
                <FormHelperText>
                  Type comma ( , ) separated value.
                </FormHelperText>
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
