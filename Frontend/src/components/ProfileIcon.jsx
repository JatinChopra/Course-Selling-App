import React from "react";
import useLocalStorageState from "use-local-storage-state";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
  Button,
} from "@chakra-ui/react";

import { IoPersonCircle } from "react-icons/io5";

const ProfileIcon = ({ data }) => {
  const navigate = useNavigate();
  const { username, email, isInstructor } = data;
  const [token, setToken] = useLocalStorageState("token");

  return (
    <>
      <Menu>
        <MenuButton
          // as={IconButton}

          borderRadius={"full"}
          variant={"solid"}
          color={"gray.600"}
          backgroundColor={"gray.100"}
          // border={"10px solid gray"}
        >
          <IoPersonCircle size={32} />
        </MenuButton>
        <MenuList>
          <MenuGroup title="Profile">
            <MenuItem>Username: {username}</MenuItem>
            <MenuItem>Email: {email}</MenuItem>
            <MenuItem>Instructor: {isInstructor ? "✅" : "❌"}</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Help">
            <MenuItem>Docs</MenuItem>
            <MenuItem>FAQ</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup>
            <Button
              size="sm"
              ml="14px"
              onClick={() => {
                setToken("");
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Logout
            </Button>
          </MenuGroup>
        </MenuList>
      </Menu>
    </>
  );
};

export default ProfileIcon;
