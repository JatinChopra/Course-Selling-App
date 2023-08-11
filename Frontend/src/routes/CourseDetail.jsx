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
  AbsoluteCenter,
  Spinner,
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

const BASE_URL = import.meta.env.VITE_API_URL;

const CourseDetail = () => {
  const [token, setToken] = useLocalStorageState("token");
  const { courseid } = useParams();
  const [course, setCourse] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchChapters = () => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/api/courses/${courseid}/chapters`, {
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
      {!isLoading && course ? (
        <Center>
          <VStack
            width="100%"
            px={{ base: "4", md: "10" }}
            py="5"
            mt="7"
            maxW="800px"
          >
            <Box
              width="98%"
              maxW="800px"
              height={{ base: "auto", md: "150px" }}
              my="8"
              p="2"
              borderRadius="5"
              shadow={"lg"}
              background="white"
            >
              <Box height="100%">
                <Flex height="100%">
                  <Image
                    src={course.imageurl}
                    height={{ base: "85px", md: "135px" }}
                    width={{ base: "85px", md: "135px" }}
                    objectFit="cover"
                    mr={{ base: "3", md: "5" }}
                  />
                  <Flex
                    direction="column"
                    width="100%"
                    height="100%"
                    wrap="nowrap"
                  >
                    <Box>
                      <Text
                        fontWeight="bold"
                        fontSize={{ base: "xl", md: "2xl" }}
                        color="gray.600"
                      >
                        {course.title}
                      </Text>
                      <Text fontWeight="semibold" color="gray.500">
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

            <Box width="100%">
              <Button
                float="right"
                size="sm"
                mr="2"
                onClick={onOpen}
                colorScheme="buttons"
              >
                New Chapter
              </Button>
            </Box>

            <VStack
              // backgroundColor="whiteAlpha.800"
              mt="5"
              width="100%"
              height={{ base: "60vh", md: "80vh" }}
              overflowY="scroll"
            >
              {course.chapters.map((item, index) => (
                <ChapterCard
                  key={item._id}
                  fetchChapters={fetchChapters}
                  courseid={courseid}
                  chapterObj={item}
                  index={index}
                />
              ))}
            </VStack>
          </VStack>
        </Center>
      ) : (
        <AbsoluteCenter>
          <Spinner />
        </AbsoluteCenter>
      )}
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
