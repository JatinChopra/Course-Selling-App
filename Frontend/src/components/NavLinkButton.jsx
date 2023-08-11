import React from "react";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NavLinkButton = ({ text, path }) => {
  return (
    <Link to={path}>
      <Button
        size="lg"
        fontSize={"lg"}
        variant="link"
        color={"gray.500"}
        // color="#FF9800"
        fontWeight={"normal"}
        mr="5"
        mt="1"
        sx={{
          textDecoration: "none",
          ":hover": {
            textDecoration: "none",
            color: "#03A9F4",
          },
        }}
      >
        {text}
      </Button>
    </Link>
  );
};

export default NavLinkButton;

// #1C1CFF
// #5151FF
