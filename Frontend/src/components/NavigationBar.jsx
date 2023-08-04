import useLocalStorageState from "use-local-storage-state";
import { useEffect, useState } from "react";
import axios from "axios";

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

const NavigationBar = () => {
  const [token, setToken] = useLocalStorageState("token");
  const [userData, setUserData] = useState("");
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

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/session", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          setUserData(res.data);
        })
        .catch((err) => {
          if (err.response) {
            // show modal
            sessExpOnOpen();
            setToken("");
            localStorage.removeItem("token");
          }
          console.log(err.message);
        });
    } else {
      console.log("Session token absent.");
    }
  }, [token]);

  return (
    <>
      <Box
        height="67px"
        // backgroundColor={"green"}
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
                      <Button size="sm" variant="outline" mt="1">
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

      <AuthForm
        isOpen={loginIsOpen}
        onOpen={loginOnOpen}
        onClose={loginOnClose}
        isLogin={true}
      ></AuthForm>

      <AuthForm
        isOpen={signupIsOpen}
        onOpen={signupOnOpen}
        onClose={signupOnClose}
        isLogin={false}
      ></AuthForm>
      <SessionExpiredModal
        isOpen={sessExpIsOpen}
        onOpen={sessExpOnOpen}
        onClose={sessExpOnClose}
      />
    </>
  );
};

export default NavigationBar;
