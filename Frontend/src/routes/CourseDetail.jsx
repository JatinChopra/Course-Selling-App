import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import axios from "axios";
import useLocalStorageState from "use-local-storage-state";
import {
  VStack,
  Button,
  Box,
  Text,
  Image,
  Flex,
  Spacer,
  AspectRatio,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { useDisclosure, Center } from "@chakra-ui/react";

import ChapterCard from "../components/ChapterCard";
import CreateChapter from "../components/CreateChapter";

const CourseDetail = () => {
  const [token, setToken] = useLocalStorageState("token");
  const { courseid } = useParams();
  const [course, setCourse] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchChapters = () => {
    setIsLoading(true);
    axios
      .get(`http://localhost:5000/api/courses/${courseid}/chapters`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res.data.courseObj);
        setCourse((data) => {
          return res.data.courseObj;
        });
        console.log("loo khere : ", course);
        setIsLoading(false);
      })
      .catch((err) => {})
      .finally(() => {
        console.log(isLoading);
        console.log(course);
      });
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <>
      <VStack width="100%" px="10" py="5" maxW="800px">
        {!isLoading && course ? (
          <Box
            width="98%"
            maxW="800px"
            height={"150"}
            my="8"
            p="2"
            borderRadius={"5"}
            boxShadow={"base"}
          >
            <Box height="100%">
              <Flex height="100%">
                <Image
                  src={course.imageurl}
                  height="135px"
                  width="135px"
                  objectFit={"cover"}
                  mr={"5"}
                />
                <Flex
                  direction={"column"}
                  // background="green"
                  width="100%"
                  height="100%"
                  wrap={"nowrap"}
                >
                  <Box>
                    <Text
                      fontWeight={"bold"}
                      fontSize={"2xl"}
                      color={"gray.600"}
                    >
                      {course.title}
                    </Text>
                    <Text fontWeight={"semibold"} color={"gray.500"}>
                      {course.description}
                    </Text>
                  </Box>

                  <Spacer />
                  <Box>
                    <Button float="right" mr="2" size="sm">
                      Edit
                    </Button>
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </Box>
        ) : (
          <>Loading...</>
        )}

        <Box width="100%">
          <Button float="right" size="sm" mr="2" onClick={onOpen}>
            New Chapter
          </Button>
        </Box>
        <VStack mt="5" width="100%" height="80vh" overflowY={"scroll"}>
          {!isLoading && course ? (
            <>
              {course.chapters.map((item) => {
                return <ChapterCard chapterObj={item} />;
              })}
            </>
          ) : (
            <>Loading...</>
          )}
        </VStack>
      </VStack>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent color="white" backgroundColor="gray.700">
          <DrawerCloseButton />
          <DrawerHeader>Create New Chapter</DrawerHeader>

          <DrawerBody>
            <Center>
              <Box>
                <Text px="5" fontWeight={"semibold"} fontSize="lg" my="3">
                  Upload Video
                </Text>
                <CreateChapter
                  courseid={courseid}
                  fetchChapters={fetchChapters}
                />
              </Box>
            </Center>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CourseDetail;
