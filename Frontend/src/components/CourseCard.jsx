import React from "react";

import { Box, VStack } from "@chakra-ui/react";
import { Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Image,
} from "@chakra-ui/react";
const CourseCard = ({ course }) => {
  // console.log(course);
  const { _id, title, description, imageurl } = course;
  const navigate = useNavigate();

  const manageButtonHandler = () => {
    // console.log(course._id);
    // console.log(course._id.toString());
    navigate(course._id.toString());
  };

  return (
    // <Skeleton isLoaded={false}>
    <Box
      width="250px"
      backgroundColor={"gray.700"}
      // borderRadius={"15px"}
      border="1px solid"
      color="gray.200"
      // background={"green"}
      minH={"200px"}
    >
      <VStack>
        <Image
          src={imageurl}
          width="100%"
          height="112px"
          objectFit="cover"
          // borderTopRadius={"15"}
        />
        <Box width="100%" px="2" pb="3" pt="2">
          <Text fontSize={"lg"} fontWeight={"semibold"}>
            {course.title}
          </Text>
          <Text fontSize={"sm"} width={"95%"}>
            {course.description}
          </Text>
          <Button
            mt="2"
            float="right"
            colorScheme="teal"
            size="sm"
            onClick={manageButtonHandler}
          >
            Manage
          </Button>
        </Box>
      </VStack>
    </Box>
    // {/* </Skeleton> */}
  );
};

export default CourseCard;
