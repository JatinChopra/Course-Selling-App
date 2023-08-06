import React, { useState } from "react";

import { Box, HStack, Text, IconButton, Spacer } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const ChapterCard = ({ chapterObj }) => {
  const { title, description, video } = chapterObj;

  return (
    <>
      <Box
        // backgroundColor={"gray.700"}
        // color="whiteAlpha.900"
        mx="2"
        minH="90px"
        maxH="120px"
        width="96%"
        // width="350px"
        overflow="hidden"
        minW="350px"
        borderRadius="8px"
        boxShadow="lg"
        // border={"1px solid"}
        // borderColor={"gray.300"}
      >
        <HStack height={"100%"}>
          <Box px="4" pt="2" width="80%">
            <Text fontSize={"lg"} fontWeight={"semibold"}>
              {title}
            </Text>
            <Text
              //   background="pink"
              mb="2"
              fontSize="md"
              width="100%"
              maxH="80px" // Set the maximum height for truncation
              overflow="hidden"
              position="relative"
            >
              {description}
            </Text>
          </Box>
          <Spacer />
          <IconButton mr="10">
            <DeleteIcon />
          </IconButton>
        </HStack>
      </Box>
    </>
  );
};

export default ChapterCard;
