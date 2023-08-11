import React, { useEffect, useState } from "react";

import { Box, Button, Flex, Center, VStack, useToast } from "@chakra-ui/react";

import { Link } from "react-router-dom";

import { useContext } from "react";
import UserContext from "../components/contexts/UserContext";
import useLocalStorageState from "use-local-storage-state";

import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import { AbsoluteCenter } from "@chakra-ui/react";

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
import CourseCard from "../components/CourseCard";
import { Skeleton } from "@chakra-ui/react";

const BASE_URL = import.meta.env.VITE_API_URL;

const ManageCourses = () => {
  const [token, setToken] = useLocalStorageState("token");
  const { userData, setUserData } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setisLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const toast = useToast();

  if (!token && !userData) {
    return (
      <>
        <p>Log in first!!!</p>
      </>
    );
  }
  const makeToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3500,
      isClosable: true,
    });
  };

  const fetchCourses = () => {
    setisLoading(true);
    axios
      .get(`${BASE_URL}/api/courses/manage`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        // console.log(res.data.courses);
        setCourses(res.data.courses);
        setisLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data.message);
          makeToast("Error", err.response.data.message, "error");
        }
        console.log(err.message);
        makeToast("Error", err.message, "error");
      })
      .finally(() => {});
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <VStack px="4" py="10" width="100%" mt={{ base: "12", md: "18" }}>
        <Box width={{ base: "100%", md: "80%" }}>
          <Button float="right" onClick={onOpen} colorScheme="buttons">
            Create New
          </Button>
        </Box>
        <Flex
          p="10"
          justifyContent="center"
          width="100%"
          mt="8"
          flexWrap="wrap"
          gap="5"
        >
          {loading ? (
            <AbsoluteCenter>
              <Box width="100%">
                <Spinner />
              </Box>
            </AbsoluteCenter>
          ) : (
            courses.map((course, index) => (
              <CourseCard
                key={index}
                course={course}
                buttonText="Manage"
                link={`${course._id.toString()}`}
              />
            ))
          )}
        </Flex>
      </VStack>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent color="white" backgroundColor="gray.700">
          {/* <DrawerContent color="white" backgroundColor="#4CAF50"> */}
          <DrawerCloseButton />
          <DrawerHeader>Create New Course</DrawerHeader>

          <DrawerBody>
            <Center>
              <Box>
                <Text px="5" fontWeight={"semibold"} fontSize="lg" my="3">
                  Upload Image (Course Thumbnail)
                </Text>
                <CreateCourse fetchCourses={fetchCourses} />
              </Box>
            </Center>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ManageCourses;
