import React from "react";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NavLinkButton = ({ text, path }) => {
  return (
    <Link to={path}>
      <Button
        size="sm"
        variant="link"
        mr="4"
        mt="2"
        sx={{
          textDecoration: "none",
          ":hover": {
            textDecoration: "none",
            color: "gray.700",
          },
        }}
      >
        {text}
      </Button>
    </Link>
  );
};

export default NavLinkButton;
