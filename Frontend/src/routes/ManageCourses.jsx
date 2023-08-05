import React from "react";

import { Box, Button, Flex, Center, VStack } from "@chakra-ui/react";

import { Link } from "react-router-dom";

import { useContext } from "react";
import UserContext from "../components/contexts/UserContext";
import useLocalStorageState from "use-local-storage-state";

import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import CreateCourse from "../components/CreateCourse";

const ManageCourses = () => {
  const [token, setToken] = useLocalStorageState("token");
  const { userData, setUserData } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!token && !userData) {
    return (
      <>
        <p>Log in first!!!</p>
      </>
    );
  }

  return (
    <>
      {/* <Flex
        width={{
          base: "100%",
          md: "100%",
          lg: "8xl",
        }}
        py="10"
        h="100%"
        // background="green"
      > */}
      {/* <Box height="100%" minW="30%" px="4">
          <Center>
            <Box>
              <Text
                px="5"
                fontSize="xl"
                fontWeight={"semibold"}
                my="3"
                color="blackAlpha.700"
              >
                Create Course
              </Text>
              <Text px="5" fontSize="md" my="3">
                Upload an Image
              </Text>
              <Create />
            </Box>
          </Center>
        </Box> */}
      <VStack px="4" py="10" width={"84%"}>
        <Box width="84%">
          <Button float="right" onClick={onOpen}>
            Create New
          </Button>
        </Box>
        <Flex
          justifyContent={"center"}
          // background={"pink"}
          mt="8"
          flexWrap={"wrap"}
          gap={"5"}
          // flexDirection="row-reverse"
        ></Flex>
      </VStack>
      {/* </Flex> */}

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        size="sm"
        background="green"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create New Course</DrawerHeader>

          <DrawerBody>
            <Center>
              <Box>
                <Text
                  px="5"
                  fontWeight={"semibold"}
                  fontSize="lg"
                  my="3"
                  color="gray.700"
                >
                  Upload Image (Course Thumbnail)
                </Text>
                <CreateCourse />
              </Box>
            </Center>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ManageCourses;
