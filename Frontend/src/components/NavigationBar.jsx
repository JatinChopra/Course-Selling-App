import useLocalStorageState from "use-local-storage-state";
import { useEffect, useState } from "react";
import axios from "axios";

import UserContext from "./contexts/UserContext";
import { useContext } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Icon,
  Spacer,
  Center,
  Heading,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AuthForm from "./AuthForm";
import SessionExpiredModal from "./SessionExpiredModal";
import ProfileIcon from "./ProfileIcon";
import NavLinkButton from "./NavLinkButton";
import ApplyInstructor from "./ApplyInstructor";

const NavigationBar = () => {
  const [token, setToken] = useLocalStorageState("token");
  const { userData, setUserData } = useContext(UserContext);

  const {
    isOpen: loginIsOpen,
    onOpen: loginOnOpen,
    onClose: loginOnClose,
  } = useDisclosure();

  const {
    isOpen: signupIsOpen,
    onOpen: signupOnOpen,
    onClose: signupOnClose,
  } = useDisclosure();

  const {
    isOpen: sessExpIsOpen,
    onOpen: sessExpOnOpen,
    onClose: sessExpOnClose,
  } = useDisclosure();

  const {
    isOpen: instructorAppIsOpen,
    onOpen: instructorAppOnOpen,
    onClose: instructorAppOnClose,
  } = useDisclosure();

  return (
    <>
      <Center w="100%">
        <Box
          w="100%"
          position={"fixed"}
          zIndex={"4"}
          height="67px"
          mt="67px"
          backgroundColor={"white"}
          px="24px"
          borderBottom={"1px solid lightgrey"}
        >
          <Center height="100%">
            <Box
              height="100%"
              width={{
                base: "100%",
                md: "100%",
                lg: "8xl",
              }}
            >
              <Flex alignItems={"center"} height="100%">
                <Heading mr="5">CsSpace</Heading>
                <NavLinkButton text={"Courses"} path={"/"} />
                <Button
                  size={"sm"}
                  variant="link"
                  mt="1"
                  sx={{
                    textDecoration: "none",
                    ":hover": {
                      textDecoration: "none",
                      color: "gray.700",
                    },
                  }}
                >
                  About us
                </Button>
                <Spacer />
                {token ? (
                  <>
                    <ButtonGroup alignItems={"center"}>
                      {userData.isInstructor ? (
                        <Link to={"/manage"}>
                          <Button size="sm" variant="outline" mt="1">
                            Manage Courses
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          onClick={() => {
                            instructorAppOnOpen();
                          }}
                          size="sm"
                          variant="outline"
                          mt="1"
                        >
                          Join as Instructor
                        </Button>
                      )}
                      <Link to={"/mylearning"}>
                        <Button size="sm" mr="2" mt="1">
                          My Learning
                        </Button>
                      </Link>
                      <ProfileIcon data={userData} />
                    </ButtonGroup>
                  </>
                ) : (
                  <ButtonGroup>
                    <Button size="sm" variant="outline" onClick={loginOnOpen}>
                      Login
                    </Button>
                    <Button size="sm" variant="solid" onClick={signupOnOpen}>
                      Signup
                    </Button>
                  </ButtonGroup>
                )}
              </Flex>
            </Box>
          </Center>
        </Box>
      </Center>

      <AuthForm
        isOpen={loginIsOpen}
        onOpen={loginOnOpen}
        onClose={loginOnClose}
        isLogin={true}
      />

      <AuthForm
        isOpen={signupIsOpen}
        onOpen={signupOnOpen}
        onClose={signupOnClose}
        isLogin={false}
      />

      <ApplyInstructor
        isOpen={instructorAppIsOpen}
        onOpen={instructorAppOnOpen}
        onClose={instructorAppOnClose}
      />

      <SessionExpiredModal
        isOpen={sessExpIsOpen}
        onOpen={sessExpOnOpen}
        onClose={sessExpOnClose}
      />
    </>
  );
};

export default NavigationBar;
