import React, { useState } from "react";

import {
  Box,
  HStack,
  Text,
  IconButton,
  Spacer,
  AspectRatio,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

import useLocalStorageState from "use-local-storage-state";
import { DeleteIcon } from "@chakra-ui/icons";

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const ChapterCard = ({ fetchChapters, courseid, chapterObj, index }) => {
  const { _id, title, description, videourl } = chapterObj;
  const [token, setToken] = useLocalStorageState("token");
  const toast = useToast();

  const makeToast = (title, desc, status) => {
    toast({
      title: title,
      description: desc,
      status: status,
      duration: 3500,
      isClosable: true,
    });
  };

  const onDelete = () => {
    axios
      .delete(`${BASE_URL}/api/courses/${courseid}/${_id.toString()}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        makeToast("Delete", res.data.message, "success");
        fetchChapters();
      })
      .catch((err) => {
        if (err.response) {
          makeToast("Delete Error", err.response.data.message, "error");
        }
        console.log(err.message);
      });
  };

  return (
    <>
      <Box
        my="4"
        mx="2"
        minH={{ base: "120px", md: "90px", lg: "90px" }}
        maxH="120px"
        width="96%"
        background="white"
        minW="350px"
        borderRadius="8px"
        boxShadow="lg"
        border="1px solid"
        borderColor="gray.400"
        pb=".5"
      >
        <HStack height="100%">
          <Box px="4" pt="2" width={{ base: "80%", md: "100%", lg: "100%" }}>
            <HStack>
              <Box
                mb="2"
                minW={{ base: "100px", md: "150px", lg: "150px" }}
                minH="100px"
                width={{ base: "100px", md: "150px", lg: "150px" }}
                height="100px"
                pt="2.5"
                pb="5"
                mr="1"
              >
                <video
                  style={{
                    width: "100%",
                    height: "80px",
                    objectFit: "cover",
                    overflowY: "hidden",
                  }}
                  src={videourl}
                  controls // You can add controls for video playback
                />
              </Box>
              <Box>
                <Text
                  fontSize={{ base: "lg", md: "lg", lg: "lg" }}
                  fontWeight="semibold"
                >
                  {"Chapter " + index + ":"} {title}
                </Text>
                <Text
                  mb="2"
                  fontSize={{ base: "md", md: "sm", lg: "md" }}
                  width="100%"
                  maxH="80px"
                  overflow="hidden"
                  position="relative"
                >
                  {description}
                </Text>
              </Box>
            </HStack>
          </Box>
          <Spacer />
          <IconButton colorScheme="buttons" mr="10" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </HStack>
      </Box>
    </>
  );
};

export default ChapterCard;
