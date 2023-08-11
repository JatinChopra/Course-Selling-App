import React from "react";

import { Box, VStack, tokenToCSSVar } from "@chakra-ui/react";
import { Button, Text } from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Image,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import useLocalStorageState from "use-local-storage-state";

const BASE_URL = import.meta.env.VITE_API_URL;

const CourseCard = ({ course, buttonText, link }) => {
  const { _id, title, description, imageurl } = course;
  const navigate = useNavigate();
  const toast = useToast();
  const [token, setToken] = useLocalStorageState("token");

  const makeToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3500,
      isClosable: true,
    });
  };

  const manageButtonHandler = () => {
    if (link == `${BASE_URL}/api/enroll`) {
      console.log("equal link");
      axios
        .post(
          link,
          {
            courseId: _id.toString(),
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          makeToast("Enroll Operation", res.data.message, "success");
        })
        .catch((err) => {
          if (err.response) {
            makeToast("Error", err.response.data.message, "error");
          }
          console.log(err.message);
        });
    } else {
      console.log("not equal link");
      navigate(link);
    } // addition
    // navigate(course._id.toString());
  };

  // // {    #4A4A4A
  //     #333333
  //     #2C3E50
  //     #424242
  //     #2E4053}

  return (
    <Box
      flex={"1"}
      minW="280px"
      maxW="300px"
      backgroundColor={"#F6F4E2"}
      // backgroundColor={"customTwo.600"}
      boxShadow={"2xl"}
      borderRadius={"12"}
      // border="1px solid"
      color="black"
      minH={"200px"}
      p="3"
    >
      <VStack height="100%">
        <Image
          src={imageurl}
          width="100%"
          height="112px"
          objectFit="cover"
          borderTopRadius={12}
          boxShadow={"lg"}
          mb="2"
        />
        <Box width="100%" px="2" pb="3" pt="2" height="100%">
          <Flex direction={"column"} height="100%">
            <Text fontSize={"lg"} fontWeight={"semibold"}>
              {title}
            </Text>
            <Text fontSize={"sm"} width={"95%"}>
              {description}
            </Text>

            <Spacer />
            <Button
              mt="2"
              float="right"
              colorScheme="buttons"
              size="md"
              width="50%"
              onClick={manageButtonHandler}
            >
              {buttonText}
            </Button>
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
};

export default CourseCard;
