import useLocalStorageState from "use-local-storage-state";
import { useEffect, useState, useRef } from "react";

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
  useMediaQuery,
  Image,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AuthForm from "./AuthForm";
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
    isOpen: instructorAppIsOpen,
    onOpen: instructorAppOnOpen,
    onClose: instructorAppOnClose,
  } = useDisclosure();

  return (
    <>
      <Center w="100%">
        <Box
          boxShadow={"lg"}
          width="100%"
          position={"fixed"}
          zIndex={"4"}
          background={"white"}
          height="76px"
          mt="76px"
          px="24px"
          borderBottom={"1px solid lightgrey"}
        >
          <Center height="100%">
            <Box height="100%" width="100%">
              <Flex alignItems={"center"} height="100%">
                <Image
                  width="70px"
                  height="70px"
                  src="/images/logo.jpeg"
                  mr="7"
                  ml="5"
                ></Image>
                <NavLinkButton text={"Courses"} path={"/"} />
                <NavLinkButton text={"About us"} path="#" />
                <Spacer />
                {token ? (
                  <>
                    <ButtonGroup alignItems={"center"}>
                      {userData.isInstructor ? (
                        <Link to={"/manage"}>
                          <Button
                            colorScheme="buttons"
                            size="sm"
                            variant="outline"
                            mt="1"
                          >
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
                        <Button size="sm" colorScheme="buttons" mr="2" mt="1">
                          My Learning
                        </Button>
                      </Link>
                      <ProfileIcon data={userData} />
                    </ButtonGroup>
                  </>
                ) : (
                  <ButtonGroup>
                    <Button
                      colorScheme="buttons"
                      size="sm"
                      variant="outline"
                      onClick={loginOnOpen}
                    >
                      Login
                    </Button>
                    <Button
                      size="sm"
                      variant="solid"
                      onClick={signupOnOpen}
                      colorScheme="buttons"
                    >
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
    </>
  );
};

export default NavigationBar;
