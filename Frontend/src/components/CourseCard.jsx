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
      navigate(link);
    } // addition
    // navigate(course._id.toString());
  };

  return (
    <Box
      width="250px"
      backgroundColor={"gray.700"}
      border="1px solid"
      color="gray.200"
      minH={"200px"}
    >
      <VStack height="100%">
        <Image src={imageurl} width="100%" height="112px" objectFit="cover" />
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
              colorScheme="teal"
              size="sm"
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
