import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";

import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { Link } from "react-router-dom";

const Root = () => {
  return (
    <>
      <NavigationBar />
      <Box backgroundColor={"yellow"}>
        <Outlet />
      </Box>
    </>
  );
};

export default Root;
