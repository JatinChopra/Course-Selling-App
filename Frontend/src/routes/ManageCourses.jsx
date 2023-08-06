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

const ManageCourses = () => {
  const [token, setToken] = useLocalStorageState("token");
  const { userData, setUserData } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setisLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const skeletonData = new Array(9).fill("");
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
      .get("http://localhost:5000/api/courses/manage", {
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
      <VStack px="4" py="10" width={"84%"}>
        <Box width="84%">
          <Button float="right" onClick={onOpen}>
            Create New
          </Button>
        </Box>
        <Flex
          justifyContent="start"
          // alignItems={"center"}
          // background={"pink"}
          width="100%"
          mt="8"
          flexWrap={"wrap"}
          gap={"5"}

          // flexDirection="row-reverse"
        >
          {loading
            ? skeletonData.map(() => {
                return (
                  <Skeleton>
                    <Box width="250px" height="200px" />
                  </Skeleton>
                );
              })
            : courses.map((course) => {
                // console.log(course);
                return <CourseCard key={course._id} course={course} />;
              })}
        </Flex>
      </VStack>
      {/* </Flex> */}

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent color="white" backgroundColor="gray.700">
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
