import React from "react";

import { Box, Button } from "@chakra-ui/react";

const ManageCourses = () => {
  return (
    <>
      <Box
        h="100%"
        width={{
          base: "100%",
          md: "100%",
          lg: "8xl",
        }}
        p="10"
      >
        <Box>
          <Button colorScheme="blue" size="sm" float={"right"}>
            New Course
          </Button>
        </Box>
        <Box></Box>
      </Box>
    </>
  );
};

export default ManageCourses;
